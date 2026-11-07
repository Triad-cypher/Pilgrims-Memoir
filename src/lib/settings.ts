import { prisma } from "@/lib/prisma";

export const DEFAULT_SETTINGS = {
  heroTag: "WALKING THE JOURNEY OF FAITH",
  heroTitle: "A Pilgrim's Memoirs",
  heroCtaLabel: "Explore",
  heroVerseText: "Now faith is the substance of things hoped for, the evidence of things not seen. [Heb. 11: 1 (NKJV)]",
  heroImageUrl: "/images/figma/hero-bg.png",
  bannerImageUrl: "/images/figma/banner-image.png",
  contactImageUrl: "/images/figma/contact-image.png",
  authorImageUrl: "/images/figma/author-headshot.png",
  aboutTag: "AUTHOR",
  aboutTitle: "About The Author",
  aboutBody:
    "Praise the Lord.\n\nMy name is Joel Kimari, a believer in the Lord Jesus Christ, His lifestyle, and His teachings. By divine privilege, I have served as a youth leader in my local church and in my community, drawing timeless and indispensable lessons in my service to God and His people. Professionally, my interests are in governance, law, and public service.\n\nThrough writing, I count it a great honor to communicate the Wisdom and the Intelligence of God and transmit profound truths for the edification and the establishment of the saints of God in the faith. The writings contained herein are meant to convey the Light of God, the Love of God, and the Life of God. God bless you as you enjoy every piece. Shalom.\n\nFor our citizenship is in heaven... Phil 3:20 (NKJV)",
  authorName: "Joel Kimari",
  midTitle: "Bearing witness to his transforming power",
  midSubtitle: "Browse the collection below to find your next study resource.",
  booksReleasedCount: "4+",
  monthlyArticlesCount: "100+",
  bannerBody:
    "This is a non-fiction narrative that blends personal life reflection with the structure of a journey, often to a specific, significant, or sacred destination. It represents an inner transformation—emotional, spiritual, or psychological—mirrored by an outer, physical journey.\n\nBeloved, now we are children of God; and it has not yet been revealed what we shall be, but we know that when He is revealed, we shall be like Him, for we shall see Him as He is. [1 John 3: 2 (NKJV)]",
  bannerTags: "Spirit-Led Perspective, For the Christian Journey, Deep Scripture Studies, Resources for the Road",
  footerTagline: "Christian books, articles, and monthly devotionals to nourish your faith and encourage your walk with God.",
  contactEmail: "info@pilgrimsmemoir.com",
  contactPhone: "+254 711 290058",
  contactHeading: "Contact Us",
  contactSubheading: "Reach out Today",
} as const;

export type SettingsMap = typeof DEFAULT_SETTINGS;

export async function getSettings(): Promise<SettingsMap> {
  const rows = await prisma.siteSetting.findMany();
  const map = { ...DEFAULT_SETTINGS } as Record<string, string>;
  for (const row of rows) {
    map[row.key] = row.value;
  }
  return map as SettingsMap;
}

export async function updateSettings(values: Partial<SettingsMap>) {
  const entries = Object.entries(values);
  await prisma.$transaction(
    entries.map(([key, value]) =>
      prisma.siteSetting.upsert({
        where: { key },
        create: { id: key, key, value: String(value) },
        update: { value: String(value) },
      })
    )
  );
}
