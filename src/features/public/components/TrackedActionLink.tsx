"use client";

import type { MouseEvent, ReactNode } from "react";
import Link from "next/link";

import {
  trackPublicEvent,
  type PublicEventTypeValue,
} from "@/features/public/lib/tracking";

type TrackedActionLinkProps = {
  href: string;
  children: ReactNode;
  className: string;
  eventType: PublicEventTypeValue;
  restaurantId?: string | null;
  pagePath: string;
  value?: string;
  external?: boolean;
  target?: string;
  rel?: string;
};

export function TrackedActionLink({
  href,
  children,
  className,
  eventType,
  restaurantId = null,
  pagePath,
  value,
  external = false,
  target,
  rel,
}: TrackedActionLinkProps) {
  const handleClick = (_event: MouseEvent<HTMLElement>) => {
    trackPublicEvent({
      restaurantId,
      pagePath,
      eventType,
      ...(value !== undefined ? { value } : {}),
    });
  };

  if (external) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        onClick={handleClick}
        className={className}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} onClick={handleClick} className={className}>
      {children}
    </Link>
  );
}