import { NextResponse } from "next/server";
import { getSession } from "@/lib/getSession";
import { renewSessionToken, SESSION_COOKIE, SESSION_COOKIE_OPTIONS } from "@/lib/auth";

// Keep-alive for an admin who is active in the dashboard without navigating (e.g. writing a long post).
export async function POST() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Session expired" }, { status: 401 });

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, await renewSessionToken(session), SESSION_COOKIE_OPTIONS);
  return response;
}
