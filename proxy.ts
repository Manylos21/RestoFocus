import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { auth } from "@/core/auth/auth";

const LOGIN_PATH = "/login";
const FORBIDDEN_PATH = "/non-autorise";

function buildCallbackUrl(request: NextRequest): string {
  const { pathname, search } = request.nextUrl;
  return `${pathname}${search}`;
}

function redirectToLogin(request: NextRequest): NextResponse {
  const loginUrl = new URL(LOGIN_PATH, request.url);
  loginUrl.searchParams.set("callbackUrl", buildCallbackUrl(request));
  return NextResponse.redirect(loginUrl);
}

function redirectToForbidden(request: NextRequest): NextResponse {
  const forbiddenUrl = new URL(FORBIDDEN_PATH, request.url);
  forbiddenUrl.searchParams.set("from", request.nextUrl.pathname);
  return NextResponse.redirect(forbiddenUrl);
}

const protectedProxy = auth((request) => {
  const pathname = request.nextUrl.pathname;
  const session = request.auth;
  const role = session?.user?.role;

  if (pathname.startsWith("/espace-restaurant")) {
    if (!session?.user) {
      return redirectToLogin(request);
    }

    if (role !== "RESTAURANT_ADMIN") {
      return redirectToForbidden(request);
    }
  }

  if (pathname.startsWith("/super-admin")) {
    if (!session?.user) {
      return redirectToLogin(request);
    }

    if (role !== "SUPER_ADMIN") {
      return redirectToForbidden(request);
    }
  }

  return NextResponse.next();
});

export default protectedProxy;

export const config = {
  matcher: ["/espace-restaurant/:path*", "/super-admin/:path*"],
};