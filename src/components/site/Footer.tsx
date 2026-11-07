import Link from "next/link";
import { ArrowUp } from "lucide-react";
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

const LINK_COLUMNS = [
  {
    title: "Explore",
    links: [
      { href: "/books", label: "Books" },
      { href: "/devotionals", label: "Devotionals" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/#about", label: "About" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
  },
];

const SOCIAL_CLASS =
  "grid h-11 w-11 place-items-center rounded-full border border-[#F5F6F0]/20 text-[#F5F6F0]/72 transition-colors";

export function Footer({ tagline }: { tagline?: string }) {
  return (
    <footer className="overflow-hidden rounded-t-[clamp(28px,3vw,44px)] bg-[#0B1510] px-5 pt-[clamp(56px,6vw,88px)] pb-8 font-geist text-[#F5F6F0] sm:px-[clamp(20px,4vw,48px)]">
      <BackToTop />
      <div className="mx-auto flex max-w-[1312px] flex-col gap-14">
        <div className="flex flex-wrap justify-between gap-12">
          <div className="flex max-w-[380px] flex-[1_1_300px] flex-col gap-[22px]">
            <p className="m-0 text-[18px] leading-[1.55] text-[#F5F6F0]/82">
              {tagline ??
                "Christian books, articles, and monthly devotionals to nourish your faith and encourage your walk with God."}
            </p>
            <div className="flex flex-wrap gap-2.5">
              {SOCIAL_LINKS.map(({ Icon, href, label }) =>
                href ? (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className={`${SOCIAL_CLASS} hover:text-white`}
                  >
                    <Icon className="h-[18px] w-[18px]" />
                  </a>
                ) : (
                  <span key={label} aria-label={label} className={SOCIAL_CLASS}>
                    <Icon className="h-[18px] w-[18px]" />
                  </span>
                )
              )}
            </div>
          </div>

          <div className="grid flex-[2_1_480px] grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-8">
            {LINK_COLUMNS.map((col) => (
              <div key={col.title} className="flex flex-col gap-3.5">
                <span className="text-[13px] font-medium tracking-[0.1em] text-[#E7D9A8] uppercase">{col.title}</span>
                {col.links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-[17px] text-[#F5F6F0]/72 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>

        <p
          aria-hidden="true"
          className="m-0 text-[clamp(44px,13.5vw,210px)] leading-[0.85] font-medium tracking-[-0.05em] whitespace-nowrap text-[#F5F6F0]"
        >
          Pilgrim&apos;s{" "}
          <span className="font-quote font-normal tracking-[-0.03em] text-[#E7D9A8] italic">Memoirs</span>
        </p>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#F5F6F0]/14 pt-6 text-[14px] text-[#F5F6F0]/70">
          <span>© {new Date().getFullYear()} Pilgrim&apos;s Memoirs. All rights reserved.</span>
          <span>Built with love for the Christian community.</span>
          <a
            href="#"
            aria-label="Back to top"
            className="hero-btn grid h-12 w-12 place-items-center rounded-full bg-[#F5F6F0] text-[#0B1510]"
          >
            <ArrowUp size={16} />
          </a>
        </div>
      </div>
    </footer>
  );
}
