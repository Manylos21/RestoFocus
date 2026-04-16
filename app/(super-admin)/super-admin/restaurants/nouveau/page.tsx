import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/core/auth/auth";
import { createRestaurantAdminAction } from "@/features/super-admin/actions/create-restaurant-admin-action";

type PageProps = {
  searchParams: Promise<{ success?: string; error?: string }>;
};

function getErrorMessage(error?: string): string | null {
  switch (error) {
    case "missing_fields":
      return "Merci de remplir tous les champs obligatoires.";
    case "invalid_email":
      return "L’adresse email saisie est invalide.";
    case "password_too_short":
      return "Le mot de passe doit contenir au moins 8 caractères.";
    case "invalid_slug":
      return "Le slug du restaurant est invalide.";
    case "email_exists":
      return "Un utilisateur existe déjà avec cette adresse email.";
    case "slug_exists":
      return "Un restaurant existe déjà avec ce slug.";
    default:
      return null;
  }
}

export default async function NewRestaurantAdminPage({ searchParams }: PageProps) {
  const session = await auth();

  if (!session || session.user.role !== "SUPER_ADMIN") {
    redirect("/non-autorise");
  }

  const query = await searchParams;
  const success = query.success === "1";
  const errorMessage = getErrorMessage(query.error);

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-orange-600">
          Super admin
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
          Créer un compte chef
        </h1>
        <p className="mt-3 max-w-3xl text-neutral-600">
          Cette action crée un compte <span className="font-medium">RESTAURANT_ADMIN</span>
          {" "}et le restaurant associé. Aucun super admin supplémentaire n’est créé ici.
        </p>

        <div className="mt-6">
          <Link
            href="/super-admin/restaurants"
            className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium transition hover:border-orange-500 hover:text-orange-600"
          >
            Retour à la liste des restaurants
          </Link>
        </div>

        {success ? (
          <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
            Le compte chef et le restaurant ont bien été créés.
          </div>
        ) : null}

        {errorMessage ? (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {errorMessage}
          </div>
        ) : null}
      </section>

      <section className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
        <form action={createRestaurantAdminAction} className="grid gap-6">
          <div>
            <h2 className="mb-4 text-xl font-semibold text-neutral-900">
              Informations du chef
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="prenom" className="mb-2 block text-sm font-medium text-neutral-700">
                  Prénom
                </label>
                <input
                  id="prenom"
                  name="prenom"
                  type="text"
                  required
                  className="w-full rounded-xl border border-neutral-300 px-4 py-3 focus:border-orange-500"
                />
              </div>

              <div>
                <label htmlFor="nom" className="mb-2 block text-sm font-medium text-neutral-700">
                  Nom
                </label>
                <input
                  id="nom"
                  name="nom"
                  type="text"
                  required
                  className="w-full rounded-xl border border-neutral-300 px-4 py-3 focus:border-orange-500"
                />
              </div>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-neutral-700">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full rounded-xl border border-neutral-300 px-4 py-3 focus:border-orange-500"
                />
              </div>

              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-medium text-neutral-700">
                  Mot de passe
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="w-full rounded-xl border border-neutral-300 px-4 py-3 focus:border-orange-500"
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-xl font-semibold text-neutral-900">
              Informations du restaurant
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="restaurantNom" className="mb-2 block text-sm font-medium text-neutral-700">
                  Nom du restaurant
                </label>
                <input
                  id="restaurantNom"
                  name="restaurantNom"
                  type="text"
                  required
                  className="w-full rounded-xl border border-neutral-300 px-4 py-3 focus:border-orange-500"
                />
              </div>

              <div>
                <label htmlFor="restaurantSlug" className="mb-2 block text-sm font-medium text-neutral-700">
                  Slug public
                </label>
                <input
                  id="restaurantSlug"
                  name="restaurantSlug"
                  type="text"
                  className="w-full rounded-xl border border-neutral-300 px-4 py-3 focus:border-orange-500"
                  placeholder="ex: le-bistro-parisien"
                />
              </div>
            </div>

            <div className="mt-6">
              <label htmlFor="restaurantAdresse" className="mb-2 block text-sm font-medium text-neutral-700">
                Adresse
              </label>
              <input
                id="restaurantAdresse"
                name="restaurantAdresse"
                type="text"
                required
                className="w-full rounded-xl border border-neutral-300 px-4 py-3 focus:border-orange-500"
              />
            </div>

            <div className="mt-6">
              <label htmlFor="restaurantDescription" className="mb-2 block text-sm font-medium text-neutral-700">
                Description
              </label>
              <textarea
                id="restaurantDescription"
                name="restaurantDescription"
                rows={4}
                className="w-full rounded-xl border border-neutral-300 px-4 py-3 focus:border-orange-500"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="cursor-pointer rounded-full bg-orange-600 px-6 py-3 font-semibold text-white transition hover:bg-orange-700"
            >
              Créer le compte chef et le restaurant
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}