"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/core/auth/auth";
import { prisma } from "@/shared/lib/prisma";

function getString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export async function updateReservationStatus(formData: FormData) {
  const session = await auth();

  if (
    !session ||
    session.user.role !== "RESTAURANT_ADMIN" ||
    !session.user.restaurantId
  ) {
    redirect("/login");
  }

  const reservationId = getString(formData, "reservationId");
  const actionType = getString(formData, "actionType");

  if (!reservationId) {
    redirect("/espace-restaurant/reservations?error=missing_id");
  }

  const nextStatus =
    actionType === "confirm"
      ? "CONFIRMED"
      : actionType === "cancel"
        ? "CANCELLED"
        : null;

  if (!nextStatus) {
    redirect("/espace-restaurant/reservations?error=invalid_action");
  }

  const result = await prisma.reservation.updateMany({
    where: {
      id: reservationId,
      restaurantId: session.user.restaurantId,
    },
    data: {
      status: nextStatus,
    },
  });

  if (result.count === 0) {
    redirect("/espace-restaurant/reservations?error=not_found");
  }

  revalidatePath("/espace-restaurant");
  revalidatePath("/espace-restaurant/reservations");
  redirect("/espace-restaurant/reservations?success=1");
}