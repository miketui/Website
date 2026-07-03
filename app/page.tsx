import { JourneyExperience } from "@/components/journey/JourneyExperience";
import { EditorialCameraHold } from "@/components/journey/EditorialCameraHold";
import { BookHero } from "@/components/BookHero";
import { ProofBand } from "@/components/design/ProofBand";
import { Section } from "@/components/design/Section";
import { ExperienceCard } from "@/components/design/ExperienceCard";
import { CurlCluster, CurlBloom } from "@/components/design/Flourish";
import { ChapterPathway } from "@/components/motion/ChapterPathway";
import { MagneticCurlButton } from "@/components/motion/MagneticCurlButton";
import { ParallaxDepth } from "@/components/motion/ParallaxDepth";
import { CursorReveal } from "@/components/motion/CursorReveal";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { CaptureBand } from "@/components/CaptureBand";
import { Testimonials, AuthorNote } from "@/components/SocialProof";
import { bookJsonLd } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { priceConfig } from "@/content/book";

export const metadata = pageMetadata(
  "Freelance Hairstylist's Guide to Creative Excellence",
  "The business guide freelance hairstylists were never handed — pricing, networking, on-set etiquette, leadership, and burnout, sequenced across 16 chapters with a guided worksheet in every one.",
  { path: "/", image: "/gateway-cover.jpg" }
);

/* Pain point in the body; the outcome the reader buys lives in `result`. */
const problemCards = [
  ["Pricing", "You quote a number, watch their face, and start explaining before they've even said no. The work was never the hard part.", "A rate you can say once, plainly — and the script for the silence after."],
  ["Networking", "Some people walk into a room and the room adjusts. You're just as good — you've just never been handed the script for how to say it.", "Words for what you do that fit your mouth — and rooms that remember you."],
  ["On-set etiquette", "Nobody trains you on when to speak, when to disappear, or how fast to move when the schedule collapses in front of you. You learn it by flinching.", "The set-day protocol you were supposed to be taught — before your first set."],
  ["Burnout", "The book stays full. The hands stay steady. Something underneath it is running on fumes and nobody's asked about that part.", "A working rhythm that refills what the calendar drains."],
  ["Leadership", "You call yourself a freelancer so no one expects you to lead. Every client in your chair is being led whether you name it or not.", "The authority you've been practicing by accident — named, and made deliberate."],
  ["Uncertainty", "The good weeks feel like luck. The slow weeks feel like a warning. Neither one tells you what actually happened.", "A way to read your own numbers so a slow week is information, not fear."]
] as const;

/* The buy-in, stated as a crossing: where you stand → where the book walks you. */
const transformations = [
  ["Guessing your rate", "Quoting it once, plainly"],
  ["Full book, empty tank", "Full book, steady rhythm"],
  ["Waiting to be noticed", "Rooms that remember you"]
] as const;

const pathwayRows = [
  ["Worksheets", "The audit tools — pricing, standards, next moves — you'd otherwise have to build yourself at 1 a.m."],
  ["Resources", "A member library taking shape behind the book. Nothing sold here that isn't ready yet."],
  ["Career map", "Read it as a map, not a miracle. The chapters are sequenced; the decisions are still yours."]
] as const;

