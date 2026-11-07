"use client";

import { FormEvent, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowUpRight, Check } from "lucide-react";
import { CountrySelect } from "./CountrySelect";

const fieldClass =
  "field w-full min-h-[54px] rounded-2xl border-[1.5px] border-[#E1E5DC] bg-[#F5F6F0] px-[18px] text-[16px] text-[#0F1A14] outline-none placeholder:text-[#56615A]/80";
const labelClass = "text-[14px] font-medium";

const PHONE_PATTERN = /^[0-9+\-\s()]{7,20}$/;

const INQUIRY_TYPES = [
  { value: "GENERAL", label: "General inquiry" },
  { value: "ORDER_BOOK", label: "Order a book" },
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
      setSentName(form.name.trim().split(/\s+/)[0] ?? "");
      setStatus("sent");
      setForm({ name: "", email: "", phone: "", country: "", inquiryType: "GENERAL", message: "" });
    } else {
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
        <form onSubmit={handleSubmit} className="flex flex-col gap-[18px]">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(220px,100%),1fr))] gap-[18px]">
            <div className="flex flex-col gap-2">
              <label htmlFor="f-name" className={labelClass}>
                Name
              </label>
              <input
                id="f-name"
                required
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="Your full name"
                className={fieldClass}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="f-email" className={labelClass}>
                Email
              </label>
              <input
                id="f-email"
                required
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="you@example.com"
                className={fieldClass}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="f-phone" className={labelClass}>
                Phone number
              </label>
              <input
                id="f-phone"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                onBlur={(e) => validatePhone(e.target.value)}
                inputMode="tel"
                placeholder="+254 712 345 678"
                className={fieldClass}
              />
              {phoneError && <p className="m-0 text-xs text-rose-600">{phoneError}</p>}
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
              id="f-msg"
              required
              rows={5}
              value={form.message}
              onChange={(e) => set("message", e.target.value)}
              placeholder={'I would like to order a copy of "Issue 2: The Great Transition".'}
              className={`${fieldClass} resize-y py-4 leading-[1.55]`}
            />
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
            {status === "error" && <span className="text-sm text-rose-600">Something went wrong. Please try again.</span>}
          </div>
        </form>
      )}
    </div>
  );
}
