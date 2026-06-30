import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/design/PageHero";
import { Section } from "@/components/design/Section";
import { StagedNotice } from "@/components/StagedNotice";
import { challengeDays } from "@/content/funnels";

export const metadata = pageMetadata("The 5-Day Price, Pitch, Protect Challenge", "Five days. Five worksheets. One business blind spot fixed per day.", { path: "/challenge", noIndex: true });

export default function Page() {
  return (
    <main>
      <StagedNotice funnel="The 5-Day Challenge (Funnel 3)" />
      <PageHero
        eyebrow="Coming next"
        title="Five days. Five worksheets. One blind spot fixed per day."
        description="A pure email + worksheet challenge: one short brief each morning, one exercise each evening. No live calls required, no platform to join — just the work, done."
      />
      <Section eyebrow="The five days" title="Price. Pitch. Protect.">
        <ol className="max-w-3xl space-y-4">
          {challengeDays.map((d) => (
            <li key={d.day} className="editorial-panel rounded-[1.5rem] p-5">
              <p className="editorial-kicker">Day {d.day}</p>
              <h3 className="mt-1 font-display text-2xl text-white">{d.title}</h3>
            </li>
          ))}
        </ol>
        <p className="mt-8 max-w-3xl text-sm leading-6 text-whitegold/70">Registration opens with the launch calendar. Until then, the free chapter is the best first step — it&rsquo;s Day 1&rsquo;s thinking in long form.</p>
      </Section>
    </main>
  );
}
