import Link from "next/link";
import { ChevronDown, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { DevotionalCard } from "@/components/site/DevotionalCard";
import { Pagination } from "@/components/site/Pagination";
import { prisma } from "@/lib/prisma";
import { formatMonthYear } from "@/lib/format";
import { htmlToParagraphs, stripMonthPrefix } from "@/lib/text";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 6;

export default async function DevotionalsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? "1") || 1);
  const q = params.q?.trim() ?? "";
  const sort = params.sort === "oldest" ? "asc" : "desc";

  const latest = await prisma.resource.findFirst({
    where: { type: "DEVOTIONAL", status: "PUBLISHED" },
    orderBy: { publishAt: "desc" },
  });

  const [total, devotionals] = await Promise.all([
    prisma.resource.count({
      where: {
        type: "DEVOTIONAL",
        status: "PUBLISHED",
        id: latest ? { not: latest.id } : undefined,
        title: q ? { contains: q } : undefined,
      },
    }),
    prisma.resource.findMany({
      where: {
        type: "DEVOTIONAL",
        status: "PUBLISHED",
        id: latest ? { not: latest.id } : undefined,
        title: q ? { contains: q } : undefined,
      },
      orderBy: { publishAt: sort },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const bodyPoints = latest ? htmlToParagraphs(latest.body) : [];

  return (
    <div>
      <Header />

      <section className="px-5 pt-20 pb-8 sm:px-8">
        <div className="mx-auto max-w-[1280px]">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
            <h1 className="font-display text-5xl font-extrabold leading-tight text-[#111111] sm:text-6xl lg:text-[80px]">
              Monthly
              <br />
              Devotionals
            </h1>
            <p className="max-w-sm pt-4 text-base text-[#707070]">
              Unpack the deeper mysteries of Scripture. Walk through daily, Spirit-led insights designed to shift
              your perspective and align your modern journey with eternal truths.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-bold text-[#111111]">Latest Post</h2>
            <form className="flex gap-3" action="/devotionals">
              <div className="relative">
                <select
                  name="sort"
                  defaultValue={params.sort ?? "newest"}
                  className="h-11 appearance-none rounded-xl bg-cream-dark/60 pl-4 pr-10 text-sm font-semibold text-[#111111] ring-1 ring-black/5"
                >
                  <option value="newest">Sort: Newest</option>
                  <option value="oldest">Sort: Oldest</option>
                </select>
                <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft/60" />
              </div>
              <div className="relative">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft/50" />
                <input
                  name="q"
                  defaultValue={q}
                  placeholder="Search posts..."
                  className="h-11 rounded-xl bg-cream-dark/60 pl-10 pr-4 text-sm outline-none ring-1 ring-black/5 placeholder:text-ink-soft/50"
                />
              </div>
            </form>
          </div>

          {latest && (
            <div className="mt-6 grid gap-8 rounded-3xl border border-black/5 bg-white p-6 sm:p-8 lg:grid-cols-[1fr_1fr]">
              <div
                className="relative flex aspect-[4/3] w-full items-center overflow-hidden rounded-2xl px-8 py-8 text-center"
                style={{ backgroundColor: latest.accentColor ?? "#5c1010" }}
              >
                <p className="font-serif text-base italic leading-relaxed text-white/95">
                  &ldquo;{latest.excerpt}&rdquo;
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-ink">{latest.title}</h3>
                <div className="mt-4 space-y-3 text-sm leading-relaxed text-ink-soft/80">
                  {bodyPoints.slice(0, 2).map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <Link href={`/devotionals/${latest.slug}`} className="inline-flex items-center gap-1 text-sm font-bold text-ink">
                    Read Full Post <span aria-hidden>›</span>
                  </Link>
                  <Link
                    href={`/devotionals/${latest.slug}`}
                    className="rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-600"
                  >
                    Download
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="px-5 py-14 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[#111111]">Previous Posts</h2>
            <div className="flex gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full ring-1 ring-black/10 text-ink-soft">
                <ChevronLeft size={16} />
              </span>
              <span className="flex h-10 w-10 items-center justify-center rounded-full ring-1 ring-black/10 text-ink-soft">
                <ChevronRight size={16} />
              </span>
            </div>
          </div>

          {devotionals.length === 0 ? (
            <p className="text-sm text-ink-soft/60">No devotionals found.</p>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {devotionals.map((d) => (
                <DevotionalCard
                  key={d.id}
                  href={`/devotionals/${d.slug}`}
                  title={stripMonthPrefix(d.title)}
                  monthLabel={formatMonthYear(d.publishAt)}
                  excerpt={d.excerpt}
                  accentColor={d.accentColor ?? "#1b4d34"}
                  coverImageUrl={d.coverImageUrl}
                  compact
                />
              ))}
            </div>
          )}

          <Pagination basePath="/devotionals" currentPage={page} totalPages={totalPages} extraQuery={{ q, sort: params.sort }} />
        </div>
      </section>

      <Footer />
    </div>
  );
}
