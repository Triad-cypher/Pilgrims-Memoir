import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/cms/login") {
    return NextResponse.next();
  }

  if (pathname.startsWith("/cms")) {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const session = await verifySessionToken(token);
    if (!session) {
      const loginUrl = new URL("/cms/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/cms/:path*"],
};
