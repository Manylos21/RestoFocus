import Link from "next/link";

import { auth } from "@/core/auth/auth";

type PageProps = {
  searchParams: Promise<{ from?: string }>;
};

export default async function NonAutorisePage({ searchParams }: PageProps) {
  const session = await auth();
  const query = await searchParams;

  const backHref =
    session?.user?.role === "SUPER_ADMIN"
      ? "/super-admin"
      : session?.user?.role === "RESTAURANT_ADMIN"
        ? "/espace-restaurant"
        : "/";

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center px-6 py-12">
      <div className="w-full rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-orange-600">
          Accès refusé
        </p>

        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
          Vous n’êtes pas autorisé à accéder à cette partie.
        </h1>

        <p className="mt-4 leading-7 text-neutral-600">
          Cette zone est réservée à un rôle spécifique.{" "}
          {query.from ? (
            <>
              Tentative d’accès à :{" "}
              <span className="font-medium text-neutral-900">{query.from}</span>.
            </>
          ) : null}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={backHref}
            className="rounded-full bg-orange-600 px-5 py-3 font-semibold text-white transition hover:bg-orange-700"
          >
            Retour
          </Link>

          <Link
            href="/"
            className="rounded-full border border-neutral-300 px-5 py-3 font-semibold text-neutral-900 transition hover:border-orange-500 hover:text-orange-600"
          >
            Aller à l’accueil
          </Link>
        </div>
      </div>
    </div>
  );
}