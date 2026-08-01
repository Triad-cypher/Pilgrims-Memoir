"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

export interface PickedMedia {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
}

export function MediaPickerModal({
  open,
  onClose,
  onSelect,
  filter,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (media: PickedMedia) => void;
  filter: "image" | "pdf";
}) {
  const [items, setItems] = useState<PickedMedia[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setError(null);
    fetch(`/api/cms/media?type=${filter}`)
      .then((res) => res.json())
      .then((data) => setItems(data.media ?? []))
      .catch(() => setError("Couldn't load media library."))
      .finally(() => setLoading(false));
  }, [open, filter]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[80vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-black/5 px-6 py-4">
          <h3 className="font-bold text-ink">Choose from Media Library</h3>
          <button onClick={onClose} className="text-ink-soft hover:text-ink" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-6">
          {loading && <p className="text-sm text-ink-soft/60">Loading…</p>}
          {error && <p className="text-sm text-rose-600">{error}</p>}
          {!loading && !error && items.length === 0 && (
            <p className="text-sm text-ink-soft/60">
              No {filter === "image" ? "images" : "PDFs"} uploaded yet — upload one first.
            </p>
          )}

          {!loading && items.length > 0 && (
            <div className="grid grid-cols-3 gap-4 sm:grid-cols-4">
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelect(item);
                    onClose();
                  }}
                  className="group text-left"
                >
                  <div className="relative aspect-square overflow-hidden rounded-xl border-2 border-transparent bg-cream-dark group-hover:border-brand-400">
                    {item.mimeType.startsWith("image/") ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.url} alt={item.filename} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-ink-soft/50">PDF</div>
                    )}
                  </div>
                  <p className="mt-1.5 truncate text-xs text-ink-soft/70">{item.filename}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
