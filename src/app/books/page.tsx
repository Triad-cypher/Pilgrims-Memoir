import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Book3D } from "@/components/site/Book3D";
import { Pagination } from "@/components/site/Pagination";
import { LiveSearchBar } from "@/components/site/LiveSearchBar";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format";
import { stripHtml } from "@/lib/text";
import { bookCover, bookIssueNumber, bookTheme } from "@/lib/books";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 6;

function readMinutes(body: string) {
  return Math.max(1, Math.round(stripHtml(body).split(/\s+/).filter(Boolean).length / 200));
}

export default async function BooksPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? "1") || 1);
  const q = params.q?.trim() ?? "";
  const orderBy =
    params.sort === "title"
      ? { title: "asc" as const }
      : { createdAt: params.sort === "oldest" ? ("asc" as const) : ("desc" as const) };

  const bookWhere = {
    type: "BOOK",
    status: "PUBLISHED",
    visibility: "PUBLIC",
    ...(q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" as const } },
            { excerpt: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [total, books] = await Promise.all([
    prisma.resource.count({ where: bookWhere }),
    prisma.resource.findMany({ where: bookWhere, orderBy, skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const countLabel = `${total} ${total === 1 ? "publication" : "publications"}`;

  return (
    <div className="overflow-x-clip bg-[#F5F6F0] font-geist text-[#0F1A14]">
      <Header glass />

      {/* HEADER */}
      <section className="mx-auto flex max-w-[1312px] flex-wrap items-center justify-between gap-10 px-5 pt-[clamp(64px,7vw,104px)] pb-12 sm:px-[clamp(20px,4vw,48px)]">
        <div className="in flex flex-[1_1_520px] flex-col gap-7">
          <p className="m-0 inline-flex items-center gap-2.5 text-[13px] font-medium tracking-[0.1em] text-[#3E4A43] uppercase">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[#1E7A43]" />
            The library
          </p>
          <h1 className="m-0 text-[clamp(56px,8.6vw,136px)] leading-[0.9] font-medium tracking-[-0.055em]">
            Books <span className="font-quote font-normal text-[#1E7A43] italic">&amp;</span>
            <br />
            Publications
          </h1>
          <p className="m-0 max-w-[520px] text-[19px] leading-[1.6] text-pretty text-[#36423B]">
            Books and publications for the Christian journey. These resources offer deeper biblical teaching,
            scriptural insights, and practical studies for anyone wanting to walk closer with God.
          </p>
        </div>

        <div
          aria-hidden="true"
          className="book-scene fan in relative grid h-[400px] flex-[0_1_440px] place-items-center max-sm:scale-[0.8]"
          style={{ animationDelay: ".15s" }}
        >
          <div
            className="absolute inset-5 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(231,217,168,.7), rgba(231,217,168,0) 65%)" }}
          />
          <div className="p3d absolute" style={{ transform: "rotateX(8deg)" }}>
            <Book3D
              src="/images/covers/issue-1-a-perfect-and-excellent-life.jpg"
              alt=""
              width={180}
              height={262}
              depth={24}
              spine="#0B1B33"
              className="b1"
              style={{ position: "absolute", left: -90, top: -131, transform: "translateX(-90px) rotateZ(-7deg) rotateY(-24deg)" }}
              priority
            />
            <Book3D
              src="/images/covers/issue-3-the-cross-of-jesus-christ.jpg"
              alt=""
              width={180}
              height={262}
              depth={24}
              spine="#3A1F0E"
              className="b3"
              style={{ position: "absolute", left: -90, top: -131, transform: "translateX(90px) rotateZ(7deg) rotateY(24deg)" }}
              priority
            />
            <Book3D
              src="/images/covers/issue-2-the-great-transition.jpg"
              alt=""
              width={200}
              height={290}
              depth={28}
              spine="#16261B"
              style={{ position: "absolute", left: -100, top: -145, transform: "translateZ(60px) rotateY(-14deg)" }}
              priority
            />
          </div>
        </div>
      </section>

      {/* CONTROLS */}
      <div className="mx-auto max-w-[1312px] px-5 sm:px-[clamp(20px,4vw,48px)]">
        <LiveSearchBar
          basePath="/books"
          initialQuery={q}
          initialSort={params.sort ?? "newest"}
          variant="pill"
          countLabel={countLabel}
        />
      </div>

      {/* GRID */}
      <section
        id="grid"
        aria-label="All books"
        className="mx-auto max-w-[1312px] px-5 pt-10 pb-[clamp(110px,12vw,160px)] sm:px-[clamp(20px,4vw,48px)]"
      >
        {books.length === 0 ? (
          <div className="flex flex-col items-center gap-2.5 rounded-[28px] border-[1.5px] border-dashed border-[#CDD3C8] px-6 py-20 text-center">
            <p className="m-0 font-quote text-[36px]">
              {q ? "No books match your search." : "No books published yet."}
            </p>
            {q && <p className="m-0 text-[16px] text-[#56615A]">Try a different word, like “transition” or “cross”.</p>}
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(340px,100%),1fr))] gap-6">
            {books.map((b, i) => {
              const issue = bookIssueNumber(b);
              const theme = bookTheme(issue, i);
              const cover = bookCover(b);
              const issueLabel = issue ? `Issue ${String(issue).padStart(3, "0")}` : null;
              return (
                <Link key={b.id} href={`/books/${b.slug}`} className="tilt rv flex flex-col gap-[18px] text-[#0F1A14]">
                  <div
                    className="book-scene relative grid h-[420px] place-items-center overflow-hidden rounded-[28px]"
                    style={{ background: theme.bg }}
                  >
                    {(b.pdfUrl || issueLabel) && (
                      <span className="glass absolute top-4 left-4 rounded-full px-3 py-1.5 text-[12px] font-semibold tracking-[0.08em] text-[#0F1A14] uppercase">
                        {[b.pdfUrl ? "Free copy" : null, issueLabel].filter(Boolean).join(" · ")}
                      </span>
                    )}
                    {cover && (
                      <Book3D src={cover} alt={`Cover of ${b.title}`} width={200} height={290} depth={28} spine={theme.spine} />
                    )}
                  </div>
                  <div className="flex flex-col gap-2.5 px-1.5">
                    <span className="inline-flex items-center gap-2 self-start rounded-full border border-[#DDE2D8] bg-white px-3 py-1.5 text-[13px] font-medium text-[#36423B]">
                      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full" style={{ background: theme.dot }} />
                      {b.category}
                    </span>
                    <h2 className="m-0 text-[24px] font-semibold tracking-[-0.025em]">{b.title}</h2>
                    <p className="m-0 line-clamp-3 text-[16px] leading-[1.6] text-[#4A564E]">{b.excerpt}</p>
                    <p className="m-0 flex items-center justify-between text-[14px] text-[#56615A]">
                      {formatDate(b.createdAt)} · {readMinutes(b.body)} min read
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

        <Pagination basePath="/books" currentPage={page} totalPages={totalPages} extraQuery={{ q, sort: params.sort }} />
      </section>

      <Footer />
    </div>
  );
}
