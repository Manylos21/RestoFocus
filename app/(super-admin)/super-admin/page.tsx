import Link from "next/link";
import {
  Building2,
  CalendarDays,
  CircleDollarSign,
  ShoppingBag,
  Users,
} from "lucide-react";

import { prisma } from "@/shared/lib/prisma";
import { DashboardStatCard } from "@/widgets/restaurant-admin/dashboard-stat-card";

function formatCurrency(value: { toString(): string } | number | null | undefined): string {
  const numeric =
    typeof value === "number"
      ? value
      : value
        ? Number(value.toString())
        : 0;

  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(numeric);
}

export default async function SuperAdminDashboardPage() {
  const now = new Date();
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(now.getDate() - 30);

  const [
    restaurantsCount,
    usersCount,
    reservations30d,
    confirmedReservations30d,
    orders30d,
    revenue30d,
    restaurants,
  ] = await Promise.all([
    prisma.restaurant.count(),
    prisma.user.count(),
    prisma.reservation.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
    }),
    prisma.reservation.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
        status: "CONFIRMED",
      },
    }),
    prisma.order.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
    }),
    prisma.order.aggregate({
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
      _sum: {
        totalAmount: true,
      },
    }),
    prisma.restaurant.findMany({
      include: {
        _count: {
          select: {
            menuItems: true,
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
        proprietaire: {
          select: {
            prenom: true,
            nom: true,
            email: true,
          },
        },
      },
      orderBy: {
        nom: "asc",
      },
    }),
  ]);

  const confirmationRate =
    reservations30d > 0
      ? `${Math.round((confirmedReservations30d / reservations30d) * 100)} %`
      : "0 %";

  const restaurantComparisons = restaurants.map((restaurant) => {
    const confirmedReservations = restaurant.reservations.filter(
      (reservation) => reservation.status === "CONFIRMED",
    ).length;

    const revenue = restaurant.orders.reduce((sum, order) => {
      return sum + Number(order.totalAmount.toString());
    }, 0);

    const conversionRate =
      restaurant.reservations.length > 0
        ? Math.round((confirmedReservations / restaurant.reservations.length) * 100)
        : 0;

    return {
      id: restaurant.id,
      nom: restaurant.nom,
      slug: restaurant.slug,
      owner:
        `${restaurant.proprietaire.prenom ?? ""} ${restaurant.proprietaire.nom ?? ""}`.trim() ||
        restaurant.proprietaire.email,
      reservations30d: restaurant.reservations.length,
      confirmedReservations,
      orders30d: restaurant.orders.length,
      revenue,
      conversionRate,
      menuItems: restaurant._count.menuItems,
    };
  });

  const topRevenueRestaurants = [...restaurantComparisons]
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  const topReservationRestaurants = [...restaurantComparisons]
    .sort((a, b) => b.reservations30d - a.reservations30d)
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-orange-600">
          Super admin
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
          Pilotage global de la plateforme
        </h1>
        <p className="mt-3 max-w-3xl text-neutral-600">
          Cette vue consolide les performances globales, permet de comparer les
          établissements et donne une vision transverse du produit.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <DashboardStatCard
          title="Restaurants"
          value={String(restaurantsCount)}
          hint="Établissements actifs sur la plateforme"
          icon={Building2}
        />
        <DashboardStatCard
          title="Utilisateurs"
          value={String(usersCount)}
          hint="Comptes créés dans l’application"
          icon={Users}
        />
        <DashboardStatCard
          title="Réservations (30 jours)"
          value={String(reservations30d)}
          hint={`Taux de confirmation : ${confirmationRate}`}
          icon={CalendarDays}
        />
        <DashboardStatCard
          title="Commandes (30 jours)"
          value={String(orders30d)}
          hint="Volume de commandes sur 30 jours"
          icon={ShoppingBag}
        />
        <DashboardStatCard
          title="CA global (30 jours)"
          value={formatCurrency(revenue30d._sum.totalAmount)}
          hint="Somme des commandes enregistrées"
          icon={CircleDollarSign}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-neutral-900">
            Top restaurants par chiffre d’affaires
          </h2>

          {topRevenueRestaurants.length === 0 ? (
            <p className="text-neutral-600">Aucune donnée disponible.</p>
          ) : (
            <div className="space-y-4">
              {topRevenueRestaurants.map((restaurant, index) => (
                <article
                  key={restaurant.id}
                  className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-neutral-50 p-4"
                >
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-orange-600">
                      #{index + 1}
                    </p>
                    <h3 className="font-semibold text-neutral-900">{restaurant.nom}</h3>
                    <p className="text-sm text-neutral-600">{restaurant.owner}</p>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-neutral-900">
                      {formatCurrency(restaurant.revenue)}
                    </p>
                    <Link
                      href={`/super-admin/restaurants/${restaurant.id}`}
                      className="text-sm text-orange-600 hover:underline"
                    >
                      Voir le détail
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-neutral-900">
            Top restaurants par réservations
          </h2>

          {topReservationRestaurants.length === 0 ? (
            <p className="text-neutral-600">Aucune donnée disponible.</p>
          ) : (
            <div className="space-y-4">
              {topReservationRestaurants.map((restaurant, index) => (
                <article
                  key={restaurant.id}
                  className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-neutral-50 p-4"
                >
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-orange-600">
                      #{index + 1}
                    </p>
                    <h3 className="font-semibold text-neutral-900">{restaurant.nom}</h3>
                    <p className="text-sm text-neutral-600">
                      {restaurant.reservations30d} réservation(s), {restaurant.conversionRate} % confirmées
                    </p>
                  </div>

                  <Link
                    href={`/super-admin/restaurants/${restaurant.id}`}
                    className="text-sm font-medium text-orange-600 hover:underline"
                  >
                    Ouvrir
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}