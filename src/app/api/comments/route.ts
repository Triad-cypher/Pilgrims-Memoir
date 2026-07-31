import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const { resourceId, commenterName, commenterEmail, comment } = body ?? {};

  if (!resourceId || !commenterName || !commenterEmail || !comment) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }

  const resource = await prisma.resource.findUnique({ where: { id: resourceId } });
  if (!resource) {
    return NextResponse.json({ error: "Resource not found." }, { status: 404 });
  }

  const created = await prisma.comment.create({
    data: {
      resourceId,
      commenterName: String(commenterName).slice(0, 120),
      commenterEmail: String(commenterEmail).slice(0, 160),
      body: String(comment).slice(0, 2000),
      status: "PENDING",
    },
  });

  return NextResponse.json({ ok: true, id: created.id });
}
