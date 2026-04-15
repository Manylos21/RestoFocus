import { auth } from "@/core/auth/auth";
import { RestaurantAdminHeader } from "@/widgets/restaurant-admin/restaurant-admin-header";
import { RestaurantAdminSidebar } from "@/widgets/restaurant-admin/restaurant-admin-sidebar";

export default async function RestaurantAdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const email = session?.user?.email ?? "";

  return (
    <div className="flex min-h-screen bg-[#f9fafb]">
      <RestaurantAdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <RestaurantAdminHeader email={email} />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
