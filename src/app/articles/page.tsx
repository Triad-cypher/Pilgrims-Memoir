import { ChevronLeft, ChevronRight } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ResourceCard } from "@/components/site/ResourceCard";
import { Pagination } from "@/components/site/Pagination";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 6;

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? "1") || 1);

  const [total, articles] = await Promise.all([
    prisma.resource.count({ where: { type: "ARTICLE", status: "PUBLISHED" } }),
    prisma.resource.findMany({
      where: { type: "ARTICLE", status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
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
              Articles
            </h1>
            <p className="max-w-sm pt-4 text-base text-[#707070]">
              Raw truth for the narrow road. Here, we bypass superficial motivation to dissect complex theology,
              expose cultural deceptions, and share uncompromised spiritual insights for the modern pilgrim.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 pb-20 sm:px-8">
        <div className="mx-auto max-w-[1256px]">
          <div className="mb-8 flex items-center justify-between">
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

          {articles.length === 0 ? (
            <p className="text-sm text-ink-soft/60">No articles found.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((a) => (
                <ResourceCard
                  key={a.id}
                  href={`/articles/${a.slug}`}
                  title={a.title}
                  excerpt={a.excerpt}
                  category={a.category}
                  coverImageUrl={a.coverImageUrl}
                  date={formatDate(a.createdAt)}
                />
              ))}
            </div>
          )}

          <Pagination basePath="/articles" currentPage={page} totalPages={totalPages} />
        </div>
      </section>

      <Footer />
    </div>
  );
}
