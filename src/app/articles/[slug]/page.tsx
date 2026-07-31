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
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const article = await prisma.resource.findFirst({ where: { slug, type: "ARTICLE" } });
  if (!article) notFound();

  await prisma.resource.update({ where: { id: article.id }, data: { views: { increment: 1 } } });

  const [others, comments] = await Promise.all([
    prisma.resource.findMany({
      where: { type: "ARTICLE", status: "PUBLISHED", id: { not: article.id } },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
    prisma.comment.findMany({
      where: { resourceId: article.id, status: "APPROVED" },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div>
      <Header />

      <section className="px-5 py-10 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/articles"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 text-ink-soft hover:bg-cream"
          >
            ‹
          </Link>

          <div className="mt-6 flex flex-col gap-8 md:flex-row">
            <article className="min-w-0 flex-1 rounded-3xl border border-black/5 bg-white p-6 sm:p-10">
              <div className="relative flex aspect-[16/9] w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-brand-700 to-ink px-10 text-center">
                {article.coverImageUrl ? (
                  <Image src={article.coverImageUrl} alt={article.title} fill className="object-cover" />
                ) : (
                  <p className="font-serif text-2xl italic text-white/90">{article.title}</p>
                )}
              </div>

              <div className="mt-5 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-600" />
                <span className="rounded-full border border-black/10 px-3 py-1 text-xs font-medium text-ink-soft">
                  {article.category}
                </span>
              </div>

              <h1 className="mt-3 text-2xl font-bold text-ink sm:text-3xl">{article.title}</h1>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-b border-black/5 pb-4">
                <p className="text-xs text-ink-soft/60">
                  BY <span className="font-semibold text-ink">{article.author}</span> • {formatDate(article.publishAt)}
                </p>
                <ShareButton />
              </div>

              <RichText html={article.body} className="mt-4 space-y-4 text-sm leading-relaxed text-ink-soft/85" />

              <CommentsSection
                resourceId={article.id}
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
                basePath="/articles"
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
