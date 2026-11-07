"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/#about", label: "About" },
  { href: "/books", label: "Books" },
  { href: "/devotionals", label: "Monthly Devotionals" },
];

function LeafMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <circle cx="16" cy="16" r="16" fill="#0F3B26" />
      <path
        d="M23 7.5c-5.4.4-10.2 4.6-11.8 11l-1.2 4.6 1.8-1.3c.9-2.5 2.4-4.3 4.3-5.3 3.4-1.1 6-4.8 6.9-9z"
        fill="#E7D9A8"
      />
      <path d="M10 24.5l6.5-7.6" stroke="#0F3B26" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

// Floating glass pill used over the homepage hero.
function GlassHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 px-3 pt-4 font-geist sm:px-8">
      <nav aria-label="Main" className="glass mx-auto max-w-[1312px] rounded-[28px] py-2 pr-2 pl-[18px]">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="flex min-h-11 items-center gap-2.5 text-[#0F1A14]">
            <LeafMark />
            <span className="text-[17px] font-semibold tracking-[-0.02em]">
              Pilgrim&apos;s <span className="font-quote text-[20px] font-normal italic">Memoirs</span>
            </span>
          </Link>

          <div className="hidden items-center gap-0.5 text-[15px] lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                aria-current={pathname === link.href ? "page" : undefined}
                className={`rounded-full px-[18px] py-3 transition ${
                  pathname === link.href
                    ? "bg-[#0F1A14] text-[#F5F6F0]"
                    : "text-[#3E4A43] hover:bg-[#0F1A14]/6 hover:text-[#0F1A14]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/contact"
              className="hero-btn hidden min-h-11 items-center gap-2.5 rounded-full bg-[#1E7A43] py-1.5 pr-1.5 pl-5 text-[15px] font-medium text-white sm:flex"
            >
              Contact
              <span className="arr grid h-[34px] w-[34px] place-items-center rounded-full bg-white text-[#1E7A43]">
                <ArrowUpRight size={14} />
              </span>
            </Link>
            <button
              aria-label="Toggle menu"
              className="rounded-full p-2.5 text-[#0F1A14] hover:bg-[#0F1A14]/6 lg:hidden"
              onClick={() => setOpen((v) => !v)}
            >
              <Menu size={20} />
            </button>
          </div>
        </div>

        {open && (
          <div className="mt-2 flex flex-col gap-1 border-t border-black/5 pt-2 pb-1 lg:hidden">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`rounded-full px-4 py-2.5 text-sm ${
                  pathname === link.href ? "bg-[#0F1A14] text-[#F5F6F0]" : "text-[#3E4A43] hover:bg-[#0F1A14]/6"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="mt-1 rounded-full bg-[#1E7A43] px-4 py-2.5 text-center text-sm font-medium text-white"
            >
              Contact
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}

export function Header({ transparent = false, glass = false }: { transparent?: boolean; glass?: boolean }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  if (glass) return <GlassHeader />;

  return (
    <header
      className={
        transparent
          ? "absolute inset-x-0 top-0 z-40"
          : "sticky top-0 z-40 border-b border-black/5 bg-white/90 backdrop-blur"
      }
    >
      <div className="mx-auto flex h-20 max-w-[1280px] items-center justify-between px-5 sm:px-8">
        <Link href="/" className="flex items-center">
          <Image src="/images/logo.png" alt="Pilgrim's Memoirs" width={243} height={58} className="h-9 w-auto" priority />
        </Link>

        <nav className="hidden items-center gap-[46px] lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`-mx-3 -my-3 rounded-lg px-3 py-3 text-sm font-medium transition hover:bg-black/5 hover:text-ink ${
                pathname === link.href ? "text-brand-500" : "text-ink-soft"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/contact"
            className="hidden rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-ink shadow-sm ring-1 ring-black/5 transition hover:bg-cream sm:inline-block"
          >
            Contact
          </Link>
          <button
            aria-label="Toggle menu"
            className="rounded-full border border-black/10 p-2 lg:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-black/5 bg-white px-5 py-3 lg:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`rounded-lg px-3 py-2 text-sm font-medium hover:bg-cream ${
                pathname === link.href ? "text-brand-500" : "text-ink-soft"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="mt-1 rounded-full bg-ink px-3 py-2 text-center text-sm font-semibold text-white"
          >
            Contact
          </Link>
        </nav>
      )}
    </header>
  );
}
