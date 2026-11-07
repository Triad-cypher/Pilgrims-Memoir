import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Download, Eye } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Book3D } from "@/components/site/Book3D";
import { Citation } from "@/components/site/Citation";
import { CommentsSection } from "@/components/site/CommentsSection";
import { RichText } from "@/components/site/RichText";
import { ShareButton } from "@/components/site/ShareButton";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import { bookCover, bookIssueNumber, bookTheme } from "@/lib/books";
import { splitCitation, stripHtml } from "@/lib/text";

export const dynamic = "force-dynamic";

/** "Issue 2: The Great Transition" → { lead: "Issue 2:", rest: "The Great Transition" } */
function splitTitle(title: string) {
  const match = title.match(/^(.*?:)\s*(.+)$/);
  return match ? { lead: match[1], rest: match[2] } : { lead: "", rest: title };
}

export default async function BookDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const book = await prisma.resource.findFirst({ where: { slug, type: "BOOK" } });
  if (!book) notFound();

  await prisma.resource.update({ where: { id: book.id }, data: { views: { increment: 1 } } });

  const [settings, others, comments] = await Promise.all([
    getSettings(),
    prisma.resource.findMany({
      where: { type: "BOOK", status: "PUBLISHED", id: { not: book.id } },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    prisma.comment.findMany({
      where: { resourceId: book.id, status: "APPROVED" },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const issue = bookIssueNumber(book);
  const cover = bookCover(book);
  const { lead, rest } = splitTitle(book.title);
  const quote = splitCitation(book.excerpt);
  const hasBody = stripHtml(book.body).length > 0;

  return (
    <div className="overflow-x-clip bg-[#F5F6F0] font-geist text-[#0F1A14]">
      <Header glass />

      {/* BOOK HERO */}
      <section aria-labelledby="book-h" className="px-3 pt-6 sm:px-[clamp(12px,2vw,24px)]">
        <div className="relative mx-auto max-w-[1392px] overflow-hidden rounded-[clamp(28px,3vw,44px)] bg-[#0F2A1C] p-[clamp(20px,4vw,56px)] text-[#F5F6F0]">
          {cover && (
            <Image
              src={cover}
              alt=""
              aria-hidden="true"
              fill
              sizes="100vw"
              className="scale-125 object-cover object-[50%_80%] opacity-55 blur-[60px] saturate-[1.3]"
            />
          )}

          <div className="relative flex flex-col gap-7">
            <Link
              href="/books"
              className="hero-btn glass-dark inline-flex min-h-11 items-center gap-2.5 self-start rounded-full pr-[18px] pl-3.5 text-[14px] font-medium text-[#F5F6F0]"
            >
              <ArrowLeft size={16} />
              All books
            </Link>

            <div className="flex flex-wrap items-center gap-[clamp(32px,5vw,80px)]">
              <div className="book-scene in relative grid h-[560px] flex-[1_1_380px] place-items-center max-sm:h-[440px]">
                <div
                  aria-hidden="true"
                  className="absolute bottom-[30px] left-1/2 h-10 w-[340px] max-w-[90%] -translate-x-1/2 rounded-full blur-[8px]"
                  style={{ background: "radial-gradient(ellipse, rgba(0,0,0,.6), rgba(0,0,0,0) 70%)" }}
                />
                {cover && (
                  <div className="float p3d max-sm:scale-[0.78]">
                    <Book3D
                      src={cover}
                      alt={`Cover of ${book.title} by ${book.author}`}
                      width={300}
                      height={424}
                      depth={38}
                      spine={bookTheme(issue).spine}
                      className="spin"
                      priority
                    />
                  </div>
                )}
              </div>

              <div className="in flex flex-[1_1_460px] flex-col gap-7" style={{ animationDelay: ".12s" }}>
                {(issue || book.pdfUrl) && (
                  <div className="flex flex-wrap gap-2">
                    {issue && (
                      <span className="glass-dark rounded-full px-3.5 py-2 text-[12px] font-semibold tracking-[0.1em] uppercase">
                        Issue {String(issue).padStart(3, "0")}
                      </span>
                    )}
                    {book.pdfUrl && (
                      <span className="glass-dark rounded-full px-3.5 py-2 text-[12px] font-semibold tracking-[0.1em] text-[#E7D9A8] uppercase">
                        Free copy
                      </span>
                    )}
                  </div>
                )}

                <h1 id="book-h" className="m-0 text-[clamp(48px,6vw,72px)] leading-[0.92] font-medium tracking-[-0.05em]">
                  {lead && (
                    <>
                      {lead} <br />
                    </>
                  )}
                  <span className="font-quote font-normal tracking-[-0.025em] text-[#E7D9A8] italic">{rest}</span>
                </h1>

                <figure className="m-0 flex flex-col gap-2.5">
                  <blockquote className="m-0 text-[clamp(18px,1.6vw,21px)] leading-[1.6] text-pretty text-[#F5F6F0]/90">
                    {quote.text}
                  </blockquote>
                  {quote.cite && (
                    <figcaption className="text-[13px] font-medium tracking-[0.1em] text-[#E7D9A8] uppercase">
                      <Citation text={quote.cite} />
                    </figcaption>
                  )}
                </figure>

                {hasBody && (
                  <RichText html={book.body} className="space-y-3 text-[16px] leading-[1.7] text-[#F5F6F0]/80" />
                )}

                <div className="flex flex-wrap items-center justify-between gap-4 border-y border-[#F5F6F0]/18 py-[18px]">
                  <div className="flex items-center gap-3">
                    <span className="relative h-11 w-11 overflow-hidden rounded-full bg-[#F5F6F0]/10">
                      <Image
                        src={settings.authorImageUrl}
                        alt=""
                        fill
                        sizes="44px"
                        className="origin-[50%_30%] scale-[2.1] object-cover"
                      />
                    </span>
                    <div className="flex flex-col">
                      <span className="text-[12px] tracking-[0.1em] text-[#F5F6F0]/70 uppercase">By</span>
                      <span className="text-[16px] font-semibold">
                        {book.author} · {book.publishAt.getFullYear()}
                      </span>
                    </div>
                  </div>
                  <ShareButton className="hero-btn glass-dark inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full px-[18px] text-[14px] font-medium text-[#F5F6F0]" />
                </div>

                <div className="flex flex-wrap gap-3">
                  {book.pdfUrl && (
                    <a
                      href={`/api/resources/${book.id}/download`}
                      className="hero-btn inline-flex min-h-[58px] items-center gap-3 rounded-full bg-[#E7D9A8] py-1.5 pr-1.5 pl-6 text-[16px] font-semibold text-[#0F1A14]"
                    >
                      Download E-book
                      <span className="grid h-[46px] w-[46px] place-items-center rounded-full bg-[#0F1A14] text-[#E7D9A8]">
                        <Download size={16} />
                      </span>
                    </a>
                  )}
                  <Link
                    href={`/contact?inquiry=ORDER_BOOK&book=${encodeURIComponent(book.title)}`}
                    className="hero-btn glass-dark inline-flex min-h-[58px] items-center rounded-full px-[26px] text-[16px] font-medium text-[#F5F6F0]"
                  >
                    Order book
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMMENTS + SIDEBAR */}
      <section className="mx-auto flex max-w-[1312px] flex-wrap items-start gap-8 px-5 pt-[clamp(72px,8vw,120px)] pb-[clamp(110px,12vw,160px)] sm:px-[clamp(20px,4vw,48px)]">
        <div className="rv min-w-0 flex-[999_1_560px]">
          <CommentsSection
            variant="cards"
            resourceId={book.id}
            comments={comments.map((c) => ({
              id: c.id,
              commenterName: c.commenterName,
              body: c.body,
              createdAt: c.createdAt.toISOString(),
            }))}
          />
        </div>

        {others.length > 0 && (
          <aside aria-labelledby="prev-h" className="rv flex min-w-0 flex-[1_1_320px] flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 id="prev-h" className="m-0 text-[22px] font-semibold tracking-[-0.02em]">
                Previous Posts
              </h2>
              <Link href="/books" className="inline-flex min-h-11 items-center text-[15px] font-medium text-[#1E7A43]">
                See all
              </Link>
            </div>
            {others.map((o) => {
              const otherCover = bookCover(o);
              return (
                <Link
                  key={o.id}
                  href={`/books/${o.slug}`}
                  className="lift flex min-w-0 gap-4 rounded-[22px] border border-[#E1E5DC] bg-white p-3.5 text-[#0F1A14]"
                >
                  {otherCover && (
                    <span className="relative h-[104px] w-[72px] flex-none overflow-hidden rounded-md shadow-[0_10px_20px_-10px_rgba(0,0,0,.5)]">
                      <Image src={otherCover} alt={`Cover of ${o.title}`} fill sizes="72px" className="object-cover" />
                    </span>
                  )}
                  <div className="flex min-w-0 flex-col justify-center gap-1.5">
                    <p className="m-0 text-[16px] font-semibold tracking-[-0.01em]">{o.title}</p>
                    <p className="m-0 truncate text-[14px] text-[#56615A]">{o.excerpt}</p>
                    <p className="m-0 inline-flex items-center gap-1.5 text-[13px] text-[#56615A]">
                      <Eye size={14} />
                      {o.views} views
                    </p>
                  </div>
                </Link>
              );
            })}
          </aside>
        )}
      </section>

      <Footer />
    </div>
  );
}
