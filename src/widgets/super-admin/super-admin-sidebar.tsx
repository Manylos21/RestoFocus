"use client";

import { Building2, LayoutDashboard, Settings2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/super-admin", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/super-admin/restaurants", label: "Restaurants", icon: Building2 },
  { href: "/super-admin/parametres", label: "Paramètres", icon: Settings2 },
] as const;

function isActive(pathname: string, href: string): boolean {
  if (href === "/super-admin") {
    return pathname === "/super-admin";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SuperAdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full border-r border-neutral-200 bg-white lg:w-72">
      <div className="border-b border-neutral-200 px-6 py-6">
        <Link
          href="/super-admin"
          className="-m-2 block rounded-2xl p-2 transition hover:bg-neutral-50"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-600">
            RestoFocus
          </p>
          <h2 className="mt-2 text-xl font-bold text-neutral-900">Super Admin</h2>
        </Link>
      </div>

      <nav className="flex flex-col gap-2 p-4">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = isActive(pathname, href);

          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                active
                  ? "bg-orange-50 text-orange-700"
                  : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
              }`}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
