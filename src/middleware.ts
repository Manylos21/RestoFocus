import { NextResponse } from "next/server";

import { auth } from "@/core/auth/auth";

const LOGIN_PATH = "/login";

function redirectToLogin(request: Request, callbackPath: string): NextResponse {
  const loginUrl = new URL(LOGIN_PATH, request.url);
  loginUrl.searchParams.set("callbackUrl", callbackPath);
  return NextResponse.redirect(loginUrl);
}

export default auth((request) => {
  const pathname = request.nextUrl.pathname;
  const session = request.auth;
  const role = session?.user?.role;

  if (pathname.startsWith("/espace-restaurant")) {
    if (!session?.user) {
      return redirectToLogin(request, pathname);
    }
    if (role !== "RESTAURANT_ADMIN" && role !== "SUPER_ADMIN") {
      return redirectToLogin(request, pathname);
    }
  }

  if (pathname.startsWith("/super-admin")) {
    if (!session?.user) {
      return redirectToLogin(request, pathname);
    }
    if (role !== "SUPER_ADMIN") {
      return redirectToLogin(request, pathname);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/espace-restaurant/:path*", "/super-admin/:path*"],
};
