import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Star } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { HomeHero } from "@/components/site/HomeHero";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

/**
 * Splits a heading into plain and accented (green italic serif) parts. Words wrapped in *asterisks*
 * are accented; without asterisks, the second-to-last word is (e.g. "…his *transforming* power").
 */
function accentTitle(title: string): { text: string; accent: boolean }[] {
  if (title.includes("*")) {
    return title
      .split(/(\*[^*]+\*)/)
      .filter(Boolean)
      .map((part) =>
        part.startsWith("*") && part.endsWith("*") ? { text: part.slice(1, -1), accent: true } : { text: part, accent: false }
      );
  }
  const words = title.trim().split(/\s+/);
  if (words.length < 3) return [{ text: title, accent: false }];
  const i = words.length - 2;
  return [
    { text: words.slice(0, i).join(" ") + " ", accent: false },
    { text: words[i], accent: true },
    { text: " " + words.slice(i + 1).join(" "), accent: false },
  ];
}

export default async function HomePage() {
  const settings = await getSettings();

  const [featuredResources] = await Promise.all([
    prisma.resource.findMany({
      where: { status: "PUBLISHED", visibility: "PUBLIC", featured: false, type: "BOOK" },
      orderBy: { createdAt: "asc" },
      take: 3,
    }),
  ]);

  const aboutParagraphs = settings.aboutBody.split("\n\n");
  // const bannerParagraphs = settings.bannerBody.split("\n\n");
  const bannerTags = settings.bannerTags.split(",").map((t) => t.trim()).filter(Boolean);

  return (
    <div className="overflow-x-clip">
      <Header glass />
      <HomeHero
        tag={settings.heroTag}
        title={settings.heroTitle}
        tagline={settings.footerTagline}
        ctaLabel={settings.heroCtaLabel}
        verse={settings.heroVerseText}
        marqueeItems={bannerTags}
      />

      {/* ABOUT AUTHOR */}
      <section id="about" className="bg-cream px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto grid max-w-[1280px] gap-8 lg:grid-cols-[1.15fr_1fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-[11px] font-semibold text-ink-soft">
              <Star size={10} />
              {settings.aboutTag}
            </span>
            <h2 className="mt-4 font-geist text-4xl font-medium tracking-[-0.045em] text-[#0F1A14] sm:text-[44px] lg:text-[52px]">
              {settings.aboutTitle.split(" ")[0]}{" "}
              <span className="font-quote font-normal tracking-[-0.02em] text-[#1E7A43] italic">
                {settings.aboutTitle.split(" ").slice(1).join(" ")}
              </span>
            </h2>
            <div className="mt-5 max-w-xl space-y-4 text-[15px] leading-[24px] text-ink">
              {aboutParagraphs.map((p, i) => (
                <p
                  key={i}
                  className={i === 0 ? "font-quote text-[22px] text-[#0F3B26] italic" : undefined}
                >
                  {p}
                </p>
              ))}
            </div>
          </div>

          <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-[32px]">
            <Image src={settings.authorImageUrl} alt={settings.authorName} fill className="object-cover" />
            <div className="glass absolute right-9 bottom-10 left-9 flex items-center justify-between gap-3 rounded-full py-2 pr-2 pl-5 font-geist">
              <p className="m-0 flex items-baseline gap-x-2 leading-tight max-sm:flex-col max-sm:gap-0.5">
                <span className="text-[16px] font-semibold tracking-[-0.02em] text-[#0F1A14]">{settings.authorName}</span>
                <span aria-hidden="true" className="text-[14px] text-[#3E4A43]/50 max-sm:hidden">
                  |
                </span>
                <span className="text-[13px] text-[#3E4A43]">Author · Youth leader</span>
              </p>
              <svg width="26" height="26" viewBox="0 0 32 32" fill="none" aria-hidden="true" className="shrink-0">
                <circle cx="16" cy="16" r="16" fill="#0F3B26" />
                <path
                  d="M23 7.5c-5.4.4-10.2 4.6-11.8 11l-1.2 4.6 1.8-1.3c.9-2.5 2.4-4.3 4.3-5.3 3.4-1.1 6-4.8 6.9-9z"
                  fill="#E7D9A8"
                />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* MID CTA */}
      <section className="bg-cream px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-[1280px]">
          <div className="grid gap-10 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-center lg:gap-x-0">
            <div className="text-center lg:max-w-[clamp(376px,52.6vw,752px)] lg:text-left">
              <h2 className="font-geist text-[clamp(40px,5.6vw,80px)] leading-[0.95] font-medium tracking-[-0.055em] text-[#0F1A14]">
                {accentTitle(settings.midTitle).map((part, i) =>
                  part.accent ? (
                    <span key={i} className="font-quote font-normal tracking-[-0.03em] text-[#1E7A43] italic">
                      {part.text}
                    </span>
                  ) : (
                    <span key={i}>{part.text}</span>
                  )
                )}
              </h2>
              <p className="mt-4 font-accent text-base text-ink-soft-2">{settings.midSubtitle}</p>
              <div className="mt-7 flex flex-wrap justify-center gap-4 lg:justify-start">
                <Link
                  href="/books"
                  className="rounded-full bg-brand-100 px-7 py-3.5 font-accent text-[15px] font-bold text-brand-700"
                >
                  Explore Books
                </Link>
                <Link
                  href="/devotionals"
                  className="rounded-full px-7 py-3.5 font-accent text-[15px] font-bold text-ink-alt ring-1 ring-black/10"
                >
                  Monthly Devotionals
                </Link>
              </div>
            </div>
            <div className="flex w-full flex-col gap-5 lg:mx-auto lg:max-w-[420px]">
              <figure className="relative m-0 flex flex-col gap-4 overflow-hidden rounded-2xl bg-[#0F3B26] p-6 text-[#F5F6F0]">
                <svg aria-hidden="true" viewBox="0 0 200 200" className="absolute -top-8 -right-8 h-44 w-44 opacity-[0.12]">
                  <path d="M100 0v200M0 100h200M30 30l140 140M170 30L30 170" stroke="#E7D9A8" strokeWidth="2" />
                </svg>
                <blockquote className="relative m-0 font-quote text-[28px] leading-[1.05] text-balance">
                  For our citizenship is in heaven…
                </blockquote>
                <figcaption className="relative font-geist text-[12px] font-medium tracking-[0.1em] text-[#E7D9A8] uppercase">
                  Phil. 3:20 (NKJV)
                </figcaption>
              </figure>
              <div className="grid grid-cols-2 gap-5">
                <div className="rounded-2xl bg-brand-50 p-4">
                  <p className="font-accent text-[11px] font-semibold uppercase tracking-wide text-ink-soft-2">
                    Monthly articles
                  </p>
                  <p className="mt-1 font-display text-[32px] font-semibold text-brand-600">
                    {settings.monthlyArticlesCount}
                  </p>
                </div>
                <div className="rounded-2xl bg-brand-50 p-4">
                  <p className="font-accent text-[11px] font-semibold uppercase tracking-wide text-ink-soft-2">
                    Books Released
                  </p>
                  <p className="mt-1 font-display text-[32px] font-semibold text-brand-600">
                    {settings.booksReleasedCount}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GREEN BANNER — hidden for now. To bring it back, remove this opening comment and the closing one
          after the section, and uncomment bannerParagraphs above.
      <section className="px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-[1280px]">
          <div
            className="overflow-hidden rounded-[32px] p-6 sm:p-12"
            style={{ background: "linear-gradient(135deg, #058E38 20%, #022810 100%)" }}
          >
            <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-12">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[20px]">
                <Image src={settings.bannerImageUrl} alt="" fill className="object-cover" />
              </div>
              <div className="text-white">
                <div className="space-y-3 text-[15px] leading-relaxed text-white">
                  {bannerParagraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
                <div className="mt-9 flex flex-wrap gap-3">
                  {bannerTags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 font-accent text-[13px] font-semibold text-ink-alt"
                    >
                      <Check size={14} className="text-brand-500" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      */}

      {/* RESOURCES */}
      <section className="px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-[1280px]">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-3xl font-semibold text-ink-alt sm:text-[42px]">Resources</h2>
            <div className="flex gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-ink-soft shadow-sm">
                <ArrowLeft size={18} />
              </span>
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-700 text-white">
                <ArrowRight size={18} />
              </span>
            </div>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredResources.map((r) => (
              <Link key={r.id} href={`/books/${r.slug}`} className="group block">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-cream-dark">
                  {r.coverImageUrl && (
                    <Image
                      src={r.coverImageUrl}
                      alt={r.title}
                      fill
                      className="object-cover transition duration-300 group-hover:scale-[1.03]"
                    />
                  )}
                </div>
                <div className="mt-5 flex items-center gap-1.5 rounded-full ring-1 ring-black/10 w-fit px-2.5 py-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-terracotta-500" />
                  <span className="text-[11px] font-semibold text-[#111111]">{r.category}</span>
                </div>
                <h3 className="mt-3 text-lg font-bold text-[#111111] group-hover:text-brand-600">{r.title}</h3>
                <p className="mt-2 text-[13px] text-[#555555]">{r.excerpt}</p>
                <p className="mt-3 text-[11px] text-[#888888]">{formatDate(r.createdAt)} • 10 min read</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer tagline={settings.footerTagline} />
    </div>
  );
}
