import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MapPin } from "lucide-react";

import { getSiteOrigin } from "@/core/config/site-origin";
import { prisma } from "@/shared/lib/prisma";

import { AddToCartButton } from "@/features/public/components/AddToCartButton";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

function formatPriceEur(value: { toString(): string }): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(Number(value.toString()));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const restaurant = await prisma.restaurant.findUnique({
    where: { slug },
    select: { nom: true, description: true, adresse: true },
  });

  if (!restaurant) {
    return {
      title: "Restaurant introuvable | RestoFocus",
      description: "Ce restaurant n’existe pas ou n’est plus disponible.",
    };
  }

  const baseDescription =
    restaurant.description?.trim() ??
    `Découvrez la carte de ${restaurant.nom} : plats, adresse et ambiance.`;
  const description =
    baseDescription.length > 160 ? `${baseDescription.slice(0, 157)}…` : baseDescription;

  const origin = getSiteOrigin();

  return {
    title: `${restaurant.nom} — Menu & adresse | RestoFocus`,
    description,
    alternates: {
      canonical: `${origin}/restaurant/${slug}`,
    },
    openGraph: {
      title: `${restaurant.nom} | RestoFocus`,
      description,
      url: `${origin}/restaurant/${slug}`,
      locale: "fr_FR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${restaurant.nom} | RestoFocus`,
      description,
    },
  };
}

function buildRestaurantJsonLd(
  restaurant: {
    nom: string;
    slug: string;
    description: string | null;
    adresse: string;
    categories: {
      nom: string;
      menuItems: { nom: string; description: string | null; prix: { toString(): string } }[];
    }[];
  },
  origin: string,
): Record<string, unknown> {
  const url = `${origin}/restaurant/${restaurant.slug}`;

  const hasMenuSection = restaurant.categories.map((cat) => ({
    "@type": "MenuSection",
    name: cat.nom,
    hasMenuItem: cat.menuItems.map((item) => ({
      "@type": "MenuItem",
      name: item.nom,
      ...(item.description ? { description: item.description } : {}),
      offers: {
        "@type": "Offer",
        price: Number(item.prix.toString()).toFixed(2),
        priceCurrency: "EUR",
      },
    })),
  }));

  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: restaurant.nom,
    url,
    description: restaurant.description ?? undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: restaurant.adresse,
      addressCountry: "FR",
    },
    hasMenu: {
      "@type": "Menu",
      name: `Menu — ${restaurant.nom}`,
      hasMenuSection,
    },
  };
}

export default async function RestaurantPublicPage({ params }: PageProps) {
  const { slug } = await params;

  const restaurant = await prisma.restaurant.findUnique({
    where: { slug },
    include: {
      categories: {
        orderBy: { nom: "asc" },
        include: {
          menuItems: { orderBy: { nom: "asc" } },
        },
      },
    },
  });

  if (!restaurant) {
    notFound();
  }

  const origin = getSiteOrigin();
  const jsonLd = buildRestaurantJsonLd(restaurant, origin);
  const jsonLdString = JSON.stringify(jsonLd).replace(/</g, "\\u003c");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString }}
      />

      <article className="mx-auto max-w-4xl px-4 pb-24 pt-10 sm:px-6 lg:px-8 lg:pt-14">
        <header className="border-b border-orange-100/90 pb-10">
          <p className="text-sm font-semibold uppercase tracking-wider text-orange-800/90">
            Vitrine restaurant
          </p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-stone-900 sm:text-5xl">
            {restaurant.nom}
          </h1>
          <p className="mt-4 flex items-start gap-2 text-base text-stone-600">
            <MapPin className="mt-1 h-5 w-5 shrink-0 text-orange-600" aria-hidden />
            <span>{restaurant.adresse}</span>
          </p>
          {restaurant.description ? (
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-stone-600">
              {restaurant.description}
            </p>
          ) : null}
        </header>

        <div className="mt-12 space-y-14">
          {restaurant.categories.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-orange-200 bg-white/70 px-6 py-12 text-center text-stone-600">
              La carte sera bientôt disponible.
            </p>
          ) : (
            restaurant.categories.map((category) => (
              <section
                key={category.id}
                aria-labelledby={`cat-${category.id}`}
                className="scroll-mt-8"
              >
                <h2
                  id={`cat-${category.id}`}
                  className="text-2xl font-bold tracking-tight text-stone-900"
                >
                  {category.nom}
                </h2>
                {category.menuItems.length === 0 ? (
                  <p className="mt-3 text-sm text-stone-500">Aucun plat dans cette section.</p>
                ) : (
                  <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                    {category.menuItems.map((item) => (
                      <li key={item.id}>
                        <div className="flex h-full flex-col rounded-2xl border border-orange-100/90 bg-white/90 p-5 shadow-sm shadow-orange-900/5 transition hover:border-orange-200 hover:shadow-md">
                          <div className="flex items-start justify-between gap-3">
                            <p className="text-lg font-semibold text-stone-900">{item.nom}</p>
                            <p className="shrink-0 rounded-full bg-orange-50 px-3 py-1 text-sm font-bold tabular-nums text-orange-950">
                              {formatPriceEur(item.prix)}
                            </p>
                          </div>
                          {item.description ? (
                            <p className="mt-2 text-sm leading-relaxed text-stone-600">
                              {item.description}
                            </p>
                          ) : null}
                          
                          {/* LE BOUTON D'AJOUT EST PLACÉ ICI */}
                          <div className="mt-auto pt-4 flex justify-end">
                            <AddToCartButton 
                              restaurantId={restaurant.id} 
                              item={{
                                id: item.id,
                                nom: item.nom,
                                prix: Number(item.prix) // Conversion de Decimal vers Number
                              }} 
                            />
                          </div>
                          
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))
          )}
        </div>
      </article>
    </>
  );
}