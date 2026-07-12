import Link from "next/link";
import Image from "next/image";
import { CoverReveal } from "@/components/intro/CoverReveal";
import { MotionAsset } from "@/components/motion/MotionAsset";
import { KineticHeadline } from "@/components/motion/KineticHeadline";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { CurlDraw } from "@/components/motion/CurlDraw";
import { PreorderCountdown } from "@/components/PreorderCountdown";
import { PricingKitForm } from "@/components/PricingKitForm";
import { bookJsonLd } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { getLaunchStateCopy, releaseDateLabel } from "@/config/launchState";
import { priceConfig } from "@/content/book";

export const metadata = pageMetadata(
  "A Stylist's Interactive Journey",
  "Curls & Contemplation by Michael David is a 467-page interactive guide for freelance hairstylists building creative confidence, sustainable pricing, visibility, leadership, and career longevity.",
  { path: "/", image: "/gateway-cover.jpg" }
);

const btnGold =
  "inline-flex items-center gap-2 rounded-sm bg-antique px-7 py-3.5 text-sm font-semibold text-obsidian transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antique focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian";
const btnGhost =
  "inline-flex items-center gap-2 rounded-sm border border-whitegold/35 px-7 py-3.5 text-sm text-whitegold transition-colors hover:border-antique hover:text-antique focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antique";

const pillars = [
  ["i.", "Price with confidence", "The language and the math to charge what your work is actually worth — and hold the number."],
  ["ii.", "Pitch & protect", "Sell your services without shrinking, and guard the time and energy that keep you in the chair."],
  ["iii.", "Build a life", "Turn a chair into a career you actually want — one you can sustain for the long haul."]
] as const;

/**
 * Home — one story, one job: sell the book.
 * Scroll arc: the door (hero) → the ache (verbatim Ch. I) → the book →
 * the threshold → the promise → the claim → the free taste → the author.
 * Every quoted line is verbatim from the approved Chapter I manuscript —
 * site-book consistency rule. Motion assets keep their established roles
 * (A hero-door, B unfurling, D room, L crown, F chapter-peek).
 */
