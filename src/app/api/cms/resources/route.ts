import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/getSession";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import { RESOURCE_STATUSES, RESOURCE_TYPES, VISIBILITIES } from "@/lib/types";

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await request.json().catch(() => null);
  if (!data?.title || !data?.type) {
    return NextResponse.json({ error: "Title and type are required." }, { status: 400 });
  }
  if (!RESOURCE_TYPES.includes(data.type)) {
    return NextResponse.json({ error: "Invalid resource type." }, { status: 400 });
  }

  const baseSlug = slugify(data.title);
  let slug = baseSlug;
  let n = 1;
  while (await prisma.resource.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${++n}`;
  }

  const resource = await prisma.resource.create({
    data: {
      type: data.type,
      title: data.title,
      slug,
      author: data.author || "Joel Kimari",
      category: data.category || "Category",
      excerpt: data.excerpt || "",
      body: data.body || "",
      coverImageUrl: data.coverImageUrl || null,
      pdfUrl: data.pdfUrl || null,
      tags: data.tags || "",
      status: RESOURCE_STATUSES.includes(data.status) ? data.status : "DRAFT",
      visibility: VISIBILITIES.includes(data.visibility) ? data.visibility : "PUBLIC",
      issueNumber: data.issueNumber || null,
      accentColor: data.accentColor || null,
      publishAt: data.publishAt ? new Date(data.publishAt) : new Date(),
    },
  });

  return NextResponse.json({ ok: true, resource });
}
