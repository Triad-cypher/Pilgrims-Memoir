"use client";

import { FormEvent, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { CountrySelect } from "./CountrySelect";

const fieldClass =
  "mt-2 w-full rounded-lg bg-[#F4F4F5] px-4 py-4 text-sm text-black outline-none placeholder:text-[#71717A] focus:ring-2 focus:ring-brand-400";
const labelClass = "text-[13px] font-medium text-[#09090B]";

const PHONE_PATTERN = /^[0-9+\-\s()]{7,20}$/;

const INQUIRY_TYPES = [
  { value: "GENERAL", label: "General Inquiry" },
  { value: "ORDER_BOOK", label: "Order a Book" },
];

export function ContactForm() {
  const searchParams = useSearchParams();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    inquiryType: "GENERAL",
    message: "",
  });
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");

  useEffect(() => {
    const inquiry = searchParams.get("inquiry");
    const book = searchParams.get("book");
    if (inquiry === "ORDER_BOOK") {
      setForm((f) => ({
        ...f,
        inquiryType: "ORDER_BOOK",
        message: book ? `I would like to order a copy of "${book}".` : f.message,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function validatePhone(value: string) {
    if (!value) {
      setPhoneError(null);
      return true;
    }
    if (!PHONE_PATTERN.test(value)) {
      setPhoneError("Phone number can only contain digits, spaces, +, - and ().");
      return false;
    }
    setPhoneError(null);
    return true;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validatePhone(form.phone)) return;

    setStatus("loading");
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setStatus("sent");
      setForm({ name: "", email: "", phone: "", country: "", inquiryType: "GENERAL", message: "" });
    } else {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-2xl bg-brand-50 p-6 text-brand-700">
        <p className="font-semibold">Thank you for reaching out!</p>
        <p className="mt-1 text-sm">We&apos;ve received your message and will get back to you soon.</p>
        <button onClick={() => setStatus("idle")} className="mt-4 text-sm font-semibold underline">
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Name</label>
          <input
            required
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Your full name"
            className={fieldClass}
          />
        </div>
        <div>
          <label className={labelClass}>Email</label>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="you@example.com"
            className={fieldClass}
          />
        </div>
        <div>
          <label className={labelClass}>Phone Number</label>
          <input
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
            onBlur={(e) => validatePhone(e.target.value)}
            inputMode="tel"
            placeholder="+254 711 290058"
            className={fieldClass}
          />
          {phoneError && <p className="mt-1.5 text-xs text-rose-600">{phoneError}</p>}
        </div>
        <div>
          <label className={labelClass}>Country</label>
          <CountrySelect value={form.country} onChange={(name) => set("country", name)} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Inquiry Type</label>
        <div className="relative">
          <select
            value={form.inquiryType}
            onChange={(e) => set("inquiryType", e.target.value)}
            className={`${fieldClass} appearance-none pr-10`}
          >
            {INQUIRY_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#71717A]" />
        </div>
      </div>

      <div>
        <label className={labelClass}>Message</label>
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={(e) => set("message", e.target.value)}
          placeholder="Anything else we should know?"
          className={fieldClass}
        />
      </div>
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-full bg-black px-7 py-4 text-sm font-semibold text-white hover:bg-black/90 disabled:opacity-60"
        >
          {status === "loading" ? "Sending…" : "Send Message"}
        </button>
        <button
          type="submit"
          disabled={status === "loading"}
          aria-label="Send message"
          className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-black text-white hover:bg-black/90 disabled:opacity-60"
        >
          <ArrowUpRight size={18} />
        </button>
        {status === "error" && <span className="text-sm text-rose-600">Something went wrong. Please try again.</span>}
      </div>
    </form>
  );
}
