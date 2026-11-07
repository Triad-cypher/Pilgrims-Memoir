import { NextRequest, NextResponse } from "next/server";
import { renewSessionToken, SESSION_COOKIE, SESSION_COOKIE_OPTIONS, verifySessionToken } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/cms/login") {
    return NextResponse.next();
  }

  const session = await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value);

  if (!session) {
    if (pathname.startsWith("/api/")) {
      // CMS API routes return their own 401; nothing to refresh.
      return NextResponse.next();
    }
    const loginUrl = new URL("/cms/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Activity: slide the idle window forward.
  const response = NextResponse.next();
  response.cookies.set(SESSION_COOKIE, await renewSessionToken(session), SESSION_COOKIE_OPTIONS);
  return response;
}

export const config = {
  matcher: ["/cms/:path*", "/api/cms/:path*"],
};
