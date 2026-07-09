import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/design/PageHero";
import { Section } from "@/components/design/Section";
import { FreeChapterForm } from "@/components/FreeChapterForm";
import { MotionAsset } from "@/components/motion/MotionAsset";

export const metadata = pageMetadata("Free Chapter", "Read Chapter 1 of Curls & Contemplation free — plus the Pricing Confidence Checklist, delivered instantly.", { path: "/free-chapter", image: "/gateway-cover.jpg" });

export default function Page() {
  return (
    <main>
      <PageHero
        eyebrow="Free chapter"
        title="Read Chapter 1 tonight — free."
        description="Your craft is not the problem. Start the book where the path starts: the first chapter, plus the one-page Pricing Confidence Checklist, delivered to your inbox the moment you ask."
        primaryHref="#get-chapter"
        primaryLabel="Get Chapter 1"
        secondaryHref="/chapters"
        secondaryLabel="Preview Chapters"
      />
      <Section eyebrow="Get Chapter 1" title="In your inbox in under a minute." id="get-chapter">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <FreeChapterForm />
          <div className="space-y-6">
            {/* F — FREE-CHAPTER PEEK. Pages turning under gold light (4:3,
                scroll-once): plays once on first view, then holds the last
                frame. Poster-only under prefers-reduced-motion; reserved
                aspect keeps CLS at 0. */}
            <MotionAsset id="F" className="rounded-3xl border border-whitegold/10">
              <p className="text-xs uppercase tracking-[0.28em] text-whitegold/80">A look inside Chapter 1</p>
            </MotionAsset>
            <div className="editorial-panel rounded-3xl p-6">
            <p className="text-whitegold/80">What arrives, instantly:</p>
            <ul className="mt-4 space-y-3 text-whitegold/70">
              <li>— Chapter 1 of Curls &amp; Contemplation as a designed PDF excerpt.</li>
              <li>— The Pricing Confidence Checklist: one page, the pricing chapter distilled.</li>
              <li>— One honest note on the launch price: $17.99 through the first fifteen days after release, then $19.99 permanently. That schedule is real, and it is the only urgency you will ever get from me.</li>
            </ul>
            </div>
          </div>
        </div>
      </Section>
    </main>
  );
}
