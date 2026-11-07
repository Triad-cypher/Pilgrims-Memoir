// Upright, border-trimmed copies of the CMS cover art (the uploaded covers sit on a grey canvas,
// which doesn't work on a 3D book). Books not listed here fall back to their CMS cover image.
const TRIMMED_COVERS = new Set([
  "issue-1-a-perfect-and-excellent-life",
  "issue-2-the-great-transition",
  "issue-3-the-cross-of-jesus-christ",
]);

export const BOOK_THEMES = [
  { bg: "radial-gradient(circle at 50% 40%, #DCE2EE, #C5CEE0 70%)", spine: "#0B1B33", dot: "#2B4C8C" },
  { bg: "radial-gradient(circle at 50% 40%, #DCEBD6, #C9DDC2 70%)", spine: "#16261B", dot: "#1E7A43" },
  { bg: "radial-gradient(circle at 50% 40%, #F6E7C9, #E9DDC3 70%)", spine: "#3A1F0E", dot: "#B4532A" },
];

export function bookCover(book: { slug: string; coverImageUrl: string | null }) {
  if (TRIMMED_COVERS.has(book.slug)) return `/images/covers/${book.slug}.jpg`;
  return book.coverImageUrl;
}

/** "Issue 2: The Great Transition" → 2 */
export function bookIssueNumber(book: { title: string; issueNumber: string | null }) {
  const n = Number(book.issueNumber ?? book.title.match(/^Issue\s+(\d+)/i)?.[1]);
  return Number.isFinite(n) && n > 0 ? n : null;
}

/** Colour theme for a book card, keyed by issue number (falls back to list position). */
export function bookTheme(issue: number | null, index = 0) {
  return BOOK_THEMES[((issue ?? index + 1) - 1) % BOOK_THEMES.length];
}
