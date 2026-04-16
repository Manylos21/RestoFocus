import { auth } from "@/core/auth/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Store, Settings, LogOut } from "lucide-react";

export default async function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || session.user.role !== "SUPER_ADMIN") {
    redirect("/non-autorise");
  }

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="w-full border-r border-neutral-800 bg-neutral-950 text-white lg:w-72">
          <div className="border-b border-neutral-800 px-6 py-6">
            <Link
              href="/"
              className="-m-2 block cursor-pointer rounded-2xl p-2 transition hover:bg-neutral-900"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-500">
                RestoFocus
              </p>
              <h2 className="mt-2 text-xl font-bold text-white">Super Admin</h2>
            </Link>
          </div>

          <nav className="flex flex-col gap-2 p-4">
            <Link
              href="/super-admin"
              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-neutral-200 transition hover:bg-neutral-900 hover:text-white"
            >
              <LayoutDashboard className="h-5 w-5" />
              Tableau de bord
            </Link>

            <Link
              href="/super-admin/restaurants"
              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-neutral-200 transition hover:bg-neutral-900 hover:text-white"
            >
              <Store className="h-5 w-5" />
              Restaurants
            </Link>

            <Link
              href="/super-admin/parametres"
              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-neutral-200 transition hover:bg-neutral-900 hover:text-white"
            >
              <Settings className="h-5 w-5" />
              Paramètres
            </Link>
          </nav>

          <div className="mt-auto border-t border-neutral-800 p-4">
            <p className="mb-3 px-2 text-sm text-neutral-400">{session.user.email}</p>
            <Link
              href="/api/auth/signout"
              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-neutral-200 transition hover:bg-neutral-900 hover:text-white"
            >
              <LogOut className="h-5 w-5" />
              Se déconnecter
            </Link>
          </div>
        </aside>

        <main className="flex-1 p-6 lg:p-10">
          <div className="mb-8">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-orange-600">
              Administration globale
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
              Supervision de la plateforme
            </h1>
          </div>

          {children}
        </main>
      </div>
    </div>
  );
}