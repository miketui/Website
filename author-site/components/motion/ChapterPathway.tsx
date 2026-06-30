import Link from "next/link";
import { chapters } from "@/content/chapters";

const partLabels = ["Identity", "Experience", "Business", "Sustainability"] as const;

export function ChapterPathway({ compact = false }: { compact?: boolean }) {
  return (
    <ol aria-label="Four-part chapter pathway" className={`relative grid gap-4 ${compact ? "sm:grid-cols-2" : "md:grid-cols-4"}`}>
      {!compact && <span aria-hidden="true" className="absolute left-6 right-6 top-10 hidden h-px bg-gradient-to-r from-antique/20 via-mist/40 to-antique/20 md:block" />}
      {chapters.map((chapter, index) => (
        <li key={chapter.slug} className="relative">
          <Link
            href={`/chapter/${chapter.slug}`}
            className="group block h-full rounded-[2rem] border border-whitegold/15 bg-obsidian/70 p-5 shadow-gold transition hover:-translate-y-1 hover:border-antique/70 hover:bg-jade/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antique focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian motion-reduce:transform-none"
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
