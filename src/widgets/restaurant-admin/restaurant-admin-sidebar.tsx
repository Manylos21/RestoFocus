"use client";

import { LayoutDashboard, Settings2, UtensilsCrossed } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/espace-restaurant", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/espace-restaurant/menu", label: "Mon Menu", icon: UtensilsCrossed },
  { href: "/espace-restaurant/parametres", label: "Paramètres", icon: Settings2 },
] as const;

function isActive(pathname: string, href: string): boolean {
  if (href === "/espace-restaurant") {
    return pathname === "/espace-restaurant";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function RestaurantAdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-zinc-200/80 bg-white shadow-sm">
      <div className="flex h-16 items-center border-b border-zinc-100 px-5">
        <span className="text-sm font-semibold tracking-tight text-zinc-900">
          RestoFocus
        </span>
        <span className="ml-2 rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600">
          Restaurant
        </span>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-3" aria-label="Navigation espace restaurant">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = isActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? "bg-zinc-900 text-white shadow-sm"
                  : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
