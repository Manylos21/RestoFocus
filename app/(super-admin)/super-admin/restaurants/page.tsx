import Link from "next/link";
import { prisma } from "@/shared/lib/prisma";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

export default async function SuperAdminRestaurantsPage() {
  const now = new Date();
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(now.getDate() - 30);

  const restaurants = await prisma.restaurant.findMany({
    include: {
      proprietaire: {
        select: {
          prenom: true,
          nom: true,
          email: true,
        },
      },
      _count: {
        select: {
          menuItems: true,
          categories: true,
          reservations: true,
          orders: true,
        },
      },
      reservations: {
        where: {
          createdAt: {
            gte: thirtyDaysAgo,
          },
        },
        select: {
          id: true,
          status: true,
        },
      },
      orders: {
        where: {
          createdAt: {
            gte: thirtyDaysAgo,
          },
        },
        select: {
          id: true,
          totalAmount: true,
        },
      },
    },
    orderBy: {
      nom: "asc",
    },
  });

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-orange-600">
          Restaurants
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
          Vue comparative des établissements
        </h1>
        <p className="mt-3 max-w-3xl text-neutral-600">
          Comparez les restaurants par volume de réservations, commandes, revenus
          et qualité du catalogue.
        </p>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        {restaurants.map((restaurant) => {
          const confirmedReservations = restaurant.reservations.filter(
            (reservation) => reservation.status === "CONFIRMED",
          ).length;

          const revenue30d = restaurant.orders.reduce((sum, order) => {
            return sum + Number(order.totalAmount.toString());
          }, 0);

          const conversionRate =
            restaurant.reservations.length > 0
              ? Math.round((confirmedReservations / restaurant.reservations.length) * 100)
              : 0;

          return (
            <article
              key={restaurant.id}
              className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-neutral-900">
                    {restaurant.nom}
                  </h2>
                  <p className="mt-1 text-sm text-neutral-600">{restaurant.adresse}</p>
                  <p className="mt-2 text-sm text-neutral-500">
                    Propriétaire :{" "}
                    {`${restaurant.proprietaire.prenom ?? ""} ${restaurant.proprietaire.nom ?? ""}`.trim() ||
                      restaurant.proprietaire.email}
                  </p>
                  <p className="mt-1 text-sm text-neutral-500">Slug : {restaurant.slug}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/restaurant/${restaurant.slug}`}
                    className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium transition hover:border-orange-500 hover:text-orange-600"
                  >
                    Voir la vitrine
                  </Link>
                  <Link
                    href={`/super-admin/restaurants/${restaurant.id}`}
                    className="rounded-full bg-orange-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-700"
                  >
                    Voir le détail
                  </Link>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl bg-neutral-50 p-4">
                  <p className="text-sm text-neutral-500">Menu</p>
                  <p className="mt-1 text-2xl font-bold text-neutral-900">
                    {restaurant._count.menuItems}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {restaurant._count.categories} catégorie(s)
                  </p>
                </div>

                <div className="rounded-2xl bg-neutral-50 p-4">
                  <p className="text-sm text-neutral-500">Réservations (30 jours)</p>
                  <p className="mt-1 text-2xl font-bold text-neutral-900">
                    {restaurant.reservations.length}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {confirmedReservations} confirmée(s)
                  </p>
                </div>

                <div className="rounded-2xl bg-neutral-50 p-4">
                  <p className="text-sm text-neutral-500">Commandes (30 jours)</p>
                  <p className="mt-1 text-2xl font-bold text-neutral-900">
                    {restaurant.orders.length}
                  </p>
                  <p className="text-xs text-neutral-500">
                    Conversion réservation : {conversionRate} %
                  </p>
                </div>

                <div className="rounded-2xl bg-neutral-50 p-4">
                  <p className="text-sm text-neutral-500">CA (30 jours)</p>
                  <p className="mt-1 text-2xl font-bold text-neutral-900">
                    {formatCurrency(revenue30d)}
                  </p>
                  <p className="text-xs text-neutral-500">
                    Réservation en ligne : {restaurant.acceptsReservations ? "Oui" : "Non"}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}