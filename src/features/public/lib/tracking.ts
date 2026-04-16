type TrafficSourceValue =
  | "DIRECT"
  | "ORGANIC_SEARCH"
  | "SOCIAL"
  | "EMAIL"
  | "REFERRAL"
  | "ADS"
  | "UNKNOWN";

export type PublicEventTypeValue =
  | "CTA_RESERVATION"
  | "CTA_DIRECTIONS"
  | "CTA_CONTACT"
  | "FAQ_VIEW"
  | "MENU_VIEW"
  | "CONTACT_SUBMIT";

const SESSION_STORAGE_KEY = "rf_session_key";

function getSessionKey(): string {
  const existing = window.localStorage.getItem(SESSION_STORAGE_KEY);

  if (existing) {
    return existing;
  }

  const newKey = crypto.randomUUID();
  window.localStorage.setItem(SESSION_STORAGE_KEY, newKey);
  return newKey;
}

function detectSource(): TrafficSourceValue {
  const params = new URLSearchParams(window.location.search);
  const utmMedium = params.get("utm_medium")?.toLowerCase();

  if (utmMedium) {
    if (["cpc", "ppc", "paid", "ads", "display"].includes(utmMedium)) {
      return "ADS";
    }

    if (["social", "social-paid", "social-organic"].includes(utmMedium)) {
      return "SOCIAL";
    }

    if (["email", "newsletter"].includes(utmMedium)) {
      return "EMAIL";
    }

    return "REFERRAL";
  }

  const referrer = document.referrer.toLowerCase();

  if (!referrer) {
    return "DIRECT";
  }

  if (
    referrer.includes("google.") ||
    referrer.includes("bing.") ||
    referrer.includes("yahoo.") ||
    referrer.includes("duckduckgo.")
  ) {
    return "ORGANIC_SEARCH";
  }

  if (
    referrer.includes("facebook.") ||
    referrer.includes("instagram.") ||
    referrer.includes("linkedin.") ||
    referrer.includes("t.co") ||
    referrer.includes("twitter.")
  ) {
    return "SOCIAL";
  }

  return "REFERRAL";
}

async function sendTrackingPayload(payload: Record<string, unknown>) {
  const fullPayload = {
    ...payload,
    sessionKey: getSessionKey(),
  };

  try {
    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      const blob = new Blob([JSON.stringify(fullPayload)], {
        type: "application/json",
      });

      const accepted = navigator.sendBeacon("/api/track", blob);

      if (accepted) {
        console.log("TRACK BEACON SENT", fullPayload);
        return;
      }
    }

    const response = await fetch("/api/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
      keepalive: true,
      body: JSON.stringify(fullPayload),
    });

    const text = await response.text();
    console.log("TRACK RESPONSE", response.status, text, fullPayload);
  } catch (error) {
    console.error("TRACK ERROR", error, fullPayload);
  }
}

export function trackPublicPageView({
  restaurantId,
  pagePath,
  pageType,
}: {
  restaurantId?: string | null;
  pagePath: string;
  pageType: string;
}) {
  return sendTrackingPayload({
    kind: "page_view",
    restaurantId: restaurantId ?? null,
    pagePath,
    pageType,
    source: detectSource(),
    referrer: document.referrer || null,
  });
}

export function trackPublicEvent({
  restaurantId,
  pagePath,
  eventType,
  value,
}: {
  restaurantId?: string | null;
  pagePath: string;
  eventType: PublicEventTypeValue;
  value?: string;
}) {
  return sendTrackingPayload({
    kind: "event",
    restaurantId: restaurantId ?? null,
    pagePath,
    eventType,
    ...(value !== undefined ? { value } : {}),
  });
}