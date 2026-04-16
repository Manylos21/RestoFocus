import Link from "next/link";
import { CartIcon } from "@/features/public/components/CartIcon";
import { CartProvider } from "@/shared/store/CartContext";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CartProvider>
      <div className="min-h-screen bg-neutral-50 text-neutral-900">
        <header className="border-b border-neutral-200 bg-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <Link href="/" className="text-xl font-bold tracking-tight text-neutral-900">
              RestoFocus
            </Link>

            <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
              <Link href="/" className="transition hover:text-orange-600">
                Accueil
              </Link>
              <Link href="/faq" className="transition hover:text-orange-600">
                FAQ
              </Link>
              <Link href="/contact" className="transition hover:text-orange-600">
                Contact
              </Link>
              <Link
                href="/reservation/le-bistro-parisien"
                className="transition hover:text-orange-600"
              >
                Réserver
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <CartIcon />
              <Link
                href="/login"
                className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium transition hover:border-orange-500 hover:text-orange-600"
              >
                Connexion
              </Link>
            </div>
          </div>
        </header>

        <main>{children}</main>

        <footer className="mt-16 border-t border-neutral-200 bg-white">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-neutral-600 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-semibold text-neutral-900">RestoFocus</p>
              <p>Plateforme web multi-restaurants orientée visibilité, conversion et pilotage.</p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link href="/faq" className="hover:text-orange-600">
                FAQ
              </Link>
              <Link href="/contact" className="hover:text-orange-600">
                Contact
              </Link>
              <Link href="/reservation/le-bistro-parisien" className="hover:text-orange-600">
                Réservation
              </Link>
              <Link href="/confidentialite" className="hover:text-orange-600">
                Confidentialité
              </Link>
              <Link href="/mentions-legales" className="hover:text-orange-600">
                Mentions légales
              </Link>
            </div>

            <div className="text-right">
              <p className="font-medium text-neutral-900">Espace professionnel</p>
              <div className="flex flex-col gap-1 md:items-end">
                <Link href="/espace-restaurant" className="hover:text-orange-600">
                  Admin restaurant
                </Link>
                <Link href="/super-admin" className="hover:text-orange-600">
                  Super admin
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </CartProvider>
  );
}