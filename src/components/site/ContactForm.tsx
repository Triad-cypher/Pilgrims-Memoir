"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowUpRight, Check } from "lucide-react";
import { CountrySelect } from "./CountrySelect";
import {
  INQUIRY_TYPES,
  validateContact,
  validateField,
  type ContactErrors,
  type ContactFields,
} from "@/lib/contactValidation";

const fieldClass =
  "w-full rounded-lg bg-[#F4F4F5] px-4 py-4 text-sm text-black outline-none placeholder:text-[#71717A] focus:ring-2 focus:ring-brand-400";
const invalidClass = "ring-2 ring-rose-400 focus:ring-rose-400";
const labelClass = "text-[14px] font-medium";

const MESSAGE_PLACEHOLDERS: Record<string, string> = {
  GENERAL: "How can we help?",
  ORDER_BOOK: 'I would like to order a copy of "Issue 2: The Great Transition".',
  TESTIMONY: "Share how God has been at work in your life…",
};

const FIELD_IDS: Record<keyof ContactFields, string> = {
  name: "f-name",
  email: "f-email",
  phone: "f-phone",
  message: "f-msg",
};

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
  const [errors, setErrors] = useState<ContactErrors>({});
  const [honeypot, setHoneypot] = useState("");
  const startedAt = useRef(Date.now());
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const [sentName, setSentName] = useState("");

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
    // Once a field has an error, re-check as the visitor types so it clears when fixed.
    if (key in FIELD_IDS && errors[key as keyof ContactFields]) {
      setErrors((e) => ({ ...e, [key]: validateField(key as keyof ContactFields, value) }));
    }
  }

  function checkField(key: keyof ContactFields) {
    setErrors((e) => ({ ...e, [key]: validateField(key, form[key]) }));
  }

  function fieldProps(key: keyof ContactFields) {
    const error = errors[key];
    return {
      id: FIELD_IDS[key],
      value: form[key],
      onBlur: () => checkField(key),
      "aria-invalid": error ? true : undefined,
      "aria-describedby": error ? `${FIELD_IDS[key]}-err` : undefined,
      className: `${fieldClass} ${error ? invalidClass : ""}`,
    };
  }

  function errorText(key: keyof ContactFields) {
    const error = errors[key];
    return error ? (
      <p id={`${FIELD_IDS[key]}-err`} className="m-0 text-xs text-rose-600">
        {error}
      </p>
    ) : null;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setServerError(null);
    const found = validateContact(form);
    setErrors(found);
    const firstInvalid = (Object.keys(FIELD_IDS) as (keyof ContactFields)[]).find((k) => found[k]);
    if (firstInvalid) {
      document.getElementById(FIELD_IDS[firstInvalid])?.focus();
      return;
    }

    setStatus("loading");
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, website: honeypot, startedAt: startedAt.current }),
    });
    if (res.ok) {
      setSentName(form.name.trim().split(/\s+/)[0] ?? "");
      setStatus("sent");
      setForm({ name: "", email: "", phone: "", country: "", inquiryType: "GENERAL", message: "" });
      setErrors({});
      startedAt.current = Date.now();
    } else {
      const data = await res.json().catch(() => null);
      if (data?.errors) setErrors(data.errors);
      setServerError(data?.error ?? "Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  return (
    <div className="rv flex flex-[1_1_520px] flex-col gap-7 rounded-[32px] border border-[#E1E5DC] bg-white p-[clamp(24px,4vw,48px)]">
      <h2 className="m-0 text-[clamp(32px,3.4vw,48px)] font-medium tracking-[-0.04em]">
        Write <span className="font-quote font-normal italic">to us</span>
      </h2>

      {status === "sent" ? (
        <div role="status" className="flex flex-1 flex-col items-start justify-center gap-4 py-10">
          <span aria-hidden="true" className="grid h-16 w-16 place-items-center rounded-full bg-[#E4ECDF] text-[#1E7A43]">
            <Check size={28} strokeWidth={2.2} />
          </span>
          <p className="m-0 font-quote text-[40px] leading-[1.05]">
            Thank you{sentName ? `, ${sentName}` : ""}.
          </p>
          <p className="m-0 text-[17px] leading-[1.6] text-[#36423B]">
            Your message is on its way. We will get back to you soon. Shalom.
          </p>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="hero-btn min-h-12 cursor-pointer rounded-full border-[1.5px] border-[#0F1A14] bg-transparent px-[22px] text-[15px] font-medium text-[#0F1A14]"
          >
            Send another message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-[18px]">
          {/* Honeypot: hidden from people (and screen readers); bots that fill every field get filtered out. */}
          <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
            <label htmlFor="f-website">Website</label>
            <input
              id="f-website"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(220px,100%),1fr))] gap-[18px]">
            <div className="flex flex-col gap-2">
              <label htmlFor="f-name" className={labelClass}>
                Name
              </label>
              <input
                {...fieldProps("name")}
                autoComplete="name"
                onChange={(e) => set("name", e.target.value)}
                placeholder="Your full name"
              />
              {errorText("name")}
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="f-email" className={labelClass}>
                Email
              </label>
              <input
                {...fieldProps("email")}
                type="email"
                autoComplete="email"
                onChange={(e) => set("email", e.target.value)}
                placeholder="you@example.com"
              />
              {errorText("email")}
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="f-phone" className={labelClass}>
                Phone number
              </label>
              <input
                {...fieldProps("phone")}
                inputMode="tel"
                autoComplete="tel"
                onChange={(e) => set("phone", e.target.value)}
                placeholder="+254 712 345 678"
              />
              {errorText("phone")}
            </div>
            <div className="flex flex-col gap-2">
              <span className={labelClass}>Country</span>
              <CountrySelect
                value={form.country}
                onChange={(name) => set("country", name)}
                fieldClassName={fieldClass}
              />
            </div>
          </div>

          <fieldset className="m-0 flex flex-col gap-2.5 border-0 p-0">
            <legend className={`${labelClass} mb-2.5`}>Inquiry type</legend>
            <div className="flex flex-wrap gap-2">
              {INQUIRY_TYPES.map((t) => {
                const on = form.inquiryType === t.value;
                return (
                  <button
                    key={t.value}
                    type="button"
                    aria-pressed={on}
                    onClick={() => set("inquiryType", t.value)}
                    className={`min-h-11 cursor-pointer rounded-full border-[1.5px] px-[18px] text-[15px] font-medium transition-all duration-200 ${
                      on
                        ? "border-[#0F1A14] bg-[#0F1A14] text-[#F5F6F0]"
                        : "border-[#E1E5DC] bg-white text-[#0F1A14] hover:border-[#0F1A14]/40"
                    }`}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="flex flex-col gap-2">
            <label htmlFor="f-msg" className={labelClass}>
              Message
            </label>
            <textarea
              {...fieldProps("message")}
              rows={5}
              onChange={(e) => set("message", e.target.value)}
              placeholder={MESSAGE_PLACEHOLDERS[form.inquiryType]}
              className={`${fieldProps("message").className} resize-y`}
            />
            {errorText("message")}
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="submit"
              disabled={status === "loading"}
              className="hero-btn inline-flex min-h-[58px] cursor-pointer items-center gap-3 rounded-full border-0 bg-[#1E7A43] py-1.5 pr-1.5 pl-[26px] text-[16px] font-medium text-white disabled:opacity-60"
            >
              {status === "loading" ? "Sending…" : "Send Message"}
              <span className="arr grid h-[46px] w-[46px] place-items-center rounded-full bg-white text-[#1E7A43]">
                <ArrowUpRight size={16} />
              </span>
            </button>
            {status === "error" && serverError && <span className="text-sm text-rose-600">{serverError}</span>}
          </div>
        </form>
      )}
    </div>
  );
}
