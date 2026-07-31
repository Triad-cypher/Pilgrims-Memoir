import Link from "next/link";
import {
  BarChart2,
  BookOpen,
  Check,
  Edit2,
  File,
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

export const dynamic = "force-dynamic";

const STAT_ICONS = {
  views: BarChart2,
  posts: BookOpen,
  media: ImageIcon,
  comments: Users,
};

const ACTIVITY_ICONS = {
  published: Check,
  drafted: Edit2,
  media: ImageIcon,
  subscribed: UserPlus,
  file: File,
};

export default async function CmsDashboardPage() {
  const [totalViewsAgg, publishedPosts, mediaAssets, commentCount, recentResources, recentComments] =
    await Promise.all([
      prisma.resource.aggregate({ _sum: { views: true } }),
      prisma.resource.count({ where: { status: "PUBLISHED" } }),
      prisma.media.count(),
      prisma.comment.count(),
      prisma.resource.findMany({ orderBy: { updatedAt: "desc" }, take: 3 }),
      prisma.comment.findMany({ orderBy: { createdAt: "desc" }, take: 2, include: { resource: true } }),
    ]);

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
      </div>
    </div>
  );
}
