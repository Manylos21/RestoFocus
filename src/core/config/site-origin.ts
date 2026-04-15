/** URL canonique du site (SEO, JSON-LD). Sans slash final. */
export function getSiteOrigin(): string {
  const raw =
    process.env["NEXT_PUBLIC_APP_URL"] ??
    process.env["AUTH_URL"] ??
    "http://localhost:3000";
  return raw.replace(/\/$/, "");
}
