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

  return (
    <div className="bg-white">
      <Header />

      <section className="px-5 pt-10 pb-20 sm:px-8">
        <div className="mx-auto max-w-[1280px]">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
            <div>
              <span className="inline-flex rounded-full bg-[#F4F4F5] px-4 py-2 text-xs font-semibold text-[#09090B]">
                {settings.contactSubheading}
              </span>
              <h1 className="mt-4 font-sans text-5xl font-bold leading-none text-black sm:text-6xl lg:text-[80px]">
                {settings.contactHeading}
              </h1>
            </div>
            <p className="max-w-sm pt-4 text-base text-[#71717A] lg:pt-16">
              Have a question about a book, a devotional, or want to share how a piece touched you? We would love
              to hear from you.
            </p>
          </div>

          <div className="mt-12 grid gap-10 lg:grid-cols-[1.45fr_1fr]">
            <Suspense>
              <ContactForm />
            </Suspense>
            <div
              className="relative aspect-square w-full overflow-hidden rounded-3xl p-6 lg:aspect-auto"
              style={{ minHeight: 400 }}
            >
              <Image src={settings.contactImageUrl} alt="Your journey" fill className="object-cover" />
              <span className="relative inline-flex rounded-full bg-white/25 px-4 py-2 text-xs font-semibold text-white backdrop-blur">
                Your Journey
              </span>
            </div>
          </div>

          <div className="mt-20 grid gap-10 sm:grid-cols-3">
            <div className="flex flex-col gap-6">
              <span className="flex h-[52px] w-14 items-center justify-center rounded-full bg-cream-dark">
                <Mail size={20} />
              </span>
              <div>
                <p className="text-lg font-bold text-black">Email</p>
                <p className="mt-2 text-sm text-[#71717A]">{settings.contactEmail}</p>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <span className="flex h-[52px] w-14 items-center justify-center rounded-full bg-cream-dark">
                <Phone size={20} />
              </span>
              <div>
                <p className="text-lg font-bold text-black">Call &amp; WhatsApp</p>
                <p className="mt-2 text-sm text-[#71717A]">{settings.contactPhone}</p>
              </div>
            </div>
            <div className="flex flex-col justify-center gap-4">
              <span className="inline-flex w-fit rounded-full bg-[#F4F4F5] px-4 py-2 text-xs font-semibold text-[#09090B]">
                Contacts
              </span>
              <p className="font-sans text-4xl font-bold leading-none text-black sm:text-5xl">Write to us</p>
            </div>
          </div>
        </div>
      </section>

      <Footer tagline={settings.footerTagline} />
    </div>
  );
}
