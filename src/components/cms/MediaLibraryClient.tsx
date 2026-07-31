"use client";

import { useRef, useState } from "react";

export interface MediaItem {
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

function formatBytes(bytes: number) {
  if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(1)} MB`;
  if (bytes >= 1_000) return `${(bytes / 1_000).toFixed(0)} KB`;
  return `${bytes} B`;
}

export function MediaLibraryClient({ initialMedia }: { initialMedia: MediaItem[] }) {
  const [media, setMedia] = useState(initialMedia);
  const [selectedId, setSelectedId] = useState<string | null>(initialMedia[0]?.id ?? null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selected = media.find((m) => m.id === selectedId) ?? null;

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/cms/media", { method: "POST", body: formData });
    setUploading(false);
    e.target.value = "";
    if (res.ok) {
      const data = await res.json();
      setMedia((m) => [data.media, ...m]);
      setSelectedId(data.media.id);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this media asset?")) return;
    const res = await fetch(`/api/cms/media/${id}`, { method: "DELETE" });
    if (res.ok) {
      setMedia((m) => m.filter((item) => item.id !== id));
      if (selectedId === id) setSelectedId(null);
    }
  }

  return (
    <div className="grid gap-6 p-8 lg:grid-cols-[1fr_320px]">
      <div>
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <select className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-ink-soft">
            <option>All Types</option>
            <option>Images</option>
            <option>Documents</option>
          </select>
          <select className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-ink-soft">
            <option>Date Uploaded</option>
          </select>
          <div className="flex-1" />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-60"
          >
            {uploading ? "Uploading…" : "+ Upload New File"}
          </button>
          <input ref={fileInputRef} type="file" accept="image/*,application/pdf" hidden onChange={handleUpload} />
        </div>

        {media.length === 0 ? (
          <p className="text-sm text-ink-soft/60">No media uploaded yet.</p>
        ) : (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {media.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedId(m.id)}
                className={`text-left ${selectedId === m.id ? "" : ""}`}
              >
                <div
                  className={`relative aspect-square overflow-hidden rounded-xl border-2 bg-cream-dark ${
                    selectedId === m.id ? "border-brand-500" : "border-transparent"
                  }`}
                >
                  {m.mimeType.startsWith("image/") ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.url} alt={m.filename} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-ink-soft/50">PDF</div>
                  )}
                </div>
                <p className="mt-2 truncate text-sm font-medium text-ink">{m.filename}</p>
                <p className="text-xs text-ink-soft/50">
                  {m.width && m.height ? `${m.width} × ${m.height} • ` : ""}
                  {formatBytes(m.sizeBytes)}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="h-fit rounded-2xl border border-black/5 bg-white p-5">
        <h3 className="font-bold text-ink">Asset Metadata</h3>
        {!selected ? (
          <p className="mt-4 text-sm text-ink-soft/60">Select a file to see details.</p>
        ) : (
          <div className="mt-4">
            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-cream-dark">
              {selected.mimeType.startsWith("image/") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={selected.url} alt={selected.filename} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-ink-soft/50">PDF Document</div>
              )}
            </div>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-soft/60">File Name</dt>
                <dd className="font-medium text-ink">{selected.filename}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-soft/60">File Type</dt>
                <dd className="font-medium text-ink">{selected.mimeType}</dd>
              </div>
              {selected.width && selected.height && (
                <div className="flex justify-between">
                  <dt className="text-ink-soft/60">Dimensions</dt>
                  <dd className="font-medium text-ink">
                    {selected.width} × {selected.height} px
                  </dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-ink-soft/60">Date Added</dt>
                <dd className="font-medium text-ink">
                  {new Date(selected.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  })}
                </dd>
              </div>
            </dl>
            {selected.usedIn && (
              <div className="mt-4 border-t border-black/5 pt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft/50">Used In</p>
                <p className="mt-2 flex items-center gap-1.5 text-sm text-ink">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                  {selected.usedIn}
                </p>
              </div>
            )}
            <button
              onClick={() => handleDelete(selected.id)}
              className="mt-5 w-full rounded-full border border-rose-200 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50"
            >
              Delete Asset
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
