import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { PreviousPostsSidebar } from "@/components/site/PreviousPostsSidebar";
import { CommentsSection } from "@/components/site/CommentsSection";
import { RichText } from "@/components/site/RichText";
import { ShareButton } from "@/components/site/ShareButton";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function BookDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const book = await prisma.resource.findFirst({ where: { slug, type: "BOOK" } });
  if (!book) notFound();

  await prisma.resource.update({ where: { id: book.id }, data: { views: { increment: 1 } } });

  const [others, comments] = await Promise.all([
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

  return (
    <div className="reveal-sections">
      <Header />

      <section className="px-5 py-10 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/books"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 text-ink-soft hover:bg-cream"
          >
            ‹
          </Link>

          <div className="mt-6 flex flex-col gap-8 md:flex-row">
            <article className="min-w-0 flex-1 rounded-3xl border border-black/5 bg-white p-6 sm:p-10">
              <div className="grid gap-8 sm:grid-cols-[1fr_1.3fr]">
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-cream-dark">
                  {book.coverImageUrl && (
                    <Image src={book.coverImageUrl} alt={book.title} fill className="object-cover" />
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-rose-600">{book.title.toUpperCase()}</h1>
                  <p className="mt-2 font-semibold text-ink">{book.excerpt}</p>

                  <div className="mt-4 flex items-center justify-between border-b border-black/5 pb-4">
                    <p className="text-xs text-ink-soft/60">
                      BY <span className="font-semibold text-ink">{book.author.toUpperCase()}</span>
                      <br />
                      {book.publishAt.getFullYear()}
                    </p>
                    <ShareButton />
                  </div>

                  <RichText html={book.body} className="mt-4 space-y-3 text-sm leading-relaxed text-ink-soft/85" />

                  <div className="mt-6 flex flex-wrap items-center gap-4">
                    <Link
                      href={`/contact?inquiry=ORDER_BOOK&book=${encodeURIComponent(book.title)}`}
                      className="inline-flex items-center gap-1 text-sm font-bold text-ink"
                    >
                      ORDER BOOK <span aria-hidden>›</span>
                    </Link>
                    {book.pdfUrl && (
                      <a
                        href={`/api/resources/${book.id}/download`}
                        className="rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-600"
                      >
                        Download E-book
                      </a>
                    )}
                    {!book.pdfUrl && (
                      <span className="rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white">
                        Download E-book
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <CommentsSection
                resourceId={book.id}
                comments={comments.map((c) => ({
                  id: c.id,
                  commenterName: c.commenterName,
                  body: c.body,
                  createdAt: c.createdAt.toISOString(),
                }))}
              />
            </article>

            <div className="w-full shrink-0 md:w-[280px]">
              <PreviousPostsSidebar
                basePath="/books"
                posts={others.map((o) => ({
                  slug: o.slug,
                  title: o.title,
                  excerpt: o.excerpt,
                  coverImageUrl: o.coverImageUrl,
                  views: o.views,
                }))}
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
