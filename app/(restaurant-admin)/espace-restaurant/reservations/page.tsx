import { auth } from "@/core/auth/auth";
import { updateReservationStatus } from "@/features/restaurant-admin/actions/reservation-admin-actions";
import { prisma } from "@/shared/lib/prisma";
import { NoRestaurantAssociated } from "@/widgets/restaurant-admin/no-restaurant-associated";
import { redirect } from "next/navigation";

type PageProps = {
  searchParams: Promise<{ success?: string; error?: string }>;
};

function formatDateTime(value: Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

function getStatusBadge(status: string) {
  switch (status) {
    case "PENDING":
      return (
        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
          En attente
        </span>
      );
    case "CONFIRMED":
      return (
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
          Confirmée
        </span>
      );
    case "CANCELLED":
      return (
        <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-800">
          Annulée
        </span>
      );
    case "COMPLETED":
      return (
        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
          Terminée
        </span>
      );
    default:
      return (
        <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-700">
          {status}
        </span>
      );
  }
}

function getErrorMessage(error?: string): string | null {
  switch (error) {
    case "missing_id":
      return "Réservation introuvable.";
    case "invalid_action":
      return "Action invalide.";
    case "not_found":
      return "Réservation non trouvée pour ce restaurant.";
    default:
      return null;
  }
}

export default async function RestaurantReservationsPage({
  searchParams,
}: PageProps) {
  const session = await auth();

  if (!session || session.user.role !== "RESTAURANT_ADMIN") {
    redirect("/login");
  }

  const restaurantId = session.user.restaurantId;

  if (!restaurantId) {
    return <NoRestaurantAssociated />;
  }

  const query = await searchParams;

  const [restaurant, reservations] = await Promise.all([
    prisma.restaurant.findUnique({
      where: { id: restaurantId },
      select: {
        id: true,
        nom: true,
        slug: true,
      },
    }),
    prisma.reservation.findMany({
      where: { restaurantId },
      orderBy: [{ reservationDate: "asc" }, { createdAt: "desc" }],
    }),
  ]);

  if (!restaurant) {
    return <NoRestaurantAssociated />;
  }

  const success = query.success === "1";
  const errorMessage = getErrorMessage(query.error);

  const pendingCount = reservations.filter((r) => r.status === "PENDING").length;
  const confirmedCount = reservations.filter((r) => r.status === "CONFIRMED").length;

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-orange-600">
          Réservations
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
          {restaurant.nom}
        </h1>
        <p className="mt-2 text-neutral-600">
          Gérez les demandes reçues depuis le site public et suivez leur statut.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-neutral-50 p-4">
            <p className="text-sm text-neutral-500">Total</p>
            <p className="mt-1 text-2xl font-bold text-neutral-900">
              {reservations.length}
            </p>
          </div>
          <div className="rounded-2xl bg-neutral-50 p-4">
            <p className="text-sm text-neutral-500">En attente</p>
            <p className="mt-1 text-2xl font-bold text-neutral-900">
              {pendingCount}
            </p>
          </div>
          <div className="rounded-2xl bg-neutral-50 p-4">
            <p className="text-sm text-neutral-500">Confirmées</p>
            <p className="mt-1 text-2xl font-bold text-neutral-900">
              {confirmedCount}
            </p>
          </div>
        </div>

        {success ? (
          <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
            Le statut de la réservation a bien été mis à jour.
          </div>
        ) : null}

        {errorMessage ? (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {errorMessage}
          </div>
        ) : null}
      </section>

      <section className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
        <h2 className="mb-6 text-2xl font-semibold text-neutral-900">
          Demandes reçues
        </h2>

        {reservations.length === 0 ? (
          <p className="text-neutral-600">
            Aucune réservation pour le moment.
          </p>
        ) : (
          <div className="space-y-4">
            {reservations.map((reservation) => (
              <article
                key={reservation.id}
                className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-lg font-semibold text-neutral-900">
                        {reservation.prenom} {reservation.nom}
                      </h3>
                      {getStatusBadge(reservation.status)}
                    </div>

                    <p className="text-sm text-neutral-600">
                      Réservation pour{" "}
                      <span className="font-medium">{reservation.guestCount}</span>{" "}
                      personne{reservation.guestCount > 1 ? "s" : ""} —{" "}
                      <span className="font-medium">
                        {formatDateTime(reservation.reservationDate)}
                      </span>
                    </p>

                    <p className="text-sm text-neutral-600">
                      Email : {reservation.email}
                    </p>

                    {reservation.telephone ? (
                      <p className="text-sm text-neutral-600">
                        Téléphone : {reservation.telephone}
                      </p>
                    ) : null}

                    {reservation.commentaire ? (
                      <p className="text-sm text-neutral-600">
                        Commentaire : {reservation.commentaire}
                      </p>
                    ) : null}

                    <p className="text-xs text-neutral-500">
                      Reçue le {formatDateTime(reservation.createdAt)}
                    </p>
                  </div>

                  {reservation.status === "PENDING" ? (
                    <div className="flex flex-wrap gap-2">
                      <form action={updateReservationStatus}>
                        <input
                          type="hidden"
                          name="reservationId"
                          value={reservation.id}
                        />
                        <input type="hidden" name="actionType" value="confirm" />
                        <button
                          type="submit"
                          className="cursor-pointer rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                        >
                          Confirmer
                        </button>
                      </form>

                      <form action={updateReservationStatus}>
                        <input
                          type="hidden"
                          name="reservationId"
                          value={reservation.id}
                        />
                        <input type="hidden" name="actionType" value="cancel" />
                        <button
                          type="submit"
                          className="cursor-pointer rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                        >
                          Annuler
                        </button>
                      </form>
                    </div>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}