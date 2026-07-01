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
 * Author presence band — every credit below is drawn from Michael's own
 * "About the Author" page in the manuscript (his IP), so nothing here is
 * invented. Ships a typographic monogram, not a stock face. To use the real
 * photo: drop it at public/michael-david.jpg and replace the monogram <div>
 * with a next/image at h-40/w-40 (md:h-48/w-48), rounded-2xl object-cover.
 */
export function AuthorNote() {
  return (
    <ScrollReveal>
      <section className="mx-auto w-full max-w-5xl px-5 py-14 md:px-6 md:py-20">
        <div className="editorial-panel--warm grid items-center gap-8 rounded-[2rem] p-6 md:grid-cols-[0.4fr_1fr] md:p-10">
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
            <p className="mt-4 text-base leading-8 text-whitegold/85">
              Michael David built a career the industry never handed him a blueprint for &mdash; assisting
              Guido Palau, Jimmy Paul, and Jawara, then becoming Rihanna&rsquo;s day-to-day hairstylist in
              London. His work keyed Nike&rsquo;s &ldquo;Greatest Dynasty Ever&rdquo; campaign and reached the
              pages of Harper&rsquo;s Bazaar, W, Wonderland, and Coveteur, with runway work for Sergio Hudson
              and twelve-plus years across Tokyo, Stockholm, Mexico City, and Paris.
            </p>
            <p className="mt-4 text-base leading-8 text-whitegold/85">
              But the moment that started this book happened at a kitchen table during lockdown &mdash; a
              client whose hair had matted beyond what she could manage, who couldn&rsquo;t face her own
              reflection, and who whispered five words when he finished:
              <span className="text-antique"> &ldquo;I forgot she was still in there.&rdquo;</span> No amount of
              technical mastery prepares you for the moment your craft becomes someone&rsquo;s lifeline. This is
              the book he wished he&rsquo;d had.
            </p>
            <p className="credit-rail mt-6 text-[0.7rem] uppercase md:text-xs">
              <b>Guido Palau</b> &middot; <b>Rihanna</b> &middot; <b>Nike</b> &middot; <b>Harper&rsquo;s Bazaar</b> &middot; <b>W</b> &middot; <b>Wonderland</b> &middot; <b>Sergio Hudson</b>
            </p>
            <Link
              href="/about"
              className="mt-6 inline-block text-sm text-whitegold/70 underline decoration-antique underline-offset-4"
            >
              More about Michael
            </Link>
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}
