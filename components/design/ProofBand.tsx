import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { PullQuote } from "@/components/design/PullQuote";

/**
 * Real-proof band. Every figure is verifiable from the manuscript itself:
 * 16 chapters across 4 parts, a worksheet in every chapter, plus 15
 * journals / self-assessments / planners in the back matter. The quote is a
 * direct line from the book's Preface — Michael's own IP. No invented claims.
 */
const stats = [
  ["16", "chapters, sequenced on purpose"],
  ["4", "parts — craft, practice, strategy, growth"],
  ["16", "guided worksheets — one in every chapter"],
  ["15", "journals, self-assessments & planners"]
] as const;

export function ProofBand() {
  return (
    <ScrollReveal>
      <section aria-label="What's inside the book" className="proof-band mx-auto w-full">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:px-6 md:py-20 lg:grid-cols-[1fr_1.05fr] lg:items-center">
          <div>
            <p className="editorial-kicker mb-6">What you actually get</p>
            <dl className="grid grid-cols-2 gap-x-8 gap-y-9">
              {stats.map(([figure, label]) => (
                <div key={label}>
                  <dt className="proof-figure font-display text-5xl leading-none text-dawn md:text-6xl">{figure}</dt>
                  <dd className="mt-2 text-sm leading-6 text-whitegold/75">{label}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="editorial-panel--warm rounded-[2rem] p-7 md:p-9">
            <PullQuote quote="The creative spirit stirs when the life you have built no longer feels large enough for the vision growing inside you." />
            <p className="mt-5 text-sm tracking-wide text-whitegold/65">— from the Preface</p>
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}
