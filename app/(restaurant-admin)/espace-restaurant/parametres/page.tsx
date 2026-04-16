import { redirect } from "next/navigation";

import { auth } from "@/core/auth/auth";
import { updateRestaurantSettings } from "@/features/restaurant-admin/actions/settings-actions";
import { prisma } from "@/shared/lib/prisma";
import { NoRestaurantAssociated } from "@/widgets/restaurant-admin/no-restaurant-associated";

type PageProps = {
  searchParams: Promise<{ success?: string; error?: string }>;
};

function getErrorMessage(error?: string): string | null {
  switch (error) {
    case "missing_required_fields":
      return "Le nom et l’adresse du restaurant sont obligatoires.";
    default:
      return null;
  }
}

export default async function RestaurantSettingsPage({ searchParams }: PageProps) {
  const session = await auth();

  if (!session || session.user.role !== "RESTAURANT_ADMIN") {
    redirect("/login");
  }

  const restaurantId = session.user.restaurantId;

  if (!restaurantId) {
    return <NoRestaurantAssociated />;
  }

  const query = await searchParams;

  const restaurant = await prisma.restaurant.findUnique({
    where: { id: restaurantId },
    select: {
      id: true,
      nom: true,
      slug: true,
      description: true,
      adresse: true,
      telephone: true,
      emailPublic: true,
      servesCuisine: true,
      openingHours: true,
      reservationUrl: true,
      googleMapsUrl: true,
      acceptsReservations: true,
    },
  });

  if (!restaurant) {
    return <NoRestaurantAssociated />;
  }

  const success = query.success === "1";
  const errorMessage = getErrorMessage(query.error);

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-orange-600">
          Paramètres
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
          Paramètres du restaurant
        </h1>
        <p className="mt-3 max-w-3xl text-neutral-600">
          Mettez à jour les informations utiles au SEO local, à l’expérience utilisateur
          et à la conversion : présentation, horaires, téléphone, réservation et localisation.
        </p>

        <div className="mt-4 rounded-2xl bg-neutral-50 px-4 py-3 text-sm text-neutral-600">
          <span className="font-medium text-neutral-900">Slug public :</span> {restaurant.slug}
        </div>

        {success ? (
          <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
            Les paramètres du restaurant ont bien été mis à jour.
          </div>
        ) : null}

        {errorMessage ? (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {errorMessage}
          </div>
        ) : null}
      </section>

      <section className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
        <form action={updateRestaurantSettings} className="grid gap-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="nom" className="mb-2 block text-sm font-medium text-neutral-700">
                Nom du restaurant
              </label>
              <input
                id="nom"
                name="nom"
                type="text"
                required
                defaultValue={restaurant.nom}
                className="w-full rounded-xl border border-neutral-300 px-4 py-3 focus:border-orange-500"
              />
            </div>

            <div>
              <label
                htmlFor="servesCuisine"
                className="mb-2 block text-sm font-medium text-neutral-700"
              >
                Type de cuisine
              </label>
              <input
                id="servesCuisine"
                name="servesCuisine"
                type="text"
                defaultValue={restaurant.servesCuisine ?? ""}
                className="w-full rounded-xl border border-neutral-300 px-4 py-3 focus:border-orange-500"
                placeholder="Ex. Cuisine française"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium text-neutral-700"
            >
              Présentation
            </label>
            <textarea
              id="description"
              name="description"
              rows={5}
              defaultValue={restaurant.description ?? ""}
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 focus:border-orange-500"
              placeholder="Présentez votre établissement en quelques lignes."
            />
          </div>

          <div>
            <label
              htmlFor="adresse"
              className="mb-2 block text-sm font-medium text-neutral-700"
            >
              Adresse
            </label>
            <input
              id="adresse"
              name="adresse"
              type="text"
              required
              defaultValue={restaurant.adresse}
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 focus:border-orange-500"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="telephone"
                className="mb-2 block text-sm font-medium text-neutral-700"
              >
                Téléphone public
              </label>
              <input
                id="telephone"
                name="telephone"
                type="text"
                defaultValue={restaurant.telephone ?? ""}
                className="w-full rounded-xl border border-neutral-300 px-4 py-3 focus:border-orange-500"
              />
            </div>

            <div>
              <label
                htmlFor="emailPublic"
                className="mb-2 block text-sm font-medium text-neutral-700"
              >
                Email public
              </label>
              <input
                id="emailPublic"
                name="emailPublic"
                type="email"
                defaultValue={restaurant.emailPublic ?? ""}
                className="w-full rounded-xl border border-neutral-300 px-4 py-3 focus:border-orange-500"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="openingHours"
              className="mb-2 block text-sm font-medium text-neutral-700"
            >
              Horaires
            </label>
            <input
              id="openingHours"
              name="openingHours"
              type="text"
              defaultValue={restaurant.openingHours ?? ""}
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 focus:border-orange-500"
              placeholder="Ex. Lun-Dim 12:00-14:30, 19:00-22:30"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="reservationUrl"
                className="mb-2 block text-sm font-medium text-neutral-700"
              >
                URL de réservation
              </label>
              <input
                id="reservationUrl"
                name="reservationUrl"
                type="text"
                defaultValue={restaurant.reservationUrl ?? ""}
                className="w-full rounded-xl border border-neutral-300 px-4 py-3 focus:border-orange-500"
                placeholder="/reservation/le-bistro-parisien"
              />
            </div>

            <div>
              <label
                htmlFor="googleMapsUrl"
                className="mb-2 block text-sm font-medium text-neutral-700"
              >
                URL Google Maps
              </label>
              <input
                id="googleMapsUrl"
                name="googleMapsUrl"
                type="text"
                defaultValue={restaurant.googleMapsUrl ?? ""}
                className="w-full rounded-xl border border-neutral-300 px-4 py-3 focus:border-orange-500"
                placeholder="https://maps.google.com/..."
              />
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
            <label className="flex items-center gap-3 text-sm font-medium text-neutral-800">
              <input
                type="checkbox"
                name="acceptsReservations"
                defaultChecked={restaurant.acceptsReservations}
                className="h-4 w-4 rounded border-neutral-300"
              />
              Activer la réservation en ligne
            </label>
            <p className="mt-2 text-sm text-neutral-500">
              Si cette option est activée, la page publique affichera la réservation comme
              disponible.
            </p>
          </div>

          <div>
            <button
              type="submit"
              className="cursor-pointer rounded-full bg-orange-600 px-6 py-3 font-semibold text-white transition hover:bg-orange-700"
            >
              Enregistrer les modifications
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}