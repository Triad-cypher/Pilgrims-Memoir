import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function toHtml(text: string): string {
  return text
    .split("\n\n")
    .map((p) => `<p>${p.replace(/\n/g, "<br/>")}</p>`)
    .join("");
}

async function main() {
  console.log("Seeding database...");

  await prisma.comment.deleteMany();
  await prisma.resource.deleteMany();
  await prisma.media.deleteMany();
  await prisma.admin.deleteMany();

  const adminEmail = process.env.ADMIN_EMAIL ?? "joel@pilgrimsmemoir.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "ChangeMe123!";
  const admin = await prisma.admin.create({
    data: {
      name: process.env.ADMIN_NAME ?? "Joel Kimari",
      email: adminEmail,
      passwordHash: await bcrypt.hash(adminPassword, 10),
      avatarUrl: "/images/figma/admin-avatar.png",
    },
  });
  console.log(`Created admin: ${admin.email}`);

  const books = [
    {
      type: "BOOK",
      title: "Born of God",
      slug: "born-of-god",
      category: "Book",
      issueNumber: null,
      featured: true,
      status: "PUBLISHED",
      views: 4200,
      coverImageUrl: "/images/figma/cover-born-of-god.png",
      excerpt:
        "From the error in Eden, the pause at Sinai, the conquest at Calvary, to the joys of the Celestial City.",
      tags: "Salvation,Theology,Foundations",
      body: `This book introduces the foundational Christian teachings on God's plan for man's salvation from sin, death, and the devil. It courses through four main themes in the Bible: The error at Eden; the redemption packaging at Sinai; the inauguration of salvation by the Cross of Jesus Christ at Calvary; and finally the believer's eternal settlement in the Celestial City.

Key subjects in the book include the three expressions of salvation, the seven substitutions that took place at the cross of Jesus Christ, the twelve infallible witnesses of His Eternal Victory over sin, death, and the devil, among others.

The book will prove resourceful to the unbeliever, to bring him to the place of accepting Jesus Christ as their Lord and Savior, and to the believer, to ignite his pursuit for God that cannot be quenched and ground him in the eternal truths regarding his identity in Christ Jesus.`,
    },
    {
      type: "BOOK",
      title: "The Great Transition",
      slug: "the-great-transition",
      category: "Category",
      issueNumber: "002",
      featured: false,
      status: "PUBLISHED",
      views: 2500,
      coverImageUrl: "/images/figma/cover-great-transition.png",
      excerpt: "Embracing the shift into the Newness of Life.",
      tags: "Freedom,Identity,Growth",
      body: `Embracing the shift into the Newness of Life: Four Principles from Israel's Transition to the Promised Land.

Israel's journey from the wilderness into Canaan is a picture of the believer's own transition from promise to reality. This short study walks through four principles drawn from that crossing — leaving behind the manna of the past, stepping into the Jordan by faith, the significance of the memorial stones, and possessing the land one step at a time.

It is written for anyone standing at the edge of a new season, unsure of how to walk into what God has already promised.`,
    },
    {
      type: "BOOK",
      title: "The Cross of Jesus Christ",
      slug: "the-cross-of-jesus-christ",
      category: "Category",
      issueNumber: "003",
      featured: false,
      status: "PUBLISHED",
      views: 2000,
      coverImageUrl: "/images/figma/cover-cross-of-jesus-christ.png",
      excerpt: "The symbolism and significance of His cross.",
      tags: "Cross,Redemption,Symbolism",
      body: `The cross is the central symbol of the Christian faith, yet its full significance is often reduced to a piece of jewelry or wall art. This booklet unpacks the symbolism and significance of the cross of Jesus Christ — as an instrument of shame turned into the highest expression of love, as the meeting place of justice and mercy, and as the believer's continual place of death to self.

Written simply and devotionally, it is a short but weighty companion for anyone wanting to look again, freshly, at what happened at Calvary.`,
    },
    {
      type: "BOOK",
      title: "A Perfect and Excellent Life",
      slug: "a-perfect-and-excellent-life",
      category: "Category",
      issueNumber: "001",
      featured: false,
      status: "DRAFT",
      views: 500,
      coverImageUrl: "/images/figma/cover-perfect-excellent-life.png",
      excerpt: "The seven expressions of a perfect and excellent life.",
      tags: "Christian Living,Excellence,Character",
      body: `Issue 001, free copy. What does it mean to live a life that God Himself would call perfect and excellent? This booklet walks through seven scriptural expressions of such a life — from a renewed mind, to a disciplined tongue, to a heart postured in gratitude.

It is offered freely, in the hope that it will sharpen your pursuit of a life fully surrendered to God.`,
    },
  ];

  const devotionals = [
    {
      title: "Lifted Up On Eagles' Wings",
      slug: "january-2026-lifted-up-on-eagles-wings",
      month: "January 2026",
      accentColor: "#241f1c",
      coverImageUrl: "/images/figma/devotional-january.png",
      body: `You have seen what I did to the Egyptians, and how I carried you on eagles' wings, and brought you to Myself. [Exo. 19: 4 (NKJV)]

You are my hiding place; You shall preserve me from trouble; You shall surround me with songs of deliverance. [Psa. 32: 7 (NKJV)]

Abide in Me, and I in you. As the branch cannot bear fruit of itself, unless it abides in the vine, neither can you, unless you abide in Me. [John 15: 4 (NKJV)]`,
      anchorTitle: "January 2026: Lifted Up On Eagles' Wings",
      excerpt: "You have seen what I did to the Egyptians, and how I carried you on eagles' wings.",
    },
    {
      title: "Whom Shall I Fear",
      slug: "february-2026-whom-shall-i-fear",
      month: "February 2026",
      accentColor: "#006C9A",
      body: `The Lord is my light and my salvation; Whom shall I fear? The Lord is the strength of my life; Of whom shall I be afraid? [Psa. 27: 1 (NKJV)]

The Lord favors those who fear and worship Him (with awe-inspired reverence and obedience), those who wait for His mercy and lovingkindness. [Psa. 147: 11 (AMP)]

The light shines in the darkness, and the darkness can never extinguish it. [John 1: 5 (NLT)]`,
      anchorTitle: "February 2026: Whom Shall I Fear",
      excerpt: "The Lord is my light and my salvation; whom shall I fear?",
    },
    {
      title: "You Are My Hiding Place",
      slug: "march-2026-you-are-my-hiding-place",
      month: "March 2026",
      accentColor: "#1b4d34",
      body: `You are my hiding place; you will protect me from trouble and surround me with songs of deliverance. [Psa. 32: 7 (NLT)]

1). God's protection is not always the absence of trouble, but His presence within it. To hide in Him is to trust His covering even while the trouble is still visible around you.

2). Songs of deliverance are given before the deliverance is complete — praise in advance is a mark of confident faith.`,
      anchorTitle: "March 2026: You Are My Hiding Place",
      excerpt: "You are my hiding place; you will protect me from trouble.",
    },
    {
      title: "Complete In Him",
      slug: "april-2026-complete-in-him",
      month: "April 2026",
      accentColor: "#1f5f73",
      body: `And you are complete in Him, who is the head of all principality and power. [Col. 2: 10 (NKJV)]

1). Completeness in Christ is a present-tense reality, not a future achievement. You are not becoming complete — you already are, in Him.

2). This truth frees us from the exhausting labor of trying to earn what has already been freely given.`,
      anchorTitle: "April 2026: Complete In Him",
      excerpt: "And you are complete in Him, who is the head of all principality and power.",
    },
    {
      title: "The God Who Sees",
      slug: "may-2026-the-god-who-sees",
      month: "May 2026",
      accentColor: "#5c1010",
      body: `Then she called the name of the LORD who spoke to her, You-Are-the-God-Who-Sees; for she said, Have I also here seen Him who sees me? [Gen. 16: 13 (NKJV)]

1). Hagar's declaration was made in a wilderness, alone and afraid. Yet it is there that God met her, named Himself to her, and gave her a promise.

2). No wilderness season is hidden from Him. The God who sees you in your lowest place is already working out your deliverance.`,
      anchorTitle: "May 2026: The God Who Sees",
      excerpt: "You-Are-the-God-Who-Sees; for she said, have I also here seen Him who sees me?",
    },
    {
      title: "The Faith That Creates and Possesses Things",
      slug: "june-2026-the-faith-that-creates-and-possesses-things",
      month: "June 2026",
      accentColor: "#014421",
      body: `The LORD is my strength and my shield; My heart trusted in Him, and I am helped; Therefore my heart greatly rejoices, And with my song I will praise Him. [Psa. 28: 7 (NKJV)]

Complete whatever may be imperfect and lacking in your faith. [1 Thes. 3: 10b (AMP)]

By faith we understand that the worlds were framed by the word of God, so that the things which are seen were not made of things which are visible. [Heb. 11: 3 (NKJV)]`,
      anchorTitle: "June 2026: The Faith That Creates and Possesses Things",
      excerpt: "By faith we understand that the worlds were framed by the word of God.",
    },
    {
      title: "Divine Strategies Facilitate the Fulfillment of Prophetic Words",
      slug: "july-2026-divine-strategies-facilitate-the-fulfillment-of-prophetic-words",
      month: "July 2026",
      accentColor: "#440001",
      featured: true,
      body: `1). The rise of Joseph to kingship was not the work of a political strategist but of God. A prison house is one of the most unlikely of places to produce a prince.

2). The series of events that followed after he received the prophetic word through his dreams can naturally be translated to mean that he was drifting from its realization.

3). In reality, he was moving forward because God was executing a divine strategy. The shortest route for Joseph to enter the palace was through the prison.

4). He was not aware of this at the beginning, and he could easily have given up. Naturally, we do not possess the ability to interpret divine strategies.

5). Every prophetic word or promise from God depends on a divine strategy to come to pass. Human strategies cannot produce the results that God desires.

6). Our responsibility is to align with His Word, His strategies, and His timings. Even when we do not know how He will do it, we must maintain our trust in Him.

7). Whether we can access the divine strategy or not, our security is in knowing that He is with us and has the intention of fulfilling every promise. Hallelujah.`,
      anchorTitle: "July 2026: Divine Strategies Facilitate the Fulfillment of Prophetic Words",
      excerpt: "So now it was not you who sent me here, but God; and He has made me a father to Pharaoh. [Gen. 45:8 (NKJV)]",
    },
  ];

  const articles = [
    {
      title: "Walking in the Spirit, Not the Flesh",
      slug: "walking-in-the-spirit-not-the-flesh",
      category: "Discipleship",
      excerpt: "What it practically means to be led by the Spirit each day.",
      body: `To walk in the Spirit is not a mystical experience reserved for the especially devout — it is a daily, moment-by-moment yielding of the will to God. Paul contrasts it sharply with walking in the flesh, because the two are opposing directions, not complementary options.

Practically, this looks like choosing patience when the flesh wants to react, choosing truth when the flesh wants to protect an image, and choosing dependence when the flesh wants to control the outcome.

The Spirit-led life is not the absence of temptation, but the presence of a Guide who is stronger than the pull of the flesh — if we will simply follow.`,
    },
    {
      title: "The Danger of a Divided Heart",
      slug: "the-danger-of-a-divided-heart",
      category: "Faith",
      excerpt: "Why half-hearted devotion cannot sustain the Christian walk.",
      body: `A double-minded man is unstable in all his ways, James tells us. A divided heart does not simply slow spiritual growth — it undermines it at the root, because faith itself requires a single-minded fixing of trust on God.

Compromise rarely announces itself. It creeps in through small accommodations: a little more of the world's approval here, a little less obedience there, until the heart is split between two masters.

The remedy is not more effort but a fresh, total surrender — asking God, quite literally, to unite the heart to fear His name.`,
    },
    {
      title: "Kingdom Economics: Giving as Worship",
      slug: "kingdom-economics-giving-as-worship",
      category: "Stewardship",
      excerpt: "Rethinking generosity as an act of worship, not obligation.",
      body: `Much teaching on giving reduces it to either guilt-driven obligation or transactional seed-sowing. Scripture presents something richer: giving as an act of worship, flowing from a heart that has already surrendered everything to God.

When the early church gave, it was described as an overflow of grace, not a demand of law. Their giving met real needs and, at the same time, was itself an offering pleasing to God.

Reframing giving as worship changes the question from "how little can I give" to "what does worship look like with what I have been given."`,
    },
    {
      title: "Raw Truth for a Compromising Age",
      slug: "raw-truth-for-a-compromising-age",
      category: "Culture",
      excerpt: "Bypassing superficial motivation to confront cultural deception.",
      body: `Every generation is tempted to soften the gospel to fit its cultural moment. Ours is no exception. The pressure to trade conviction for comfort is constant, subtle, and often dressed up as kindness.

But love without truth is sentimentality, and truth without love is cruelty. The narrow road has always required both — a refusal to compromise conviction, held together with a genuine love for people.

This piece is an invitation to examine where cultural comfort may have quietly replaced scriptural conviction in our own thinking.`,
    },
    {
      title: "The Discipline of Silence Before God",
      slug: "the-discipline-of-silence-before-god",
      category: "Prayer",
      excerpt: "Learning to be still and know that He is God.",
      body: `Modern life is loud, and modern prayer often inherits that noise — a rapid list of requests offered without pause. Scripture, however, repeatedly commends silence: "Be still, and know that I am God."

Silence before God is not empty space; it is an active posture of listening, trust, and surrender. It says, in effect, "I do not need to fill every moment with my own words to be heard."

Cultivating even a few minutes of unhurried silence each day can recalibrate a prayer life that has become transactional back into one that is relational.`,
    },
    {
      title: "Identity in Christ: Who Does God Say You Are?",
      slug: "identity-in-christ-who-does-god-say-you-are",
      category: "Theology",
      excerpt: "Grounding your sense of self in what scripture declares.",
      body: `In an age of curated identities, the question "who am I" is answered a thousand different ways by a thousand different voices. Scripture offers a different starting point entirely: identity is not built, it is received.

To be in Christ is to be forgiven, adopted, sealed, and seated — not because of performance, but because of union with Him. These are not aspirational titles; they are present-tense facts for the believer.

Grounding identity here, rather than in achievement or approval, is what allows the Christian to walk in a stability that circumstances cannot shake.`,
    },
  ];

  const createdBooks: Record<string, string> = {};
  for (const book of books) {
    const created = await prisma.resource.create({ data: { ...book, body: toHtml(book.body) } as never });
    createdBooks[book.slug] = created.id;
  }

  for (const d of devotionals) {
    await prisma.resource.create({
      data: {
        type: "DEVOTIONAL",
        title: d.anchorTitle,
        slug: d.slug,
        category: "Devotional",
        excerpt: d.excerpt,
        body: toHtml(d.body),
        accentColor: d.accentColor,
        featured: Boolean((d as { featured?: boolean }).featured),
        status: "PUBLISHED",
        views: 500 + Math.floor(Math.random() * 2000),
        publishAt: new Date(`${d.month} 1, 2026`),
      },
    });
  }

  const createdArticles: Record<string, string> = {};
  for (const a of articles) {
    const created = await prisma.resource.create({
      data: {
        type: "ARTICLE",
        title: a.title,
        slug: a.slug,
        category: a.category,
        excerpt: a.excerpt,
        body: toHtml(a.body),
        status: "PUBLISHED",
        views: 300 + Math.floor(Math.random() * 1500),
      },
    });
    createdArticles[a.slug] = created.id;
  }

  const greatTransitionId = createdBooks["the-great-transition"];
  const perfectLifeId = createdBooks["a-perfect-and-excellent-life"];
  const crossId = createdBooks["the-cross-of-jesus-christ"];

  await prisma.comment.createMany({
    data: [
      {
        resourceId: greatTransitionId,
        commenterName: "Deborah Mwangi",
        commenterEmail: "deborah.mwangi@gmail.com",
        body: "This chapter really helped me understand the shift from promise to reality in my own walk.",
        status: "APPROVED",
        createdAt: new Date("2026-10-24T10:00:00Z"),
      },
      {
        resourceId: perfectLifeId,
        commenterName: "Andrew Foster",
        commenterEmail: "foster.andrew@outlook.com",
        body: "Quick correction needed in paragraph 3 of the article: the quotation is from Galatians 5, not Ephesians 5.",
        status: "PENDING",
        createdAt: new Date("2026-10-23T16:15:00Z"),
      },
      {
        resourceId: greatTransitionId,
        commenterName: "Esther Alao",
        commenterEmail: "esther.alao@yahoo.com",
        body: "Is there a printable version of this available? Would love to share it with my small group.",
        status: "APPROVED",
        createdAt: new Date("2026-10-22T09:30:00Z"),
      },
      {
        resourceId: crossId,
        commenterName: "Jonathan Vance",
        commenterEmail: "jvance@mailinator.com",
        body: "Buy crypto now!! Limited time offer, click the link in my profile for guaranteed returns...",
        status: "REJECTED",
        createdAt: new Date("2026-10-20T14:00:00Z"),
      },
      {
        resourceId: greatTransitionId,
        commenterName: "Patience Khumalo",
        commenterEmail: "patience.khumalo@gmail.com",
        body: "Thank you so much for this teaching, Pastor Joel. God bless you.",
        status: "APPROVED",
        createdAt: new Date("2026-10-18T18:45:00Z"),
      },
    ],
  });

  await prisma.media.createMany({
    data: [
      {
        filename: "hero-bg.png",
        url: "/images/figma/hero-bg.png",
        mimeType: "image/png",
        width: 1500,
        height: 984,
        sizeBytes: 1560290,
        usedIn: "Home — hero background",
      },
      {
        filename: "author-photo.png",
        url: "/images/figma/author-photo.png",
        mimeType: "image/png",
        width: 2731,
        height: 4096,
        sizeBytes: 3891370,
        usedIn: "Home — About the Author",
      },
      {
        filename: "banner-image.png",
        url: "/images/figma/banner-image.png",
        mimeType: "image/png",
        width: 853,
        height: 1280,
        sizeBytes: 2053263,
        usedIn: "Home — feature banner",
      },
      {
        filename: "contact-image.png",
        url: "/images/figma/contact-image.png",
        mimeType: "image/png",
        width: 1024,
        height: 1024,
        sizeBytes: 1579941,
        usedIn: "Contact page",
      },
      {
        filename: "cover-born-of-god.png",
        url: "/images/figma/cover-born-of-god.png",
        mimeType: "image/png",
        width: 1667,
        height: 2567,
        sizeBytes: 4285708,
        usedIn: "Born of God — cover",
      },
      {
        filename: "cover-great-transition.png",
        url: "/images/figma/cover-great-transition.png",
        mimeType: "image/png",
        width: 1240,
        height: 1748,
        sizeBytes: 1344605,
        usedIn: "The Great Transition — cover",
      },
      {
        filename: "cover-cross-of-jesus-christ.png",
        url: "/images/figma/cover-cross-of-jesus-christ.png",
        mimeType: "image/png",
        width: 1240,
        height: 1748,
        sizeBytes: 1022160,
        usedIn: "The Cross of Jesus Christ — cover",
      },
      {
        filename: "cover-perfect-excellent-life.png",
        url: "/images/figma/cover-perfect-excellent-life.png",
        mimeType: "image/png",
        width: 2447,
        height: 3263,
        sizeBytes: 631226,
        usedIn: "A Perfect and Excellent Life — cover",
      },
      {
        filename: "devotional-january.png",
        url: "/images/figma/devotional-january.png",
        mimeType: "image/png",
        width: 512,
        height: 383,
        sizeBytes: 326356,
        usedIn: "January 2026 devotional",
      },
      {
        filename: "devotional-february.png",
        url: "/images/figma/devotional-february.png",
        mimeType: "image/png",
        width: 999,
        height: 1024,
        sizeBytes: 949940,
        usedIn: "February 2026 devotional",
      },
      {
        filename: "devotional-june.png",
        url: "/images/figma/devotional-june.png",
        mimeType: "image/png",
        width: 1600,
        height: 922,
        sizeBytes: 385862,
        usedIn: "June 2026 devotional",
      },
      {
        filename: "devotional-july.png",
        url: "/images/figma/devotional-july.png",
        mimeType: "image/png",
        width: 1600,
        height: 1027,
        sizeBytes: 403830,
        usedIn: "July 2026 devotional",
      },
      {
        filename: "admin-avatar.png",
        url: "/images/figma/admin-avatar.png",
        mimeType: "image/png",
        width: 1024,
        height: 1024,
        sizeBytes: 1354716,
        usedIn: "Admin profile photo",
      },
    ],
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
