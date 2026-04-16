"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/core/auth/auth";
import { prisma } from "@/shared/lib/prisma";

function getString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function updateRestaurantSettings(formData: FormData) {
  const session = await auth();

  if (!session || session.user.role !== "RESTAURANT_ADMIN" || !session.user.restaurantId) {
    redirect("/login");
  }

  const nom = getString(formData, "nom");
  const description = getString(formData, "description");
  const adresse = getString(formData, "adresse");
  const telephone = getString(formData, "telephone");
  const emailPublic = getString(formData, "emailPublic");
  const servesCuisine = getString(formData, "servesCuisine");
  const openingHours = getString(formData, "openingHours");
  const reservationUrl = getString(formData, "reservationUrl");
  const googleMapsUrl = getString(formData, "googleMapsUrl");
  const acceptsReservationsValue = getString(formData, "acceptsReservations");

  if (!nom || !adresse) {
    redirect("/espace-restaurant/parametres?error=missing_required_fields");
  }

  const acceptsReservations = acceptsReservationsValue === "on";

  await prisma.restaurant.update({
    where: {
      id: session.user.restaurantId,
    },
    data: {
      nom,
      description: description || null,
      adresse,
      telephone: telephone || null,
      emailPublic: emailPublic || null,
      servesCuisine: servesCuisine || null,
      openingHours: openingHours || null,
      reservationUrl: reservationUrl || null,
      googleMapsUrl: googleMapsUrl || null,
      acceptsReservations,
    },
  });

  revalidatePath("/espace-restaurant");
  revalidatePath("/espace-restaurant/parametres");
  revalidatePath("/restaurant/[slug]", "page");

  redirect("/espace-restaurant/parametres?success=1");
}