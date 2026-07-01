import Link from "next/link";
import Image from "next/image";
import { book, priceConfig } from "@/content/book";
import { BookTilt } from "@/components/motion/BookTilt";
import { MagneticCurlButton } from "@/components/motion/MagneticCurlButton";

/**
 * Homepage hero. Deliberately does NOT repeat the gateway's cold-open line
 * ("You learned the craft. Nobody taught you the business.") — the gateway
 * poses the problem; this hero delivers the promise on a warm "sunrise"
 * surface with claim-safe trust microcopy.
 */
export function BookHero() {
  return (
    <section className="sunrise-surface relative overflow-hidden px-5 py-20 md:px-6 md:py-28">
      <div aria-hidden="true" className="dawn-bloom pointer-events-none absolute inset-x-0 -top-10 mx-auto h-72 w-[42rem] max-w-full rounded-full" />
      <div aria-hidden="true" className="hairline-orbit absolute -right-24 top-16 h-72 w-72 rounded-full md:h-[30rem] md:w-[30rem]" />
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-[1.05fr_0.95fr]">
        <div className="relative z-10">
          <p className="editorial-kicker">The guide behind the chair</p>
          <h1 className="hero-display mt-5 max-w-4xl font-display text-5xl leading-[0.92] text-white sm:text-6xl md:text-7xl">
            Build the business your <span className="text-dawn">talent already earned.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-xl leading-8 text-whitegold md:text-2xl">{book.subtitle}</p>
          <p className="mt-6 max-w-2xl text-pretty text-base leading-8 text-whitegold/80 md:text-lg">
            Pricing you can say out loud without flinching. Boundaries that hold. A calendar that stays full without emptying you. The part of the job your training skipped &mdash; now written down, in order.
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
          <BookTilt>
            <Image src="/gateway-cover.jpg" alt="Curls & Contemplation by Michael David — book cover" width={800} height={1200} priority className="mx-auto w-full max-w-sm rounded-lg shadow-gold" />
          </BookTilt>
          <Link href="/book" className="mx-auto mt-6 block max-w-xs text-center text-sm text-whitegold/70 underline decoration-antique underline-offset-4">See what the book covers</Link>
        </div>
      </div>
    </section>
  );
}
