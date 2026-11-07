import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Book3D } from "./Book3D";

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
    <Book3D
      src={book.src}
      alt={book.alt}
      width={width}
      height={height}
      depth={depth}
      spine={book.spine}
      className={spinClass}
      priority
    />
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
        className="relative -mt-[76px] flex min-h-[min(100svh,780px)] flex-col items-center overflow-hidden px-5 pt-[120px] pb-28 font-geist md:pb-16 text-[#0F1A14] sm:px-[clamp(20px,4vw,48px)]"
        style={{ background: "linear-gradient(180deg, #DCE8DC 0%, #EEF0E4 45%, #F4EFE0 70%, #F5F6F0 100%)" }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-[187px] left-1/2 h-[765px] w-[765px] -translate-x-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255,236,190,.85) 0%, rgba(255,236,190,.35) 35%, rgba(255,236,190,0) 65%)",
          }}
        />

        <svg
          aria-hidden="true"
          viewBox="0 0 1440 420"
          preserveAspectRatio="none"
          className="pointer-events-none absolute bottom-0 left-0 h-[340px] w-full"
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

        <div className="hero-parallax relative z-[1] flex flex-col items-center gap-4 text-center">
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
              <span className="text-[clamp(19px,2vw,29px)] font-medium tracking-[-0.02em] text-[#234A33]">
                {lead}
              </span>
            )}
            <span className="font-quote text-[clamp(99px,min(19vw,40svh),289px)] leading-[0.82] tracking-[-0.035em] text-[#0F3B26]">
              {word}
            </span>
          </h1>
        </div>

        <div className="relative z-[2] mt-8 grid w-full max-w-[1312px] grid-cols-1 items-end gap-6 md:grid-cols-2 lg:mt-[clamp(-128px,-7.65vw,-34px)] lg:flex lg:justify-between">
          <div className="flex max-w-[348px] flex-col gap-4 pb-2.5 max-md:mx-auto max-md:items-center md:order-2 lg:order-none lg:flex-[1_1_200px]">
            <p className="m-0 text-[16px] leading-[1.55] text-pretty text-[#233128] max-md:text-justify max-md:[text-align-last:center]">{tagline}</p>
            <div className="flex flex-wrap gap-2.5 max-md:justify-center">
              <Link
                href="/books"
                className="hero-btn inline-flex min-h-11 items-center gap-2.5 rounded-full bg-[#0F1A14] py-1 pr-1 pl-[19px] text-[15px] font-medium text-[#F5F6F0]"
              >
                {ctaLabel}
                <span className="arr grid h-[34px] w-[34px] place-items-center rounded-full bg-[#E7D9A8] text-[#0F1A14]">
                  <ArrowUpRight size={14} />
                </span>
              </Link>
            </div>
          </div>

          <div className="book-scene relative flex h-[400px] w-full justify-center max-sm:-my-10 max-sm:scale-[0.8] md:order-1 md:col-span-2 lg:order-none lg:flex-[0_1_476px]">
            <div
              aria-hidden="true"
              className="absolute bottom-[15px] left-1/2 h-[37px] w-[357px] max-w-[90%] -translate-x-1/2 rounded-full blur-[6px]"
              style={{ background: "radial-gradient(ellipse, rgba(10,40,20,.45), rgba(10,40,20,0) 70%)" }}
            />
            <div
              className="p3d absolute top-[60px] left-1/2"
              style={{ transform: "translateX(-108%) translateZ(-136px) rotateZ(-6deg)" }}
            >
              <div className="float-b p3d">
                <Book book={LEFT_BOOK} width={162} height={238} depth={22} spinClass="spin-b" />
              </div>
            </div>
            <div
              className="p3d absolute top-[60px] left-1/2"
              style={{ transform: "translateX(8%) translateZ(-136px) rotateZ(6deg)" }}
            >
              <div className="float-b p3d" style={{ animationDelay: "-5s" }}>
                <Book book={RIGHT_BOOK} width={162} height={238} depth={22} spinClass="spin-c" />
              </div>
            </div>
            <div className="p3d absolute top-2 left-1/2" style={{ transform: "translateX(-50%) translateZ(51px)" }}>
              <div className="float p3d">
                <Book book={CENTER_BOOK} width={212} height={306} depth={29} spinClass="spin" />
              </div>
            </div>
          </div>

          <figure className="glass m-0 flex max-w-[306px] flex-col gap-3 rounded-[24px] px-[22px] py-5 max-sm:max-w-none md:order-3 md:justify-self-end lg:order-none lg:flex-[1_1_200px]">
            <svg width="24" height="19" viewBox="0 0 28 22" fill="none" aria-hidden="true">
              <path
                d="M0 22V13C0 5.8 3.6 1.5 10.4 0l1.2 2.6C8 4 6.3 6.4 6 10h5v12H0zm16 0V13c0-7.2 3.6-11.5 10.4-13l1.2 2.6C24 4 22.3 6.4 22 10h5v12H16z"
                fill="#1E7A43"
              />
            </svg>
            <blockquote className="m-0 font-quote text-[22px] leading-[1.2] text-pretty text-[#0F1A14]">
              {verseText}
            </blockquote>
            {cite && (
              <figcaption className="text-[12px] font-medium tracking-[0.06em] text-[#3E4A43] uppercase">
                {cite}
              </figcaption>
            )}
          </figure>
        </div>
      </section>

      {marqueeItems.length > 0 && (
        <div className="relative z-[3] -mt-[34px] -mb-12 overflow-hidden pt-6 pb-12">
        <div
          aria-label="What you will find"
          className="relative -mx-5 overflow-hidden bg-[#0F3B26] py-[22px] text-[#F5F6F0] shadow-[0_20px_40px_-24px_rgba(15,59,38,.6)]"
          style={{ transform: "rotate(-1.2deg)" }}
        >
          <div className="marquee flex w-max items-center gap-10 pl-10 font-quote text-[clamp(24px,2.7vw,37px)] whitespace-nowrap italic">
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
        </div>
      )}
    </>
  );
}
