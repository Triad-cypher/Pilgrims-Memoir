"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RESOURCE_TYPES, RESOURCE_TYPE_LABEL, VISIBILITIES, type ResourceStatus, type ResourceType, type Visibility } from "@/lib/types";
import { RichTextEditor } from "./RichTextEditor";

export interface ResourceFormValues {
  id?: string;
  type: ResourceType;
  title: string;
  author: string;
  category: string;
  tags: string;
  coverImageUrl: string;
  pdfUrl: string;
  body: string;
  excerpt: string;
  publishAt: string;
  visibility: Visibility;
  status: ResourceStatus;
  slug?: string;
}

const emptyValues = (type: ResourceType): ResourceFormValues => ({
  type,
  title: "",
  author: "Joel Kimari",
  category: "Category",
  tags: "",
  coverImageUrl: "",
  pdfUrl: "",
  body: "",
  excerpt: "",
  publishAt: "",
  visibility: "PUBLIC",
  status: "DRAFT",
});

export function ResourceForm({ initial, defaultType }: { initial?: ResourceFormValues; defaultType?: ResourceType }) {
  const router = useRouter();
  const [values, setValues] = useState<ResourceFormValues>(initial ?? emptyValues(defaultType ?? "BOOK"));
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState<"draft" | "publish" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  const tags = values.tags ? values.tags.split(",").map((t) => t.trim()).filter(Boolean) : [];

  function set<K extends keyof ResourceFormValues>(key: K, value: ResourceFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function addTag() {
    const t = tagInput.trim();
    if (!t) return;
    set("tags", [...tags, t].join(","));
    setTagInput("");
  }

  function removeTag(tag: string) {
    set("tags", tags.filter((t) => t !== tag).join(","));
  }

  async function uploadFile(file: File): Promise<string | null> {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/cms/media", { method: "POST", body: formData });
    if (!res.ok) return null;
    const data = await res.json();
    return data.media.url as string;
  }

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    const url = await uploadFile(file);
    setUploadingCover(false);
    if (url) set("coverImageUrl", url);
  }

  async function handlePdfUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPdf(true);
    const url = await uploadFile(file);
    setUploadingPdf(false);
    if (url) set("pdfUrl", url);
  }

  async function handleSave(status: ResourceStatus) {
    setSaving(status === "DRAFT" ? "draft" : "publish");
    setError(null);

    const payload = { ...values, status };
    const res = initial?.id
      ? await fetch(`/api/cms/resources/${initial.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      : await fetch("/api/cms/resources", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

    setSaving(null);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Something went wrong.");
      return;
    }
    router.push("/cms/resources");
    router.refresh();
  }

  const typePath = { BOOK: "books", ARTICLE: "articles", DEVOTIONAL: "devotionals" }[values.type];

  return (
    <div className="rounded-3xl border border-black/5 bg-white p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black/5 pb-6">
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-sm font-semibold text-ink">
            Resource Type:
            <select
              value={values.type}
              onChange={(e) => set("type", e.target.value as ResourceType)}
              className="bg-transparent font-bold outline-none"
            >
              {RESOURCE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {RESOURCE_TYPE_LABEL[t]}
                </option>
              ))}
            </select>
          </label>
          <span className="rounded-full bg-cream-dark px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-ink-soft">
            {values.status}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {initial?.slug && (
            <Link
              href={`/${typePath}/${initial.slug}`}
              target="_blank"
              className="rounded-full border border-black/10 px-4 py-2 text-sm font-semibold text-ink-soft hover:bg-cream"
            >
              Preview
            </Link>
          )}
          <button
            onClick={() => handleSave("DRAFT")}
            disabled={saving !== null}
            className="rounded-full border border-black/10 px-4 py-2 text-sm font-semibold text-ink hover:bg-cream disabled:opacity-60"
          >
            {saving === "draft" ? "Saving…" : "Save Draft"}
          </button>
          <button
            onClick={() => handleSave("PUBLISHED")}
            disabled={saving !== null}
            className="rounded-full bg-brand-500 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-60"
          >
            {saving === "publish" ? "Publishing…" : "Publish Resource"}
          </button>
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-rose-600">{error}</p>}

      <div className="mt-6 space-y-6">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-ink-soft/60">Title</label>
          <input
            required
            value={values.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="The Pathway to Grace"
            className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-lg outline-none focus:border-brand-500"
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-ink-soft/60">Author / Pastor</label>
            <input
              value={values.author}
              onChange={(e) => set("author", e.target.value)}
              className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-brand-500"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-ink-soft/60">Categories / Tags</label>
            <div className="mt-2 flex flex-wrap items-center gap-2 rounded-xl border border-black/10 bg-white px-3 py-2.5">
              {tags.map((tag) => (
                <span key={tag} className="flex items-center gap-1 rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
                  {tag}
                  <button onClick={() => removeTag(tag)} className="text-brand-700/60 hover:text-brand-700">
                    ×
                  </button>
                </span>
              ))}
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault();
                    addTag();
                  }
                }}
                placeholder="+ Add Tag"
                className="flex-1 min-w-[80px] bg-transparent text-sm outline-none placeholder:text-ink-soft/40"
              />
            </div>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-ink-soft/60">Cover Image</label>
            <button
              type="button"
              onClick={() => coverInputRef.current?.click()}
              className="mt-2 flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-black/15 bg-cream px-4 py-8 text-center hover:border-brand-400"
            >
              {values.coverImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={values.coverImageUrl} alt="Cover" className="h-24 rounded-lg object-cover" />
              ) : (
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.6" className="text-brand-500">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="9" cy="9" r="2" />
                  <path d="m21 15-5-5-11 11" />
                </svg>
              )}
              <span className="text-sm font-medium text-ink">
                {uploadingCover ? "Uploading…" : "Drag & drop file here or browse"}
              </span>
              <span className="text-xs text-ink-soft/50">PNG, JPG, JPEG up to 5MB</span>
            </button>
            <input ref={coverInputRef} type="file" accept="image/*" hidden onChange={handleCoverUpload} />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-ink-soft/60">Downloadable PDF</label>
            <button
              type="button"
              onClick={() => pdfInputRef.current?.click()}
              className="mt-2 flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-black/15 bg-cream px-4 py-8 text-center hover:border-brand-400"
            >
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.6" className="text-brand-500">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
                <path d="M14 2v6h6" />
              </svg>
              <span className="text-sm font-medium text-ink">
                {uploadingPdf ? "Uploading…" : values.pdfUrl ? "Replace PDF file" : "Drag & drop file here or browse"}
              </span>
              <span className="text-xs text-ink-soft/50">{values.pdfUrl ? values.pdfUrl.split("/").pop() : "PDF up to 5MB"}</span>
            </button>
            <input ref={pdfInputRef} type="file" accept="application/pdf" hidden onChange={handlePdfUpload} />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-ink-soft/60">Body Content</label>
          <div className="mt-2">
            <RichTextEditor value={values.body} onChange={(html) => set("body", html)} />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-ink-soft/60">Brief Summary / Excerpt</label>
          <textarea
            value={values.excerpt}
            onChange={(e) => set("excerpt", e.target.value)}
            rows={2}
            placeholder="A short introduction to the themes explored in this piece."
            className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-brand-500"
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-ink-soft/60">Schedule Publishing Date</label>
            <input
              type="datetime-local"
              value={values.publishAt}
              onChange={(e) => set("publishAt", e.target.value)}
              className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-brand-500"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-ink-soft/60">Visibility</label>
            <select
              value={values.visibility}
              onChange={(e) => set("visibility", e.target.value as Visibility)}
              className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-brand-500"
            >
              {VISIBILITIES.map((v) => (
                <option key={v} value={v}>
                  {v === "PUBLIC" ? "Public (Anyone can view)" : "Private (Admin only)"}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
