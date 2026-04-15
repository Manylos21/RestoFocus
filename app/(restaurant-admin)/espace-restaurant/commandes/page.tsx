import { auth } from "@/core/auth/auth";
import { redirect } from "next/navigation";
import {prisma} from "@/shared/lib/prisma";
import { Clock, CheckCircle, ChefHat, XCircle } from "lucide-react";

export default async function RestaurantOrdersPage() {
  const session = await auth();

  // Sécurité
  if (!session || session.user.role !== "RESTAURANT_ADMIN" || !session.user.restaurantId) {
    redirect("/login");
  }

  // Récupérer les commandes du restaurant avec les détails du client et des plats
  const orders = await prisma.order.findMany({
    where: {
      restaurantId: session.user.restaurantId,
    },
    include: {
      user: {
        select: { nom: true, prenom: true, email: true }
      },
      items: {
        include: { menuItem: true }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  // Fonction pour afficher une belle étiquette selon le statut
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING': return <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs flex items-center gap-1"><Clock size={14}/> En attente</span>;
      case 'PREPARING': return <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs flex items-center gap-1"><ChefHat size={14}/> En cuisine</span>;
      case 'READY': return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs flex items-center gap-1"><CheckCircle size={14}/> Prêt</span>;
      default: return <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs flex items-center gap-1"><XCircle size={14}/> {status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Commandes en cours</h1>
      
      <div className="grid gap-4">
        {orders.length === 0 ? (
          <div className="bg-white p-8 text-center rounded-xl border border-dashed border-gray-300 text-gray-500">
            Aucune commande pour le moment.
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 justify-between md:items-center">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-bold text-lg text-gray-900">
                    Commande #{order.id.slice(0, 8)}...
                  </h3>
                  {getStatusBadge(order.status)}
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  Client : <span className="font-medium text-gray-700">{order.user.prenom} {order.user.nom || order.user.email}</span>
                </p>
                
                <ul className="space-y-1">
                  {order.items.map((item) => (
                    <li key={item.id} className="text-sm text-gray-700">
                      <span className="font-medium">{item.quantity}x</span> {item.menuItem.nom} 
                      <span className="text-gray-400 text-xs ml-2">({item.price.toString()}€/u)</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex flex-col items-end gap-4 mt-4 md:mt-0 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                <p className="text-2xl font-bold text-gray-900">{order.totalAmount.toString()} €</p>
                {order.status === 'PENDING' && (
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                    Accepter & Préparer
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}