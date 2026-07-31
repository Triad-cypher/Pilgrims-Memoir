import Image from "next/image";
import Link from "next/link";
import { formatCompactNumber } from "@/lib/format";

export interface PreviousPost {
  slug: string;
  title: string;
  excerpt: string;
  coverImageUrl?: string | null;
  accentColor?: string | null;
  views: number;
}

export function PreviousPostsSidebar({
  basePath,
  posts,
}: {
  basePath: string;
  posts: PreviousPost[];
}) {
  if (posts.length === 0) return null;
  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-ink">Previous Posts</h3>
        <Link href={basePath} className="text-xs font-semibold text-ink underline">
          See all
        </Link>
      </div>
      <div className="mt-4 space-y-4">
        {posts.map((p) => (
          <Link
            key={p.slug}
            href={`${basePath}/${p.slug}`}
            className="flex gap-3 rounded-2xl border border-black/5 bg-white p-3 transition hover:border-brand-200"
          >
            <div
              className="relative h-16 w-14 shrink-0 overflow-hidden rounded-lg bg-cream-dark"
              style={!p.coverImageUrl && p.accentColor ? { backgroundColor: p.accentColor } : undefined}
            >
              {p.coverImageUrl && <Image src={p.coverImageUrl} alt={p.title} fill className="object-cover" />}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold uppercase text-rose-600">{p.title}</p>
              <div className="mt-1 flex items-center gap-1 text-xs text-ink-soft/50">
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                {formatCompactNumber(p.views)}
              </div>
              <p className="mt-0.5 line-clamp-1 text-xs text-ink-soft/70">{p.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
