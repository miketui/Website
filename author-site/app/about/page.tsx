import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/design/PageHero";
import { Section } from "@/components/design/Section";

export const metadata = pageMetadata("About", "About Michael David and the Curls & Contemplation project.", { path: "/about" });

export default function Page() {
  return <main><PageHero eyebrow="About Michael" title="A working creative, writing for working creatives." description="Michael David writes from lived hairstylist practice and the reality of building standards in rooms where every detail carries weight." primaryHref="/book" primaryLabel="Explore the Book" secondaryHref="/contact" secondaryLabel="Contact" /><Section eyebrow="The vantage point" title="Written from the chair, not the podium."><p className="max-w-3xl">Curls &amp; Contemplation comes out of Michael&rsquo;s own working practice — the pricing conversations, the set-day etiquette, the bookings that almost broke the calendar, and the quiet decisions that kept the work honest. You won&rsquo;t find borrowed authority here: no name-dropping, no manufactured praise. Just the freelance hairstylist&rsquo;s business, written down by someone living it.</p><p className="mt-4 max-w-3xl text-sm text-whitegold/70">That restraint is deliberate. Every claim on this site is one Michael can stand behind in person.</p></Section></main>;
}
