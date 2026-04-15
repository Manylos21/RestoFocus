"use client";

import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { type FormEvent, useState } from "react";

function safeCallbackUrl(raw: string | null): string {
  if (!raw || raw.length === 0) {
    return "/";
  }
  if (!raw.startsWith("/") || raw.startsWith("//")) {
    return "/";
  }
  return raw;
}

export function LoginForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsPending(true);

    const callbackUrl = safeCallbackUrl(searchParams.get("callbackUrl"));

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        setError("Identifiants incorrects. Vérifiez votre email et votre mot de passe.");
        setIsPending(false);
        return;
      }

      let destination = callbackUrl;
      if (typeof result?.url === "string" && result.url.length > 0) {
        try {
          const parsed = new URL(result.url, window.location.origin);
          destination = `${parsed.pathname}${parsed.search}`;
        } catch {
          destination = callbackUrl;
        }
      }

      setIsPending(false);
      /** Navigation complète : garantit la prise en compte du cookie de session (évite de rester sur /login). */
      window.location.assign(destination);
    } catch {
      setError("Une erreur est survenue. Réessayez dans un instant.");
      setIsPending(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-col gap-5"
      noValidate
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium text-zinc-700">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          className="rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-zinc-900 shadow-sm outline-none ring-zinc-900/10 transition placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-900/15"
          placeholder="vous@exemple.com"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium text-zinc-700">
          Mot de passe
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          className="rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-zinc-900 shadow-sm outline-none ring-zinc-900/10 transition placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-900/15"
          placeholder="••••••••"
        />
      </div>

      {error ? (
        <p
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
        >
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="mt-1 inline-flex h-11 w-full items-center justify-center rounded-lg bg-zinc-900 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Connexion…" : "Se connecter"}
      </button>
    </form>
  );
}
