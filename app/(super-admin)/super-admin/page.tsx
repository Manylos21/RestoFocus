import { auth } from "@/core/auth/auth";
import { redirect } from "next/navigation";
import {prisma} from "@/shared/lib/prisma";
import { Store, Users, UtensilsCrossed } from "lucide-react";

export default async function SuperAdminPage() {
  // 1. Sécurité absolue : on récupère la session
  const session = await auth();

  // 2. Vérification du rôle
  if (!session || session.user.role !== "SUPER_ADMIN") {
    redirect("/");
  }

  // 3. Récupération des données réelles en parallèle
  const [totalRestaurants, totalUsers, totalMenuItems] = await Promise.all([
    prisma.restaurant.count(),
    prisma.user.count(),
    prisma.menuItem.count(),
  ]);

  return (
    <main className="mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-5xl flex-col gap-6 px-6 py-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          RestoFocus - Super Admin
        </p>
        <h1 className="text-3xl font-bold text-zinc-900 mt-1">Pilotage plateforme</h1>
        <p className="text-zinc-600 mt-2">
          Vue d'ensemble et supervision globale de l'activité.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        {/* Carte Restaurants */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-blue-100 text-blue-600 rounded-lg">
            <Store size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Restaurants Inscrits</p>
            <p className="text-3xl font-bold text-gray-900">{totalRestaurants}</p>
          </div>
        </div>

        {/* Carte Utilisateurs */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-green-100 text-green-600 rounded-lg">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Utilisateurs Totaux</p>
            <p className="text-3xl font-bold text-gray-900">{totalUsers}</p>
          </div>
        </div>

        {/* Carte Plats */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-orange-100 text-orange-600 rounded-lg">
            <UtensilsCrossed size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Plats sur la plateforme</p>
            <p className="text-3xl font-bold text-gray-900">{totalMenuItems}</p>
          </div>
        </div>
      </div>
    </main>
  );
}