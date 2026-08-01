import { pageMetadata } from "@/lib/seo";
import { bookJsonLd, productJsonLd } from "@/lib/schema";
import { PageHero } from "@/components/design/PageHero";
import { Section } from "@/components/design/Section";
import { PricingCard } from "@/components/PricingCard";
import { ScrollScrubVideo } from "@/components/motion/ScrollScrubVideo";
import Image from "next/image";
import { getLaunchStateCopy } from "@/config/launchState";

/**
 * Must resolve per request. `resolveLaunchOffer()` is time-derived whenever
 * NEXT_PUBLIC_LAUNCH_STATE is unset, so a static prerender freezes the price
 * at BUILD time: a build made before November 24 would keep showing $17.99
 * after the release instant while /api/checkout charges $19.99 — the exact
 * display-versus-charge mismatch this resolver exists to prevent. Same trap
 * that made /order force-dynamic (see tests/order-launch-transition.test.ts).
 */
export const dynamic = "force-dynamic";

/* The hair story, told by scroll: the camera moves through the dark toward
   the light the way the book moves a stylist through the business. */
const scrubStages = [
  { kicker: "Where you start", line: "Talent in the dark.", detail: "The skill is real. The path was never lit." },
  { kicker: "Where the chapters take you", line: "One strand at a time.", detail: "Pricing, rooms, sets, rhythm — the knots come loose in order." },
  { kicker: "Where you end up", line: "The light was always yours.", detail: "Not louder. Not luckier. Just finally working with the lights on." }
] as const;

export const metadata = pageMetadata("Interactive Career Guide for Freelance Hairstylists", "Explore Curls & Contemplation: 467 pages and 16 chapters on creative identity, networking, pricing, digital visibility, leadership, resilience, financial wisdom, and texture-inclusive practice.", { path: "/book", image: "/gateway-cover.jpg" });

export default function Page() {
  const launch = getLaunchStateCopy();
  return <main><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([bookJsonLd(), productJsonLd()]) }} /><PageHero eyebrow="Book" title="A map for the parts of this career nobody photographs." description="Across 467 interactive pages, Michael David connects creative identity and technical growth with networking, mentorship, pricing, digital visibility, leadership, financial wisdom, resilience, AI, ethics, and texture-inclusive practice." primaryHref={launch.heroCta.href} primaryLabel={launch.heroCta.label} secondaryHref="/pricing-kit" secondaryLabel="Get the Free Pricing Kit"><Image src="/gateway-cover.jpg" alt="Curls & Contemplation — cover" width={800} height={1200} className="mx-auto w-full max-w-xs rounded-lg shadow-gold" /></PageHero><ScrollScrubVideo src="/curl-scrub.mp4" webmSrc="/curl-scrub.webm" poster="/curl-poster.jpg" trackVh={260} stages={scrubStages.map(({ kicker, line, detail }) => (
    <div key={line} className="max-w-3xl">
      <p className="editorial-kicker mb-4">{kicker}</p>
      <p className="hero-display font-display text-4xl leading-tight text-white md:text-6xl">{line}</p>
      <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-whitegold/80 md:text-lg">{detail}</p>
    </div>
  ))} /><Section eyebrow="Inside the book" title="Sixteen chapters. One practice you can sustain."><div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{[
    ["Creative identity", "Refine your voice, toolkit, confidence, and creative fire."],
    ["Professional practice", "Build stronger networks, mentorship, client trust, and continuing education."],
    ["Business clarity", "Price from real costs, plan cash flow, and make sustainable financial decisions."],
    ["Visibility", "Use digital strategy with intention so excellent work can be found and understood."],
    ["Leadership and legacy", "Turn daily standards into influence, community impact, and work that lasts."],
    ["Resilience and inclusion", "Protect well-being, adapt to change, and honor every texture with skill and respect."]
  ].map(([title, copy]) => <article key={title} className="editorial-panel rounded-3xl p-6"><h2 className="font-display text-2xl text-white">{title}</h2><p className="mt-3 leading-7 text-whitegold/72">{copy}</p></article>)}</div><div className="mt-10"><PricingCard /></div><p className="mt-5 text-sm text-whitegold/70">The direct digital edition launches November 24, 2026. Kindle and paperback availability will be announced when their store listings are confirmed.</p></Section></main>;
}
