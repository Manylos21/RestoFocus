import { auth } from "@/core/auth/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/shared/lib/prisma";
import Link from "next/link";
import { Clock, ChefHat, CheckCircle, Package, Receipt } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function MyOrdersPage() {
  // 1. Sécurité : On vérifie qui est connecté
  const session = await auth();

  if (!session || !session.user.id) {
    redirect("/login");
  }

  // 2. Base de données : On récupère UNIQUEMENT les commandes de ce client
  const orders = await prisma.order.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      restaurant: {
        select: { nom: true }
      },
      items: {
        include: {
          menuItem: { select: { nom: true } }
        }
      }
    },
    orderBy: {
      createdAt: 'desc' // Les plus récentes en premier
    }
  });

  // Fonction visuelle pour les badges de statut
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING': return <span className="flex items-center gap-1.5 rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800"><Clock size={14}/> En attente du Chef</span>;
      case 'PREPARING': return <span className="flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800"><ChefHat size={14}/> En cuisine</span>;
      case 'READY': return <span className="flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800"><CheckCircle size={14}/> Prêt à récupérer</span>;
      case 'DELIVERED': return <span className="flex items-center gap-1.5 rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-800"><Package size={14}/> Terminé</span>;
      default: return <span className="flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-800">Annulé</span>;
    }
  };

  return (
    <main className="mx-auto min-h-[calc(100vh-10rem)] max-w-4xl p-6 py-12">
      <div className="mb-8 flex items-center gap-3">
        <Receipt className="h-8 w-8 text-orange-600" />
        <h1 className="text-3xl font-bold text-stone-900">Mes Commandes</h1>
      </div>

      <div className="space-y-6">
        {orders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-12 text-center">
            <p className="text-lg font-medium text-stone-900">Vous n'avez pas encore passé de commande.</p>
            <p className="mt-2 text-stone-500">Découvrez nos restaurants et laissez-vous tenter !</p>
            <Link href="/" className="mt-6 inline-block rounded-full bg-orange-600 px-6 py-2.5 font-medium text-white transition hover:bg-orange-700">
              Explorer les restaurants
            </Link>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className=" overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:shadow-md">
              <div className="border-b border-stone-100 bg-stone-50/50 px-6 py-4 sm:flex sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-bold text-stone-900">{order.restaurant.nom}</h3>
                  <p className="text-xs text-stone-500 mt-1">
                    Commande passée le {new Date(order.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="mt-4 sm:mt-0">
                  {getStatusBadge(order.status)}
                </div>
              </div>
              
              <div className="px-6 py-4">
                <ul className="space-y-2">
                  {order.items.map((item) => (
                    <li key={item.id} className="flex justify-between text-sm text-stone-700">
                      <span><span className="font-semibold text-stone-900">{item.quantity}x</span> {item.menuItem.nom}</span>
                      <span className="text-stone-500">{Number(item.price).toFixed(2)} €</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="border-t border-stone-100 bg-stone-50/30 px-6 py-4 text-right">
                <p className="text-sm text-stone-500">Total payé</p>
                <p className="text-xl font-bold text-stone-900">{Number(order.totalAmount).toFixed(2)} €</p>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}