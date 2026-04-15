"use client";

import { useCart } from "@/shared/store/CartContext";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";

export function CartIcon() {
  const { items } = useCart();
  
  // On additionne les quantités de chaque plat pour avoir le total d'articles
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <Link href="/panier" className="relative flex items-center p-2 text-stone-600 transition hover:text-orange-900">
      <ShoppingBag size={24} />
      {itemCount > 0 && (
        <span className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-orange-600 text-[10px] font-bold text-white shadow-sm">
          {itemCount}
        </span>
      )}
    </Link>
  );
}