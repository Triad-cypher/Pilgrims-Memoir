import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const resource = await prisma.resource.findUnique({ where: { id } });
  if (!resource || !resource.pdfUrl) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.resource.update({ where: { id }, data: { downloads: { increment: 1 } } });

  return NextResponse.redirect(resource.pdfUrl);
}
