import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/design/PageHero";
import { QuizFlow } from "@/components/QuizFlow";

/**
 * Funnel 2 — the Stylist Blind-Spot Quiz (LIVE, PRD v2 §4.7).
 * Segmentation engine: 6 questions → email gate → /quiz/results/[archetype].
 * Reached by CTA/campaign traffic only — never linked from primary nav.
 * Indexed: funnel pages are legitimate landing targets (PRD §3.2); the four
 * result pages stay noindex so the personalized variants don't compete.
 */
export const metadata = pageMetadata(
  "The Stylist Blind-Spot Quiz",
  "Every artist has one blind spot holding the whole vision back. Find yours in six questions — 90 seconds, one honest diagnosis, one free worksheet.",
  { path: "/quiz", image: "/gateway-cover.jpg" }
);

export default function Page() {
  return (
    <main>
      <PageHero
        eyebrow="90 seconds · free"
        title="Every artist has one blind spot holding the whole vision back."
        description="Six questions, no right answers — only the one that sounds most like you right now. At the end: your blind spot named, the part of the book that addresses it, and a free worksheet to start on tonight."
      />
      <section className="mx-auto w-full max-w-4xl px-5 pb-20 md:px-6 md:pb-28">
        <QuizFlow />
      </section>
    </main>
  );
}
