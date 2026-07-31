"use client";

import { useRef, useState } from "react";
import type { SettingsMap } from "@/lib/settings";

function Field({
  label,
  value,
  onChange,
  textarea,
  rows = 2,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  rows?: number;
}) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-wide text-ink-soft/60">{label}</label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          className="mt-1.5 w-full rounded-xl border border-black/10 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-brand-500"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1.5 w-full rounded-xl border border-black/10 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-brand-500"
        />
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-black/5 bg-white p-6">
      <h3 className="font-bold text-ink">{title}</h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">{children}</div>
    </div>
  );
}

function ImageField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/cms/media", { method: "POST", body: formData });
    setUploading(false);
    if (res.ok) {
      const data = await res.json();
      onChange(data.media.url);
    }
  }

  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-wide text-ink-soft/60">{label}</label>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="mt-1.5 flex w-full items-center gap-3 rounded-xl border border-dashed border-black/15 bg-cream px-3.5 py-2.5 text-left hover:border-brand-400"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={value} alt="" className="h-12 w-12 rounded-lg object-cover" />
        <span className="text-sm text-ink-soft">{uploading ? "Uploading…" : "Click to replace image"}</span>
      </button>
      <input ref={inputRef} type="file" accept="image/*" hidden onChange={handleUpload} />
    </div>
  );
}

export function SettingsForm({ initial }: { initial: SettingsMap }) {
  const [values, setValues] = useState<SettingsMap>(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function set<K extends keyof SettingsMap>(key: K, value: string) {
    setValues((v) => ({ ...v, [key]: value }));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    const res = await fetch("/api/cms/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    setSaving(false);
    if (res.ok) setSaved(true);
  }

  return (
    <div className="space-y-6">
      <Section title="Hero">
        <Field label="Hero Tag" value={values.heroTag} onChange={(v) => set("heroTag", v)} />
        <Field label="Hero Title" value={values.heroTitle} onChange={(v) => set("heroTitle", v)} />
        <Field label="Hero CTA Label" value={values.heroCtaLabel} onChange={(v) => set("heroCtaLabel", v)} />
        <ImageField label="Hero Background Image" value={values.heroImageUrl} onChange={(v) => set("heroImageUrl", v)} />
      </Section>

      <Section title="Hero Stats">
        <Field label="Stat 1 Value" value={values.stat1Value} onChange={(v) => set("stat1Value", v)} />
        <Field label="Stat 1 Label" value={values.stat1Label} onChange={(v) => set("stat1Label", v)} />
        <Field label="Stat 2 Value" value={values.stat2Value} onChange={(v) => set("stat2Value", v)} />
        <Field label="Stat 2 Label" value={values.stat2Label} onChange={(v) => set("stat2Label", v)} />
        <Field label="Stat 3 Value" value={values.stat3Value} onChange={(v) => set("stat3Value", v)} />
        <Field label="Stat 3 Label" value={values.stat3Label} onChange={(v) => set("stat3Label", v)} />
      </Section>

      <Section title="About The Author">
        <Field label="Section Tag" value={values.aboutTag} onChange={(v) => set("aboutTag", v)} />
        <Field label="Section Title" value={values.aboutTitle} onChange={(v) => set("aboutTitle", v)} />
        <Field label="Author Name" value={values.authorName} onChange={(v) => set("authorName", v)} />
        <ImageField label="Author Photo" value={values.authorImageUrl} onChange={(v) => set("authorImageUrl", v)} />
        <div className="sm:col-span-2">
          <Field label="Author Bio" value={values.aboutBody} onChange={(v) => set("aboutBody", v)} textarea rows={8} />
        </div>
      </Section>

      <Section title="Mid-page Call to Action">
        <Field label="Title" value={values.midTitle} onChange={(v) => set("midTitle", v)} />
        <Field label="Subtitle" value={values.midSubtitle} onChange={(v) => set("midSubtitle", v)} />
        <Field label="Books Released Count" value={values.booksReleasedCount} onChange={(v) => set("booksReleasedCount", v)} />
        <Field label="Monthly Articles Count" value={values.monthlyArticlesCount} onChange={(v) => set("monthlyArticlesCount", v)} />
      </Section>

      <Section title="Feature Banner">
        <ImageField label="Banner Image" value={values.bannerImageUrl} onChange={(v) => set("bannerImageUrl", v)} />
        <Field label="Tags (comma separated)" value={values.bannerTags} onChange={(v) => set("bannerTags", v)} />
        <div className="sm:col-span-2">
          <Field label="Banner Body" value={values.bannerBody} onChange={(v) => set("bannerBody", v)} textarea rows={4} />
        </div>
      </Section>

      <Section title="Contact & Footer">
        <Field label="Contact Heading" value={values.contactHeading} onChange={(v) => set("contactHeading", v)} />
        <Field label="Contact Subheading" value={values.contactSubheading} onChange={(v) => set("contactSubheading", v)} />
        <Field label="Contact Email" value={values.contactEmail} onChange={(v) => set("contactEmail", v)} />
        <Field label="Contact Phone" value={values.contactPhone} onChange={(v) => set("contactPhone", v)} />
        <ImageField label="Contact Image" value={values.contactImageUrl} onChange={(v) => set("contactImageUrl", v)} />
        <Field label="Footer Tagline" value={values.footerTagline} onChange={(v) => set("footerTagline", v)} textarea />
      </Section>

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save Settings"}
        </button>
        {saved && <span className="text-sm font-medium text-brand-600">Saved.</span>}
      </div>
    </div>
  );
}
