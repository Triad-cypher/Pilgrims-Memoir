"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Search } from "lucide-react";

export function LiveSearchBar({
  basePath,
  initialQuery,
  initialSort,
  variant = "default",
  countLabel,
  noun = "books",
}: {
  basePath: string;
  initialQuery: string;
  initialSort: string;
  /** "pill" is the rounded white bar used on the Books page. */
  variant?: "default" | "pill";
  countLabel?: string;
  /** What's being searched, e.g. "books" → "Search books…". */
  noun?: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function updateUrl(nextQuery: string, nextSort: string) {
    const params = new URLSearchParams();
    if (nextQuery) params.set("q", nextQuery);
    if (nextSort && nextSort !== "newest") params.set("sort", nextSort);
    const qs = params.toString();
    router.replace(qs ? `${basePath}?${qs}` : basePath, { scroll: false });
  }

  function handleQueryChange(value: string) {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => updateUrl(value, initialSort), 250);
  }

  function handleSortChange(value: string) {
    updateUrl(query, value);
  }

  if (variant === "pill") {
    const pillField =
      "field min-h-[52px] rounded-full border-[1.5px] border-[#DDE2D8] bg-[#F5F6F0] text-[15px] text-[#0F1A14]";
    return (
      <div
        role="search"
        className="flex flex-wrap items-center justify-between gap-3 rounded-[28px] border border-[#E1E5DC] bg-white p-3 font-geist"
      >
        <div className="flex flex-[1_1_520px] flex-wrap gap-3">
          <div className="relative">
            <label htmlFor="sort" className="sr-only">
              Sort {noun}
            </label>
            <select
              id="sort"
              defaultValue={initialSort}
              onChange={(e) => handleSortChange(e.target.value)}
              className={`${pillField} cursor-pointer appearance-none pr-11 pl-5 font-medium`}
            >
              <option value="newest">Sort: Newest</option>
              <option value="oldest">Sort: Oldest</option>
              <option value="title">Sort: Title A–Z</option>
            </select>
            <ChevronDown
              size={16}
              className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-[#0F1A14]"
            />
          </div>
          <div className="relative max-w-[460px] flex-[1_1_280px]">
            <Search size={18} className="absolute top-1/2 left-[18px] -translate-y-1/2 text-[#56615A]" />
            <label htmlFor="q" className="sr-only">
              Search {noun}
            </label>
            <input
              id="q"
              type="search"
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              placeholder={`Search ${noun}…`}
              className={`${pillField} w-full pr-5 pl-12 placeholder:text-[#56615A]`}
            />
          </div>
        </div>
        {countLabel && <p className="m-0 px-3 text-[14px] text-[#56615A]">{countLabel}</p>}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-3">
      <div className="relative">
        <select
          defaultValue={initialSort}
          onChange={(e) => handleSortChange(e.target.value)}
          className="h-11 appearance-none rounded-xl bg-cream-dark/60 pl-4 pr-10 text-sm font-semibold text-[#111111] ring-1 ring-black/5"
        >
          <option value="newest">Sort: Newest</option>
          <option value="oldest">Sort: Oldest</option>
        </select>
        <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft/60" />
      </div>
      <div className="relative flex-1 sm:max-w-xs">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft/50" />
        <input
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          placeholder="Search posts..."
          className="h-11 w-full rounded-xl bg-cream-dark/60 pl-10 pr-4 text-sm outline-none ring-1 ring-black/5 placeholder:text-ink-soft/50"
        />
      </div>
    </div>
  );
}