export default function HomePage() {
  const launch = getLaunchStateCopy();
  const regular = priceConfig.regularDirect.amount;
  const preorderPrice = priceConfig.preorderDirect.amount;

  return (
    <>
      <CoverReveal />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(bookJsonLd()) }} />

      <main id="top">
        {/* ACT I — THE DOOR. Asset A (hero-door), kinetic headline. */}
        <section className="relative flex min-h-[100svh] items-center overflow-hidden">
          <MotionAsset id="A" fill priority />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-obsidian/90 via-obsidian/60 to-obsidian/25" />
          <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-28 md:py-32">
            <p className="editorial-kicker mb-5">Beauty school taught you hair. Nobody taught you the money.</p>
            <KineticHeadline text="Curls & Contemplation" as="h1" className="text-5xl text-white md:text-7xl" accentFrom={1} />
            <p className="mt-4 font-accent text-2xl italic text-mist md:text-3xl">A Stylist&rsquo;s Interactive Journey</p>
            <p className="mt-6 max-w-[46ch] leading-8 text-whitegold/85">
              A 467-page interactive guide to creative identity, networking, pricing, digital visibility, leadership,
              financial wisdom, resilience, and building a career that can hold your ambition.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link href={launch.heroCta.href} className={btnGold}>{launch.heroCta.label}</Link>
              <Link href="/pricing-kit" className={btnGhost}>Get the free pricing checklist</Link>
            </div>
          </div>
        </section>

        {/* ACT II — THE ACHE. Quiet interlude; every quoted line verbatim Ch. I. */}
        <section id="ache" aria-label="From Chapter One" className="mx-auto max-w-3xl px-6 py-[clamp(4.5rem,12vw,9rem)] text-center">
          <ScrollReveal>
            <p className="editorial-kicker mb-6">From Chapter One</p>
            <p className="mx-auto max-w-[54ch] text-left leading-9 text-whitegold/85 md:text-lg">
              If you have ever felt reduced to appointments, formulas, and the pressure to keep producing without losing
              yourself — this book speaks directly to that ache.
            </p>
            <blockquote className="mt-12">
              <p className="font-display text-3xl leading-tight text-white md:text-5xl">
                &ldquo;I forgot she was <span className="accent-italic text-antique">still in there</span>.&rdquo;
              </p>
              <footer className="mx-auto mt-8 max-w-[52ch] text-left leading-8 text-whitegold/75">
                A house call the morning before a wedding. A client who hadn&rsquo;t left her apartment in weeks. By the last
                pin, the woman in the mirror barely resembled the one who answered the door — she touched her reflection and
                said those five words. <span className="text-whitegold/90">&ldquo;My hands weren&rsquo;t just creating hairstyles; they were helping
                rebuild bridges between people and their forgotten selves. This wasn&rsquo;t just a job. It was sacred
                work.&rdquo;</span>
              </footer>
            </blockquote>
            <CurlDraw className="mx-auto mt-10 h-16 w-full max-w-xs" />
            <p className="mx-auto mt-8 max-w-[54ch] text-left leading-8 text-whitegold/85">
              That&rsquo;s the craft. The gap between doing that work and getting <em>paid</em> like it matters — that&rsquo;s the
              book.
            </p>
          </ScrollReveal>
        </section>

        {/* ACT III — THE BOOK. Asset B (unfurling). */}
        <section id="book" className="mx-auto max-w-6xl px-6 py-[clamp(4.5rem,12vw,9rem)]">
          <div className="grid items-center gap-14 md:grid-cols-2">
            <div>
              <p className="editorial-kicker mb-4">The Book</p>
              <h2 className="font-display text-4xl text-white md:text-5xl">
                A book you <span className="accent-italic text-antique">do</span>, not just read
              </h2>
              <p className="mt-5 max-w-[52ch] leading-8 text-whitegold/82">
                Prompts, reflections, and real talk on pricing, protecting your energy, and pitching your worth — with a
                guided worksheet in every chapter. You finish it with a plan in your handwriting, not highlights in someone
                else&rsquo;s ideas.
              </p>
              <div className="mt-8">
                <Link href="/book" className={btnGhost}>See what&rsquo;s inside</Link>
              </div>
            </div>
            <MotionAsset id="B" className="rounded-md border border-antique/20" />
          </div>
        </section>

        {/* ACT IV — THE THRESHOLD. Asset D (room). */}
        <section id="journey" className="relative grid min-h-[86svh] place-items-center overflow-hidden text-center">
          <MotionAsset id="D" fill />
          <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(90%_90%_at_50%_50%,rgba(0,0,0,0.25),rgba(0,0,0,0.8))]" />
          <div className="relative z-10 mx-auto max-w-2xl px-6">
            <p className="editorial-kicker mb-4">The Journey</p>
            <h2 className="font-display text-4xl text-white md:text-6xl">Step over the threshold</h2>
            <p className="mx-auto mt-5 max-w-[48ch] leading-8 text-whitegold/90">
              Every chapter opens a door — from technical excellence to the quiet work of trusting your own value.
            </p>
            <div className="mt-8">
              <Link href="/journey" className={btnGold}>Begin the journey</Link>
            </div>
          </div>
        </section>

        <section aria-label="A moment of contemplation" className="relative grid min-h-[72svh] place-items-center overflow-hidden border-y border-whitegold/10 bg-[#070707] px-6 text-center">
          <div aria-hidden="true" className="absolute h-72 w-72 animate-pulse rounded-full bg-antique/[0.07] blur-3xl" />
          <div className="relative mx-auto max-w-4xl">
            <p className="editorial-kicker mb-7">Pause here</p>
            <p className="font-display text-4xl leading-tight text-white md:text-6xl">When did you last name what your work is worth — and believe yourself?</p>
          </div>
        </section>

        {/* ACT V — THE PROMISE. Three pillars. */}
        <section id="stylists" className="mx-auto max-w-6xl px-6 py-[clamp(4.5rem,12vw,9rem)]">
          <p className="editorial-kicker mb-4">For Stylists</p>
          <h2 className="font-display text-4xl text-white md:text-5xl">What you&rsquo;ll walk away with</h2>
          <div className="mt-10 grid gap-7 md:grid-cols-3">
            {pillars.map(([num, title, copy]) => (
              <div key={title} className="cc-glow-card rounded-md border border-antique/20 p-7">
                <p className="font-accent text-2xl italic text-antique">{num}</p>
                <h3 className="mt-2 font-display text-xl text-white">{title}</h3>
                <p className="mt-3 leading-7 text-whitegold/72">{copy}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ACT VI — THE CLAIM. Asset L (crown), launch-state price/date. */}
        <section id="preorder" className="relative grid min-h-[86svh] place-items-center overflow-hidden text-center">
          <MotionAsset id="L" fill />
          <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(90%_90%_at_50%_50%,rgba(0,0,0,0.25),rgba(0,0,0,0.82))]" />
          <div className="relative z-10 mx-auto max-w-2xl px-6">
            {launch.heroBadge ? (
              <p className={["state-chip mb-5", launch.heroBadge.pulse ? "state-chip--pulse" : ""].join(" ").trim()}>{launch.heroBadge.label}</p>
            ) : null}
            <p className="editorial-kicker mb-4">Preorder</p>
            <h2 className="font-display text-4xl text-white md:text-6xl">Stop being the best-kept secret in your city</h2>
            <p className="mt-6 font-display text-4xl text-white">
              ${preorderPrice.toFixed(2)}{" "}
              {launch.state === "PREORDER" ? (
                <span className="align-middle text-lg text-whitegold/50 line-through">${regular.toFixed(2)}</span>
              ) : null}
            </p>
            <p className="mt-3 font-accent text-lg italic text-mist">{launch.deliveryCopy}.</p>
            {launch.showCountdown ? <PreorderCountdown className="mt-8" /> : null}
            <div className="mt-8">
              <Link href={launch.heroCta.href} className={btnGold}>{launch.finalCtaLabel}</Link>
            </div>
            <p className="mt-5 text-xs uppercase tracking-[0.28em] text-whitegold/50">
              {launch.state === "PREORDER" ? `Releasing ${releaseDateLabel()}` : "Instant digital delivery"}
            </p>
          </div>
        </section>

        {/* ACT VII — THE PRACTICAL START. Checklist capture, no manuscript giveaway. */}
        <section id="chapter" className="mx-auto max-w-6xl px-6 py-[clamp(4.5rem,12vw,9rem)]">
          <div className="grid items-center gap-14 md:grid-cols-2">
            <MotionAsset id="F" className="rounded-md border border-antique/20" />
            <div>
              <p className="editorial-kicker mb-4">Free Pricing Confidence Kit</p>
              <h2 className="font-display text-4xl text-white md:text-5xl">
                Know the number. <span className="accent-italic text-antique">Hold the boundary.</span>
              </h2>
              <p className="mt-5 max-w-[52ch] leading-8 text-whitegold/82">
                Get the one-page Pricing Confidence Checklist: a rate-floor calculation, a clear price script, and a boundary check — delivered to your inbox in minutes.
              </p>
              <div className="mt-7">
                <PricingKitForm />
              </div>
            </div>
          </div>
        </section>

        {/* ACT VIII — THE AUTHOR. Slim bio, pen name only. */}
        <section id="author" className="mx-auto max-w-6xl px-6 pb-[clamp(4.5rem,12vw,9rem)]">
          <div className="grid items-center gap-12 md:grid-cols-[0.8fr_1.2fr]">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-[20rem] overflow-hidden rounded-[2rem] border border-antique/30 bg-obsidian">
              <Image src="/michael-david-author.webp" alt="Michael David, author of Curls & Contemplation" fill sizes="320px" className="object-cover object-top" />
            </div>
            <div>
              <p className="editorial-kicker mb-4">The Author</p>
              <h2 className="font-display text-4xl text-white md:text-5xl">Michael David</h2>
              <p className="mt-5 max-w-[54ch] leading-8 text-whitegold/82">
                Michael David is a hairstylist, creative professional, and educator writing from lived practice. His work connects technical excellence with business clarity, cultural respect, leadership, and the inner steadiness required for a long creative career.
              </p>
              <div className="mt-7">
                <Link href="/about" className={btnGhost}>More about Michael</Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
