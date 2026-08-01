import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/getSession";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const { name, avatarUrl } = body ?? {};

  const admin = await prisma.admin.update({
    where: { id: session.adminId },
    data: {
      ...(typeof name === "string" && name.trim() ? { name: name.trim() } : {}),
      ...(typeof avatarUrl === "string" ? { avatarUrl } : {}),
    },
  });

  return NextResponse.json({ ok: true, admin: { name: admin.name, avatarUrl: admin.avatarUrl } });
}
