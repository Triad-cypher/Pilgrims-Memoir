import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const BOT_PATTERN = /bot|crawl|spider|slurp|preview|headless|lighthouse/i;

function header(request: NextRequest, ...names: string[]) {
  for (const name of names) {
    const value = request.headers.get(name);
    if (value) return value;
  }
  return null;
}

export async function POST(request: NextRequest) {
  if (BOT_PATTERN.test(request.headers.get("user-agent") ?? "")) {
    return new NextResponse(null, { status: 204 });
  }

  const body = await request.json().catch(() => null);
  const path = typeof body?.path === "string" ? body.path.slice(0, 300) : "/";
  if (path.startsWith("/cms")) {
    return new NextResponse(null, { status: 204 });
  }

  const country = header(request, "x-vercel-ip-country", "cf-ipcountry");
  const city = header(request, "x-vercel-ip-city");

  await prisma.siteVisit.create({
    data: {
      country: country && /^[A-Z]{2}$/i.test(country) ? country.toUpperCase() : null,
      city: city ? decodeURIComponent(city).slice(0, 120) : null,
      path,
    },
  });

  return new NextResponse(null, { status: 204 });
}
