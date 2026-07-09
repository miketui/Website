import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/design/PageHero";
import { Section } from "@/components/design/Section";
import { getLaunchStateCopy } from "@/config/launchState";
import { breadcrumbJsonLd } from "@/lib/schema";

export const metadata = pageMetadata(
  "The RESET Method",
  "A calm, reflective practice for freelance hairstylists — a way to pause between clients and think clearly, drawn from the Contemplation chapter of Curls & Contemplation.",
  { path: "/reset", image: "/gateway-cover.jpg" }
);

/* Reframed from the "Contemplation" chapter takeaways (content/chapters.ts) into a
   soft, reflective practice. No medical claims — this is a habit of attention, not
   therapy or treatment. */
const practices = [
  [
    "Notice the full book that still feels empty",
    "A calendar can be packed and something underneath it still runs low. The first move isn't to push harder. It's to name, plainly, what's actually draining and what's feeding you."
  ],
  [
    "Take the small reset, not the retreat",
    "You don't need a week away to think clearly. You need the two honest minutes between clients — a breath, a question, a note to yourself — used on purpose instead of spent scrolling."
  ],
  [
    "Choose the next move from intention",
    "Momentum will happily make your decisions for you. The reset is where you step out of the current long enough to ask whether the direction is still yours."
  ]
] as const;

export default function ResetPage() {
  const launch = getLaunchStateCopy();
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "The RESET Method", path: "/reset" }
            ])
          )
        }}
      />
      <PageHero
        eyebrow="The reset"
        title="A quieter place to think."
        description="The reset is the part of the craft nobody schedules — the pause where you set the work down for a moment and pick your own head back up. It's the through-line of the Contemplation chapter, pulled out here on its own."
        primaryHref={launch.heroCta.href}
        primaryLabel={launch.heroCta.label}
        secondaryHref="/free-chapter"
        secondaryLabel="Read Chapter 1 Free"
      >
        <p className="text-sm leading-7 text-whitegold/80">
          This isn&rsquo;t therapy and it isn&rsquo;t a cure for anything. It&rsquo;s a working habit
          of paying attention &mdash; small, repeatable, and yours. Keep what serves you;
          leave the rest.
        </p>
      </PageHero>

      <Section eyebrow="Why it matters" title="Steady hands, quieter head.">
        <p className="max-w-3xl">
          Technique keeps you booked. What keeps you <em>in it</em> &mdash; for years, not seasons &mdash;
          is the ability to step back and see your own work clearly without the spiral. Most of us
          learned everything about the chair and nothing about the pause. The reset is that missing
          part, treated as a skill you can practice rather than a luxury you keep postponing.
        </p>
        <p className="mt-6 max-w-3xl">
          None of this asks you to slow down your business. It asks you to protect the small amount of
          quiet that keeps your judgment sharp when the calendar won&rsquo;t. That&rsquo;s the whole method:
          notice, pause, choose &mdash; then get back to the work you love.
        </p>
      </Section>

      <Section eyebrow="The practice" title="Three small moves.">
        <div className="mt-2 grid gap-5 md:grid-cols-3">
          {practices.map(([title, copy]) => (
            <div key={title} className="glass-panel rounded-[1.75rem] p-6">
              <h3 className="font-display text-xl leading-tight text-antique">{title}</h3>
              <span aria-hidden="true" className="mt-3 block h-px w-10 bg-antique/70" />
              <p className="mt-4 text-sm leading-7 text-whitegold/80">{copy}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Where it lives" title="The reset is one chapter of a longer walk.">
        <p className="max-w-3xl">
          The full practice sits inside <em>Curls &amp; Contemplation</em> &mdash; sequenced after the
          pricing, the client experience, and the business rhythm, because you protect your quiet best
          once the rest is steady. If this is the part you needed to hear first, start with the free
          chapter and see whether the voice fits.
        </p>
        <p className="mt-8">
          <Link href="/book" className="text-sm text-mist underline decoration-jade underline-offset-4 transition hover:text-white">
            See where the reset sits in the book &rarr;
          </Link>
        </p>
      </Section>
    </main>
  );
}
