"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export function RestaurantAdminSignOutButton() {
  return (
    <button
      type="button"
      onClick={() => {
        void signOut({ callbackUrl: "/" });
      }}
      className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-50"
    >
      <LogOut className="h-4 w-4" aria-hidden />
      Se déconnecter
    </button>
  );
}
