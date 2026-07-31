import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/getSession";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import { RESOURCE_STATUSES, VISIBILITIES } from "@/lib/types";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const existing = await prisma.resource.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const data = await request.json().catch(() => null);
  if (!data) return NextResponse.json({ error: "Invalid payload." }, { status: 400 });

  let slug = existing.slug;
  if (data.title && data.title !== existing.title) {
    const baseSlug = slugify(data.title);
    slug = baseSlug;
    let n = 1;
    while (await prisma.resource.findFirst({ where: { slug, NOT: { id } } })) {
      slug = `${baseSlug}-${++n}`;
    }
  }

  const resource = await prisma.resource.update({
    where: { id },
    data: {
      title: data.title ?? existing.title,
      slug,
      author: data.author ?? existing.author,
      category: data.category ?? existing.category,
      excerpt: data.excerpt ?? existing.excerpt,
      body: data.body ?? existing.body,
      coverImageUrl: data.coverImageUrl ?? existing.coverImageUrl,
      pdfUrl: data.pdfUrl ?? existing.pdfUrl,
      tags: data.tags ?? existing.tags,
      status: RESOURCE_STATUSES.includes(data.status) ? data.status : existing.status,
      visibility: VISIBILITIES.includes(data.visibility) ? data.visibility : existing.visibility,
      issueNumber: data.issueNumber ?? existing.issueNumber,
      accentColor: data.accentColor ?? existing.accentColor,
      featured: typeof data.featured === "boolean" ? data.featured : existing.featured,
      publishAt: data.publishAt ? new Date(data.publishAt) : existing.publishAt,
    },
  });

  return NextResponse.json({ ok: true, resource });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.resource.delete({ where: { id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
