import type { Metadata } from "next";
import Link from "next/link";

import {
  loginAction,
  registerCustomerAction,
} from "@/features/public/components/actions/auth-actions";

export const metadata: Metadata = {
  title: "Connexion | RestoFocus",
  description: "Connectez-vous à votre compte RestoFocus ou créez un compte client.",
};

type PageProps = {
  searchParams: Promise<{
    error?: string;
    signupError?: string;
    registered?: string;
    callbackUrl?: string;
  }>;
};

function getLoginErrorMessage(error?: string): string | null {
  switch (error) {
    case "missing_login_fields":
      return "Merci de renseigner votre email et votre mot de passe.";
    case "invalid_credentials":
      return "Email ou mot de passe incorrect.";
    default:
      return null;
  }
}

function getSignupErrorMessage(error?: string): string | null {
  switch (error) {
    case "missing_fields":
      return "Merci de remplir tous les champs du formulaire client.";
    case "invalid_email":
      return "L’adresse email saisie est invalide.";
    case "password_too_short":
      return "Le mot de passe doit contenir au moins 8 caractères.";
    case "password_mismatch":
      return "Les mots de passe ne correspondent pas.";
    case "email_exists":
      return "Un compte existe déjà avec cette adresse email.";
    default:
      return null;
  }
}

export default async function LoginPage({ searchParams }: PageProps) {
  const query = await searchParams;

  const loginError = getLoginErrorMessage(query.error);
  const signupError = getSignupErrorMessage(query.signupError);
  const registered = query.registered === "1";
  const callbackUrl =
    typeof query.callbackUrl === "string" && query.callbackUrl.startsWith("/")
      ? query.callbackUrl
      : "/";

  return (
    <div className="min-h-full bg-zinc-100 px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            RestoFocus
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900">
            Connexion et création de compte
          </h1>
          <p className="mt-3 text-sm text-zinc-600">
            Connectez-vous à votre espace ou créez un compte client.
          </p>
        </div>

        {registered ? (
          <div className="mx-auto mb-6 max-w-4xl rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
            Votre compte client a bien été créé. Vous pouvez maintenant vous connecter.
          </div>
        ) : null}

        <div className="grid gap-8 lg:grid-cols-2">
          <section className="rounded-2xl border border-zinc-200/80 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
              Se connecter
            </h2>
            <p className="mt-2 text-sm text-zinc-600">
              Accédez à votre espace sécurisé avec votre email et votre mot de passe.
            </p>

            {loginError ? (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                {loginError}
              </div>
            ) : null}

            <form action={loginAction} className="mt-6 space-y-4">
              <input type="hidden" name="callbackUrl" value={callbackUrl} />

              <div>
                <label
                  htmlFor="login-email"
                  className="mb-2 block text-sm font-medium text-zinc-700"
                >
                  Email
                </label>
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  required
                  className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none transition focus:border-orange-500"
                  placeholder="vous@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="login-password"
                  className="mb-2 block text-sm font-medium text-zinc-700"
                >
                  Mot de passe
                </label>
                <input
                  id="login-password"
                  name="password"
                  type="password"
                  required
                  className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none transition focus:border-orange-500"
                  placeholder="Votre mot de passe"
                />
              </div>

              <button
                type="submit"
                className="cursor-pointer rounded-full bg-orange-600 px-6 py-3 font-semibold text-white transition hover:bg-orange-700"
              >
                Se connecter
              </button>
            </form>
          </section>

          <section className="rounded-2xl border border-zinc-200/80 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
              Créer un compte client
            </h2>
            <p className="mt-2 text-sm text-zinc-600">
              Cette inscription crée uniquement un compte client.
            </p>

            {signupError ? (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                {signupError}
              </div>
            ) : null}

            <form action={registerCustomerAction} className="mt-6 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="signup-prenom"
                    className="mb-2 block text-sm font-medium text-zinc-700"
                  >
                    Prénom
                  </label>
                  <input
                    id="signup-prenom"
                    name="prenom"
                    type="text"
                    required
                    className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none transition focus:border-orange-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="signup-nom"
                    className="mb-2 block text-sm font-medium text-zinc-700"
                  >
                    Nom
                  </label>
                  <input
                    id="signup-nom"
                    name="nom"
                    type="text"
                    required
                    className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none transition focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="signup-email"
                  className="mb-2 block text-sm font-medium text-zinc-700"
                >
                  Email
                </label>
                <input
                  id="signup-email"
                  name="email"
                  type="email"
                  required
                  className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none transition focus:border-orange-500"
                />
              </div>

              <div>
                <label
                  htmlFor="signup-password"
                  className="mb-2 block text-sm font-medium text-zinc-700"
                >
                  Mot de passe
                </label>
                <input
                  id="signup-password"
                  name="password"
                  type="password"
                  required
                  className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none transition focus:border-orange-500"
                />
              </div>

              <div>
                <label
                  htmlFor="signup-confirm-password"
                  className="mb-2 block text-sm font-medium text-zinc-700"
                >
                  Confirmer le mot de passe
                </label>
                <input
                  id="signup-confirm-password"
                  name="confirmPassword"
                  type="password"
                  required
                  className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none transition focus:border-orange-500"
                />
              </div>

              <button
                type="submit"
                className="cursor-pointer rounded-full border border-zinc-300 px-6 py-3 font-semibold text-zinc-900 transition hover:border-orange-500 hover:text-orange-600"
              >
                Créer mon compte client
              </button>

              <p className="text-sm leading-6 text-zinc-500">
                Aucun compte super admin ni chef ne peut être créé depuis cette page.
              </p>
            </form>
          </section>
        </div>

        <p className="mt-8 text-center text-sm text-zinc-500">
          <Link href="/" className="font-medium text-zinc-800 underline-offset-4 hover:underline">
            Retour au site
          </Link>
        </p>
      </div>
    </div>
  );
}