import { Euro, Layers, UtensilsCrossed, CalendarDays } from "lucide-react";

import { auth } from "@/core/auth/auth";
import { prisma } from "@/shared/lib/prisma";
import { DashboardStatCard } from "@/widgets/restaurant-admin/dashboard-stat-card";
import { NoRestaurantAssociated } from "@/widgets/restaurant-admin/no-restaurant-associated";
import { RevenueChart } from "@/widgets/restaurant-admin/revenue-chart";

export default async function RestaurantDashboardPage() {
  const session = await auth();
  const restaurantId = session?.user?.restaurantId ?? null;

  if (!restaurantId) {
    return <NoRestaurantAssociated />;
  }

  const restaurant = await prisma.restaurant.findFirst({
    where: { id: restaurantId },
    include: {
      _count: {
        select: {
          categories: true,
          menuItems: true,
        },
      },
    },
  });

  if (!restaurant) {
    return <NoRestaurantAssociated />;
  }

  const categoriesCount = restaurant._count.categories;
  const menuItemsCount = restaurant._count.menuItems;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <div>
        <p className="text-sm font-medium text-zinc-500">Tableau de bord</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
          {restaurant.nom}
        </h1>
        {restaurant.description ? (
          <p className="mt-2 max-w-2xl text-sm text-zinc-600">
            {restaurant.description}
          </p>
        ) : null}
        <p className="mt-1 text-xs text-zinc-400">Slug : {restaurant.slug}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardStatCard
          title="Plats au menu"
          value={String(menuItemsCount)}
          hint="Articles publiés"
          icon={UtensilsCrossed}
        />
        <DashboardStatCard
          title="Catégories actives"
          value={String(categoriesCount)}
          hint="Sections du menu"
          icon={Layers}
        />
        <DashboardStatCard
          title="Chiffre d'affaires"
          value="12 450 €"
          hint="Ce mois (estimation — démo)"
          icon={Euro}
          variant="muted"
        />
        <DashboardStatCard
          title="Réservations"
          value="24"
          hint="Aujourd'hui (démo)"
          icon={CalendarDays}
          variant="muted"
        />
      </div>

      <RevenueChart />
    </div>
  );
}
