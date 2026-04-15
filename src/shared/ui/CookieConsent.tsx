"use client";

import { useState } from "react";

const COOKIE_NAME = "rf_cookie_preferences";
const CONSENT_VERSION = "v1";

type ConsentChoice = "necessary_only" | "allow_analytics";

function persistConsent(choice: ConsentChoice): void {
  const payload = `${CONSENT_VERSION}:${choice}`;
  const oneYearInSeconds = 60 * 60 * 24 * 365;
  document.cookie = `${COOKIE_NAME}=${payload}; path=/; max-age=${oneYearInSeconds}; SameSite=Lax; Secure`;
}

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof document === "undefined") {
      return false;
    }
    const hasConsent = document.cookie
      .split(";")
      .some((cookie) => cookie.trim().startsWith(`${COOKIE_NAME}=`));
    return !hasConsent;
  });

  if (!isVisible) {
    return null;
  }

  return (
    <aside className="fixed bottom-4 left-4 right-4 z-50 rounded-lg border border-zinc-200 bg-white p-4 shadow-lg md:left-auto md:max-w-md">
      <p className="text-sm font-semibold text-zinc-900">Gestion des cookies</p>
      <p className="mt-2 text-sm text-zinc-600">
        Nous utilisons des cookies strictement necessaires pour le fonctionnement
        du service. Vous pouvez aussi autoriser les cookies analytiques.
      </p>
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={() => {
            persistConsent("necessary_only");
            setIsVisible(false);
          }}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-900"
        >
          Strictement necessaires
        </button>
        <button
          type="button"
          onClick={() => {
            persistConsent("allow_analytics");
            setIsVisible(false);
          }}
          className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white"
        >
          Autoriser analytiques
        </button>
      </div>
    </aside>
  );
}
