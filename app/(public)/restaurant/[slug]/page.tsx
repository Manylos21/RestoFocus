import type { Metadata } from "next";
import Link from "next/link";
import { PublicPageTracker } from "@/features/public/components/PublicPageTracker";
import { TrackedActionLink } from "@/features/public/components/TrackedActionLink";
import { notFound } from "next/navigation";
import {
  CalendarCheck,
  Clock3,
  Mail,
  MapPin,
  Phone,
  UtensilsCrossed,
} from "lucide-react";

import { getSiteOrigin } from "@/core/config/site-origin";
import { AddToCartButton } from "@/features/public/components/AddToCartButton";
import { prisma } from "@/shared/lib/prisma";

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
    select: {
      nom: true,
      description: true,
      adresse: true,
      servesCuisine: true,
    },
  });

  if (!restaurant) {
    return {
      title: "Restaurant introuvable | RestoFocus",
      description: "Ce restaurant n’existe pas ou n’est plus disponible.",
    };
  }

  const baseDescription =
    restaurant.description?.trim() ??
    `Découvrez la carte de ${restaurant.nom}, son adresse et ses informations pratiques.`;

  const description =
    baseDescription.length > 160 ? `${baseDescription.slice(0, 157)}…` : baseDescription;

  const origin = getSiteOrigin();

  return {
    title: `${restaurant.nom} — Menu, horaires et adresse | RestoFocus`,
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
    telephone: string | null;
    emailPublic: string | null;
    servesCuisine: string | null;
    acceptsReservations: boolean;
    reservationUrl: string | null;
    openingHours: string | null;
    googleMapsUrl: string | null;
    categories: {
      nom: string;
      menuItems: {
        nom: string;
        description: string | null;
        prix: { toString(): string };
      }[];
    }[];
  },
  origin: string,
): Record<string, unknown> {
  const url = `${origin}/restaurant/${restaurant.slug}`;
  const reservationAbsoluteUrl = restaurant.reservationUrl
    ? restaurant.reservationUrl.startsWith("http")
      ? restaurant.reservationUrl
      : `${origin}${restaurant.reservationUrl}`
    : `${origin}/reservation/${restaurant.slug}`;

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
    telephone: restaurant.telephone ?? undefined,
    email: restaurant.emailPublic ?? undefined,
    servesCuisine: restaurant.servesCuisine ?? undefined,
    acceptsReservations: restaurant.acceptsReservations
      ? reservationAbsoluteUrl
      : false,
    openingHours: restaurant.openingHours ?? undefined,
    hasMenu: {
      "@type": "Menu",
      name: `Menu — ${restaurant.nom}`,
      hasMenuSection: restaurant.categories.map((cat) => ({
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
      })),
    },
  };
}

const faqItems = [
  {
    question: "Faut-il réserver à l’avance ?",
    answer:
      "C’est recommandé aux heures de pointe, surtout le soir et le week-end.",
  },
  {
    question: "Le menu est-il consultable en ligne ?",
    answer:
      "Oui, la carte est accessible directement sur cette page avec les plats et les prix.",
  },
  {
    question: "Comment trouver facilement le restaurant ?",
    answer:
      "L’adresse complète est affichée ci-dessous, avec un lien d’itinéraire quand il est disponible.",
  },
];

