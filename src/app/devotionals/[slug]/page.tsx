import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Eye, MessageCircle, Share2 } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { PreviousPostsSidebar } from "@/components/site/PreviousPostsSidebar";
import { CommentsSection } from "@/components/site/CommentsSection";
import { RichText } from "@/components/site/RichText";
import { ShareButton } from "@/components/site/ShareButton";
import { prisma } from "@/lib/prisma";
import { formatCompactNumber } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function DevotionalDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const devotional = await prisma.resource.findFirst({ where: { slug, type: "DEVOTIONAL" } });
  if (!devotional) notFound();

  await prisma.resource.update({ where: { id: devotional.id }, data: { views: { increment: 1 } } });

  const [others, comments, commentCount] = await Promise.all([
    prisma.resource.findMany({
      where: { type: "DEVOTIONAL", status: "PUBLISHED", id: { not: devotional.id } },
      orderBy: { publishAt: "desc" },
      take: 4,
    }),
    prisma.comment.findMany({
      where: { resourceId: devotional.id, status: "APPROVED" },
      orderBy: { createdAt: "desc" },
    }),
    prisma.comment.count({ where: { resourceId: devotional.id } }),
  ]);

  return (
    <div>
      <Header />

      <section className="px-5 py-10 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/devotionals"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 text-ink-soft hover:bg-cream"
          >
            ‹
          </Link>

          <div className="mt-6 flex flex-col gap-8 md:flex-row">
            <article className="min-w-0 flex-1 rounded-3xl border border-black/5 bg-white p-6 sm:p-10">
              <div
                className="relative flex aspect-[16/9] w-full items-center justify-center overflow-hidden rounded-2xl px-10 py-10 text-center"
                style={devotional.coverImageUrl ? undefined : { backgroundColor: devotional.accentColor ?? "#5c1010" }}
              >
                {devotional.coverImageUrl && (
                  <Image src={devotional.coverImageUrl} alt={devotional.title} fill className="object-cover" />
                )}
                {!devotional.coverImageUrl && (
                  <p className="font-serif text-lg italic leading-relaxed text-white/95">
                    &ldquo;{devotional.excerpt}&rdquo;
                  </p>
                )}
              </div>

              <div className="mt-4 flex items-center gap-5 text-xs text-ink-soft/60">
                <span className="flex items-center gap-1">
                  <Eye size={14} />
                  {formatCompactNumber(devotional.views)}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle size={14} />
                  {commentCount}
                </span>
                <span className="flex items-center gap-1">
                  <Share2 size={14} />
                  {formatCompactNumber(devotional.views * 15)}
                </span>
              </div>

              <h1 className="mt-4 text-xl font-bold text-ink sm:text-2xl">{devotional.title}</h1>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-b border-black/5 pb-4">
                <p className="text-xs text-ink-soft/60">
                  BY <span className="font-semibold text-ink">J.K.</span>
                  <br />
                  {devotional.publishAt.toLocaleString("en-US", {
                    month: "2-digit",
                    day: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <ShareButton />
              </div>

              <RichText html={devotional.body} className="mt-4 space-y-4 text-sm leading-relaxed text-ink-soft/85" />

              <CommentsSection
                resourceId={devotional.id}
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
                basePath="/devotionals"
                posts={others.map((o) => ({
                  slug: o.slug,
                  title: o.title,
                  excerpt: o.excerpt,
                  accentColor: o.accentColor,
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
