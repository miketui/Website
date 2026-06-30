import Link from "next/link";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { testimonials } from "@/content/testimonials";

/**
 * Early-reader proof row. Renders NOTHING until real, sourced quotes exist in
 * content/testimonials.ts — no placeholder or invented blurbs ever ship.
 */
export function Testimonials() {
  if (testimonials.length === 0) return null;
  return (
    <ScrollReveal>
      <section className="light mx-auto w-full max-w-6xl px-5 py-14 md:px-6 md:py-20">
        <p className="editorial-kicker mb-8">Early readers</p>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.name} className="editorial-panel rounded-[2rem] p-6">
              <blockquote className="font-display text-xl leading-snug text-white md:text-2xl">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-4 text-sm text-whitegold/70">
                <span className="text-antique">{t.name}</span>
                {t.title ? ` · ${t.title}` : ""}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    </ScrollReveal>
  );
}

/**
 * Author presence band — claim-safe voice, no quantified credentials, no awards.
 * Ships a typographic monogram (not a stock face). To use the real photo:
 * drop it at public/michael-david.jpg and replace the monogram <div> below with
 * a next/image: <Image src="/michael-david.jpg" alt="Michael David" width={384}
 * height={384} className="mx-auto h-40 w-40 rounded-2xl object-cover md:h-48 md:w-48" />.
 */
export function AuthorNote() {
  return (
    <ScrollReveal>
      <section className="mx-auto w-full max-w-5xl px-5 py-14 md:px-6 md:py-20">
        <div className="editorial-panel grid items-center gap-8 rounded-[2rem] p-6 md:grid-cols-[0.4fr_1fr] md:p-10">
          <div
            aria-hidden="true"
            className="mx-auto flex h-40 w-40 items-center justify-center rounded-2xl border border-antique/40 font-display text-4xl tracking-wide text-antique md:h-48 md:w-48"
          >
            MD
          </div>
          <div>
            <p className="editorial-kicker mb-3">Why this book</p>
            <p className="font-display text-2xl leading-snug text-white md:text-3xl">
              Written behind the chair, not above it.
            </p>
            <p className="mt-4 text-base leading-8 text-whitegold/80">
              Michael David wrote Curls &amp; Contemplation from inside the work it describes — the
              pricing conversations, the on-set pressure, the burnout, and the slow business of
              building a creative practice that lasts.
            </p>
            <Link
              href="/about"
              className="mt-5 inline-block text-sm text-whitegold/70 underline decoration-antique underline-offset-4"
            >
              More about Michael
            </Link>
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}
