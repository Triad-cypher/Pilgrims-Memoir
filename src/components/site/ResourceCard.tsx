import Image from "next/image";
import Link from "next/link";

export function ResourceCard({
  href,
  title,
  excerpt,
  category,
  coverImageUrl,
  date,
  readTime = "10 min read",
}: {
  href: string;
  title: string;
  excerpt: string;
  category: string;
  coverImageUrl?: string | null;
  date: string;
  readTime?: string;
}) {
  return (
    <Link href={href} className="group block">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-brand-700 to-ink">
        {coverImageUrl ? (
          <Image
            src={coverImageUrl}
            alt={title}
            fill
            className="object-cover transition duration-300 group-hover:scale-[1.03]"
            sizes="(min-width: 1024px) 33vw, 100vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center p-6 text-center">
            <p className="font-serif text-base italic leading-snug text-white/85 line-clamp-5">{title}</p>
          </div>
        )}
      </div>
      <div className="mt-5 flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-terracotta-500" />
          <span className="text-[11px] font-semibold text-[#111111]">{category}</span>
        </span>
      </div>
      <h3 className="mt-3 text-lg font-bold text-[#111111] group-hover:text-brand-600">{title}</h3>
      <p className="mt-3 line-clamp-2 text-[13px] text-[#555555]">{excerpt}</p>
      <p className="mt-3 text-[11px] text-[#888888]">
        {date} • {readTime}
      </p>
    </Link>
  );
}
