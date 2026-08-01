import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ResourceCard } from "@/components/site/ResourceCard";
import { Pagination } from "@/components/site/Pagination";
import { LiveSearchBar } from "@/components/site/LiveSearchBar";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format";
import { htmlToParagraphs } from "@/lib/text";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 6;

export default async function BooksPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? "1") || 1);
  const q = params.q?.trim() ?? "";
  const sort = params.sort === "oldest" ? "asc" : "desc";

  const featured = q
    ? null
    : await prisma.resource.findFirst({
        where: { type: "BOOK", status: "PUBLISHED", visibility: "PUBLIC", featured: true },
      });

  const bookWhere = {
    type: "BOOK",
    status: "PUBLISHED",
    visibility: "PUBLIC",
    ...(q ? {} : { featured: false }),
    ...(q ? { title: { contains: q, mode: "insensitive" as const } } : {}),
  };

  const [total, books] = await Promise.all([
    prisma.resource.count({ where: bookWhere }),
    prisma.resource.findMany({
      where: bookWhere,
      orderBy: { createdAt: sort },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="bg-white">
      <Header />

      <section className="px-5 pt-20 pb-12 sm:px-8">
        <div className="mx-auto max-w-[1280px]">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
            <h1 className="font-display text-5xl font-extrabold leading-tight text-[#111111] sm:text-6xl lg:text-[80px]">
              Books &amp;
              <br />
              Publications
            </h1>
            <p className="max-w-sm pt-4 text-base text-[#707070]">
              Books and publications for the Christian journey. These resources offer deeper biblical teaching,
              scriptural insights, and practical studies for anyone wanting to walk closer with God.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 pt-10 pb-20 sm:px-8">
        <div className="mx-auto max-w-[1200px]">
          <LiveSearchBar basePath="/books" initialQuery={q} initialSort={params.sort ?? "newest"} />

          {featured && (
            <div className="mt-16 grid gap-12 lg:grid-cols-2">
              <Link
                href={`/books/${featured.slug}`}
                className="group relative flex aspect-[3/2] w-full items-end overflow-hidden rounded-3xl bg-cream-dark"
              >
                {featured.coverImageUrl && (
                  <Image
                    src={featured.coverImageUrl}
                    alt={featured.title}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-[1.02]"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <p className="relative p-8 text-2xl font-bold text-white sm:text-[28px]">
                  {featured.title}
                </p>
              </Link>

              <div className="flex flex-col">
                <h2 className="text-2xl font-bold text-[#111111]">{featured.title.toUpperCase()}</h2>
                <div className="mt-5 space-y-1.5">
                  <p className="text-lg font-medium text-[#111111]">{featured.excerpt}</p>
                  <p className="line-clamp-[10] text-xs leading-relaxed text-[#888888]">
                    {htmlToParagraphs(featured.body).join("  ")}
                  </p>
                </div>
                <div className="mt-6 flex flex-wrap items-center gap-6">
                  <Link
                    href={`/contact?inquiry=ORDER_BOOK&book=${encodeURIComponent(featured.title)}`}
                    className="inline-flex items-center gap-1.5 text-[13px] font-bold tracking-wide text-[#111111]"
                  >
                    ORDER BOOK <ChevronRight size={12} />
                  </Link>
                  {featured.pdfUrl ? (
                    <a
                      href={`/api/resources/${featured.id}/download`}
                      className="rounded-full bg-brand-500 px-6 py-3.5 text-[13px] font-bold tracking-wide text-white hover:bg-brand-600"
                    >
                      Download E-book
                    </a>
                  ) : (
                    <Link
                      href={`/books/${featured.slug}`}
                      className="rounded-full bg-brand-500 px-6 py-3.5 text-[13px] font-bold tracking-wide text-white hover:bg-brand-600"
                    >
                      View Book
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="bg-cream px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-8 flex items-center justify-between">
            <span className="text-lg font-bold text-[#111111]">*</span>
            <div className="flex gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink-soft shadow-sm">
                <ChevronLeft size={16} />
              </span>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink-soft shadow-sm">
                <ChevronRight size={16} />
              </span>
            </div>
          </div>

          {books.length === 0 ? (
            <p className="text-sm text-ink-soft/60">
              {q ? `No books match "${q}".` : "No books found."}
            </p>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {books.map((b) => (
                <ResourceCard
                  key={b.id}
                  href={`/books/${b.slug}`}
                  title={b.title}
                  excerpt={b.excerpt}
                  category={b.category}
                  coverImageUrl={b.coverImageUrl}
                  date={formatDate(b.createdAt)}
                />
              ))}
            </div>
          )}

          <Pagination
            basePath="/books"
            currentPage={page}
            totalPages={totalPages}
            extraQuery={{ q, sort: params.sort }}
          />
        </div>
      </section>

      <Footer />
    </div>
  );
}
