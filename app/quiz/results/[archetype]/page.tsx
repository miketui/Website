import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/design/PageHero";
import { Section } from "@/components/design/Section";
import { MagneticCurlButton } from "@/components/motion/MagneticCurlButton";
import { quizArchetypes } from "@/content/funnels";
import { getLaunchStateCopy } from "@/config/launchState";

export function generateStaticParams() {
  return quizArchetypes.map((a) => ({ archetype: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ archetype: string }> }) {
  const { archetype } = await params;
  const result = quizArchetypes.find((a) => a.slug === archetype);
  /* Personalized variants stay noindex — /quiz is the indexed landing target. */
  return pageMetadata(result ? result.name : "Quiz Result", "Your blind-spot diagnosis, mapped to the book.", { path: `/quiz/results/${archetype}`, noIndex: true });
}

export default async function Page({ params }: { params: Promise<{ archetype: string }> }) {
  const { archetype } = await params;
  const result = quizArchetypes.find((a) => a.slug === archetype);
  if (!result) notFound();
  const launch = getLaunchStateCopy();

  return (
    <main>
      <PageHero eyebrow={`Your focus · ${result.focus}`} title={result.name} description={result.diagnosis} />
      <Section eyebrow="Start tonight" title="The shift begins with one honest worksheet.">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          <div className="editorial-panel rounded-[2rem] p-6 md:p-8">
            <h3 className="font-display text-2xl text-white">Your free worksheet</h3>
            <p className="mt-3 text-sm leading-6 text-whitegold/70">One exercise for {result.focus.toLowerCase()}, designed to be finished in an evening. Take the quiz and it lands in your inbox with your full diagnosis.</p>
            <h3 className="mt-8 font-display text-2xl text-white">Continue the work</h3>
            <p className="mt-3 text-sm leading-6 text-whitegold/70">The complete book connects this focus to the rest of your creative and business practice.</p>
            <div className="mt-6 flex flex-col gap-4 sm:flex-row">
              <MagneticCurlButton href="/book" variant="secondary">Explore the Book</MagneticCurlButton>
            </div>
          </div>
          <div className="editorial-panel rounded-[2rem] p-6 md:p-8">
            <h3 className="font-display text-2xl text-white">The journey was written for exactly this</h3>
            <p className="mt-3 leading-8 text-whitegold/80">The book connects pricing, visibility, sustainable rhythm, and leadership without turning them into a rigid formula. {launch.priceCopy}; {launch.deliveryCopy.toLowerCase()}.</p>
            <div className="mt-6">
              <MagneticCurlButton href={launch.heroCta.href}>{launch.finalCtaLabel}</MagneticCurlButton>
            </div>
          </div>
        </div>
      </Section>
    </main>
  );
}
