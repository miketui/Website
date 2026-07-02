import type { ReactNode } from "react";
import { MagneticCurlButton } from "@/components/motion/MagneticCurlButton";
import { ParallaxDepth } from "@/components/motion/ParallaxDepth";
import { CurlCluster, CornerStrand } from "@/components/design/Flourish";

/**
 * Shared interior-page hero: deep-jade veil with silky curls drifting at two
 * parallax depths, oversized serif display, and an optional frosted-glass
 * side panel wrapped in a gold strand. The art is decorative-only and renders
 * static under reduced motion / excluded routes (via ParallaxDepth + CSS).
 */
export function PageHero({ eyebrow, title, description, primaryHref, primaryLabel, secondaryHref, secondaryLabel, children }: { eyebrow: string; title: string; description: string; primaryHref?: string; primaryLabel?: string; secondaryHref?: string; secondaryLabel?: string; children?: ReactNode }) {
  return (
    <section className="experience-surface flourish-field relative overflow-hidden px-5 py-16 md:px-6 md:py-24">
      <div aria-hidden="true" className="flourish-layer">
        <ParallaxDepth speed={0.12} className="absolute -right-16 -top-12 w-44 md:-right-6 md:w-72">
          <CurlCluster side="right" className="flourish-item--sway [--strand-rotate:16deg] opacity-70" />
        </ParallaxDepth>
        <ParallaxDepth speed={-0.06} className="absolute -left-14 bottom-0 hidden w-52 md:block">
          <CurlCluster side="left" className="flourish-item--sway-slow [--strand-rotate:-24deg] opacity-45" />
        </ParallaxDepth>
      </div>
      <div className="relative z-10 mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
        <div>
          <p className="editorial-kicker">{eyebrow}</p>
          <h1 className="hero-display mt-4 max-w-4xl font-display text-5xl leading-[0.92] text-white md:text-8xl">{title}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-whitegold/82 md:text-xl">{description}</p>
          {(primaryHref || secondaryHref) && (
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              {primaryHref && primaryLabel && <MagneticCurlButton href={primaryHref}>{primaryLabel}</MagneticCurlButton>}
              {secondaryHref && secondaryLabel && <MagneticCurlButton href={secondaryHref} variant="secondary">{secondaryLabel}</MagneticCurlButton>}
            </div>
          )}
        </div>
        {children && (
          <div className="glass-panel relative rounded-[2rem] p-6 md:p-8">
            <CornerStrand className="opacity-70" />
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
