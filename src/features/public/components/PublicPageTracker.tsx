"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

import { trackPublicPageView } from "@/features/public/lib/tracking";

type PublicPageTrackerProps = {
  restaurantId?: string | null;
  pageType: string;
};

export function PublicPageTracker({
  restaurantId = null,
  pageType,
}: PublicPageTrackerProps) {
  const pathname = usePathname();
  const sentRef = useRef(false);

  useEffect(() => {
    if (sentRef.current) {
      return;
    }

    sentRef.current = true;

    trackPublicPageView({
      restaurantId,
      pagePath: pathname,
      pageType,
    });
  }, [pathname, pageType, restaurantId]);

  return null;
}