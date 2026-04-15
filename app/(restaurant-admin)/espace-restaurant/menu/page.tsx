import { UtensilsCrossed } from "lucide-react";

import { auth } from "@/core/auth/auth";
import { AddMenuForm } from "@/features/restaurant-admin/components/AddMenuForm";
import { DeleteMenuButton } from "@/features/restaurant-admin/components/DeleteMenuButton";
import { prisma } from "@/shared/lib/prisma";
import { NoRestaurantAssociated } from "@/widgets/restaurant-admin/no-restaurant-associated";

function formatPrice(value: { toString(): string }): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(Number(value.toString()));
}

export default async function RestaurantMenuPage() {
  const session = await auth();

  if (session?.user?.role !== "RESTAURANT_ADMIN") {
    return (
      <div className="mx-auto max-w-2xl rounded-xl border border-zinc-200 bg-white px-6 py-10 text-center shadow-sm">
        <UtensilsCrossed
          className="mx-auto h-10 w-10 text-zinc-400"
          aria-hidden
        />
        <h1 className="mt-4 text-xl font-semibold text-zinc-900">Mon Menu</h1>
        <p className="mt-2 text-sm text-zinc-600">
          La gestion du menu est réservée aux administrateurs d’un établissement
          (compte restaurant).
        </p>
      </div>
    );
  }

  const restaurantId = session.user.restaurantId;
  if (!restaurantId) {
    return <NoRestaurantAssociated />;
  }

  const [menuItems, categories] = await Promise.all([
    prisma.menuItem.findMany({
      where: { restaurantId },
      include: { category: { select: { id: true, nom: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({
      where: { restaurantId },
      orderBy: { nom: "asc" },
      select: { id: true, nom: true },
    }),
  ]);

  const categoryOptions = categories.map((c) => ({ id: c.id, nom: c.nom }));

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
      <div>
        <p className="text-sm font-medium text-zinc-500">Mon Menu</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
          Plats du restaurant
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-zinc-600">
          Liste des plats proposés à vos clients. Ajoutez ou supprimez des entrées :
          chaque action est vérifiée côté serveur.
        </p>
      </div>

      <AddMenuForm categories={categoryOptions} />

      <div className="overflow-hidden rounded-xl border border-zinc-200/80 bg-white shadow-sm">
        <div className="border-b border-zinc-100 px-5 py-4">
          <h2 className="text-base font-semibold text-zinc-900">Plats publiés</h2>
          <p className="text-sm text-zinc-500">
            {menuItems.length === 0
              ? "Aucun plat pour le moment."
              : `${menuItems.length} plat${menuItems.length > 1 ? "s" : ""}`}
          </p>
        </div>

        {menuItems.length === 0 ? (
          <div className="px-5 py-12 text-center text-sm text-zinc-500">
            Utilisez le formulaire ci-dessus pour créer votre premier plat.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-zinc-100 bg-zinc-50/80 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                <tr>
                  <th className="px-5 py-3">Plat</th>
                  <th className="px-5 py-3">Catégorie</th>
                  <th className="px-5 py-3 text-right">Prix</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {menuItems.map((item) => (
                  <tr key={item.id} className="transition hover:bg-zinc-50/60">
                    <td className="px-5 py-4 align-top">
                      <p className="font-medium text-zinc-900">{item.nom}</p>
                      {item.description ? (
                        <p className="mt-1 max-w-md text-xs leading-relaxed text-zinc-500">
                          {item.description}
                        </p>
                      ) : null}
                    </td>
                    <td className="px-5 py-4 align-top">
                      <span className="inline-flex rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-700">
                        {item.category.nom}
                      </span>
                    </td>
                    <td className="px-5 py-4 align-top text-right font-medium tabular-nums text-zinc-900">
                      {formatPrice(item.prix)}
                    </td>
                    <td className="px-5 py-4 align-top text-right">
                      <DeleteMenuButton menuItemId={item.id} label={item.nom} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
