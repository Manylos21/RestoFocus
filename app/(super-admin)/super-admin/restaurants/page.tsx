import { auth } from "@/core/auth/auth";
import { redirect } from "next/navigation";
import {prisma} from "@/shared/lib/prisma";

export default async function SuperAdminRestaurantsPage() {
  const session = await auth();

  if (!session || session.user.role !== "SUPER_ADMIN") {
    redirect("/");
  }

  // Requête Prisma optimisée : on récupère le restaurant, l'email du proprio et le nombre de plats en UN SEUL appel
  const restaurants = await prisma.restaurant.findMany({
    include: {
      proprietaire: true,
      _count: {
        select: { menuItems: true },
      },
    },
    orderBy: {
      nom: 'asc'
    }
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Liste des Restaurants</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 text-gray-700 font-medium border-b border-gray-100">
            <tr>
              <th className="px-6 py-4">Nom du restaurant</th>
              <th className="px-6 py-4">Slug</th>
              <th className="px-6 py-4">Propriétaire</th>
              <th className="px-6 py-4">Nb. de plats</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {restaurants.map((restaurant) => (
              <tr key={restaurant.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">{restaurant.nom}</td>
                <td className="px-6 py-4 font-mono text-xs text-gray-500">{restaurant.slug}</td>
                <td className="px-6 py-4">{restaurant.proprietaire?.email || "N/A"}</td>
                <td className="px-6 py-4">
                  <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold">
                    {restaurant._count.menuItems}
                  </span>
                </td>
              </tr>
            ))}
            {restaurants.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  Aucun restaurant inscrit pour le moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}