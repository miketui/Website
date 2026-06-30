import type { ReactNode } from "react";
import { MagneticCurlButton } from "@/components/motion/MagneticCurlButton";

export function PageHero({ eyebrow, title, description, primaryHref, primaryLabel, secondaryHref, secondaryLabel, children }: { eyebrow: string; title: string; description: string; primaryHref?: string; primaryLabel?: string; secondaryHref?: string; secondaryLabel?: string; children?: ReactNode }) {
  return (
    <section className="experience-surface px-5 py-14 md:px-6 md:py-20">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
        <div>
          <p className="editorial-kicker">{eyebrow}</p>
          <h1 className="mt-4 max-w-4xl font-display text-5xl leading-[0.95] text-white md:text-7xl">{title}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-whitegold/82 md:text-xl">{description}</p>
          {(primaryHref || secondaryHref) && (
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              {primaryHref && primaryLabel && <MagneticCurlButton href={primaryHref}>{primaryLabel}</MagneticCurlButton>}
              {secondaryHref && secondaryLabel && <MagneticCurlButton href={secondaryHref} variant="secondary">{secondaryLabel}</MagneticCurlButton>}
            </div>
          )}
        </div>
        {children && <div className="editorial-panel rounded-[2rem] p-6 md:p-8">{children}</div>}
      </div>
    </section>
  );
}
