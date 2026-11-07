import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface HeroBook {
  src: string;
  alt: string;
  spine: string;
}

const LEFT_BOOK: HeroBook = {
  src: "/images/hero/perfect-excellent-life.jpg",
  alt: "Cover of Issue 1: A Perfect and Excellent Life",
  spine: "#0B1B33",
};
const CENTER_BOOK: HeroBook = {
  src: "/images/hero/great-transition.jpg",
  alt: "Cover of Issue 2: The Great Transition",
  spine: "#16261B",
};
const RIGHT_BOOK: HeroBook = {
  src: "/images/hero/cross-of-jesus-christ.jpg",
  alt: "Cover of Issue 3: The Cross of Jesus Christ",
  spine: "#3A1F0E",
};

function Book({
  book,
  width,
  height,
  depth,
  spinClass,
}: {
  book: HeroBook;
  width: number;
  height: number;
  depth: number;
  spinClass: string;
}) {
  return (
    <div
      className={`book ${spinClass}`}
      style={{ "--w": `${width}px`, "--h": `${height}px`, "--d": `${depth}px`, "--sp": book.spine } as React.CSSProperties}
    >
      <div className="bk-f">
        <Image src={book.src} alt={book.alt} fill sizes={`${width}px`} priority className="object-cover" />
      </div>
      <div className="bk-s" />
      <div className="bk-p" />
      <div className="bk-b" />
    </div>
  );
}

/** Splits "A Pilgrim's Memoirs" into a small lead line and the giant last word. */
function splitTitle(title: string) {
  const words = title.trim().split(/\s+/);
  const word = words.pop() ?? "";
  return { lead: words.join(" "), word };
}

/** Splits "Verse text. [Heb. 11: 1 (NKJV)]" into the verse and its citation. */
function splitVerse(verse: string) {
  const match = verse.match(/^([\s\S]*?)\s*\[([^\]]+)\]\s*$/);
  if (!match) return { text: verse, cite: "" };
  return { text: match[1], cite: match[2].replace(/:\s+/g, ":") };
}

