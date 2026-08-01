import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Topbar } from "@/components/cms/Topbar";
import { formatDate } from "@/lib/format";
import { ResourceRowActions } from "@/components/cms/ResourceRowActions";

export const dynamic = "force-dynamic";

const TABS = [
  { key: "all", label: "All", type: undefined },
  { key: "books", label: "Books", type: "BOOK" },
  { key: "articles", label: "Articles", type: "ARTICLE" },
  { key: "devotions", label: "Monthly Devotion", type: "DEVOTIONAL" },
] as const;

export default async function ResourceManagerPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const activeTab = TABS.find((t) => t.key === tab) ?? TABS[0];

  const resources = await prisma.resource.findMany({
    where: activeTab.type ? { type: activeTab.type } : undefined,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <Topbar title="Resource Manager" subtitle="Control digital catalogs, books, and sermons." />
      <div className="p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-6">
            {TABS.map((t) => (
              <Link
                key={t.key}
                href={t.key === "all" ? "/cms/resources" : `/cms/resources?tab=${t.key}`}
                className={`border-b-2 pb-1 text-sm font-semibold ${
                  activeTab.key === t.key ? "border-brand-500 text-brand-600" : "border-transparent text-ink-soft/60"
                }`}
              >
                {t.label}
              </Link>
            ))}
          </div>
          <Link
            href="/cms/resources/new"
            className="rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-600"
          >
            + Create New
          </Link>
        </div>

        <div className="overflow-hidden rounded-2xl border border-black/5 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-cream text-xs font-semibold uppercase tracking-wide text-ink-soft/60">
              <tr>
                <th className="px-6 py-3">Title</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Downloads</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {resources.map((r) => (
                <tr key={r.id} className="hover:bg-cream/60">
                  <td className="px-6 py-4">
                    <Link href={`/cms/resources/${r.id}/edit`} className="font-semibold text-ink hover:text-brand-600">
                      {r.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 capitalize text-ink-soft/70">{r.type.toLowerCase()}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        r.status === "PUBLISHED" ? "bg-brand-50 text-brand-600" : "bg-cream-dark text-ink-soft/70"
                      }`}
                    >
                      {r.status === "PUBLISHED" ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-ink-soft/60">
                    {r.pdfUrl ? r.downloads.toLocaleString() : <span className="text-ink-soft/30">—</span>}
                  </td>
                  <td className="px-6 py-4 text-ink-soft/60">{formatDate(r.createdAt)}</td>
                  <td className="px-6 py-4 text-right">
                    <ResourceRowActions id={r.id} />
                  </td>
                </tr>
              ))}
              {resources.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-ink-soft/50">
                    No resources yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
