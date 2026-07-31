import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export default function PrivacyPage() {
  return (
    <div>
      <Header />
      <section className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
        <h1 className="font-display text-4xl font-bold text-ink">Privacy Policy</h1>
        <div className="mt-6 space-y-4 text-sm leading-relaxed text-ink-soft/80">
          <p>
            Pilgrim&apos;s Memoirs respects your privacy. Information submitted through our contact form or comments
            (such as your name and email) is used only to respond to you and to moderate community discussion — it
            is never sold or shared with third parties.
          </p>
          <p>
            We use minimal cookies required to keep you signed in to the administrative dashboard. We do not run
            third-party advertising trackers on this site.
          </p>
          <p>If you would like any information you&apos;ve submitted removed, please reach out via our Contact page.</p>
        </div>
      </section>
      <Footer />
    </div>
  );
}
