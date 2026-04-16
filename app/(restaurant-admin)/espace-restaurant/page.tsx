import {
  CalendarDays,
  CircleDollarSign,
  Clock3,
  MousePointerClick,
  Search,
  ShoppingBag,
  TrendingUp,
  MapPinned,
} from "lucide-react";

import { auth } from "@/core/auth/auth";
import { prisma } from "@/shared/lib/prisma";
import { DashboardStatCard } from "@/widgets/restaurant-admin/dashboard-stat-card";
import { NoRestaurantAssociated } from "@/widgets/restaurant-admin/no-restaurant-associated";

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

function formatDateTime(value: Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

function formatPercentFromRatio(value: number | null | undefined): string {
  if (!value) {
    return "0 %";
  }

  return `${(value * 100).toFixed(1)} %`;
}

function formatAveragePosition(value: number | null | undefined): string {
  if (!value) {
    return "0";
  }

  return value.toFixed(1);
}

export default async function RestaurantDashboardPage() {
  const session = await auth();
  const restaurantId = session?.user?.restaurantId ?? null;

  if (!restaurantId) {
    return <NoRestaurantAssociated />;
  }

  const now = new Date();
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(now.getDate() - 30);

  const thirtyDaysAgoDateOnly = new Date(now);
  thirtyDaysAgoDateOnly.setDate(now.getDate() - 30);
  thirtyDaysAgoDateOnly.setHours(0, 0, 0, 0);

  const [
    restaurant,
    reservationsTotal,
    pendingReservations,
    confirmedReservations,
    ordersTotal,
    revenueAggregate,
    latestReservations,
    latestOrders,
    publicViews30d,
    reservationClicks30d,
    directionsClicks30d,
    gscAggregate,
  ] = await Promise.all([
    prisma.restaurant.findFirst({
      where: { id: restaurantId },
      include: {
        _count: {
          select: {
            categories: true,
            menuItems: true,
            reservations: true,
            orders: true,
          },
        },
      },
    }),
    prisma.reservation.count({
      where: {
        restaurantId,
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
    }),
    prisma.reservation.count({
      where: {
        restaurantId,
        status: "PENDING",
      },
    }),
    prisma.reservation.count({
      where: {
        restaurantId,
        status: "CONFIRMED",
      },
    }),
    prisma.order.count({
      where: {
        restaurantId,
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
    }),
    prisma.order.aggregate({
      where: {
        restaurantId,
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
      _sum: {
        totalAmount: true,
      },
    }),
    prisma.reservation.findMany({
      where: { restaurantId },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.order.findMany({
      where: { restaurantId },
      include: {
        user: {
          select: {
            prenom: true,
            nom: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.publicVisit.count({
      where: {
        restaurantId,
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
    }),
    prisma.publicEvent.count({
      where: {
        restaurantId,
        type: "CTA_RESERVATION",
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
    }),
    prisma.publicEvent.count({
      where: {
        restaurantId,
        type: "CTA_DIRECTIONS",
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
    }),
    prisma.searchPerformanceDaily.aggregate({
      where: {
        restaurantId,
        date: {
          gte: thirtyDaysAgoDateOnly,
        },
      },
      _sum: {
        clicks: true,
        impressions: true,
      },
      _avg: {
        ctr: true,
        averagePosition: true,
      },
    }),
  ]);

  if (!restaurant) {
    return <NoRestaurantAssociated />;
  }

  const reservationConfirmationRate =
    reservationsTotal > 0
      ? `${Math.round((confirmedReservations / reservationsTotal) * 100)} %`
      : "0 %";

  const reservationClickToLeadRate =
    reservationClicks30d > 0
      ? `${Math.round((reservationsTotal / reservationClicks30d) * 100)} %`
      : "0 %";

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-orange-600">
          Tableau de bord
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
          {restaurant.nom}
        </h1>

        {restaurant.description ? (
          <p className="mt-3 max-w-3xl text-neutral-600">
            {restaurant.description}
          </p>
        ) : null}

        <p className="mt-3 text-sm text-neutral-500">Slug : {restaurant.slug}</p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DashboardStatCard
          title="Réservations (30 jours)"
          value={String(reservationsTotal)}
          hint="Demandes reçues depuis le site public"
          icon={CalendarDays}
        />
        <DashboardStatCard
          title="Réservations en attente"
          value={String(pendingReservations)}
          hint="À traiter rapidement"
          icon={Clock3}
        />
        <DashboardStatCard
          title="Commandes (30 jours)"
          value={String(ordersTotal)}
          hint="Commandes enregistrées"
          icon={ShoppingBag}
        />
        <DashboardStatCard
          title="Chiffre d’affaires (30 jours)"
          value={formatCurrency(revenueAggregate._sum.totalAmount)}
          hint={`Taux de confirmation : ${reservationConfirmationRate}`}
          icon={CircleDollarSign}
        />
      </section>

      <section className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
        <div className="mb-6">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-orange-600">
            Acquisition
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
            SEO + engagement onsite
          </h2>
          <p className="mt-2 max-w-3xl text-neutral-600">
            Les métriques Search Console sont préparées dans la base et les métriques onsite
            sont alimentées automatiquement par les visites publiques et les clics CTA.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <DashboardStatCard
            title="Clics Search Console (30 jours)"
            value={String(gscAggregate._sum.clicks ?? 0)}
            hint="Import Search Console"
            icon={Search}
          />
          <DashboardStatCard
            title="Impressions (30 jours)"
            value={String(gscAggregate._sum.impressions ?? 0)}
            hint={`CTR moyen : ${formatPercentFromRatio(gscAggregate._avg.ctr)}`}
            icon={TrendingUp}
          />
          <DashboardStatCard
            title="Vues de page publiques"
            value={String(publicViews30d)}
            hint="Pages restaurant et réservation"
            icon={MousePointerClick}
          />
          <DashboardStatCard
            title="Position moyenne"
            value={formatAveragePosition(gscAggregate._avg.averagePosition)}
            hint="Search Console"
            icon={Search}
          />
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-2xl bg-neutral-50 p-5">
            <p className="text-sm text-neutral-500">Clics vers réservation</p>
            <p className="mt-1 text-2xl font-bold text-neutral-900">
              {reservationClicks30d}
            </p>
            <p className="text-xs text-neutral-500">
              Taux clic → demande : {reservationClickToLeadRate}
            </p>
          </div>

          <div className="rounded-2xl bg-neutral-50 p-5">
            <p className="text-sm text-neutral-500">Clics itinéraire</p>
            <p className="mt-1 text-2xl font-bold text-neutral-900">
              {directionsClicks30d}
            </p>
            <p className="text-xs text-neutral-500">
              Intention de visite locale
            </p>
          </div>

          <div className="rounded-2xl bg-neutral-50 p-5">
            <p className="text-sm text-neutral-500">Demandes de réservation</p>
            <p className="mt-1 text-2xl font-bold text-neutral-900">
              {reservationsTotal}
            </p>
            <p className="text-xs text-neutral-500">
              Conversion métier du trafic
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-neutral-900">
            Dernières réservations
          </h2>

          {latestReservations.length === 0 ? (
            <p className="text-neutral-600">
              Aucune réservation reçue pour le moment.
            </p>
          ) : (
            <div className="space-y-4">
              {latestReservations.map((reservation) => (
                <article
                  key={reservation.id}
                  className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-neutral-900">
                        {reservation.prenom} {reservation.nom}
                      </h3>
                      <p className="text-sm text-neutral-600">
                        {reservation.guestCount} personne
                        {reservation.guestCount > 1 ? "s" : ""} —{" "}
                        {formatDateTime(reservation.reservationDate)}
                      </p>
                    </div>

                    <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-700">
                      {reservation.status}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-neutral-900">
            Dernières commandes
          </h2>

          {latestOrders.length === 0 ? (
            <p className="text-neutral-600">
              Aucune commande reçue pour le moment.
            </p>
          ) : (
            <div className="space-y-4">
              {latestOrders.map((order) => (
                <article
                  key={order.id}
                  className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-neutral-900">
                        {order.user.prenom} {order.user.nom || ""}
                      </h3>
                      <p className="text-sm text-neutral-600">
                        Commande du {formatDateTime(order.createdAt)}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold text-neutral-900">
                        {formatCurrency(order.totalAmount)}
                      </p>
                      <p className="text-xs text-neutral-500">{order.status}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}