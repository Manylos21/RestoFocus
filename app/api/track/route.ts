import { NextRequest, NextResponse } from "next/server";
import type { PublicEventType, TrafficSource } from "@prisma/client";

import { prisma } from "@/shared/lib/prisma";

const VALID_SOURCES: TrafficSource[] = [
  "DIRECT",
  "ORGANIC_SEARCH",
  "SOCIAL",
  "EMAIL",
  "REFERRAL",
  "ADS",
  "UNKNOWN",
];

const VALID_EVENT_TYPES: PublicEventType[] = [
  "CTA_RESERVATION",
  "CTA_DIRECTIONS",
  "CTA_CONTACT",
  "FAQ_VIEW",
  "MENU_VIEW",
  "CONTACT_SUBMIT",
];

function getString(payload: Record<string, unknown>, key: string): string {
  const value = payload[key];
  return typeof value === "string" ? value : "";
}

function parseTrafficSource(value: string): TrafficSource {
  return VALID_SOURCES.includes(value as TrafficSource)
    ? (value as TrafficSource)
    : "UNKNOWN";
}

function parseEventType(value: string): PublicEventType | null {
  return VALID_EVENT_TYPES.includes(value as PublicEventType)
    ? (value as PublicEventType)
    : null;
}

export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  const payload = body as Record<string, unknown>;

  const kind = getString(payload, "kind");
  const sessionKey = getString(payload, "sessionKey");
  const pagePath = getString(payload, "pagePath");
  const pageType = getString(payload, "pageType") || "unknown";

  const rawRestaurantId = getString(payload, "restaurantId");
  const restaurantId = rawRestaurantId.length > 0 ? rawRestaurantId : null;

  const source = parseTrafficSource(getString(payload, "source"));

  const rawReferrer = getString(payload, "referrer");
  const referrer = rawReferrer.length > 0 ? rawReferrer : null;

  const eventType = parseEventType(getString(payload, "eventType"));

  const rawValue = getString(payload, "value");
  const value = rawValue.length > 0 ? rawValue : null;

  if (!sessionKey || !pagePath) {
    return NextResponse.json(
      { ok: false, error: "missing_required_fields" },
      { status: 400 },
    );
  }

  if (kind === "page_view") {
    await prisma.publicVisit.create({
      data: {
        restaurantId,
        sessionKey,
        pagePath,
        pageType,
        source,
        referrer,
        userAgent: request.headers.get("user-agent"),
      },
    });

    return NextResponse.json({ ok: true });
  }

  if (kind === "event") {
    if (!eventType) {
      return NextResponse.json(
        { ok: false, error: "invalid_event_type" },
        { status: 400 },
      );
    }

    const recentVisit = await prisma.publicVisit.findFirst({
      where: {
        sessionKey,
        ...(restaurantId ? { restaurantId } : {}),
        createdAt: {
          gte: new Date(Date.now() - 1000 * 60 * 60 * 24),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
      },
    });

    await prisma.publicEvent.create({
      data: {
        visitId: recentVisit?.id ?? null,
        restaurantId,
        sessionKey,
        pagePath,
        type: eventType,
        value,
      },
    });

    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: false, error: "invalid_kind" }, { status: 400 });
}