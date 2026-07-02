import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { NewsletterForm } from "@/components/NewsletterForm";

type CaptureBandProps = {
  /** Attribution for /api/subscribe (e.g. "home-midscroll", "about", "chapter"). */
  source: string;
  heading?: string;
  copy?: string;
};

/**
 * Mid-scroll email capture surface. One consistent editorial band reused on
 * content pages (home, about, chapters, resources, 404) so capture exists on
 * more than the footer without inventing a new form per page. Hides itself
 * for visitors who already subscribed on this device (the footer form stays
 * visible everywhere as the durable fallback).
 */
export function CaptureBand({
  source,
  heading = "The letters behind the book.",
  copy = "One welcome note, then the occasional letter on pricing, craft, and the business nobody taught you. Free chapter included. No spam, ever."
}: CaptureBandProps) {
  return (
    <ScrollReveal>
      <section aria-label="Newsletter signup" className="mx-auto w-full max-w-4xl px-5 py-10 md:px-6 md:py-14">
        <NewsletterForm source={source} heading={heading} copy={copy} hideWhenSubscribed />
      </section>
    </ScrollReveal>
  );
}
