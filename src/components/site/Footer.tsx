import Image from "next/image";
import Link from "next/link";
import { FacebookIcon, InstagramIcon, TiktokIcon, TwitterIcon, YoutubeIcon } from "./SocialIcons";
import { BackToTop } from "./BackToTop";

const SOCIAL_LINKS = [
  { Icon: InstagramIcon, href: null, label: "Instagram" },
  { Icon: TwitterIcon, href: null, label: "Twitter" },
  {
    Icon: FacebookIcon,
    href: "https://www.facebook.com/people/Joel-Kimari/pfbid02HStP6WRHCuJkuqoD7REuiSTaX4hxUXkbNJFV1zRPbjgkMC2QyHLZYUpG1vDpzbAdl/",
    label: "Facebook",
  },
  { Icon: TiktokIcon, href: "https://www.tiktok.com/@pilgrimsmemoir", label: "TikTok" },
  { Icon: YoutubeIcon, href: null, label: "YouTube" },
];

export function Footer({ tagline }: { tagline?: string }) {
  return (
    <footer className="bg-[#111111] text-white">
      <BackToTop />
      <div className="mx-auto max-w-[1280px] px-5 pt-20 pb-10 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[2fr_1fr_1fr_1fr]">
          <div>
            <Image src="/images/logo.png" alt="Pilgrim's Memoirs" width={243} height={58} className="h-9 w-auto" />
            <p className="mt-3 max-w-xs text-sm text-white/70">
              {tagline ??
                "Christian books, articles, and monthly devotionals to nourish your faith and encourage your walk with God."}
            </p>
            <div className="mt-5 flex gap-3">
              {SOCIAL_LINKS.map(({ Icon, href, label }) =>
                href ? (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.078] text-white/80 transition hover:bg-white/20 hover:text-white"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ) : (
                  <span
                    key={label}
                    aria-label={label}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.078] text-white/80"
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                )
              )}
            </div>
          </div>

          <div>
            <p className="text-xs font-bold tracking-wide text-white">EXPLORE</p>
            <ul className="mt-2.5 space-y-2.5 text-sm text-white/70">
              <li><Link href="/books" className="hover:text-white">Books</Link></li>
              <li><Link href="/devotionals" className="hover:text-white">Devotionals</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold tracking-wide text-white">COMPANY</p>
            <ul className="mt-2.5 space-y-2.5 text-sm text-white/70">
              <li><Link href="/#about" className="hover:text-white">About</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold tracking-wide text-white">LEGAL</p>
            <ul className="mt-2.5 space-y-2.5 text-sm text-white/70">
              <li><Link href="/privacy" className="hover:text-white">Privacy</Link></li>
              <li><Link href="/terms" className="hover:text-white">Terms</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Pilgrim&apos;s Memoirs. All rights reserved.</p>
          <p>Built with love for the Christian community.</p>
        </div>
      </div>
    </footer>
  );
}
