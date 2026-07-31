import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/getSession";
import { prisma } from "@/lib/prisma";
import { COMMENT_STATUSES } from "@/lib/types";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const data = await request.json().catch(() => null);
  if (!data) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const update: { status?: string; reply?: string } = {};
  if (data.status && COMMENT_STATUSES.includes(data.status)) update.status = data.status;
  if (typeof data.reply === "string") update.reply = data.reply;

  const comment = await prisma.comment.update({ where: { id }, data: update });
  return NextResponse.json({ ok: true, comment });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.comment.delete({ where: { id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
