import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/design/PageHero";
import { Section } from "@/components/design/Section";
import { StagedNotice } from "@/components/StagedNotice";
import { quizArchetypes, quizQuestions } from "@/content/funnels";

export const metadata = pageMetadata("The Stylist Blind-Spot Quiz", "Your craft isn't the problem. Find your blind spot in 90 seconds.", { path: "/quiz", noIndex: true });

export default function Page() {
  return (
    <main>
      <StagedNotice funnel="The Blind-Spot Quiz (Funnel 2)" />
      <PageHero
        eyebrow="Coming next"
        title="Your craft isn't the problem. Find your blind spot in 90 seconds."
        description="Six questions. One honest diagnosis, mapped to the part of the book that fixes it — with a free worksheet to start on tonight."
      />
      <Section eyebrow="The six questions" title="What the quiz will ask.">
        <ol className="max-w-3xl list-decimal space-y-3 pl-6 text-whitegold/80">
          {quizQuestions.map((q) => (
            <li key={q}>{q}</li>
          ))}
        </ol>
      </Section>
      <Section eyebrow="The four blind spots" title="Every result maps to a part of the book.">
        <div className="grid gap-4 sm:grid-cols-2">
          {quizArchetypes.map((a) => (
            <Link key={a.slug} href={`/quiz/results/${a.slug}`} className="editorial-panel block rounded-[1.5rem] p-6 transition hover:border-antique/60">
              <p className="editorial-kicker">{a.bookPart}</p>
              <h3 className="mt-2 font-display text-3xl text-white">{a.name}</h3>
              <p className="mt-3 text-sm leading-6 text-whitegold/70">{a.diagnosis}</p>
            </Link>
          ))}
        </div>
      </Section>
    </main>
  );
}
