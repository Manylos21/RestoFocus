"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// La forme d'un plat dans le panier
type CartItem = {
  id: string;
  nom: string;
  prix: number;
  quantity: number;
  restaurantId: string;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  total: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (newItem: CartItem) => {
    setItems((prev) => {
      // Règle métier : On ne mélange pas les plats de différents restaurants !
      if (prev.length > 0 && prev[0]?.restaurantId !== newItem.restaurantId) {
        alert("Vous ne pouvez commander que dans un seul restaurant à la fois ! Videz votre panier d'abord.");
        return prev;
      }

      // Si le plat est déjà là, on augmente juste la quantité
      const existingItem = prev.find((item) => item.id === newItem.id);
      if (existingItem) {
        return prev.map((item) =>
          item.id === newItem.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      // Sinon, on l'ajoute
      return [...prev, { ...newItem, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => setItems([]);

  // Calcul automatique du prix total
  const total = items.reduce((acc, item) => acc + item.prix * item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
}

// Un petit outil (Hook) pour utiliser le panier partout facilement
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart doit être utilisé à l'intérieur d'un CartProvider");
  return context;
};