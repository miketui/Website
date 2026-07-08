import { JourneyExperience } from "@/components/JourneyExperience";
import { BookHero } from "@/components/BookHero";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { ParallaxDepth } from "@/components/motion/ParallaxDepth";
import { CurlCluster } from "@/components/CurlCluster";
import { MagneticCurlButton } from "@/components/motion/MagneticCurlButton";
import { EditorialGrid } from "@/components/design/EditorialGrid";
import { CaptureBand } from "@/components/CaptureBand";
import { Testimonials, AuthorNote } from "@/components/SocialProof";
import { bookJsonLd } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { getLaunchStateCopy, releaseDateLabel } from "@/config/launchState";

export const metadata = pageMetadata(
  "Freelance Hairstylist's Guide to Creative Excellence",
  "Your craft is not the problem — the missing business map is. Pricing, networking, on-set etiquette, and leadership for freelance hairstylists.",
  { path: "/" }
);

const pathwayRows = [
  {
    eyebrow: "Part 1",
    title: "Creative Excellence",
    copy: "A steadier way to define the standard you are building toward. Name what your work is actually worth — before anyone else prices it for you.",
    href: "/chapter/creative-excellence"
  },
  {
    eyebrow: "Part 2",
    title: "Client Experience",
    copy: "Premium service starts before the appointment and continues after the chair turns. Shape the whole experience around your standard — so the price stops needing a defense.",
    href: "/chapter/client-experience"
  },
  {
    eyebrow: "Part 3",
    title: "Business Rhythm",
    copy: "Make the work easier to repeat without making it feel mechanical. Build a working rhythm that refills what the calendar drains.",
    href: "/chapter/business-rhythm"
  },
  {
    eyebrow: "Part 4",
    title: "Contemplation",
    copy: "Space to think, reset, and choose your next move with intention. Protect the quiet space that keeps your judgment sharp when the calendar won't.",
    href: "/chapter/contemplation"
  }
] as const;

export default function HomePage() {
  const launch = getLaunchStateCopy();
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(bookJsonLd()) }} />
      <JourneyExperience />
      <BookHero />
      <section className="relative overflow-hidden bg-night px-5 py-20 md:px-6 md:py-28">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-display text-3xl leading-tight text-white sm:text-5xl md:text-6xl">
            Four parts. One map. <span className="accent-italic text-dawn">Your next move.</span>
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-whitegold/80">The book walks through pricing, the client experience, operating rhythm, and the quiet space you need to stay sharp.</p>
        </div>
        <EditorialGrid>
          {pathwayRows.map((row, index) => (
            <article key={row.href} className="flex flex-col rounded-lg border border-whitegold/10 bg-night/60 backdrop-blur-sm transition-all duration-300 hover:border-antique/30 hover:bg-night/80">
              <a href={row.href} className="flex flex-1 flex-col gap-6 p-7 text-left hover:no-underline">
                <div className="flex flex-1 flex-col gap-4">
                  <p className="text-xs font-medium uppercase tracking-widest text-antique/70">{row.eyebrow}</p>
                  <h3 className="font-display text-2xl leading-tight text-white transition-colors duration-300 group-hover:text-antique/90">{row.title}</h3>
                </div>
                <p className="text-base leading-7 text-whitegold/75">{row.copy}</p>
                <p className="text-sm font-medium text-antique/70 transition-all duration-300 hover:text-antique">Read the preview →</p>
              </a>
            </article>
          ))}
        </EditorialGrid>
      </section>
      <section className="relative overflow-hidden bg-gradient-to-b from-night via-night to-obsidian px-5 py-20 md:px-6 md:py-28">
        <div className="mx-auto max-w-5xl">
          <div className="relative">
            <ParallaxDepth depth={-1} className="pointer-events-none absolute inset-0 overflow-hidden">
              <CurlCluster side="left" className="flourish-item--sway [--strand-rotate:-42deg] opacity-50" />
              <CurlCluster side="right" className="flourish-item--sway-slow [--strand-rotate:38deg] opacity-55" />
            </ParallaxDepth>
          </div>
          {/* THE THRESHOLD — PRD v2 §4.1 section 9. The site's whole visual
              grammar concludes on the action: the portal contracts around the
              one gold CTA. All copy is launch-state driven — this section
              never needs a launch-morning edit. */}
          <div className="relative z-10 mx-auto max-w-4xl px-5 py-20 text-center md:px-6 md:py-28">
            {launch.heroBadge ? (
              <p className={["state-chip mb-6", launch.heroBadge.pulse ? "state-chip--pulse" : ""].join(" ").trim()}>{launch.heroBadge.label}</p>
            ) : null}
            <h2 className="hero-display font-display text-5xl leading-[0.92] text-white md:text-7xl">
              Your gift is asking <span className="accent-italic text-dawn">for more.</span>
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-whitegold/85">
              {launch.finalCtaLine} {launch.priceCopy} — {launch.deliveryCopy.toLowerCase()}.
            </p>
            <div className="relative mx-auto mt-8 flex w-fit flex-col items-center justify-center gap-4 sm:flex-row">
              <span aria-hidden="true" className="portal-ring portal-ring--tight inset-x-[-12%] inset-y-[-40%] hidden sm:block" />
              <MagneticCurlButton href={launch.heroCta.href}>{launch.finalCtaLabel}</MagneticCurlButton>
              <MagneticCurlButton href="/free-chapter" variant="secondary">Read Chapter 1 Free</MagneticCurlButton>
            </div>
            <p className="mt-6 text-xs uppercase tracking-[0.28em] text-whitegold/50">
              {launch.state === "PREORDER" ? `Releasing ${releaseDateLabel()}` : "Instant digital delivery"}
            </p>
          </div>
        </div>
      </section>
      <ScrollReveal>
        <Testimonials />
      </ScrollReveal>
      <section className="relative overflow-hidden bg-night px-5 py-20 md:px-6 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <AuthorNote />
        </div>
      </section>
      <CaptureBand source="home" heading="Keep the letters coming." copy="Join the weekly letters from Michael David — essays on pricing, business, and the calling that lives in craft." />
    </main>
  );
}
