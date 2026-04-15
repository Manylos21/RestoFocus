import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { LoginForm } from "@/features/public/components/LoginForm";

export const metadata: Metadata = {
  title: "Connexion | RestoFocus",
  description: "Connectez-vous à votre compte RestoFocus.",
};

function LoginFormFallback() {
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="h-10 animate-pulse rounded-lg bg-zinc-100" />
      <div className="h-10 animate-pulse rounded-lg bg-zinc-100" />
      <div className="h-11 animate-pulse rounded-lg bg-zinc-200" />
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-full flex-1 items-center justify-center bg-zinc-100 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200/80 bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            RestoFocus
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900">
            Connexion
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            Accédez à votre espace sécurisé avec votre email et votre mot de passe.
          </p>
        </div>

        <Suspense fallback={<LoginFormFallback />}>
          <LoginForm />
        </Suspense>

        <p className="mt-8 text-center text-sm text-zinc-500">
          <Link href="/" className="font-medium text-zinc-800 underline-offset-4 hover:underline">
            Retour au site
          </Link>
        </p>
      </div>
    </div>
  );
}
