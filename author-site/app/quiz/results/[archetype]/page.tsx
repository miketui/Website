import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/design/PageHero";
import { Section } from "@/components/design/Section";
import { StagedNotice } from "@/components/StagedNotice";
import { MagneticCurlButton } from "@/components/motion/MagneticCurlButton";
import { quizArchetypes } from "@/content/funnels";

export function generateStaticParams() {
  return quizArchetypes.map((a) => ({ archetype: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ archetype: string }> }) {
  const { archetype } = await params;
  const result = quizArchetypes.find((a) => a.slug === archetype);
  return pageMetadata(result ? result.name : "Quiz Result", "Your blind-spot diagnosis, mapped to the book.", { path: `/quiz/results/${archetype}`, noIndex: true });
}

export default async function Page({ params }: { params: Promise<{ archetype: string }> }) {
  const { archetype } = await params;
  const result = quizArchetypes.find((a) => a.slug === archetype);
  if (!result) notFound();

  return (
    <main>
      <StagedNotice funnel="Quiz results (Funnel 2)" />
      <PageHero eyebrow={`Your blind spot · ${result.bookPart}`} title={result.name} description={result.diagnosis} />
      <Section eyebrow="Start tonight" title="The fix begins with one worksheet and one chapter.">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          <div className="editorial-panel rounded-[2rem] p-6 md:p-8">
            <h3 className="font-display text-2xl text-white">Your free worksheet</h3>
            <p className="mt-3 text-sm leading-6 text-whitegold/70">One exercise from {result.bookPart}, designed to be finished in an evening. Delivered by email once the quiz goes live.</p>
            <h3 className="mt-8 font-display text-2xl text-white">The chapter that fixes it</h3>
            <p className="mt-3 text-sm leading-6 text-whitegold/70">Preview the matching chapter now — it&rsquo;s already public.</p>
            <div className="mt-6 flex flex-col gap-4 sm:flex-row">
              <MagneticCurlButton href={`/chapter/${result.chapterSlug}`} variant="secondary">Preview the Chapter</MagneticCurlButton>
            </div>
          </div>
          <div className="editorial-panel rounded-[2rem] p-6 md:p-8">
            <h3 className="font-display text-2xl text-white">The whole map</h3>
            <p className="mt-3 leading-8 text-whitegold/80">The book walks all four blind spots in sequence — start with {result.bookPart}, then keep going. $17.99 now, $19.99 fifteen days after release. That schedule is the only urgency here.</p>
            <div className="mt-6">
              <MagneticCurlButton href="/preorder">Preorder — $17.99</MagneticCurlButton>
            </div>
          </div>
        </div>
      </Section>
    </main>
  );
}
