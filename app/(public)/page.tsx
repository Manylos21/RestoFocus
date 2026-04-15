import { MapPin, Sparkles } from "lucide-react";
import Link from "next/link";

import { prisma } from "@/shared/lib/prisma";

/** Données Prisma à jour à chaque requête (SEO + liste partenaires). */
export const dynamic = "force-dynamic";

export default async function PublicHomePage() {
  const restaurants = await prisma.restaurant.findMany({
    orderBy: { nom: "asc" },
    select: {
      id: true,
      nom: true,
      slug: true,
      adresse: true,
      description: true,
    },
  });

  return (
    <main className="mx-auto max-w-6xl px-4 pb-20 pt-12 sm:px-6 lg:px-8 lg:pt-16">
      <div className="mx-auto max-w-3xl text-center">
        <p className="inline-flex items-center gap-2 rounded-full border border-orange-200/80 bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-orange-900 shadow-sm">
          <Sparkles className="h-3.5 w-3.5" aria-hidden />
          Découvrez les tables près de chez vous
        </p>
        <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-stone-900 sm:text-5xl lg:text-6xl">
          Réservez le bon goût,
          <span className="block bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
            sans friction.
          </span>
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-stone-600 sm:text-xl">
          Parcourez les restaurants partenaires : menus authentiques, fiches claires et
          informations utiles pour choisir votre prochaine sortie.
        </p>
      </div>

      <section className="mt-16 lg:mt-20" aria-labelledby="listing-heading">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2
              id="listing-heading"
              className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl"
            >
              Restaurants partenaires
            </h2>
            <p className="mt-1 text-sm text-stone-500">
              {restaurants.length === 0
                ? "Les premières adresses arrivent bientôt."
                : `${restaurants.length} adresse${restaurants.length > 1 ? "s" : ""} à explorer`}
            </p>
          </div>
        </div>

        {restaurants.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-orange-200 bg-white/60 px-8 py-16 text-center text-stone-600 shadow-inner">
            Aucun restaurant n’est encore publié. Revenez très vite.
          </div>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {restaurants.map((r) => (
              <li key={r.id}>
                <Link
                  href={`/restaurant/${r.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-orange-100/90 bg-white shadow-md shadow-orange-900/5 transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-lg hover:shadow-orange-900/10"
                >
                  <div className="relative h-36 bg-gradient-to-br from-orange-400 via-amber-400 to-rose-300">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_55%)]" />
                    <div className="absolute bottom-3 left-4 right-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-white/90">
                        Restaurant
                      </p>
                      <p className="mt-0.5 line-clamp-2 text-xl font-bold text-white drop-shadow-sm">
                        {r.nom}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-5">
                    {r.description ? (
                      <p className="line-clamp-3 text-sm leading-relaxed text-stone-600">
                        {r.description}
                      </p>
                    ) : (
                      <p className="text-sm italic text-stone-400">
                        Découvrez la carte et les spécialités sur la vitrine.
                      </p>
                    )}
                    <p className="mt-auto flex items-start gap-2 text-sm text-stone-500">
                      <MapPin
                        className="mt-0.5 h-4 w-4 shrink-0 text-orange-600/90"
                        aria-hidden
                      />
                      <span className="leading-snug">{r.adresse}</span>
                    </p>
                    <span className="text-sm font-semibold text-orange-800 transition group-hover:text-orange-950">
                      Voir la carte →
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
