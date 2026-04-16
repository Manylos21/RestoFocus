"use server";

import { Prisma } from "@prisma/client";

import { auth } from "@/core/auth/auth";
import { prisma } from "@/shared/lib/prisma";

export async function createOrder(
  restaurantId: string,
  cartItems: { id: string; quantity: number }[],
) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Vous devez être connecté pour passer une commande." };
  }

  if (cartItems.length === 0) {
    return { error: "Votre panier est vide." };
  }

  // Vérifie que l'utilisateur de la session existe encore réellement en base.
  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, role: true },
  });

  if (!currentUser) {
    return {
      error:
        "Votre session n'est plus valide après la réinitialisation de la base. Déconnectez-vous puis reconnectez-vous.",
    };
  }

  const itemIds = cartItems.map((item) => item.id);

  const realMenuItems = await prisma.menuItem.findMany({
    where: {
      id: { in: itemIds },
      restaurantId,
    },
    select: {
      id: true,
      prix: true,
      restaurantId: true,
    },
  });

  if (realMenuItems.length !== cartItems.length) {
    return {
      error: "Certains plats sont invalides ou n'appartiennent pas à ce restaurant.",
    };
  }

  let totalAmount = new Prisma.Decimal(0);

  const orderItemsData = cartItems.map((cartItem) => {
    const realItem = realMenuItems.find((menuItem) => menuItem.id === cartItem.id);

    if (!realItem) {
      throw new Error("Plat introuvable dans la base.");
    }

    const unitPrice = new Prisma.Decimal(realItem.prix.toString());
    const quantity = cartItem.quantity;
    totalAmount = totalAmount.plus(unitPrice.mul(quantity));

    return {
      menuItemId: realItem.id,
      quantity,
      price: unitPrice,
    };
  });

  try {
    const newOrder = await prisma.order.create({
      data: {
        userId: currentUser.id,
        restaurantId,
        totalAmount,
        items: {
          create: orderItemsData,
        },
      },
    });

    return { success: true, orderId: newOrder.id };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      return {
        error:
          "Impossible de créer la commande car une relation en base est invalide. Rechargez la page, reconnectez-vous et réessayez.",
      };
    }

    throw error;
  }
}