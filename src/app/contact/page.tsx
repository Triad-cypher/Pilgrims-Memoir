import Image from "next/image";
import { Suspense } from "react";
import { Mail, Phone } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ContactForm } from "@/components/site/ContactForm";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const settings = await getSettings();
  const headingWords = settings.contactHeading.trim().split(/\s+/);
  const headingLast = headingWords.length > 1 ? headingWords.pop() : null;

  return (
    <div className="overflow-x-clip bg-[#F5F6F0] font-geist text-[#0F1A14]">
      <Header glass />

      {/* HEADER */}
      <section className="mx-auto flex max-w-[1312px] flex-wrap items-end justify-between gap-8 px-5 pt-[clamp(64px,7vw,100px)] pb-12 sm:px-[clamp(20px,4vw,48px)]">
        <div className="in flex flex-col gap-6">
          <p className="m-0 inline-flex items-center gap-2.5 text-[13px] font-medium tracking-[0.1em] text-[#3E4A43] uppercase">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[#1E7A43]" />
            {settings.contactSubheading}
          </p>
          <h1 className="m-0 text-[clamp(64px,10vw,160px)] leading-[0.88] font-medium tracking-[-0.06em]">
            {headingWords.join(" ")}
            {headingLast && (
              <>
                {" "}
                <span className="font-quote font-normal tracking-[-0.03em] text-[#1E7A43] italic">{headingLast}</span>
              </>
            )}
          </h1>
        </div>
        <p
          className="in m-0 max-w-[420px] text-[19px] leading-[1.6] text-pretty text-[#36423B]"
          style={{ animationDelay: ".1s" }}
        >
          Have a question about a book, a devotional, or want to share how a piece touched you? We would love to hear
          from you.
        </p>
      </section>

      {/* FORM + IMAGE */}
      <section
        aria-label="Write to us"
        className="mx-auto flex max-w-[1312px] flex-wrap items-stretch gap-5 px-5 sm:px-[clamp(20px,4vw,48px)]"
      >
        <Suspense>
          <ContactForm />
        </Suspense>

        <div className="rv zoom relative flex min-h-[640px] flex-[1_1_440px] flex-col justify-between overflow-hidden rounded-[32px] bg-[#B86A3A] p-5 text-white">
          <Image
            src={settings.contactImageUrl}
            alt="A winding road through a desert valley at sunset"
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background: "linear-gradient(180deg, rgba(20,10,4,.15) 0%, rgba(20,10,4,0) 35%, rgba(20,10,4,.55) 100%)",
            }}
          />
          <span className="glass-d relative self-start rounded-full px-3.5 py-2 text-[12px] font-semibold tracking-[0.1em] uppercase">
            Your journey
          </span>
          <div className="relative flex flex-col gap-3">
            <p className="m-0 mb-2 text-[13px] font-semibold tracking-[0.1em] text-white/85 uppercase">Contacts</p>
            <a
              href={`mailto:${settings.contactEmail}`}
              className="glass-d lift flex items-center gap-4 rounded-[22px] p-4 text-white"
            >
              <span aria-hidden="true" className="grid h-12 w-12 flex-none place-items-center rounded-full bg-white text-[#0F1A14]">
                <Mail size={20} strokeWidth={1.7} />
              </span>
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className="text-[13px] text-white/80">Email</span>
                <span className="text-[18px] font-semibold [overflow-wrap:anywhere]">{settings.contactEmail}</span>
              </span>
            </a>
            <a
              href={`tel:${settings.contactPhone.replace(/[^\d+]/g, "")}`}
              className="glass-d lift flex items-center gap-4 rounded-[22px] p-4 text-white"
            >
              <span aria-hidden="true" className="grid h-12 w-12 flex-none place-items-center rounded-full bg-white text-[#0F1A14]">
                <Phone size={20} strokeWidth={1.7} />
              </span>
              <span className="flex flex-col gap-0.5">
                <span className="text-[13px] text-white/80">Call &amp; WhatsApp</span>
                <span className="text-[18px] font-semibold">{settings.contactPhone}</span>
              </span>
            </a>
          </div>
        </div>
      </section>

      <div className="h-[clamp(110px,12vw,160px)]" />

      <Footer tagline={settings.footerTagline} />
    </div>
  );
}
