import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export default function TermsPage() {
  return (
    <div>
      <Header />
      <section className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
        <h1 className="font-display text-4xl font-bold text-ink">Terms of Use</h1>
        <div className="mt-6 space-y-4 text-sm leading-relaxed text-ink-soft/80">
          <p>
            The books, articles, and devotionals published on Pilgrim&apos;s Memoirs are provided for personal
            edification and study. Free copies may be shared as-is, in full, with attribution to the author.
          </p>
          <p>
            Comments are moderated and may be removed at our discretion, particularly spam, abusive language, or
            promotional content unrelated to the discussion.
          </p>
          <p>Content on this site is provided &ldquo;as is&rdquo; without warranty of any kind.</p>
        </div>
      </section>
      <Footer />
    </div>
  );
}
