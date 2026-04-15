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

  // Sécurité absolue : on revérifie le rôle côté serveur
  if (!session || session.user.role !== "SUPER_ADMIN") {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar Sombre (Identité "God Mode") */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold tracking-wider">RESTO<span className="text-blue-500">FOCUS</span></h1>
          <p className="text-slate-400 text-xs mt-1">Super Admin Console</p>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <Link href="/super-admin" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800 transition-colors">
            <LayoutDashboard size={20} />
            Tableau de bord
          </Link>
          <Link href="/super-admin/restaurants" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800 transition-colors">
            <Store size={20} />
            Restaurants
          </Link>
          <Link href="/super-admin/parametres" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800 transition-colors">
            <Settings size={20} />
            Paramètres
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <div className="text-sm truncate mb-4 text-slate-300">{session.user.email}</div>
          {/* Lien direct vers la route de déconnexion NextAuth */}
          <a href="/api/auth/signout" className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors">
            <LogOut size={18} />
            Se déconnecter
          </a>
        </div>
      </aside>

      {/* Contenu Principal */}
      <main className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm h-16 flex items-center px-8 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-700">Administration Globale</h2>
        </header>
        <div className="p-8 flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}