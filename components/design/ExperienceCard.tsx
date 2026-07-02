import type { ReactNode } from "react";
import { CornerStrand } from "@/components/design/Flourish";

/**
 * Frosted-glass card with a gold strand draped over the corner — the concept-
 * film card. `result` renders the outcome line: the pain point lives in the
 * body, what the reader walks away with lives in gold italic serif below it.
 */
export function ExperienceCard({ title, result, children }: { title: string; result?: string; children: ReactNode }) {
  return (
    <article className="glass-panel group relative rounded-[2rem] p-6 transition duration-300 hover:-translate-y-1.5 hover:border-antique/45 motion-reduce:transform-none">
      <CornerStrand className="opacity-60 transition-opacity duration-500 group-hover:opacity-100" />
      <h3 className="font-display text-2xl leading-tight text-white md:text-3xl">{title}</h3>
      <div className="mt-3 text-sm leading-7 text-whitegold/78 md:text-base">{children}</div>
      {result && (
        <div className="mt-5 border-t border-whitegold/10 pt-4">
          <p className="editorial-kicker text-[0.65rem]">You leave with</p>
          <p className="result-line mt-1.5">{result}</p>
        </div>
      )}
    </article>
  );
}
