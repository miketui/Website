import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/design/PageHero";
import { Section } from "@/components/design/Section";
import { NewsletterForm } from "@/components/NewsletterForm";
import { challengeDays } from "@/content/funnels";

/**
 * Funnel 3 — the 5-Day "Price. Pitch. Protect." Challenge (LIVE, PRD v2 §4.8).
 * Pure email mechanism: signup → Day 1 lands the next morning → Day 5 pitch.
 * Day themes stay at headline level only; worksheet contents are never
 * previewed (no-spoiler doctrine). Reached by CTA/campaign traffic — no nav link.
 */
export const metadata = pageMetadata(
  "The 5-Day Price, Pitch, Protect Challenge",
  "Five days that change how you run your gift. One short brief each morning, one worksheet each evening — free, by email, no platform to join.",
  { path: "/challenge", image: "/gateway-cover.jpg" }
);

export default function Page() {
  return (
    <main>
      <PageHero
        eyebrow="Free · 5 days · by email"
        title="Price. Pitch. Protect. Five days that change how you run your gift."
        description="A pure email + worksheet challenge: one short brief each morning, one exercise each evening. No live calls, no platform to join — just the work, done."
      />
      <section className="mx-auto w-full max-w-4xl px-5 pb-6 md:px-6">
        <NewsletterForm
          source="challenge"
          heading="Join the challenge"
          copy="Day 1 lands tomorrow morning. Five briefs, five worksheets, then you keep the rhythm."
          cta="Join the Challenge"
        />
      </section>
      <Section eyebrow="The five days" title="One blind spot fixed per day.">
        <ol className="max-w-3xl space-y-4">
          {challengeDays.map((d) => (
            <li key={d.day} className="editorial-panel rounded-[1.5rem] p-5">
              <p className="editorial-kicker">Day {d.day}</p>
              <h3 className="mt-1 font-display text-2xl text-white">{d.title}</h3>
            </li>
          ))}
        </ol>
        <p className="mt-8 max-w-3xl text-sm leading-6 text-whitegold/70">Who it&rsquo;s for: the stylist whose hands are senior and whose prices are junior; the artist the room hasn&rsquo;t met yet; the fully booked professional running on fumes. If one of those is you, Day 1 is waiting.</p>
      </Section>
      <section className="mx-auto w-full max-w-4xl px-5 pb-20 md:px-6 md:pb-28">
        <NewsletterForm
          source="challenge"
          heading="Ready? It costs five evenings."
          copy="Sign up and Day 1 lands tomorrow morning."
          cta="Join the Challenge"
        />
      </section>
    </main>
  );
}
