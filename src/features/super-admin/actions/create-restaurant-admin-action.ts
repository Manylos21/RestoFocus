"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { auth } from "@/core/auth/auth";
import { prisma } from "@/shared/lib/prisma";

function getString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function normalizeSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export async function createRestaurantAdminAction(formData: FormData) {
  const session = await auth();

  if (!session || session.user.role !== "SUPER_ADMIN") {
    redirect("/non-autorise");
  }

  const prenom = getString(formData, "prenom");
  const nom = getString(formData, "nom");
  const email = getString(formData, "email");
  const password = getString(formData, "password");

  const restaurantNom = getString(formData, "restaurantNom");
  const restaurantSlugRaw = getString(formData, "restaurantSlug");
  const restaurantAdresse = getString(formData, "restaurantAdresse");
  const restaurantDescription = getString(formData, "restaurantDescription");

  if (!prenom || !nom || !email || !password || !restaurantNom || !restaurantAdresse) {
    redirect("/super-admin/restaurants/nouveau?error=missing_fields");
  }

  if (!isValidEmail(email)) {
    redirect("/super-admin/restaurants/nouveau?error=invalid_email");
  }

  if (password.length < 8) {
    redirect("/super-admin/restaurants/nouveau?error=password_too_short");
  }

  const restaurantSlug = normalizeSlug(restaurantSlugRaw || restaurantNom);

  if (!restaurantSlug) {
    redirect("/super-admin/restaurants/nouveau?error=invalid_slug");
  }

  const [existingUser, existingRestaurant] = await Promise.all([
    prisma.user.findUnique({
      where: { email },
      select: { id: true },
    }),
    prisma.restaurant.findUnique({
      where: { slug: restaurantSlug },
      select: { id: true },
    }),
  ]);

  if (existingUser) {
    redirect("/super-admin/restaurants/nouveau?error=email_exists");
  }

  if (existingRestaurant) {
    redirect("/super-admin/restaurants/nouveau?error=slug_exists");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.$transaction(async (tx) => {
    const chef = await tx.user.create({
      data: {
        prenom,
        nom,
        email,
        passwordHash,
        role: "RESTAURANT_ADMIN",
      },
    });

    await tx.restaurant.create({
      data: {
        nom: restaurantNom,
        slug: restaurantSlug,
        description: restaurantDescription || null,
        adresse: restaurantAdresse,
        proprietaireId: chef.id,
      },
    });
  });

  revalidatePath("/super-admin");
  revalidatePath("/super-admin/restaurants");

  redirect("/super-admin/restaurants/nouveau?success=1");
}