import { pageMetadata } from "@/lib/seo";
import { bookJsonLd, productJsonLd } from "@/lib/schema";
import { PageHero } from "@/components/design/PageHero";
import { Section } from "@/components/design/Section";
import { PricingCard } from "@/components/PricingCard";
import { ChapterPathway } from "@/components/motion/ChapterPathway";
import { ScrollScrubVideo } from "@/components/motion/ScrollScrubVideo";
import Image from "next/image";
import { priceConfig } from "@/content/book";
import { getLaunchStateCopy } from "@/config/launchState";

/* The hair story, told by scroll: the camera moves through the dark toward
   the light the way the book moves a stylist through the business. */
const scrubStages = [
  { kicker: "Where you start", line: "Talent in the dark.", detail: "The skill is real. The path was never lit." },
  { kicker: "Where the chapters take you", line: "One strand at a time.", detail: "Pricing, rooms, sets, rhythm — the knots come loose in order." },
  { kicker: "Where you end up", line: "The light was always yours.", detail: "Not louder. Not luckier. Just finally working with the lights on." }
] as const;

export const metadata = pageMetadata("Book", "Pricing, chapters, and the protected delivery path for Curls & Contemplation.", { path: "/book", image: "/gateway-cover.jpg" });

export default function Page() {
  const launch = getLaunchStateCopy();
  return <main><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([bookJsonLd(), productJsonLd()]) }} /><PageHero eyebrow="Book" title="A map for the parts of this job nobody photographs." description="Creative identity, client experience, business rhythm, and the sustainability to keep doing this for years — without the fake promises or the countdown-timer urgency." primaryHref={launch.heroCta.href} primaryLabel={launch.heroCta.label} secondaryHref="/free-chapter" secondaryLabel="Read Chapter 1 Free"><Image src="/gateway-cover.jpg" alt="Curls & Contemplation — cover" width={800} height={1200} className="mx-auto w-full max-w-xs rounded-lg shadow-gold" /></PageHero><ScrollScrubVideo src="/curl-scrub.mp4" webmSrc="/curl-scrub.webm" poster="/curl-poster.jpg" trackVh={260} stages={scrubStages.map(({ kicker, line, detail }) => (
    <div key={line} className="max-w-3xl">
      <p className="editorial-kicker mb-4">{kicker}</p>
      <p className="hero-display font-display text-4xl leading-tight text-white md:text-6xl">{line}</p>
      <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-whitegold/80 md:text-lg">{detail}</p>
    </div>
  ))} /><Section eyebrow="Inside the book" title="Four parts, one calmer path."><ChapterPathway /><div className="mt-10"><PricingCard /></div><p className="mt-5 text-sm text-whitegold/70">Kindle (${priceConfig.kindleExternal.amount.toFixed(2)}) and paperback (${priceConfig.paperbackExternal.amount.toFixed(2)}) editions follow through their own stores.</p></Section></main>;
}
