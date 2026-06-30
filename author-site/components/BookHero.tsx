import Link from "next/link";
import { book, priceConfig } from "@/content/book";
import { BookMockup } from "@/components/BookMockup";
import { BookTilt } from "@/components/motion/BookTilt";
import { MagneticCurlButton } from "@/components/motion/MagneticCurlButton";

export function BookHero() {
  return (
    <section className="experience-surface relative overflow-hidden px-5 py-16 md:px-6 md:py-28">
      <div aria-hidden="true" className="hairline-orbit absolute -right-24 top-16 h-72 w-72 rounded-full md:h-[30rem] md:w-[30rem]" />
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-[1.05fr_0.95fr]">
        <div className="relative z-10">
          <p className="editorial-kicker">For freelance hairstylists</p>
          <h1 className="mt-5 max-w-4xl font-display text-5xl leading-[0.92] text-white sm:text-6xl md:text-7xl">You learned the craft. Nobody taught you the business.</h1>
          <p className="mt-6 max-w-2xl text-xl leading-8 text-whitegold md:text-2xl">{book.subtitle}</p>
          <p className="mt-6 max-w-2xl text-base leading-8 text-whitegold/80 md:text-lg">A grounded guide for freelance hairstylists navigating pricing, etiquette, leadership, burnout, and the quiet decisions that shape a sustainable creative career.</p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <MagneticCurlButton href="/preorder">Preorder — ${priceConfig.preorderDirect.amount.toFixed(2)}</MagneticCurlButton>
            <MagneticCurlButton href="/free-chapter" variant="secondary">Read Chapter 1 Free</MagneticCurlButton>
          </div>
          <p className="mt-5 text-sm text-whitegold/65">Direct launch price. Kindle (${priceConfig.kindleExternal.amount.toFixed(2)}) and paperback (${priceConfig.paperbackExternal.amount.toFixed(2)}) editions follow through their own stores.</p>
        </div>
        <div className="relative z-10">
          <BookTilt><BookMockup /></BookTilt>
          <Link href="/book" className="mx-auto mt-6 block max-w-xs text-center text-sm text-whitegold/70 underline decoration-antique underline-offset-4">See what the book covers</Link>
        </div>
      </div>
    </section>
  );
}