export function HomeHero({
  tag,
  title,
  tagline,
  ctaLabel,
  verse,
  marqueeItems,
}: {
  tag: string;
  title: string;
  tagline: string;
  ctaLabel: string;
  verse: string;
  marqueeItems: string[];
}) {
  const { lead, word } = splitTitle(title);
  const { text: verseText, cite } = splitVerse(verse);

  return (
    <>
      <section
        aria-label="Welcome"
        className="relative -mt-[76px] flex min-h-[min(100svh,760px)] flex-col items-center overflow-hidden px-5 pt-[112px] pb-28 font-geist md:pb-20 text-[#0F1A14] sm:px-[clamp(20px,4vw,48px)]"
        style={{ background: "linear-gradient(180deg, #DCE8DC 0%, #EEF0E4 45%, #F4EFE0 70%, #F5F6F0 100%)" }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-[165px] left-1/2 h-[680px] w-[680px] -translate-x-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255,236,190,.85) 0%, rgba(255,236,190,.35) 35%, rgba(255,236,190,0) 65%)",
          }}
        />

        <svg
          aria-hidden="true"
          viewBox="0 0 1440 420"
          preserveAspectRatio="none"
          className="pointer-events-none absolute bottom-0 left-0 h-[300px] w-full"
        >
          <path d="M0 350 C 320 300 700 370 1000 340 S 1320 320 1440 340 L1440 420 L0 420Z" fill="#2E6A3F" />
          <g fill="#FFFFFF" opacity=".9">
            <circle cx="90" cy="372" r="3" />
            <circle cx="180" cy="392" r="2.4" />
            <circle cx="260" cy="365" r="2" />
            <circle cx="340" cy="398" r="3" />
            <circle cx="1080" cy="380" r="3" />
            <circle cx="1170" cy="364" r="2.2" />
            <circle cx="1250" cy="395" r="2.8" />
            <circle cx="1350" cy="372" r="2" />
            <circle cx="1400" cy="400" r="2.6" />
            <circle cx="40" cy="404" r="2.2" />
          </g>
          <g fill="#E8C66A">
            <circle cx="90" cy="372" r="1.1" />
            <circle cx="340" cy="398" r="1.1" />
            <circle cx="1080" cy="380" r="1.1" />
            <circle cx="1250" cy="395" r="1" />
          </g>
        </svg>

        <div className="hero-parallax hero-fit relative z-[1] flex flex-col items-center gap-3.5 text-center">
          <p className="glass m-0 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[12px] font-medium tracking-[0.08em] text-[#234A33] uppercase">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M8 1v4M8 11v4M1 8h4M11 8h4M3.5 3.5l2 2M10.5 10.5l2 2M12.5 3.5l-2 2M5.5 10.5l-2 2"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
            {tag}
          </p>
          <h1 className="m-0 flex flex-col items-center font-normal">
            {lead && (
              <span className="text-[clamp(18px,1.8vw,26px)] font-medium tracking-[-0.02em] text-[#234A33]">
                {lead}
              </span>
            )}
            <span className="font-quote text-[clamp(88px,min(16.5vw,30svh),255px)] leading-[0.82] tracking-[-0.035em] text-[#0F3B26]">
              {word}
            </span>
          </h1>
        </div>

        <div className="hero-fit relative z-[2] mt-8 flex md:mt-[clamp(-112px,-6.75vw,-30px)] w-full max-w-[1312px] flex-wrap items-end justify-between gap-5">
          <div className="flex max-w-[330px] flex-[1_1_220px] flex-col gap-3.5 pb-2">
            <p className="m-0 text-[15px] leading-[1.55] text-pretty text-[#233128]">{tagline}</p>
            <div className="flex flex-wrap gap-2.5">
              <Link
                href="/books"
                className="hero-btn inline-flex min-h-11 items-center gap-2.5 rounded-full bg-[#0F1A14] py-1 pr-1 pl-[18px] text-[15px] font-medium text-[#F5F6F0]"
              >
                {ctaLabel}
                <span className="arr grid h-9 w-9 place-items-center rounded-full bg-[#E7D9A8] text-[#0F1A14]">
                  <ArrowUpRight size={14} />
                </span>
              </Link>
            </div>
          </div>

          <div className="book-scene relative flex h-[352px] w-full flex-[0_1_420px] justify-center max-sm:-my-6 max-sm:scale-[0.9]">
            <div
              aria-hidden="true"
              className="absolute bottom-[14px] left-1/2 h-8 w-[315px] max-w-[90%] -translate-x-1/2 rounded-full blur-[6px]"
              style={{ background: "radial-gradient(ellipse, rgba(10,40,20,.45), rgba(10,40,20,0) 70%)" }}
            />
            <div
              className="p3d absolute top-[52px] left-1/2"
              style={{ transform: "translateX(-108%) translateZ(-120px) rotateZ(-6deg)" }}
            >
              <div className="float-b p3d">
                <Book book={LEFT_BOOK} width={142} height={210} depth={20} spinClass="spin-b" />
              </div>
            </div>
            <div
              className="p3d absolute top-[52px] left-1/2"
              style={{ transform: "translateX(8%) translateZ(-120px) rotateZ(6deg)" }}
            >
              <div className="float-b p3d" style={{ animationDelay: "-5s" }}>
                <Book book={RIGHT_BOOK} width={142} height={210} depth={20} spinClass="spin-c" />
              </div>
            </div>
            <div className="p3d absolute top-2 left-1/2" style={{ transform: "translateX(-50%) translateZ(45px)" }}>
              <div className="float p3d">
                <Book book={CENTER_BOOK} width={188} height={270} depth={26} spinClass="spin" />
              </div>
            </div>
          </div>

          <figure className="glass m-0 flex max-w-[290px] flex-[1_1_220px] max-sm:max-w-none flex-col gap-2.5 rounded-[22px] px-5 py-[18px]">
            <svg width="21" height="16" viewBox="0 0 28 22" fill="none" aria-hidden="true">
              <path
                d="M0 22V13C0 5.8 3.6 1.5 10.4 0l1.2 2.6C8 4 6.3 6.4 6 10h5v12H0zm16 0V13c0-7.2 3.6-11.5 10.4-13l1.2 2.6C24 4 22.3 6.4 22 10h5v12H16z"
                fill="#1E7A43"
              />
            </svg>
            <blockquote className="m-0 font-quote text-[20px] leading-[1.2] text-pretty text-[#0F1A14]">
              {verseText}
            </blockquote>
            {cite && (
              <figcaption className="text-[11px] font-medium tracking-[0.06em] text-[#3E4A43] uppercase">
                {cite}
              </figcaption>
            )}
          </figure>
        </div>
      </section>

      {marqueeItems.length > 0 && (
        <div
          aria-label="What you will find"
          className="relative z-[3] -mx-5 -mt-2.5 overflow-hidden bg-[#0F3B26] py-5 text-[#F5F6F0] shadow-[0_20px_40px_-24px_rgba(15,59,38,.6)]"
          style={{ transform: "rotate(-1.2deg)" }}
        >
          <div className="marquee flex w-max items-center gap-9 pl-9 font-quote text-[clamp(22px,2.4vw,33px)] whitespace-nowrap italic">
            {[0, 1].map((copy) =>
              marqueeItems.map((item) => (
                <span key={`${copy}-${item}`} aria-hidden={copy === 1 ? true : undefined} className="contents">
                  <span>{item}</span>
                  <span aria-hidden="true" className="text-[#E7D9A8] not-italic">
                    ✦
                  </span>
                </span>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
}
