"use client";

import { upload } from "@vercel/blob/client";

export interface UploadedMedia {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
  width: number | null;
  height: number | null;
  sizeBytes: number;
  usedIn: string | null;
  createdAt: string;
}

export type UploadResult = { ok: true; media: UploadedMedia } | { ok: false; error: string };

let cachedUseBlob: boolean | null = null;

async function shouldUseBlob(): Promise<boolean> {
  if (cachedUseBlob !== null) return cachedUseBlob;
  try {
    const res = await fetch("/api/cms/media/config");
    const data = await res.json();
    cachedUseBlob = Boolean(data.useBlob);
  } catch {
    cachedUseBlob = false;
  }
  return cachedUseBlob;
}

/** Uploads a file for the CMS media library, always resolving (never throwing) so callers
 * can safely reset loading state in a `finally` block without risk of it hanging forever. */
export async function uploadMedia(file: File): Promise<UploadResult> {
  try {
    const useBlob = await shouldUseBlob();

    if (useBlob) {
      const blob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/cms/media/upload-url",
        contentType: file.type || "application/octet-stream",
      });

      const res = await fetch("/api/cms/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          url: blob.url,
          mimeType: file.type || "application/octet-stream",
          sizeBytes: file.size,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) return { ok: false, error: data.error ?? "Upload failed while saving metadata." };
      return { ok: true, media: data.media };
    }

    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/cms/media", { method: "POST", body: formData });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: data.error ?? "Upload failed." };
    return { ok: true, media: data.media };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Upload failed unexpectedly." };
  }
}
