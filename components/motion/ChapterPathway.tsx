import Link from "next/link";
import { chapters } from "@/content/chapters";

const partLabels = ["Identity", "Experience", "Business", "Sustainability"] as const;

export function ChapterPathway({ compact = false }: { compact?: boolean }) {
  return (
    <ol aria-label="Four-part chapter pathway" className={`relative grid gap-4 ${compact ? "sm:grid-cols-2" : "md:grid-cols-4"}`}>
      {!compact && (
        /* Glowing jade circuit weaving behind the frosted cards — draws in
           when the surrounding ScrollReveal fires. */
        <svg aria-hidden="true" viewBox="0 0 1200 90" preserveAspectRatio="none" className="jade-circuit absolute -top-5 left-0 hidden h-24 w-full md:block">
          <path d="M-10 72 C 120 66, 170 24, 300 22 S 500 70, 620 64 S 860 14, 980 24 S 1150 66, 1210 58" pathLength={1} className="jade-circuit-path jade-circuit-draw" />
          <circle cx="300" cy="22" r="3.5" className="jade-circuit-node" />
          <circle cx="620" cy="64" r="3.5" className="jade-circuit-node" />
          <circle cx="980" cy="24" r="3.5" className="jade-circuit-node" />
        </svg>
      )}
      {chapters.map((chapter, index) => (
        <li key={chapter.slug} className="relative">
          {!compact && <span aria-hidden="true" className="circuit-dot absolute -top-1.5 left-1/2 hidden h-2 w-2 -translate-x-1/2 rounded-full md:block" />}
          <Link
            href={`/chapter/${chapter.slug}`}
            className="glass-panel group block h-full rounded-[2rem] p-5 transition hover:-translate-y-1 hover:border-antique/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antique focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian motion-reduce:transform-none"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-antique/50 bg-obsidian text-sm font-semibold text-antique">{index + 1}</span>
            <p className="mt-5 text-xs uppercase tracking-[0.24em] text-mist/80">Part {index + 1} · {partLabels[index]}</p>
            <h3 className={`mt-2 font-display text-2xl text-white ${compact ? "" : "md:text-3xl"}`}>{chapter.title}</h3>
            {!compact && <p className="mt-3 text-sm leading-6 text-whitegold/75">{chapter.excerpt}</p>}
          </Link>
        </li>
      ))}
    </ol>
  );
}
