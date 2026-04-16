import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { AuthSessionProvider } from "@/app-providers/session-provider";
import { getSiteOrigin } from "@/core/config/site-origin";
import { CartProvider } from "@/shared/store/CartContext"; // <--- AJOUT ICI

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteOrigin()),
  title: "RestoFocus",
  description:
    "Plateforme multi-restaurants avec Site Public, Espace Admin Restaurant et Super Admin.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* On enveloppe tout avec le Auth ET le CartProvider */}
        <AuthSessionProvider>
          <CartProvider> {/* <--- AJOUT ICI */}
            {children}
          </CartProvider> {/* <--- AJOUT ICI */}
        </AuthSessionProvider>
      </body>
    </html>
  );
}