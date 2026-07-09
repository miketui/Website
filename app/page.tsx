import Link from "next/link";
import { CoverReveal } from "@/components/intro/CoverReveal";
import { MotionAsset } from "@/components/motion/MotionAsset";
import { KineticHeadline } from "@/components/motion/KineticHeadline";
import { PreorderCountdown } from "@/components/PreorderCountdown";
import { FreeChapterForm } from "@/components/FreeChapterForm";
import { bookJsonLd } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { getLaunchStateCopy, releaseDateLabel } from "@/config/launchState";
import { priceConfig } from "@/content/book";

export const metadata = pageMetadata(
  "A Stylist's Interactive Journey",
  "Curls & Contemplation by Michael David — an immersive book for hairstylists on craft, confidence, and the business of beauty. Preorder the direct digital edition.",
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

export default function HomePage() {
  const launch = getLaunchStateCopy();
  const regular = priceConfig.regularDirect.amount;
  const preorderPrice = priceConfig.preorderDirect.amount;

  return (
    <>
      <CoverReveal />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(bookJsonLd()) }} />

      <main id="top">
        {/* HERO — asset A (hero-door) full-bleed, kinetic display headline. */}
        <section className="relative flex min-h-[100svh] items-center overflow-hidden">
          <MotionAsset id="A" fill priority />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-obsidian/90 via-obsidian/60 to-obsidian/25" />
          <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-28 md:py-32">
            <p className="editorial-kicker mb-5">A book for the chair &amp; the soul</p>
            <KineticHeadline text="Curls & Contemplation" as="h1" className="text-5xl text-white md:text-7xl" accentFrom={1} />
            <p className="mt-4 font-accent text-2xl italic text-mist md:text-3xl">A Stylist&rsquo;s Interactive Journey</p>
            <p className="mt-6 max-w-[46ch] leading-8 text-whitegold/85">
              Craft, confidence, and the business of beauty — an immersive companion for the stylist who wants to build a life, not just a clientele.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link href={launch.heroCta.href} className={btnGold}>{launch.heroCta.label}</Link>
              <Link href="/free-chapter" className={btnGhost}>Read Chapter 1 free</Link>
            </div>
          </div>
        </section>

        {/* THE BOOK — asset B (unfurling) mediacard. */}
        <section id="book" className="mx-auto max-w-6xl px-6 py-[clamp(4.5rem,12vw,9rem)]">
          <div className="grid items-center gap-14 md:grid-cols-2">
            <div>
              <p className="editorial-kicker mb-4">The Book</p>
              <h2 className="font-display text-4xl text-white md:text-5xl">
                A journey you can <span className="accent-italic text-antique">hold</span>
              </h2>
              <p className="mt-5 max-w-[52ch] leading-8 text-whitegold/82">
                An interactive journey — prompts, reflections, and real talk on pricing, protecting your energy, and pitching your worth. Written for the working stylist.
              </p>
              <div className="mt-8">
                <Link href="/book" className={btnGhost}>See what&rsquo;s inside</Link>
              </div>
            </div>
            <MotionAsset id="B" className="rounded-md border border-antique/20" />
          </div>
        </section>

        {/* THE JOURNEY — asset D (room) cinematic → /journey. */}
        <section id="journey" className="relative grid min-h-[86svh] place-items-center overflow-hidden text-center">
          <MotionAsset id="D" fill />
          <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(90%_90%_at_50%_50%,rgba(0,0,0,0.25),rgba(0,0,0,0.8))]" />
          <div className="relative z-10 mx-auto max-w-2xl px-6">
            <p className="editorial-kicker mb-4">The Journey</p>
            <h2 className="font-display text-4xl text-white md:text-6xl">Step over the threshold</h2>
            <p className="mx-auto mt-5 max-w-[48ch] leading-8 text-whitegold/90">
              Every chapter opens a door — from the salon floor to the quiet work of knowing your own value.
            </p>
            <div className="mt-8">
              <Link href="/journey" className={btnGold}>Begin the journey</Link>
            </div>
          </div>
        </section>

        {/* FOR STYLISTS — three pillars (replaces the old four-part block). */}
        <section id="stylists" className="mx-auto max-w-6xl px-6 py-[clamp(4.5rem,12vw,9rem)]">
          <p className="editorial-kicker mb-4">For Stylists</p>
          <h2 className="font-display text-4xl text-white md:text-5xl">What you&rsquo;ll walk away with</h2>
          <div className="mt-10 grid gap-7 md:grid-cols-3">
            {pillars.map(([num, title, copy]) => (
              <div key={title} className="rounded-md border border-antique/20 p-7">
                <p className="font-accent text-2xl italic text-antique">{num}</p>
                <h3 className="mt-2 font-display text-xl text-white">{title}</h3>
                <p className="mt-3 leading-7 text-whitegold/72">{copy}</p>
              </div>
            ))}
          </div>
        </section>

        {/* PREORDER — asset L (crown) cinematic, launch-state price/date. */}
        <section id="preorder" className="relative grid min-h-[86svh] place-items-center overflow-hidden text-center">
          <MotionAsset id="L" fill />
          <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(90%_90%_at_50%_50%,rgba(0,0,0,0.25),rgba(0,0,0,0.82))]" />
          <div className="relative z-10 mx-auto max-w-2xl px-6">
            {launch.heroBadge ? (
              <p className={["state-chip mb-5", launch.heroBadge.pulse ? "state-chip--pulse" : ""].join(" ").trim()}>{launch.heroBadge.label}</p>
            ) : null}
            <p className="editorial-kicker mb-4">Preorder</p>
            <h2 className="font-display text-4xl text-white md:text-6xl">Claim your copy</h2>
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

        {/* FREE CHAPTER — asset F (chapter-peek) + capture form → /api/free-chapter. */}
        <section id="chapter" className="mx-auto max-w-6xl px-6 py-[clamp(4.5rem,12vw,9rem)]">
          <div className="grid items-center gap-14 md:grid-cols-2">
            <MotionAsset id="F" className="rounded-md border border-antique/20" />
            <div>
              <p className="editorial-kicker mb-4">Free Chapter</p>
              <h2 className="font-display text-4xl text-white md:text-5xl">
                Read the first chapter <span className="accent-italic text-antique">free</span>
              </h2>
              <p className="mt-5 max-w-[52ch] leading-8 text-whitegold/82">
                Get Chapter 1 plus the Pricing Confidence Checklist — delivered to your inbox in minutes.
              </p>
              <div className="mt-7">
                <FreeChapterForm />
              </div>
            </div>
          </div>
        </section>

        {/* AUTHOR — slim bio, pen name only. */}
        <section id="author" className="mx-auto max-w-6xl px-6 pb-[clamp(4.5rem,12vw,9rem)]">
          <div className="grid items-center gap-12 md:grid-cols-[0.8fr_1.2fr]">
            <div
              aria-hidden="true"
              className="mx-auto grid aspect-square w-full max-w-[16rem] place-items-center rounded-full border border-antique/30 bg-[radial-gradient(circle_at_40%_35%,#1c2622,#0c0c0c)]"
            >
              <span className="font-display text-5xl text-antique">MD</span>
            </div>
            <div>
              <p className="editorial-kicker mb-4">The Author</p>
              <h2 className="font-display text-4xl text-white md:text-5xl">Michael David</h2>
              <p className="mt-5 max-w-[54ch] leading-8 text-whitegold/82">
                A stylist writing for stylists — on the craft that fills the chair and the contemplation that sustains a career. He writes, prices, and delivers this book directly, so the whole of it stays honest.
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
