"use client";

import { useCart } from "@/shared/store/CartContext";
import { Plus } from "lucide-react";

type Props = {
  item: { id: string; nom: string; prix: number };
  restaurantId: string;
};

export function AddToCartButton({ item, restaurantId }: Props) {
  const { addToCart } = useCart();

  return (
    <button
      onClick={() => addToCart({ ...item, restaurantId, quantity: 1 })}
      className="flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1.5 text-sm font-semibold text-orange-700 transition-colors hover:bg-orange-200"
    >
      <Plus size={16} />
      Ajouter
    </button>
  );
}