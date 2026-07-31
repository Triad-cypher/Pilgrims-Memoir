"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/#about", label: "About" },
  { href: "/books", label: "Books" },
  { href: "/devotionals", label: "Monthly Devotionals" },
];

export function Header({ transparent = false }: { transparent?: boolean }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

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
