import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/getSession";
import { updateSettings } from "@/lib/settings";

export async function PATCH(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await request.json().catch(() => null);
  if (!data || typeof data !== "object") {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  await updateSettings(data);
  return NextResponse.json({ ok: true });
}
