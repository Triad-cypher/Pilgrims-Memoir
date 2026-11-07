import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Pagination } from "@/components/site/Pagination";
import { LiveSearchBar } from "@/components/site/LiveSearchBar";
import { prisma } from "@/lib/prisma";
import { formatDate, formatMonthYear } from "@/lib/format";
import { stripHtml, stripMonthPrefix } from "@/lib/text";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 6;

const CARD_DOTS = ["#B4532A", "#1E7A43", "#2B4C8C"];

function readMinutes(body: string) {
  return Math.max(1, Math.round(stripHtml(body).split(/\s+/).filter(Boolean).length / 200));
}

export default async function DevotionalsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? "1") || 1);
  const q = params.q?.trim() ?? "";
  const sort = params.sort ?? "newest";
  const orderBy =
    sort === "title" ? { title: "asc" as const } : { publishAt: sort === "oldest" ? ("asc" as const) : ("desc" as const) };

  const devotionalWhere = {
    type: "DEVOTIONAL",
    status: "PUBLISHED",
    ...(q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" as const } },
            { excerpt: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [total, devotionals] = await Promise.all([
    prisma.resource.count({ where: devotionalWhere }),
    prisma.resource.findMany({ where: devotionalWhere, orderBy, skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const countLabel = `${total} ${total === 1 ? "devotional" : "devotionals"}`;
  // The newest post gets a "Latest" badge when browsing the default (newest-first) list.
  const showLatest = !q && sort === "newest" && page === 1;

  return (
    <div className="overflow-x-clip bg-[#F5F6F0] font-geist text-[#0F1A14]">
      <Header glass />

      {/* HEADER */}
      <section className="mx-auto flex max-w-[1312px] flex-wrap items-center justify-between gap-10 px-5 pt-[clamp(64px,7vw,104px)] pb-12 sm:px-[clamp(20px,4vw,48px)]">
        <div className="in flex flex-[1_1_520px] flex-col gap-7">
          <p className="m-0 inline-flex items-center gap-2.5 text-[13px] font-medium tracking-[0.1em] text-[#3E4A43] uppercase">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[#1E7A43]" />
            Spirit-led insights
          </p>
          <h1 className="m-0 text-[clamp(56px,8.6vw,136px)] leading-[0.9] font-medium tracking-[-0.055em]">
            <span className="font-quote font-normal tracking-[-0.03em] text-[#1E7A43] italic">Monthly</span>
            <br />
            Devotionals
          </h1>
          <p className="m-0 max-w-[520px] text-[19px] leading-[1.6] text-pretty text-[#36423B]">
            Unpack the deeper mysteries of Scripture. Walk through daily, Spirit-led insights designed to shift your
            perspective and align your modern journey with eternal truths.
          </p>
        </div>

        <div
          aria-hidden="true"
          className="dev-art in relative grid h-[400px] flex-[0_1_440px] place-items-center max-sm:h-[340px]"
          style={{ animationDelay: ".15s" }}
        >
          <div
            className="absolute inset-5 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(231,217,168,.7), rgba(231,217,168,0) 65%)" }}
          />
          {/* Two aligned layers (same canvas) so they can drift apart on hover. */}
          <div className="relative aspect-[175/215] h-[380px] max-sm:h-[320px]">
            <Image
              src="/images/devotional-paper.png"
              alt=""
              fill
              priority
              sizes="320px"
              className="dev-layer-paper object-contain drop-shadow-[0_20px_26px_rgba(40,30,10,0.22)]"
            />
            <Image
              src="/images/devotional-scroll-ink.png"
              alt=""
              fill
              priority
              sizes="320px"
              className="dev-layer-ink object-contain drop-shadow-[0_18px_22px_rgba(40,30,10,0.3)]"
            />
          </div>
        </div>
      </section>

      {/* CONTROLS */}
      <div className="mx-auto max-w-[1312px] px-5 sm:px-[clamp(20px,4vw,48px)]">
        <LiveSearchBar
          basePath="/devotionals"
          initialQuery={q}
          initialSort={sort}
          variant="pill"
          noun="devotionals"
          countLabel={countLabel}
        />
      </div>

      {/* GRID */}
      <section
        aria-label="All devotionals"
        className="mx-auto max-w-[1312px] px-5 pt-10 pb-[clamp(110px,12vw,160px)] sm:px-[clamp(20px,4vw,48px)]"
      >
        {devotionals.length === 0 ? (
          <div className="flex flex-col items-center gap-2.5 rounded-[28px] border-[1.5px] border-dashed border-[#CDD3C8] px-6 py-20 text-center">
            <p className="m-0 font-quote text-[36px]">
              {q ? "No devotionals match your search." : "No devotionals published yet."}
            </p>
            <p className="m-0 text-[16px] text-[#56615A]">
              {q ? "Try a different word or phrase." : "New monthly devotionals will appear here."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(340px,100%),1fr))] gap-6">
            {devotionals.map((d, i) => {
              const monthLabel = formatMonthYear(d.publishAt);
              return (
                <Link key={d.id} href={`/devotionals/${d.slug}`} className="rv lift flex flex-col gap-[18px] text-[#0F1A14]">
                  <div
                    className="zoom relative flex h-[420px] items-center overflow-hidden rounded-[28px] px-10 text-center"
                    style={d.coverImageUrl ? undefined : { backgroundColor: d.accentColor ?? "#1b4d34" }}
                  >
                    {d.coverImageUrl ? (
                      <Image
                        src={d.coverImageUrl}
                        alt={d.title}
                        fill
                        sizes="(min-width: 1024px) 420px, 100vw"
                        className="object-cover"
                      />
                    ) : (
                      <p className="relative m-0 line-clamp-6 font-quote text-[26px] leading-[1.25] text-white/95 italic">
                        &ldquo;{d.excerpt}&rdquo;
                      </p>
                    )}
                    <span className="glass absolute top-4 left-4 rounded-full px-3 py-1.5 text-[12px] font-semibold tracking-[0.08em] text-[#0F1A14] uppercase">
                      {showLatest && i === 0 ? `Latest · ${monthLabel}` : monthLabel}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2.5 px-1.5">
                    <span className="inline-flex items-center gap-2 self-start rounded-full border border-[#DDE2D8] bg-white px-3 py-1.5 text-[13px] font-medium text-[#36423B]">
                      <span
                        aria-hidden="true"
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ background: CARD_DOTS[i % CARD_DOTS.length] }}
                      />
                      {d.category}
                    </span>
                    <h2 className="m-0 text-[24px] font-semibold tracking-[-0.025em]">{stripMonthPrefix(d.title)}</h2>
                    <p className="m-0 line-clamp-3 text-[16px] leading-[1.6] text-[#4A564E]">{d.excerpt}</p>
                    <p className="m-0 flex items-center justify-between text-[14px] text-[#56615A]">
                      {formatDate(d.publishAt)} · {readMinutes(d.body)} min read
                      <span className="inline-flex items-center gap-1.5 font-medium text-[#1E7A43]">
                        Read <ArrowUpRight size={12} />
                      </span>
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <Pagination basePath="/devotionals" currentPage={page} totalPages={totalPages} extraQuery={{ q, sort: params.sort }} />
      </section>

      <Footer />
    </div>
  );
}
