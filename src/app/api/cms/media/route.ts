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

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const type = request.nextUrl.searchParams.get("type");
  const where =
    type === "image"
      ? { mimeType: { startsWith: "image/" } }
      : type === "pdf"
        ? { mimeType: "application/pdf" }
        : {};

  const media = await prisma.media.findMany({ where, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ media });
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    // File was already uploaded directly to Blob storage from the browser (bypasses the
    // serverless function's ~4.5MB request body limit) — just record the metadata.
    if (request.headers.get("content-type")?.includes("application/json")) {
      const body = await request.json();
      if (!body.url || !body.filename) {
        return NextResponse.json({ error: "Missing url or filename." }, { status: 400 });
      }
      const media = await prisma.media.create({
        data: {
          filename: body.filename,
          url: body.url,
          mimeType: body.mimeType || "application/octet-stream",
          sizeBytes: body.sizeBytes || 0,
        },
      });
      return NextResponse.json({ ok: true, media });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file provided." }, { status: 400 });

    const bytes = Buffer.from(await file.arrayBuffer());
    const { uniqueName } = buildUniqueName(file.name);

    let url: string;
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(uniqueName, bytes, {
        access: "public",
        contentType: file.type || "application/octet-stream",
      });
      url = blob.url;
    } else if (process.env.VERCEL) {
      // Deployed on Vercel with no Blob storage configured — the filesystem here is
      // read-only, so writing to public/uploads would fail. Fail clearly instead.
      return NextResponse.json(
        {
          error:
            "File uploads aren't configured yet: add Blob storage in your Vercel project (Storage tab → Create → Blob), then redeploy.",
        },
        { status: 500 }
      );
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
  } catch (err) {
    console.error("[media upload] failed:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload failed unexpectedly." },
      { status: 500 }
    );
  }
}
