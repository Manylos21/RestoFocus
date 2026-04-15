"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { auth } from "@/core/auth/auth";
import { prisma } from "@/shared/lib/prisma";
import { flattenError, z } from "zod";

const MENU_PATH = "/espace-restaurant/menu";

export type MenuItemFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<
    Record<"nom" | "prix" | "description" | "categoryId", string[]>
  >;
};

const createMenuItemSchema = z.object({
  nom: z.string().trim().min(1, "Le nom est obligatoire"),
  description: z
    .string()
    .max(2000, "La description est trop longue")
    .transform((value) => {
      const t = value.trim();
      return t.length === 0 ? undefined : t;
    }),
  prix: z
    .string()
    .trim()
    .min(1, "Le prix est obligatoire")
    .transform((value) => value.replace(",", "."))
    .refine((value) => {
      const n = Number(value);
      return !Number.isNaN(n) && n > 0;
    }, "Le prix doit être un nombre positif"),
  categoryId: z.string().uuid("Catégorie invalide"),
});

async function requireRestaurantAdmin(): Promise<
  | { ok: true; restaurantId: string }
  | { ok: false; state: MenuItemFormState }
> {
  const session = await auth();

  if (!session?.user) {
    return {
      ok: false,
      state: {
        status: "error",
        message: "Vous devez être connecté pour effectuer cette action.",
      },
    };
  }

  if (session.user.role !== "RESTAURANT_ADMIN") {
    return {
      ok: false,
      state: {
        status: "error",
        message: "Seuls les administrateurs restaurant peuvent modifier le menu.",
      },
    };
  }

  const restaurantId = session.user.restaurantId;
  if (!restaurantId || restaurantId.length === 0) {
    return {
      ok: false,
      state: {
        status: "error",
        message: "Aucun restaurant n’est associé à votre compte.",
      },
    };
  }

  return { ok: true, restaurantId };
}

export async function createMenuItem(
  _prevState: MenuItemFormState,
  formData: FormData,
): Promise<MenuItemFormState> {
  const guard = await requireRestaurantAdmin();
  if (!guard.ok) {
    return guard.state;
  }

  const raw = {
    nom: formData.get("nom"),
    description: formData.get("description"),
    prix: formData.get("prix"),
    categoryId: formData.get("categoryId"),
  };

  const parsed = createMenuItemSchema.safeParse({
    nom: typeof raw.nom === "string" ? raw.nom : "",
    description: typeof raw.description === "string" ? raw.description : "",
    prix: typeof raw.prix === "string" ? raw.prix : "",
    categoryId: typeof raw.categoryId === "string" ? raw.categoryId : "",
  });

  if (!parsed.success) {
    const { fieldErrors: rawFieldErrors } = flattenError(parsed.error);
    const fieldErrors = rawFieldErrors as Partial<
      Record<"nom" | "prix" | "description" | "categoryId", string[]>
    >;
    return {
      status: "error",
      message: "Veuillez corriger les champs du formulaire.",
      fieldErrors,
    };
  }

  const { nom, description, prix, categoryId } = parsed.data;

  const category = await prisma.category.findFirst({
    where: {
      id: categoryId,
      restaurantId: guard.restaurantId,
    },
    select: { id: true },
  });

  if (!category) {
    return {
      status: "error",
      message: "Cette catégorie n’existe pas ou n’appartient pas à votre restaurant.",
      fieldErrors: { categoryId: ["Catégorie invalide"] },
    };
  }

  const prixDecimal = new Prisma.Decimal(prix);

  await prisma.menuItem.create({
    data: {
      nom,
      description: description ?? null,
      prix: prixDecimal,
      categoryId,
      restaurantId: guard.restaurantId,
    },
  });

  revalidatePath(MENU_PATH);

  return {
    status: "success",
    message: "Le plat a été ajouté au menu.",
  };
}

export type DeleteMenuItemResult =
  | { ok: true }
  | { ok: false; message: string };

export async function deleteMenuItem(id: string): Promise<DeleteMenuItemResult> {
  const session = await auth();

  if (!session?.user) {
    return { ok: false, message: "Vous devez être connecté." };
  }

  if (session.user.role !== "RESTAURANT_ADMIN") {
    return { ok: false, message: "Action non autorisée." };
  }

  const restaurantId = session.user.restaurantId;
  if (!restaurantId || restaurantId.length === 0) {
    return { ok: false, message: "Aucun restaurant associé." };
  }

  const uuidResult = z.string().uuid().safeParse(id);
  if (!uuidResult.success) {
    return { ok: false, message: "Identifiant de plat invalide." };
  }

  const result = await prisma.menuItem.deleteMany({
    where: {
      id: uuidResult.data,
      restaurantId,
    },
  });

  if (result.count === 0) {
    return {
      ok: false,
      message: "Plat introuvable ou déjà supprimé.",
    };
  }

  revalidatePath(MENU_PATH);

  return { ok: true };
}
