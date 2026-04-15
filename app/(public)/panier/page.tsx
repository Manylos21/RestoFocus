"use client";

import { useCart } from "@/shared/store/CartContext";
import { createOrder } from "@/features/public/components/actions/order-actions";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { items, removeFromCart, total, clearCart } = useCart();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  if (items.length === 0) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-10rem)] max-w-2xl flex-col items-center justify-center gap-4 p-6">
        <h1 className="text-2xl font-bold text-stone-800">Votre panier est vide</h1>
        <p className="text-stone-500">Découvrez nos restaurants pour commencer votre commande.</p>
        <Link href="/" className="mt-4 rounded-full bg-orange-600 px-6 py-2 text-white hover:bg-orange-700">
          Voir les restaurants
        </Link>
      </main>
    );
  }

  const handleCheckout = async () => {
    // 1. On extrait le premier élément du panier
    const firstItem = items[0];

    // 2. S'il n'existe pas, on arrête tout immédiatement.
    // Cela rassure TypeScript à 100% !
    if (!firstItem) return;

    setIsPending(true);
    setError("");
    
    // 3. On utilise firstItem au lieu de items[0]
    const restaurantId = firstItem.restaurantId; 
    const orderData = items.map(item => ({ id: item.id, quantity: item.quantity }));

    // On appelle notre action serveur ultra-sécurisée !
    const result = await createOrder(restaurantId, orderData);

    setIsPending(false);

    if (result.error) {
      setError(result.error);
    } else {
      clearCart();
      alert("Commande validée avec succès ! (Ticket #" + result.orderId?.slice(0, 8) + ")");
      router.push("/");
    }
  };

  return (
    <main className="mx-auto min-h-[calc(100vh-10rem)] max-w-3xl p-6 py-12">
      <h1 className="mb-8 text-3xl font-bold text-stone-900">Votre Panier</h1>
      
      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <ul className="divide-y divide-stone-100">
          {items.map((item) => (
            <li key={item.id} className="flex items-center justify-between py-4">
              <div>
                <h3 className="font-semibold text-stone-800">{item.nom}</h3>
                <p className="text-sm text-stone-500">Quantité : {item.quantity}</p>
              </div>
              <div className="flex items-center gap-4">
                <p className="font-medium text-stone-900">{(item.prix * item.quantity).toFixed(2)} €</p>
                <button onClick={() => removeFromCart(item.id)} className="text-stone-400 hover:text-red-500 transition">
                  <Trash2 size={18} />
                </button>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-6 border-t border-stone-100 pt-6">
          <div className="flex items-center justify-between text-lg font-bold text-stone-900">
            <span>Total</span>
            <span>{total.toFixed(2)} €</span>
          </div>
          
          {error && <p className="mt-4 rounded bg-red-50 p-3 text-sm text-red-600">{error}</p>}

          <button
            onClick={handleCheckout}
            disabled={isPending}
            className="mt-6 w-full rounded-xl bg-stone-900 py-3 text-center font-semibold text-white transition hover:bg-stone-800 disabled:opacity-50"
          >
            {isPending ? "Validation en cours..." : "Valider la commande"}
          </button>
        </div>
      </div>
    </main>
  );
}