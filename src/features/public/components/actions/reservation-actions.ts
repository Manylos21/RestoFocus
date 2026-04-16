"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/shared/lib/prisma";

function getString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function submitReservation(formData: FormData) {
  const restaurantId = getString(formData, "restaurantId");
  const slug = getString(formData, "slug");
  const prenom = getString(formData, "prenom");
  const nom = getString(formData, "nom");
  const email = getString(formData, "email");
  const telephone = getString(formData, "telephone");
  const date = getString(formData, "date");
  const heure = getString(formData, "heure");
  const personnes = getString(formData, "personnes");
  const commentaire = getString(formData, "commentaire");

  if (!restaurantId || !slug || !prenom || !nom || !email || !date || !heure || !personnes) {
    redirect(`/reservation/${slug || "le-bistro-parisien"}?error=missing_fields`);
  }

  const guestCount = Number(personnes);

  if (!Number.isInteger(guestCount) || guestCount < 1 || guestCount > 20) {
    redirect(`/reservation/${slug}?error=invalid_guest_count`);
  }

  const reservationDate = new Date(`${date}T${heure}:00`);

  if (Number.isNaN(reservationDate.getTime())) {
    redirect(`/reservation/${slug}?error=invalid_date`);
  }

  const restaurant = await prisma.restaurant.findUnique({
    where: { id: restaurantId },
    select: {
      id: true,
      slug: true,
      acceptsReservations: true,
    },
  });

  if (!restaurant) {
    redirect(`/reservation/${slug}?error=restaurant_not_found`);
  }

  if (!restaurant.acceptsReservations) {
    redirect(`/reservation/${slug}?error=reservations_disabled`);
  }

  await prisma.reservation.create({
    data: {
      restaurantId: restaurant.id,
      prenom,
      nom,
      email,
      telephone: telephone || null,
      reservationDate,
      guestCount,
      commentaire: commentaire || null,
      status: "PENDING",
      source: "site_public",
    },
  });

  revalidatePath("/espace-restaurant");
  revalidatePath("/espace-restaurant/reservations");

  redirect(`/reservation/${restaurant.slug}?success=1`);
}