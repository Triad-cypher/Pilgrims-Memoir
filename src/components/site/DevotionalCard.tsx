import Image from "next/image";
import Link from "next/link";

export function DevotionalCard({
  href,
  title,
  monthLabel,
  excerpt,
  accentColor,
  coverImageUrl,
  compact = false,
}: {
  href: string;
  title: string;
  monthLabel: string;
  excerpt: string;
  accentColor: string;
  coverImageUrl?: string | null;
  compact?: boolean;
}) {
  return (
    <Link href={href} className="group block">
      <div
        className={`relative flex w-full items-center overflow-hidden rounded-2xl px-6 py-8 text-center ${
          compact ? "aspect-[4/3]" : "aspect-[16/10]"
        }`}
        style={coverImageUrl ? undefined : { backgroundColor: accentColor }}
      >
        {coverImageUrl && (
          <Image src={coverImageUrl} alt={title} fill className="object-cover" />
        )}
        {!coverImageUrl && (
          <>
            <div
              className="pointer-events-none absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(115deg, transparent 0px, transparent 18px, rgba(255,255,255,0.4) 19px)",
              }}
            />
            <p className="relative font-serif text-sm italic leading-relaxed text-white/95 line-clamp-6">
              &ldquo;{excerpt}&rdquo;
            </p>
            <p className="absolute bottom-3 left-0 right-0 px-4 font-serif text-[11px] italic text-white/70">
              {monthLabel}: {title}
            </p>
          </>
        )}
      </div>
      <div className="mt-5 flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-terracotta-500" />
          <span className="text-[11px] font-semibold text-[#111111]">Category</span>
        </span>
      </div>
      <h3 className="mt-3 text-lg font-bold text-[#111111] group-hover:text-brand-600">{monthLabel}</h3>
      <p className="mt-3 line-clamp-2 text-[13px] text-[#555555]">{title}</p>
      <p className="mt-3 text-[11px] text-[#888888]">Aug 10 • 10 min read</p>
    </Link>
  );
}
