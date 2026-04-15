"use client";

import { useActionState, useEffect, useRef } from "react";

import {
  createMenuItem,
  type MenuItemFormState,
} from "@/features/restaurant-admin/actions/menu-actions";

import { AddMenuFormSubmit } from "./add-menu-form-submit";

const initialState: MenuItemFormState = { status: "idle" };

export type MenuCategoryOption = {
  id: string;
  nom: string;
};

type AddMenuFormProps = {
  categories: MenuCategoryOption[];
};

function fieldError(
  fieldErrors: MenuItemFormState["fieldErrors"],
  key: keyof NonNullable<MenuItemFormState["fieldErrors"]>,
): string | undefined {
  const list = fieldErrors?.[key];
  return list?.[0];
}

export function AddMenuForm({ categories }: AddMenuFormProps) {
  const [state, formAction] = useActionState(createMenuItem, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  if (categories.length === 0) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50/90 px-4 py-3 text-sm text-amber-900">
        Aucune catégorie n’est disponible. Créez d’abord des catégories pour pouvoir
        ajouter des plats.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-200/80 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-zinc-900">Nouveau plat</h2>
      <p className="mt-1 text-sm text-zinc-500">
        Les données sont validées côté serveur ; seuls les plats de votre restaurant
        peuvent être créés.
      </p>

      <form ref={formRef} action={formAction} className="mt-5 flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label htmlFor="nom" className="text-sm font-medium text-zinc-700">
              Nom du plat
            </label>
            <input
              id="nom"
              name="nom"
              type="text"
              required
              autoComplete="off"
              className="rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none ring-zinc-900/10 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-900/15"
              placeholder="Ex. : Magret de canard"
            />
            {fieldError(state.fieldErrors, "nom") ? (
              <p className="text-sm text-red-600">{fieldError(state.fieldErrors, "nom")}</p>
            ) : null}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="prix" className="text-sm font-medium text-zinc-700">
              Prix (€)
            </label>
            <input
              id="prix"
              name="prix"
              type="text"
              inputMode="decimal"
              required
              className="rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none ring-zinc-900/10 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-900/15"
              placeholder="14,50"
            />
            {fieldError(state.fieldErrors, "prix") ? (
              <p className="text-sm text-red-600">{fieldError(state.fieldErrors, "prix")}</p>
            ) : null}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="categoryId" className="text-sm font-medium text-zinc-700">
              Catégorie
            </label>
            <select
              id="categoryId"
              name="categoryId"
              required
              defaultValue=""
              className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none ring-zinc-900/10 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-900/15"
            >
              <option value="" disabled>
                Choisir une catégorie
              </option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nom}
                </option>
              ))}
            </select>
            {fieldError(state.fieldErrors, "categoryId") ? (
              <p className="text-sm text-red-600">
                {fieldError(state.fieldErrors, "categoryId")}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label htmlFor="description" className="text-sm font-medium text-zinc-700">
              Description <span className="font-normal text-zinc-400">(optionnel)</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              className="resize-y rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none ring-zinc-900/10 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-900/15"
              placeholder="Ingrédients, allergènes…"
            />
            {fieldError(state.fieldErrors, "description") ? (
              <p className="text-sm text-red-600">
                {fieldError(state.fieldErrors, "description")}
              </p>
            ) : null}
          </div>
        </div>

        {state.status === "error" && state.message && !state.fieldErrors ? (
          <p className="text-sm text-red-600" role="alert">
            {state.message}
          </p>
        ) : null}

        {state.status === "success" && state.message ? (
          <p className="text-sm text-emerald-700" role="status">
            {state.message}
          </p>
        ) : null}

        <div className="flex justify-end">
          <AddMenuFormSubmit />
        </div>
      </form>
    </div>
  );
}