export default function HomePage() {
  return (
    <main>
      <JourneyExperience />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(bookJsonLd()) }} />
      <BookHero />
      <ProofBand />
      <EditorialCameraHold />

      <div className="flourish-field veil-surface relative overflow-hidden">
        <div aria-hidden="true" className="flourish-layer">
          <ParallaxDepth speed={0.12} className="absolute -right-20 -top-10 w-44 md:-right-10 md:w-72">
            <CurlCluster side="right" className="flourish-item--sway [--strand-rotate:12deg] opacity-70" />
          </ParallaxDepth>
          <ParallaxDepth speed={-0.06} className="absolute -left-16 bottom-8 hidden w-56 md:block">
            <span className="flourish-item flourish-item--sway-slow block [--strand-rotate:-58deg] opacity-50">
              <CurlBloom tone="deep" className="w-full" />
            </span>
          </ParallaxDepth>
        </div>
        <div className="relative z-10">
          <Section eyebrow="The unspoken problem" title="Your hands know the work. Nobody handed you the rest of the job.">
            <p className="max-w-3xl">Technique gets taught. What happens after &mdash; the pricing conversation, the boundary that costs you a client if you hold it and costs you more if you don&rsquo;t, the quiet math of a full calendar that still doesn&rsquo;t feel like enough &mdash; gets learned alone, usually the expensive way.</p>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {problemCards.map(([title, copy, result]) => <ExperienceCard key={title} title={title} result={result}>{copy}</ExperienceCard>)}
            </div>
          </Section>
        </div>
      </div>

      <ScrollReveal>
        <CursorReveal frontSrc="/curl-front.jpg" revealSrc="/curl-reveal.jpg" alt="Dark spiral curls in deep emerald shadow, waking under warm gold light">
          <div className="mx-auto w-full max-w-5xl px-5 py-24 text-center md:px-6 md:py-36">
            <span aria-hidden="true" className="mx-auto mb-8 block h-px w-16 bg-antique/70" />
            <p className="hero-display font-display text-4xl leading-snug text-white md:text-6xl">
              You&rsquo;re not behind. You were never given the map.<span className="accent-italic text-dawn"> Here it is.</span>
            </p>
            <p className="mt-5 hidden text-[0.65rem] uppercase tracking-[0.3em] text-whitegold/50 md:block">Move your cursor &mdash; bring it to light</p>
            <div className="mt-12 grid gap-4 text-left sm:grid-cols-3">
              {transformations.map(([from, to]) => (
                <div key={to} className="glass-panel rounded-[1.75rem] p-5">
                  <p className="text-sm leading-6 text-whitegold/55">{from}</p>
                  <p aria-hidden="true" className="my-2 font-display text-xl leading-none text-antique">&darr;</p>
                  <p className="result-line">{to}</p>
                </div>
              ))}
            </div>
          </div>
        </CursorReveal>
      </ScrollReveal>

      <Section eyebrow="The path forward" title="Four parts. One calmer way through.">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="glass-panel rounded-[2rem] p-6 md:p-8">
            <p>Curls & Contemplation moves in order on purpose: name what your work is actually worth, shape the client experience around that standard, build a business rhythm that doesn&rsquo;t eat the version of you that started this &mdash; and protect the quiet space that keeps your judgment sharp when the calendar won&rsquo;t.</p>
            <div className="mt-8 border-y border-whitegold/10">
              {pathwayRows.map(([title, copy]) => (
                <div key={title} className="grid gap-1 border-b border-whitegold/10 py-4 last:border-b-0 sm:grid-cols-[8.5rem_1fr] sm:gap-5">
                  <h3 className="font-display text-xl leading-tight text-antique">{title}</h3>
                  <p className="text-sm leading-7 text-whitegold/80">{copy}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <MagneticCurlButton href="/preorder">Preorder &mdash; ${priceConfig.preorderDirect.amount.toFixed(2)}</MagneticCurlButton>
              <MagneticCurlButton href="/book" variant="secondary">Explore the Book</MagneticCurlButton>
            </div>
          </div>
          <ChapterPathway compact />
        </div>
      </Section>

      <Testimonials />
      <AuthorNote />

      <CaptureBand source="home-midscroll" heading="Not ready to buy? Read Chapter 1 free." copy="Join the letters and the full Chapter 1 PDF lands in your inbox tonight — with the Pricing Confidence Checklist alongside it. One welcome note, then the occasional letter. No spam." />

      <ScrollReveal>
        <section className="sunrise-surface flourish-field relative overflow-hidden">
          <div aria-hidden="true" className="dawn-bloom pointer-events-none absolute inset-x-0 -top-8 mx-auto h-64 w-[40rem] max-w-full rounded-full" />
          <div aria-hidden="true" className="flourish-layer">
            <ParallaxDepth speed={0.1} className="absolute -bottom-12 -left-14 w-44 md:w-64">
              <CurlCluster side="left" className="flourish-item--sway [--strand-rotate:-140deg] opacity-60" />
            </ParallaxDepth>
            <ParallaxDepth speed={-0.06} className="absolute -right-12 -top-10 w-40 md:w-56">
              <CurlCluster side="right" className="flourish-item--sway-slow [--strand-rotate:38deg] opacity-55" />
            </ParallaxDepth>
          </div>
          <div className="relative z-10 mx-auto max-w-4xl px-5 py-20 text-center md:px-6 md:py-28">
            <p className="editorial-kicker mb-5">Launching November 17</p>
            <h2 className="hero-display font-display text-5xl leading-[0.92] text-white md:text-7xl">
              Stop learning the business the <span className="accent-italic text-dawn">expensive way.</span>
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-whitegold/85">
              Preorder the direct edition for ${priceConfig.preorderDirect.amount.toFixed(2)} &mdash; instant digital delivery, launch price locked through release day.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <MagneticCurlButton href="/preorder">Preorder &mdash; ${priceConfig.preorderDirect.amount.toFixed(2)}</MagneticCurlButton>
              <MagneticCurlButton href="/free-chapter" variant="secondary">Read Chapter 1 Free</MagneticCurlButton>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </main>
  );
}
