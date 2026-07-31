import { NextRequest, NextResponse } from "next/server";
import { unlink } from "node:fs/promises";
import path from "node:path";
import { del } from "@vercel/blob";
import { getSession } from "@/lib/getSession";
import { prisma } from "@/lib/prisma";

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (media.url.startsWith("/uploads/")) {
    const filePath = path.join(process.cwd(), "public", media.url);
    await unlink(filePath).catch(() => {});
  } else if (process.env.BLOB_READ_WRITE_TOKEN) {
    await del(media.url).catch(() => {});
  }

  await prisma.media.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
