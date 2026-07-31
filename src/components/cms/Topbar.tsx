import Link from "next/link";
import { ArrowUpRight, Search } from "lucide-react";

export function Topbar({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="flex items-center justify-between bg-white px-8 py-5">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink-alt">{title}</h1>
        {subtitle && <p className="mt-1 text-[13px] text-[#526056]">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden items-center gap-2 rounded-full px-4 py-2 text-[13px] text-[#8C9C92] sm:flex">
          <Search size={15} />
          Search content...
        </div>
        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-4 py-2 text-[13px] font-semibold text-brand-500 hover:brightness-95"
        >
          View Landing Page
          <ArrowUpRight size={12} />
        </Link>
      </div>
    </div>
  );
}
