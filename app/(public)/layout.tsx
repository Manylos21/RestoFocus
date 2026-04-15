import Link from "next/link";
import { CartProvider } from "@/shared/store/CartContext";
import { CartIcon } from "@/features/public/components/CartIcon";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CartProvider>
      <div className="min-h-full bg-gradient-to-b from-amber-50/40 via-orange-50/20 to-stone-50">
        <header className="border-b border-orange-100/80 bg-white/70 backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <Link
              href="/"
              className="text-lg font-bold tracking-tight text-stone-900 transition hover:text-orange-800"
            >
              RestoFocus
            </Link>
            <nav className="flex items-center gap-4 text-sm font-medium text-stone-600">
              <Link href="/" className="transition hover:text-orange-900">
                Découvrir
              </Link>
              <CartIcon />
              {/* Le lien Connexion (et bientôt l'icône du panier viendra se mettre ici !) */}
              <Link
                href="/login"
                className="rounded-full bg-stone-900 px-4 py-2 text-white shadow-sm transition hover:bg-stone-800"
              >
                Connexion
              </Link>
            </nav>
          </div>
        </header>
        {children}
        <footer className="border-t border-orange-100/60 bg-white/50 py-8 text-center text-xs text-stone-500">
          <p>
            Espace professionnel :{" "}
            <Link href="/espace-restaurant" className="font-medium text-orange-900 underline-offset-2 hover:underline">
              Admin restaurant
            </Link>
            {" · "}
            <Link href="/super-admin" className="font-medium text-orange-900 underline-offset-2 hover:underline">
              Super admin
            </Link>
          </p>
        </footer>
      </div>
    </CartProvider>
  );
}