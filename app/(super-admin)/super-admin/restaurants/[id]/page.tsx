import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/shared/lib/prisma";

type PageProps = {
  params: Promise<{ id: string }>;
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

function formatDateTime(value: Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

export default async function SuperAdminRestaurantDetailPage({ params }: PageProps) {
  const { id } = await params;

  const restaurant = await prisma.restaurant.findUnique({
    where: { id },
    include: {
      proprietaire: {
        select: {
          prenom: true,
          nom: true,
          email: true,
        },
      },
      categories: {
        orderBy: {
          nom: "asc",
        },
      },
      menuItems: {
        orderBy: {
          nom: "asc",
        },
      },
      reservations: {
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
      },
      orders: {
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
        include: {
          user: {
            select: {
              prenom: true,
              nom: true,
              email: true,
            },
          },
        },
      },
    },
  });

  if (!restaurant) {
    notFound();
  }

  const confirmedReservations = restaurant.reservations.filter(
    (reservation) => reservation.status === "CONFIRMED",
  ).length;

  const cancelledReservations = restaurant.reservations.filter(
    (reservation) => reservation.status === "CANCELLED",
  ).length;

  const totalRevenue = restaurant.orders.reduce((sum, order) => {
    return sum + Number(order.totalAmount.toString());
  }, 0);

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-orange-600">
              Détail restaurant
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
              {restaurant.nom}
            </h1>
            <p className="mt-3 max-w-3xl text-neutral-600">
              {restaurant.description ?? "Aucune description renseignée."}
            </p>
            <p className="mt-3 text-sm text-neutral-500">{restaurant.adresse}</p>
            <p className="mt-1 text-sm text-neutral-500">
              Propriétaire :{" "}
              {`${restaurant.proprietaire.prenom ?? ""} ${restaurant.proprietaire.nom ?? ""}`.trim() ||
                restaurant.proprietaire.email}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/super-admin/restaurants"
              className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium transition hover:border-orange-500 hover:text-orange-600"
            >
              Retour à la liste
            </Link>
            <Link
              href={`/restaurant/${restaurant.slug}`}
              className="rounded-full bg-orange-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-700"
            >
              Ouvrir la vitrine
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-neutral-500">Catégories</p>
          <p className="mt-1 text-2xl font-bold text-neutral-900">
            {restaurant.categories.length}
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-neutral-500">Plats</p>
          <p className="mt-1 text-2xl font-bold text-neutral-900">
            {restaurant.menuItems.length}
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-neutral-500">Réservations confirmées</p>
          <p className="mt-1 text-2xl font-bold text-neutral-900">
            {confirmedReservations}
          </p>
          <p className="text-xs text-neutral-500">
            {cancelledReservations} annulée(s)
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-neutral-500">CA cumulé visible</p>
          <p className="mt-1 text-2xl font-bold text-neutral-900">
            {formatCurrency(totalRevenue)}
          </p>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-neutral-900">
            Dernières réservations
          </h2>

          {restaurant.reservations.length === 0 ? (
            <p className="text-neutral-600">Aucune réservation disponible.</p>
          ) : (
            <div className="space-y-4">
              {restaurant.reservations.map((reservation) => (
                <article
                  key={reservation.id}
                  className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4"
                >
                  <h3 className="font-semibold text-neutral-900">
                    {reservation.prenom} {reservation.nom}
                  </h3>
                  <p className="text-sm text-neutral-600">
                    {reservation.guestCount} personne(s) — {formatDateTime(reservation.reservationDate)}
                  </p>
                  <p className="text-sm text-neutral-600">Statut : {reservation.status}</p>
                  <p className="text-xs text-neutral-500">
                    Créée le {formatDateTime(reservation.createdAt)}
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-neutral-900">
            Dernières commandes
          </h2>

          {restaurant.orders.length === 0 ? (
            <p className="text-neutral-600">Aucune commande disponible.</p>
          ) : (
            <div className="space-y-4">
              {restaurant.orders.map((order) => (
                <article
                  key={order.id}
                  className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4"
                >
                  <h3 className="font-semibold text-neutral-900">
                    {order.user.prenom} {order.user.nom ?? ""}
                  </h3>
                  <p className="text-sm text-neutral-600">
                    {formatCurrency(Number(order.totalAmount.toString()))}
                  </p>
                  <p className="text-sm text-neutral-600">Statut : {order.status}</p>
                  <p className="text-xs text-neutral-500">
                    Créée le {formatDateTime(order.createdAt)}
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}