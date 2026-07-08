import Link from "next/link";
import Image from "next/image";
import { book } from "@/content/book";
import { getLaunchStateCopy } from "@/config/launchState";
import { BookTilt } from "@/components/motion/BookTilt";
import { MagneticCurlButton } from "@/components/motion/MagneticCurlButton";
import { ParallaxDepth } from "@/components/motion/ParallaxDepth";
import { CurlCluster, GoldStrand } from "@/components/design/Flourish";

const heroResults = [
  "Pricing that reflects the standard you set",
  "Client experience as a competitive edge",
  "Operating rhythm that refills instead of drains",
  "Quiet space to reset and choose with intention"
] as const;

/**
 * Homepage hero — PRD v2 §4.1 "Beyond the Craft."
 *
 * The 3-second emotional seizure: the book floats inside a breathing gold
 * portal (pure CSS — the LCP element stays a static image, per §6.2), the
 * threshold headline leads, and every piece of state copy (CTA, badge chip,
 * urgency) comes from the launch-state machine — no hardcoded dates, no
 * rebuild on launch morning.
 *
 * FELT gate: light behaves (portal breath + dawn bloom), depth exists (three
 * parallax curl layers), one thing breathes (the ring), gold appears only at
 * the moment of elevation (CTA + chip). Reduced motion: the global kill-switch
 * in motion.css freezes every loop; the page stays fully convertible.
 */
export function BookHero() {
  const launch = getLaunchStateCopy();
  return (
    <section className="sunrise-surface flourish-field relative overflow-hidden px-5 py-20 md:px-6 md:py-28">
      <div aria-hidden="true" className="dawn-bloom pointer-events-none absolute inset-x-0 -top-10 mx-auto h-72 w-[42rem] max-w-full rounded-full" />
      <ParallaxDepth depth={-2} className="pointer-events-none absolute inset-0 overflow-hidden">
        <CurlCluster side="left" className="flourish-item--sway [--strand-rotate:-28deg] opacity-40" />
      </ParallaxDepth>
      <ParallaxDepth depth={-1} className="pointer-events-none absolute inset-0 overflow-hidden">
        <CurlCluster side="right" className="flourish-item--sway-slow [--strand-rotate:45deg] opacity-45" />
      </ParallaxDepth>
      <ParallaxDepth depth={0} className="pointer-events-none absolute inset-0 overflow-hidden">
        <CurlCluster side="left" className="flourish-item--sway [--strand-rotate:-15deg] opacity-35" />
      </ParallaxDepth>
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-[1.05fr_0.95fr]">
        <div className="relative z-10">
          {launch.heroBadge ? (
            <p className={["state-chip", launch.heroBadge.pulse ? "state-chip--pulse" : ""].join(" ").trim()}>
              {launch.heroBadge.label}
            </p>
          ) : (
            <p className="editorial-kicker">The guide behind the chair</p>
          )}
          <h1 className="hero-display mt-5 max-w-4xl font-display text-6xl leading-[0.9] text-white sm:text-7xl xl:text-8xl">
            Beyond the craft. <span className="accent-italic text-dawn">Into the calling.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-xl leading-8 text-whitegold md:text-2xl">{book.subtitle}</p>
          <ul className="mt-7 max-w-2xl space-y-3 text-base leading-7 text-whitegold/85 md:text-lg">
            {heroResults.map((result) => (
              <li key={result} className="flex items-start gap-3.5">
                <span aria-hidden="true" className="circuit-dot mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" />
                <span>{result}</span>
              </li>
            ))}
          </ul>
          <p className="mt-8 max-w-2xl text-base leading-7 text-whitegold/70">
            The part of the job your training skipped &mdash; now written down, in order.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <MagneticCurlButton href={launch.heroCta.href}>{launch.heroCta.label}</MagneticCurlButton>
            <MagneticCurlButton href="/free-chapter" variant="secondary">Read Chapter 1 Free</MagneticCurlButton>
          </div>
          <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-whitegold/65">
            <span>{launch.deliveryCopy}</span>
            <span aria-hidden="true" className="text-antique">&middot;</span>
            <span>{launch.priceCopy}</span>
          </p>
        </div>
        <div className="relative z-10">
          <div className="relative mx-auto w-full max-w-sm">
            {/* The threshold: a breathing portal of antique-gold light the book
                floats inside — CSS only, behind the static LCP image. */}
            <span aria-hidden="true" className="portal-ring inset-[-14%] hidden md:block" />
            <span aria-hidden="true" className="portal-ring portal-ring--tight inset-[-6%]" />
            <span aria-hidden="true" className="strand-ornament -right-10 -top-7 z-10 w-52 md:-right-14">
              <GoldStrand className="w-full" />
            </span>
            <div className="relative z-0 [perspective:800px]">
              <BookTilt>
                <Image
                  src="/book-cover-thumb.webp"
                  alt="Curls & Contemplation book cover"
                  width={360}
                  height={540}
                  priority
                  className="w-full rounded-lg shadow-2xl"
                />
              </BookTilt>
            </div>
          </div>
          <Link href="/book" className="mx-auto mt-8 block max-w-xs text-center text-sm text-whitegold/70 underline decoration-antique underline-offset-4">Enter the world of the book</Link>
        </div>
      </div>
    </section>
  );
}
