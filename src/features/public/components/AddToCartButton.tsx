"use client";

import { useCart } from "@/shared/store/CartContext";
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";

type Props = {
  item: { id: string; nom: string; prix: number };
  restaurantId: string;
};

export function AddToCartButton({ item, restaurantId }: Props) {
  const { addToCart } = useCart();
  const [mounted, setMounted] = useState(false);

  // Sécurité : n'active le bouton que côté client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Si le JS n'est pas encore chargé par le navigateur, on affiche un bouton "fantôme"
  if (!mounted) {
    return (
      <div className="h-9 w-24 animate-pulse rounded-full bg-stone-100" />
    );
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log("CLIC RÉUSSI sur :", item.nom);
        alert("Ajouté au panier !");
        addToCart({ ...item, restaurantId, quantity: 1 });
      }}
      className="cursor-pointer relative z-50 flex items-center gap-2 rounded-full bg-orange-600 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-orange-700"
    >
      <Plus size={16} />
      Ajouter
    </button>
  );
}