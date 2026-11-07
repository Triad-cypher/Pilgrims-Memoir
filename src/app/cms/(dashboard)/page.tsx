import Link from "next/link";
import {
  BarChart2,
  BookOpen,
  Check,
  Edit2,
  File,
  Globe,
  Image as ImageIcon,
  Plus,
  TrendingUp,
  UploadCloud,
  UserPlus,
  Users,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Topbar } from "@/components/cms/Topbar";
import { formatCompactNumber, timeAgo } from "@/lib/format";
import { COUNTRIES } from "@/lib/countries";

export const dynamic = "force-dynamic";

const STAT_ICONS = {
  views: BarChart2,
  posts: BookOpen,
  media: ImageIcon,
  comments: Users,
};

const VISITOR_WINDOW_DAYS = 30;

function flagEmoji(code: string) {
  return String.fromCodePoint(...[...code].map((ch) => 0x1f1e6 + ch.charCodeAt(0) - 65));
}

function countryName(code: string | null) {
  if (!code) return "Unknown";
  return COUNTRIES.find((c) => c.code === code)?.name ?? code;
}

const ACTIVITY_ICONS = {
  published: Check,
  drafted: Edit2,
  media: ImageIcon,
  subscribed: UserPlus,
  file: File,
};

export default async function CmsDashboardPage() {
  const visitorsSince = new Date(Date.now() - VISITOR_WINDOW_DAYS * 24 * 60 * 60 * 1000);

  const [
    totalViewsAgg,
    publishedPosts,
    mediaAssets,
    commentCount,
    recentResources,
    recentComments,
    visitsByCountry,
  ] = await Promise.all([
      prisma.resource.aggregate({ _sum: { views: true } }),
      prisma.resource.count({ where: { status: "PUBLISHED" } }),
      prisma.media.count(),
      prisma.comment.count(),
      prisma.resource.findMany({ orderBy: { updatedAt: "desc" }, take: 3 }),
      prisma.comment.findMany({ orderBy: { createdAt: "desc" }, take: 2, include: { resource: true } }),
      prisma.siteVisit.groupBy({
        by: ["country"],
        where: { createdAt: { gte: visitorsSince } },
        _count: { _all: true },
      }),
    ]);

  const totalVisitors = visitsByCountry.reduce((sum, v) => sum + v._count._all, 0);
  const topCountries = visitsByCountry
    .map((v) => ({ code: v.country, count: v._count._all }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const totalViews = totalViewsAgg._sum.views ?? 0;

  const stats = [
    { label: "Total Page Views", value: formatCompactNumber(totalViews), delta: "+12.4%", icon: STAT_ICONS.views },
    { label: "Published Posts", value: String(publishedPosts), delta: "+4%", icon: STAT_ICONS.posts },
    { label: "Media Assets", value: String(mediaAssets), delta: "+15", icon: STAT_ICONS.media },
    { label: "Comments", value: String(commentCount), delta: "+8.2%", icon: STAT_ICONS.comments },
  ];

  const activity = [
    ...recentResources.map((r) => ({
      id: r.id,
      icon: r.status === "PUBLISHED" ? ACTIVITY_ICONS.published : ACTIVITY_ICONS.drafted,
      text: `${r.status === "PUBLISHED" ? "Published" : "Drafted"} "${r.title}"`,
      meta: `by ${r.author} • ${timeAgo(r.updatedAt)}`,
    })),
    ...recentComments.map((c) => ({
      id: c.id,
      icon: ACTIVITY_ICONS.subscribed,
      text: `${c.commenterName} commented on "${c.resource.title}"`,
      meta: timeAgo(c.createdAt),
    })),
  ].slice(0, 4);

  const quickOps = [
    { href: "/cms/resources/new?type=ARTICLE", title: "Add New Article", desc: "Write a new chapter or thought piece for the articles section.", icon: Plus },
    { href: "/cms/resources/new?type=DEVOTIONAL", title: "Add New Monthly devotional", desc: "Write a new chapter or thought piece for the devotionals section.", icon: Plus },
    { href: "/cms/media", title: "Upload Media Assets", desc: "Add photos, banners, or document files to your global library.", icon: UploadCloud },
    { href: "/cms/resources/new?type=BOOK", title: "Add new e-book", desc: "Instantly update landing page copywriting, titles, and stats.", icon: Edit2 },
  ];

  return (
    <div>
      <Topbar title="Dashboard Overview" subtitle="System status and content health at a glance." />
      <div className="p-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl bg-white p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-[#526056]">{s.label}</p>
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-500">
                  <s.icon size={16} />
                </span>
              </div>
              <p className="mt-3 font-display text-[28px] font-bold text-ink-alt">{s.value}</p>
              <p className="mt-1 flex items-center gap-1 text-xs">
                <TrendingUp size={12} className="text-brand-500" />
                <span className="font-medium text-brand-500">{s.delta}</span>
                <span className="text-[#8C9C92]">vs last week</span>
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <h2 className="font-display text-lg font-bold text-ink-alt">Quick Operations</h2>
            <div className="mt-4 space-y-3">
              {quickOps.map((op) => (
                <Link
                  key={op.title}
                  href={op.href}
                  className="flex items-center gap-4 rounded-xl bg-white p-5 transition hover:shadow-sm"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-brand-50 text-brand-500">
                    <op.icon size={20} />
                  </span>
                  <div>
                    <p className="text-[15px] font-semibold text-ink-alt">{op.title}</p>
                    <p className="text-xs text-[#526056]">{op.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6">
            <h2 className="font-display text-lg font-bold text-ink-alt">Recent Activity</h2>
            <div className="mt-5 space-y-4">
              {activity.length === 0 && <p className="text-sm text-ink-soft/60">No activity yet.</p>}
              {activity.map((a) => (
                <div key={a.id} className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-500">
                    <a.icon size={12} />
                  </span>
                  <div>
                    <p className="text-[13px] font-medium text-ink-alt">{a.text}</p>
                    <p className="text-[11px] text-[#8C9C92]">{a.meta}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="flex items-center gap-2 font-display text-lg font-bold text-ink-alt">
              <Globe size={18} className="text-brand-500" />
              Visitors by Country
            </h2>
            <p className="text-xs text-[#8C9C92]">
              {formatCompactNumber(totalVisitors)} visitors • last {VISITOR_WINDOW_DAYS} days
            </p>
          </div>
          {topCountries.length === 0 ? (
            <p className="mt-5 text-sm text-ink-soft/60">
              No visitor data yet. Visits will appear here as people browse the site.
            </p>
          ) : (
            <div className="mt-5 space-y-3">
              {topCountries.map((c) => {
                const pct = Math.round((c.count / totalVisitors) * 100);
                return (
                  <div key={c.code ?? "unknown"} className="flex items-center gap-3 text-[13px]">
                    <span className="w-6 text-center text-base">{c.code ? flagEmoji(c.code) : "🌐"}</span>
                    <span className="w-40 truncate font-medium text-ink-alt">{countryName(c.code)}</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-brand-50">
                      <div className="h-full rounded-full bg-brand-500" style={{ width: `${Math.max(pct, 2)}%` }} />
                    </div>
                    <span className="w-20 text-right text-[#526056]">
                      {c.count} <span className="text-[#8C9C92]">({pct}%)</span>
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
