import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/design/PageHero";
import { Section } from "@/components/design/Section";
import { CaptureBand } from "@/components/CaptureBand";
import { MouseScrubVideo } from "@/components/motion/MouseScrubVideo";
import Image from "next/image";

export const metadata = pageMetadata("About", "Michael David writes Curls & Contemplation from lived hairstylist practice, not borrowed theory.", { path: "/about" });

export default function Page() {
  return (
    <main>
      <PageHero
        eyebrow="About Michael"
        title="Brooklyn taught me the chair. The rest I learned the expensive way."
        description="Michael David is a working hairstylist and creative director, raised in Brooklyn and based in Los Angeles now. Curls & Contemplation is what he wishes someone had handed him before the bookings got real."
        primaryHref="/book"
        primaryLabel="Explore the Book"
        secondaryHref="/contact"
        secondaryLabel="Contact"
      />
      <Section eyebrow="The vantage point" title="Written from the chair, not the podium.">
        <div className="grid gap-10 md:grid-cols-[0.7fr_1.3fr] md:items-start">
          <Image src="/michael-david-author.webp" alt="Michael David, author and hairstylist" width={800} height={1035} className="w-full rounded-[2rem] border border-antique/30 object-cover" />
          <div><p className="max-w-3xl">Every page of this book grew from the real questions creative professionals carry: how to refine a distinct voice, build relationships without performing, price from evidence, protect recovery, lead before a title arrives, and keep learning without losing the center of the work.</p>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-whitegold/70">Michael writes with the belief that hairstyling holds more than appearance. It carries identity, confidence, culture, service, and transformation. The book turns that belief into practical audits, quizzes, reflection prompts, financial exercises, and commitments a reader can use.</p></div>
        </div>
      </Section>
      <MouseScrubVideo src="/curl-scrub.mp4" webmSrc="/curl-scrub.webm" poster="/curl-poster.jpg">
        <div className="mx-auto max-w-4xl px-5 py-28 text-center md:py-40">
          <p className="editorial-kicker mb-4">Behind the chair</p>
          <p className="hero-display font-display text-3xl leading-tight text-white md:text-5xl">
            The quiet is where the <span className="accent-italic text-dawn">judgment sharpens.</span>
          </p>
          <p className="mt-5 hidden text-[0.65rem] uppercase tracking-[0.3em] text-whitegold/70 md:block">Move your cursor &mdash; carry the light through the strands</p>
        </div>
      </MouseScrubVideo>
      <Section eyebrow="Beyond the chair" title="The work that shapes the writing.">
        <p className="max-w-3xl">Outside the book, Michael leads Haus of Basquiat, a ballroom community built on the same principle the book runs on: standards and belonging aren&rsquo;t opposites. Chosen family, competitive craft, and real accountability can share a room. That&rsquo;s the same tension every freelancer navigates alone in their own business — how to hold a standard without losing the people it&rsquo;s for.</p>
      </Section>
      <CaptureBand source="about" heading="Read the way he writes." copy="One welcome note, then the occasional letter on pricing, craft, and the business nobody taught you. Start with the free Pricing Confidence Checklist. No spam." />
    </main>
  );
}
