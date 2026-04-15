"use server";

import { auth } from "@/core/auth/auth";
import {prisma} from "@/shared/lib/prisma";

export async function createOrder(restaurantId: string, cartItems: { id: string; quantity: number }[]) {
  const session = await auth();

  // 1. On vérifie que l'utilisateur est connecté
  if (!session || !session.user.id) {
    return { error: "Vous devez être connecté pour passer une commande." };
  }

  if (cartItems.length === 0) {
    return { error: "Votre panier est vide." };
  }

  // 2. SÉCURITÉ ABSOLUE : On ne fait pas confiance aux prix envoyés par le client !
  // On va chercher les vrais prix dans la base de données.
  const itemIds = cartItems.map(i => i.id);
  const realMenuItems = await prisma.menuItem.findMany({
    where: { 
      id: { in: itemIds }, 
      restaurantId: restaurantId 
    }
  });

  if (realMenuItems.length !== cartItems.length) {
    return { error: "Certains plats sont invalides ou n'appartiennent pas à ce restaurant." };
  }

  // 3. On calcule le vrai total mathématique
  let totalAmount = 0;
  const orderItemsData = cartItems.map(cartItem => {
    const realItem = realMenuItems.find(m => m.id === cartItem.id)!;
    const price = Number(realItem.prix);
    totalAmount += price * cartItem.quantity;

    return {
      menuItemId: realItem.id,
      quantity: cartItem.quantity,
      price: price
    };
  });

  // 4. On crée la commande dans la base de données
  const newOrder = await prisma.order.create({
    data: {
      userId: session.user.id,
      restaurantId: restaurantId,
      totalAmount: totalAmount,
      items: {
        create: orderItemsData
      }
    }
  });

  return { success: true, orderId: newOrder.id };
}