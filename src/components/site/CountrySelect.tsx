"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { COUNTRIES, countryFlag } from "@/lib/countries";

const fieldClass =
  "mt-2 w-full rounded-lg bg-[#F4F4F5] px-4 py-4 text-sm text-black outline-none placeholder:text-[#71717A] focus:ring-2 focus:ring-brand-400";

export function CountrySelect({
  value,
  onChange,
  fieldClassName = fieldClass,
}: {
  value: string;
  onChange: (name: string) => void;
  /** Overrides the input/button styling so the selector can match its form. */
  fieldClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COUNTRIES;
    return COUNTRIES.filter((c) => c.name.toLowerCase().includes(q) || c.dial.includes(q));
  }, [query]);

  const selected = COUNTRIES.find((c) => c.name === value);

  function openDropdown() {
    setOpen(true);
    setQuery("");
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  function selectCountry(name: string) {
    onChange(name);
    setOpen(false);
    setQuery("");
  }

  return (
    <div ref={containerRef} className="relative">
      {open ? (
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#71717A]" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type to search countries..."
            className={`${fieldClassName} pl-10`}
          />
        </div>
      ) : (
        <button
          type="button"
          onClick={openDropdown}
          className={`${fieldClassName} flex items-center justify-between pr-10 text-left`}
        >
          <span className={selected ? "text-black" : "text-[#71717A]"}>
            {selected ? `${countryFlag(selected.code)} ${selected.name} (${selected.dial})` : "Select your country..."}
          </span>
          <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#71717A]" />
        </button>
      )}

      {open && (
        <ul className="absolute z-20 mt-1.5 max-h-64 w-full overflow-y-auto rounded-lg bg-white py-1.5 shadow-lg ring-1 ring-black/10">
          {filtered.length === 0 && <li className="px-4 py-2.5 text-sm text-[#71717A]">No countries match.</li>}
          {filtered.map((c) => (
            <li key={c.code}>
              <button
                type="button"
                onClick={() => selectCountry(c.name)}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm hover:bg-cream"
              >
                <span>{countryFlag(c.code)}</span>
                <span className="flex-1 text-black">{c.name}</span>
                <span className="text-[#71717A]">{c.dial}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
