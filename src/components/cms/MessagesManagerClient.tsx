"use client";

import { useState } from "react";
import { Mail, Phone, Trash2 } from "lucide-react";
import { INQUIRY_TYPES, inquiryLabel } from "@/lib/contactValidation";

export interface MessageItem {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  country: string | null;
  inquiryType: string;
  message: string;
  createdAt: string;
}

const TYPE_STYLES: Record<string, string> = {
  GENERAL: "bg-brand-50 text-brand-600",
  ORDER_BOOK: "bg-amber-100 text-amber-700",
  TESTIMONY: "bg-sky-100 text-sky-700",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function replyHref(m: MessageItem) {
  const subject = `Re: your ${inquiryLabel(m.inquiryType).toLowerCase()} — A Pilgrim's Memoirs`;
  const quoted = m.message
    .split("\n")
    .map((line) => `> ${line}`)
    .join("\n");
  const body = `Dear ${m.name.split(/\s+/)[0]},\n\n\n\n— On ${formatDateTime(m.createdAt)} you wrote:\n${quoted}`;
  return `mailto:${m.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function MessagesManagerClient({ initialMessages }: { initialMessages: MessageItem[] }) {
  const [messages, setMessages] = useState(initialMessages);
  const [selectedId, setSelectedId] = useState<string | null>(initialMessages[0]?.id ?? null);
  const [typeFilter, setTypeFilter] = useState<string>("ALL");

  const filtered = messages.filter((m) => typeFilter === "ALL" || m.inquiryType === typeFilter);
  const selected = messages.find((m) => m.id === selectedId) ?? null;
  const countFor = (type: string) => (type === "ALL" ? messages.length : messages.filter((m) => m.inquiryType === type).length);

  async function handleDelete(id: string) {
    if (!confirm("Delete this message? This cannot be undone.")) return;
    const res = await fetch(`/api/cms/messages/${id}`, { method: "DELETE" });
    if (res.ok) {
      setMessages((ms) => ms.filter((m) => m.id !== id));
      if (selectedId === id) setSelectedId(null);
    }
  }

  return (
    <div className="grid gap-6 p-8 lg:grid-cols-[1fr_380px]">
      <div className="min-w-0 rounded-2xl border border-black/5 bg-white p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-bold text-ink">All Messages</h3>
          <div className="flex flex-wrap gap-2">
            {[{ value: "ALL", label: "All" }, ...INQUIRY_TYPES].map((t) => (
              <button
                key={t.value}
                onClick={() => setTypeFilter(t.value)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  typeFilter === t.value ? "bg-ink text-white" : "border border-black/10 text-ink-soft hover:bg-cream"
                }`}
              >
                {t.label} <span className="opacity-60">({countFor(t.value)})</span>
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs font-semibold uppercase tracking-wide text-ink-soft/50">
              <tr>
                <th className="pb-2">From</th>
                <th className="pb-2">Type</th>
                <th className="pb-2 pr-4">Message</th>
                <th className="pb-2 pr-4">Country</th>
                <th className="pb-2">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {filtered.map((m) => (
                <tr
                  key={m.id}
                  onClick={() => setSelectedId(m.id)}
                  className={`cursor-pointer ${selectedId === m.id ? "bg-cream" : "hover:bg-cream/60"}`}
                >
                  <td className="py-3 pr-2">
                    <p className="font-semibold text-ink">{m.name}</p>
                    <p className="max-w-[180px] truncate text-xs text-ink-soft/60">{m.email}</p>
                  </td>
                  <td className="py-3 pr-2">
                    <span
                      className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${
                        TYPE_STYLES[m.inquiryType] ?? "bg-black/5 text-ink-soft"
                      }`}
                    >
                      {inquiryLabel(m.inquiryType)}
                    </span>
                  </td>
                  <td className="max-w-[160px] truncate py-3 pr-4 text-ink-soft/70">{m.message}</td>
                  <td className="whitespace-nowrap py-3 pr-4 text-ink-soft/70">{m.country ?? "—"}</td>
                  <td className="whitespace-nowrap py-3 text-ink-soft/60">{formatDate(m.createdAt)}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-ink-soft/50">
                    {messages.length === 0 ? "No messages yet." : "No messages of this type."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="h-fit rounded-2xl border border-black/5 bg-white p-5">
        <h3 className="font-bold text-ink">Message Details</h3>
        {!selected ? (
          <p className="mt-4 text-sm text-ink-soft/60">Select a message to read it.</p>
        ) : (
          <div className="mt-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-semibold text-ink">{selected.name}</p>
                <p className="text-xs text-ink-soft/50">{formatDateTime(selected.createdAt)}</p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                  TYPE_STYLES[selected.inquiryType] ?? "bg-black/5 text-ink-soft"
                }`}
              >
                {inquiryLabel(selected.inquiryType)}
              </span>
            </div>

            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Mail size={14} className="shrink-0 text-ink-soft/50" />
                <a href={`mailto:${selected.email}`} className="truncate text-brand-600 hover:underline">
                  {selected.email}
                </a>
              </div>
              {selected.phone && (
                <div className="flex items-center gap-2">
                  <Phone size={14} className="shrink-0 text-ink-soft/50" />
                  <a href={`tel:${selected.phone.replace(/[^\d+]/g, "")}`} className="text-ink hover:underline">
                    {selected.phone}
                  </a>
                </div>
              )}
              {selected.country && (
                <p className="text-ink-soft/70">
                  <span className="text-ink-soft/50">Country:</span> {selected.country}
                </p>
              )}
            </dl>

            <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-ink-soft/50">Message</p>
            <p className="mt-2 max-h-[360px] overflow-y-auto whitespace-pre-wrap text-sm leading-relaxed text-ink-soft/85">
              {selected.message}
            </p>

            <a
              href={replyHref(selected)}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-brand-500 py-2.5 text-sm font-semibold text-white hover:bg-brand-600"
            >
              <Mail size={15} />
              Reply by Email
            </a>
            <button
              onClick={() => handleDelete(selected.id)}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-full border border-rose-200 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50"
            >
              <Trash2 size={15} />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
