import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarCheck, Clock3, MapPin, Phone, Users } from "lucide-react";

import { submitReservation } from "@/features/public/components/actions/reservation-actions";
import { prisma } from "@/shared/lib/prisma";
import { PublicPageTracker } from "@/features/public/components/PublicPageTracker";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ success?: string; error?: string }>;
};

export const dynamic = "force-dynamic";

function getErrorMessage(error?: string): string | null {
  switch (error) {
    case "missing_fields":
      return "Merci de remplir tous les champs obligatoires.";
    case "invalid_guest_count":
      return "Le nombre de personnes doit être compris entre 1 et 20.";
    case "invalid_date":
      return "La date ou l'heure saisie est invalide.";
    case "restaurant_not_found":
      return "Le restaurant demandé est introuvable.";
    case "reservations_disabled":
      return "La réservation en ligne n'est pas activée pour cet établissement.";
    default:
      return null;
  }
}

export default async function ReservationPage({
  params,
  searchParams,
}: PageProps) {
  const { slug } = await params;
  const query = await searchParams;

  const restaurant = await prisma.restaurant.findUnique({
    where: { slug },
    select: {
      id: true,
      nom: true,
      slug: true,
      adresse: true,
      telephone: true,
      openingHours: true,
      acceptsReservations: true,
    },
  });

  if (!restaurant) {
    notFound();
  }

  const success = query.success === "1";
  const errorMessage = getErrorMessage(query.error);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <PublicPageTracker restaurantId={restaurant.id} pageType="reservation" />
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-orange-600">
            Réservation
          </p>
          <h1 className="mb-3 text-4xl font-bold tracking-tight text-neutral-900">
            Réserver chez {restaurant.nom}
          </h1>
          <p className="mb-8 text-neutral-600">
            Envoyez une demande de réservation. Elle sera maintenant enregistrée en base
            et servira ensuite à alimenter les KPI du dashboard.
          </p>

          {success ? (
            <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
              Votre demande de réservation a bien été enregistrée.
            </div>
          ) : null}

          {errorMessage ? (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {errorMessage}
            </div>
          ) : null}

          <form action={submitReservation} className="grid gap-4 md:grid-cols-2">
            <input type="hidden" name="restaurantId" value={restaurant.id} />
            <input type="hidden" name="slug" value={restaurant.slug} />

            <div>
              <label
                htmlFor="prenom"
                className="mb-2 block text-sm font-medium text-neutral-700"
              >
                Prénom
              </label>
              <input
                id="prenom"
                name="prenom"
                type="text"
                required
                className="w-full rounded-xl border border-neutral-300 px-4 py-3 focus:border-orange-500"
                placeholder="Prénom"
              />
            </div>

            <div>
              <label htmlFor="nom" className="mb-2 block text-sm font-medium text-neutral-700">
                Nom
              </label>
              <input
                id="nom"
                name="nom"
                type="text"
                required
                className="w-full rounded-xl border border-neutral-300 px-4 py-3 focus:border-orange-500"
                placeholder="Nom"
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-neutral-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full rounded-xl border border-neutral-300 px-4 py-3 focus:border-orange-500"
                placeholder="vous@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="telephone"
                className="mb-2 block text-sm font-medium text-neutral-700"
              >
                Téléphone
              </label>
              <input
                id="telephone"
                name="telephone"
                type="tel"
                className="w-full rounded-xl border border-neutral-300 px-4 py-3 focus:border-orange-500"
                placeholder="+33 6 00 00 00 00"
              />
            </div>

            <div>
              <label htmlFor="date" className="mb-2 block text-sm font-medium text-neutral-700">
                Date
              </label>
              <input
                id="date"
                name="date"
                type="date"
                required
                className="w-full rounded-xl border border-neutral-300 px-4 py-3 focus:border-orange-500"
              />
            </div>

            <div>
              <label htmlFor="heure" className="mb-2 block text-sm font-medium text-neutral-700">
                Heure
              </label>
              <input
                id="heure"
                name="heure"
                type="time"
                required
                className="w-full rounded-xl border border-neutral-300 px-4 py-3 focus:border-orange-500"
              />
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="personnes"
                className="mb-2 block text-sm font-medium text-neutral-700"
              >
                Nombre de personnes
              </label>
              <input
                id="personnes"
                name="personnes"
                type="number"
                min={1}
                max={20}
                required
                className="w-full rounded-xl border border-neutral-300 px-4 py-3 focus:border-orange-500"
                placeholder="2"
              />
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="commentaire"
                className="mb-2 block text-sm font-medium text-neutral-700"
              >
                Commentaire
              </label>
              <textarea
                id="commentaire"
                name="commentaire"
                rows={4}
                className="w-full rounded-xl border border-neutral-300 px-4 py-3 focus:border-orange-500"
                placeholder="Ex. table en terrasse, anniversaire, allergie à signaler..."
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                className="cursor-pointer rounded-full bg-orange-600 px-6 py-3 font-semibold text-white transition hover:bg-orange-700"
              >
                Envoyer une demande
              </button>
              <p className="mt-3 text-sm leading-6 text-neutral-500">
                Les données saisies dans ce formulaire sont utilisées uniquement pour traiter votre
                demande de réservation et alimenter le suivi d’activité du restaurant. Consultez la{" "}
                <a href="/confidentialite" className="text-orange-600 hover:underline">
                  politique de confidentialité
                </a>
              </p>
            </div>
          </form>
        </section>

        <aside className="space-y-4">
          <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-neutral-900">
              Informations utiles
            </h2>

            <div className="space-y-4 text-neutral-700">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 text-orange-600" />
                <div>
                  <p className="font-medium text-neutral-900">Adresse</p>
                  <p>{restaurant.adresse}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock3 className="mt-0.5 h-5 w-5 text-orange-600" />
                <div>
                  <p className="font-medium text-neutral-900">Horaires</p>
                  <p>{restaurant.openingHours ?? "Horaires bientôt disponibles."}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-5 w-5 text-orange-600" />
                <div>
                  <p className="font-medium text-neutral-900">Téléphone</p>
                  <p>{restaurant.telephone ?? "Téléphone bientôt disponible."}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CalendarCheck className="mt-0.5 h-5 w-5 text-orange-600" />
                <div>
                  <p className="font-medium text-neutral-900">Réservation en ligne</p>
                  <p>{restaurant.acceptsReservations ? "Disponible" : "Non activée"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users className="mt-0.5 h-5 w-5 text-orange-600" />
                <div>
                  <p className="font-medium text-neutral-900">Conseil</p>
                  <p>Pour les groupes, il vaut mieux anticiper votre demande.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-lg font-semibold text-neutral-900">
              Voir la fiche restaurant
            </h2>
            <p className="mb-4 text-neutral-600">
              Retrouvez la carte, les plats et les informations détaillées de l’établissement.
            </p>
            <Link
              href={`/restaurant/${restaurant.slug}`}
              className="inline-flex rounded-full border border-neutral-300 px-4 py-2 font-medium transition hover:border-orange-500 hover:text-orange-600"
            >
              Retour à la vitrine
            </Link>
          </section>
        </aside>
      </div>
    </div>
  );
}