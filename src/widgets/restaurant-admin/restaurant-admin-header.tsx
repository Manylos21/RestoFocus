import { RestaurantAdminSignOutButton } from "@/widgets/restaurant-admin/restaurant-admin-sign-out-button";

type RestaurantAdminHeaderProps = {
  email: string;
};

export function RestaurantAdminHeader({ email }: RestaurantAdminHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-zinc-200/80 bg-white/90 px-6 backdrop-blur lg:px-8">
      <div className="min-w-0 flex-1" />
      <div className="flex items-center gap-4">
        <p className="truncate text-right text-sm text-zinc-600">
          <span className="hidden sm:inline">Connecté en tant que </span>
          <span className="font-medium text-zinc-900">{email || "—"}</span>
        </p>
        <RestaurantAdminSignOutButton />
      </div>
    </header>
  );
}
