import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, WandSparkles } from "lucide-react";
import { Header } from "@/components/site/Header";

// Backup of the original homepage hero (background photo + white headline), replaced by HomeHero
// in Nov 2026. Not used anywhere. To restore it, render <ClassicHero settings={settings} /> in
// src/app/page.tsx in place of <Header glass /> and <HomeHero … />.
export function ClassicHero({
  settings,
}: {
  settings: { heroImageUrl: string; heroTag: string; heroTitle: string; heroCtaLabel: string; heroVerseText: string };
}) {
  return (
    <section className="relative overflow-hidden pb-28">
      <div className="absolute inset-0">
        <Image src={settings.heroImageUrl} alt="" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-white/15" />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.01) 0%, rgba(0,0,0,0.75) 100%)" }}
        />
      </div>

      <Header transparent />

      <div className="relative mx-auto max-w-[1280px] px-5 pt-20 pb-10 text-center sm:px-8">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/40 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-ink-soft backdrop-blur-sm">
          <WandSparkles size={12} />
          {settings.heroTag}
        </span>
        <h1 className="mx-auto mt-6 max-w-3xl font-display text-5xl font-extrabold leading-[1.1] text-white sm:text-6xl lg:text-[83px]">
          {settings.heroTitle}
        </h1>
        <Link
          href="/books"
          className="mt-5 inline-flex items-center gap-2.5 rounded-full bg-ink px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:bg-black"
        >
          {settings.heroCtaLabel}
          <ArrowUpRight size={14} />
        </Link>

        <div className="mx-auto mt-16 max-w-2xl rounded-[32px] bg-white/10 px-8 py-7 shadow-[0_8px_32px_rgba(0,0,0,0.2)] ring-1 ring-white/25 backdrop-blur-xl backdrop-saturate-150">
          <p className="font-serif text-lg italic leading-relaxed text-white sm:text-xl">{settings.heroVerseText}</p>
        </div>
      </div>
    </section>
  );
}
