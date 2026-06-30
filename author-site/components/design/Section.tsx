import type { ReactNode } from "react";
import clsx from "clsx";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

export function Section({ eyebrow, title, children, className, quiet = false, id }: { eyebrow?: string; title?: string; children: ReactNode; className?: string; quiet?: boolean; id?: string }) {
  const content = (
    <section id={id} className={clsx("mx-auto w-full max-w-6xl px-5 py-14 md:px-6 md:py-24", className)}>
      {eyebrow && <p className="editorial-kicker mb-4">{eyebrow}</p>}
      {title && <h2 className="max-w-4xl font-display text-4xl leading-[0.95] text-white md:text-6xl">{title}</h2>}
      <div className="mt-8 text-base leading-8 text-whitegold/85 md:text-lg">{children}</div>
    </section>
  );

  return quiet ? content : <ScrollReveal>{content}</ScrollReveal>;
}
