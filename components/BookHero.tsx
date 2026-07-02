import Link from "next/link";
import Image from "next/image";
import { book, priceConfig } from "@/content/book";
import { BookTilt } from "@/components/motion/BookTilt";
import { MagneticCurlButton } from "@/components/motion/MagneticCurlButton";
import { ParallaxDepth } from "@/components/motion/ParallaxDepth";
import { CurlCluster, CurlBloom, GoldStrand } from "@/components/design/Flourish";

const heroResults = [
  "A rate you can say out loud — without flinching.",
  "Boundaries that hold, even when holding them costs you.",
  "A calendar that stays full without emptying you."
] as const;

/**
 * Homepage hero. Deliberately does NOT repeat the gateway's cold-open line
 * ("You learned the craft. Nobody taught you the business.") — the gateway
 * poses the problem; this hero sells the after-state: the results the reader
 * walks away holding. Silky curls drift at three parallax depths around a warm
 * "sunrise" surface — the lush 2.5D depth of the concept film.
 */
export function BookHero() {
  return (
    <section className="sunrise-surface flourish-field relative overflow-hidden px-5 py-20 md:px-6 md:py-28">
      <div aria-hidden="true" className="dawn-bloom pointer-events-none absolute inset-x-0 -top-10 mx-auto h-72 w-[42rem] max-w-full rounded-full" />
      <div aria-hidden="true" className="hairline-orbit absolute -right-24 top-16 h-72 w-72 rounded-full md:h-[30rem] md:w-[30rem]" />
      <div aria-hidden="true" className="flourish-layer">
        <ParallaxDepth speed={0.16} className="absolute -left-16 -top-14 w-48 md:-left-8 md:w-80">
          <CurlCluster side="left" className="flourish-item--sway [--strand-rotate:-16deg] opacity-80" />
        </ParallaxDepth>
        <ParallaxDepth speed={-0.07} className="absolute -right-14 top-[16%] w-36 md:w-56">
          <CurlCluster side="right" className="flourish-item--sway-slow [--strand-rotate:24deg] opacity-55" />
        </ParallaxDepth>
        <ParallaxDepth speed={0.1} className="absolute -bottom-16 left-[30%] hidden w-52 md:block">
          <span className="flourish-item flourish-item--sway block [--strand-rotate:148deg] opacity-45">
            <CurlBloom tone="mid" className="w-full" />
          </span>
        </ParallaxDepth>
      </div>
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-[1.05fr_0.95fr]">
        <div className="relative z-10">
          <p className="editorial-kicker">The guide behind the chair</p>
          <h1 className="hero-display mt-5 max-w-4xl font-display text-6xl leading-[0.9] text-white sm:text-7xl xl:text-8xl">
            Build the business your talent <span className="accent-italic text-dawn">already earned.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-xl leading-8 text-whitegold md:text-2xl">{book.subtitle}</p>
          <ul className="mt-7 max-w-2xl space-y-3 text-base leading-7 text-whitegold/85 md:text-lg">
            {heroResults.map((result) => (
              <li key={result} className="flex items-start gap-3.5">
                <span aria-hidden="true" className="circuit-dot mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full" />
                <span>{result}</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 max-w-2xl text-pretty text-base leading-8 text-whitegold/75 md:text-lg">
            The part of the job your training skipped &mdash; now written down, in order.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <MagneticCurlButton href="/preorder">Preorder &mdash; ${priceConfig.preorderDirect.amount.toFixed(2)}</MagneticCurlButton>
            <MagneticCurlButton href="/free-chapter" variant="secondary">Read Chapter 1 Free</MagneticCurlButton>
          </div>
          <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-whitegold/65">
            <span>Instant digital delivery</span>
            <span aria-hidden="true" className="text-antique">&middot;</span>
            <span>Launch price holds through release</span>
            <span aria-hidden="true" className="text-antique">&middot;</span>
            <span>Kindle ${priceConfig.kindleExternal.amount.toFixed(2)} &amp; paperback ${priceConfig.paperbackExternal.amount.toFixed(2)} to follow</span>
          </p>
        </div>
        <div className="relative z-10">
          <div className="relative mx-auto w-full max-w-sm">
            <span aria-hidden="true" className="strand-ornament -right-10 -top-7 z-10 w-52 md:-right-14">
              <GoldStrand className="w-full" />
            </span>
            <span aria-hidden="true" className="strand-ornament -bottom-6 -left-10 z-10 w-44 rotate-180">
              <GoldStrand className="w-full" />
            </span>
            <div className="hero-book-float">
              <BookTilt>
                <Image src="/gateway-cover.jpg" alt="Curls & Contemplation by Michael David — book cover" width={800} height={1200} priority className="mx-auto w-full max-w-sm rounded-lg shadow-gold" />
              </BookTilt>
            </div>
          </div>
          <Link href="/book" className="mx-auto mt-8 block max-w-xs text-center text-sm text-whitegold/70 underline decoration-antique underline-offset-4">See what the book covers</Link>
        </div>
      </div>
    </section>
  );
}
