"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Search } from "lucide-react";

export function LiveSearchBar({
  basePath,
  initialQuery,
  initialSort,
}: {
  basePath: string;
  initialQuery: string;
  initialSort: string;
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