export default async function RestaurantPublicPage({ params }: PageProps) {
  const { slug } = await params;

  const restaurant = await prisma.restaurant.findUnique({
    where: { slug },
    include: {
      categories: {
        orderBy: { nom: "asc" },
        include: {
          menuItems: {
            orderBy: { nom: "asc" },
          },
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

  const reservationHref =
    restaurant.reservationUrl || `/reservation/${restaurant.slug}`;


    const publicPagePath = `/restaurant/${restaurant.slug}`;

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <PublicPageTracker restaurantId={restaurant.id} pageType="restaurant" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString }}
      />

      <section className="grid gap-8 rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-orange-600">
            Restaurant partenaire
          </p>

          <h1 className="mb-4 text-4xl font-bold tracking-tight text-neutral-900">
            {restaurant.nom}
          </h1>

          <p className="mb-6 max-w-3xl text-lg leading-8 text-neutral-600">
            {restaurant.description ??
              "Découvrez une adresse sélectionnée avec une fiche claire, un menu lisible et des informations utiles pour préparer votre visite."}
          </p>

          <div className="flex flex-wrap gap-3">
          <TrackedActionLink
              href={reservationHref}
              restaurantId={restaurant.id}
              pagePath={publicPagePath}
              eventType="CTA_RESERVATION"
              value={restaurant.slug}
              className="rounded-full bg-orange-600 px-5 py-3 font-semibold text-white transition hover:bg-orange-700"
          >
            Réserver une table
          </TrackedActionLink>

            {restaurant.googleMapsUrl ? (
              <TrackedActionLink
              href={restaurant.googleMapsUrl}
              external
              target="_blank"
              rel="noreferrer"
              restaurantId={restaurant.id}
              pagePath={publicPagePath}
              eventType="CTA_DIRECTIONS"
              value={restaurant.googleMapsUrl}
              className="rounded-full border border-neutral-300 px-5 py-3 font-semibold text-neutral-900 transition hover:border-orange-500 hover:text-orange-600"
            >
              Itinéraire
            </TrackedActionLink>
            ) : null}
          </div>
        </div>

        <aside className="rounded-3xl bg-neutral-50 p-6">
          <h2 className="mb-5 text-lg font-semibold text-neutral-900">
            Informations pratiques
          </h2>

          <div className="space-y-4 text-sm text-neutral-700">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 text-orange-600" />
              <div>
                <p className="font-medium text-neutral-900">Adresse</p>
                <p>{restaurant.adresse}</p>
              </div>
            </div>

            {restaurant.telephone ? (
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-5 w-5 text-orange-600" />
                <div>
                  <p className="font-medium text-neutral-900">Téléphone</p>
                  <p>{restaurant.telephone}</p>
                </div>
              </div>
            ) : null}

            {restaurant.emailPublic ? (
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-5 w-5 text-orange-600" />
                <div>
                  <p className="font-medium text-neutral-900">Email</p>
                  <p>{restaurant.emailPublic}</p>
                </div>
              </div>
            ) : null}

            {restaurant.servesCuisine ? (
              <div className="flex items-start gap-3">
                <UtensilsCrossed className="mt-0.5 h-5 w-5 text-orange-600" />
                <div>
                  <p className="font-medium text-neutral-900">Cuisine</p>
                  <p>{restaurant.servesCuisine}</p>
                </div>
              </div>
            ) : null}

            {restaurant.openingHours ? (
              <div className="flex items-start gap-3">
                <Clock3 className="mt-0.5 h-5 w-5 text-orange-600" />
                <div>
                  <p className="font-medium text-neutral-900">Horaires</p>
                  <p>{restaurant.openingHours}</p>
                </div>
              </div>
            ) : null}

            <div className="flex items-start gap-3">
              <CalendarCheck className="mt-0.5 h-5 w-5 text-orange-600" />
              <div>
                <p className="font-medium text-neutral-900">Réservation</p>
                <p>
                  {restaurant.acceptsReservations
                    ? "Disponible en ligne"
                    : "À confirmer auprès du restaurant"}
                </p>
              </div>
            </div>
          </div>
        </aside>
      </section>

      <section className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-orange-600">
              Menu
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900">
              La carte
            </h2>
          </div>

          <div className="space-y-6">
            {restaurant.categories.map((category) => (
              <section
                key={category.nom}
                className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm"
              >
                <h3 className="mb-4 text-2xl font-semibold text-neutral-900">
                  {category.nom}
                </h3>

                <div className="space-y-4">
                  {category.menuItems.map((item) => (
                    <article
                      key={item.id}
                      className="flex flex-col gap-4 rounded-2xl border border-neutral-100 bg-neutral-50 p-4 md:flex-row md:items-start md:justify-between"
                    >
                      <div className="max-w-2xl">
                        <div className="mb-1 flex flex-wrap items-center gap-3">
                          <h4 className="text-lg font-semibold text-neutral-900">
                            {item.nom}
                          </h4>
                          <span className="text-sm font-medium text-orange-700">
                            {formatPriceEur(item.prix)}
                          </span>
                        </div>

                        {item.description ? (
                          <p className="leading-7 text-neutral-600">
                            {item.description}
                          </p>
                        ) : null}
                      </div>

                      <AddToCartButton
                        restaurantId={restaurant.id}
                        item={{
                          id: item.id,
                          nom: item.nom,
                          prix: Number(item.prix.toString()),
                        }}
                      />
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>

        <aside className="space-y-6">
          <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-neutral-900">
              Pourquoi cette fiche est utile
            </h2>
            <p className="leading-7 text-neutral-600">
              Cette vitrine centralise les informations qu’un client cherche vraiment :
              adresse, horaires, type de cuisine, menu, réservation et itinéraire.
            </p>
          </section>

          <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-neutral-900">
              Questions fréquentes
            </h2>

            <div className="space-y-4">
              {faqItems.map((item) => (
                <div key={item.question}>
                  <h3 className="font-semibold text-neutral-900">{item.question}</h3>
                  <p className="mt-1 leading-7 text-neutral-600">{item.answer}</p>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </section>
    </div>
  );
}

