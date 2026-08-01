"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { uploadMedia } from "@/lib/uploadMedia";
import { MediaPickerModal } from "./MediaPickerModal";

export function ProfileForm({ initialAvatarUrl }: { initialAvatarUrl: string | null }) {
  const router = useRouter();
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function saveAvatar(url: string) {
    setError(null);
    const res = await fetch("/api/cms/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ avatarUrl: url }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Couldn't save your profile picture.");
      return;
    }
    setAvatarUrl(url);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    router.refresh();
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const result = await uploadMedia(file);
      if (result.ok) {
        await saveAvatar(result.media.url);
      } else {
        setError(result.error);
      }
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div className="mb-6 rounded-3xl border border-black/5 bg-white p-6 sm:p-8">
      <h3 className="font-bold text-ink">Profile Picture</h3>
      <p className="mt-1 text-sm text-ink-soft/60">This photo appears in the CMS sidebar and on comment moderation.</p>

      <div className="mt-5 flex flex-wrap items-center gap-5">
        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full bg-cream-dark">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} alt="Your profile" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-ink-soft/40">?</div>
          )}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="rounded-full border border-black/10 px-4 py-2 text-sm font-semibold text-ink hover:bg-cream disabled:opacity-60"
          >
            {uploading ? "Uploading…" : "Upload New Photo"}
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleFileChange} />
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="rounded-full border border-black/10 px-4 py-2 text-sm font-semibold text-ink hover:bg-cream"
          >
            Choose from Media Library
          </button>
        </div>

        {saved && <span className="text-sm font-medium text-brand-600">Saved ✓</span>}
      </div>

      {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}

      <MediaPickerModal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        filter="image"
        onSelect={(media) => saveAvatar(media.url)}
      />
    </div>
  );
}
