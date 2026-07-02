import Link from "next/link";
import { MagneticCurlButton } from "@/components/motion/MagneticCurlButton";
import { NewsletterForm } from "@/components/NewsletterForm";

/**
 * Branded 404. Recovers the visit instead of dead-ending it: route the
 * visitor back into the funnel (free chapter, quiz, book) and offer the
 * letters so a mistyped URL still becomes a subscriber.
 */
export default function NotFound() {
  return (
    <main className="mx-auto w-full max-w-4xl px-5 py-20 text-center md:px-6 md:py-28">
      <p className="editorial-kicker mb-5">Page not found</p>
      <h1 className="hero-display font-display text-4xl leading-[0.95] text-white md:text-6xl">
        This page slipped the map. <span className="text-antique">You don&rsquo;t have to.</span>
      </h1>
      <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-whitegold/85">
        The link you followed doesn&rsquo;t exist (or moved). The good stuff is still here — start with the free chapter, or find your blind spot in two minutes.
      </p>
      <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <MagneticCurlButton href="/free-chapter">Read Chapter 1 Free</MagneticCurlButton>
        <MagneticCurlButton href="/quiz" variant="secondary">Take the Blind-Spot Quiz</MagneticCurlButton>
      </div>
      <p className="mt-6 text-sm text-whitegold/60">
        Or head back to <Link href="/" className="underline decoration-antique underline-offset-4">the homepage</Link> ·{" "}
        <Link href="/book" className="underline decoration-antique underline-offset-4">the book</Link> ·{" "}
        <Link href="/blog" className="underline decoration-antique underline-offset-4">the blog</Link>
      </p>
      <div className="mx-auto mt-12 max-w-xl text-left">
        <NewsletterForm source="404" heading="While you're here." copy="One welcome note, then the occasional letter on pricing, craft, and the business nobody taught you. No spam." hideWhenSubscribed />
      </div>
    </main>
  );
}
