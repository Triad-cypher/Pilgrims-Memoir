import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { put } from "@vercel/blob";
import { getSession } from "@/lib/getSession";
import { prisma } from "@/lib/prisma";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

function buildUniqueName(originalName: string): { uniqueName: string; ext: string } {
  const ext = path.extname(originalName) || "";
  const safeBase = path
    .basename(originalName, ext)
    .replace(/[^a-zA-Z0-9-_]+/g, "-")
    .slice(0, 60);
  return { uniqueName: `${Date.now()}-${safeBase}${ext}`, ext };
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file provided." }, { status: 400 });

  const bytes = Buffer.from(await file.arrayBuffer());
  const { uniqueName } = buildUniqueName(file.name);

  let url: string;
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    // Production (and any environment with Blob configured): persistent, CDN-backed storage.
    const blob = await put(uniqueName, bytes, {
      access: "public",
      contentType: file.type || "application/octet-stream",
    });
    url = blob.url;
  } else {
    // Local dev fallback only — the local filesystem does not persist on Vercel.
    await mkdir(UPLOAD_DIR, { recursive: true });
    await writeFile(path.join(UPLOAD_DIR, uniqueName), bytes);
    url = `/uploads/${uniqueName}`;
  }

  const media = await prisma.media.create({
    data: {
      filename: file.name,
      url,
      mimeType: file.type || "application/octet-stream",
      sizeBytes: bytes.byteLength,
    },
  });

  return NextResponse.json({ ok: true, media });
}
