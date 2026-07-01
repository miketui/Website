import { BookGateway } from "@/components/gateway/BookGateway";
import { BookHero } from "@/components/BookHero";
import { Section } from "@/components/design/Section";
import { ExperienceCard } from "@/components/design/ExperienceCard";
import { EditorialGrid } from "@/components/design/EditorialGrid";
import { ChapterPathway } from "@/components/motion/ChapterPathway";
import { MagneticCurlButton } from "@/components/motion/MagneticCurlButton";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { Testimonials, AuthorNote } from "@/components/SocialProof";
import { bookJsonLd } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/content/site";

export const metadata = pageMetadata(
  "Freelance Hairstylist's Guide to Creative Excellence",
  siteConfig.description,
  { path: "/", image: "/gateway-cover.jpg" }
);

const problemCards = [
  ["Pricing", "You quote a number, watch their face, and start explaining before they've even said no. The work was never the hard part."],
  ["Networking", "Some people walk into a room and the room adjusts. You're just as good — you've just never been handed the script for how to say it."],
  ["On-set etiquette", "Nobody trains you on when to speak, when to disappear, or how fast to move when the schedule collapses in front of you. You learn it by flinching."],
  ["Burnout", "The book stays full. The hands stay steady. Something underneath it is running on fumes and nobody's asked about that part."],
  ["Leadership", "You call yourself a freelancer so no one expects you to lead. Every client in your chair is being led whether you name it or not."],
  ["Uncertainty", "The good weeks feel like luck. The slow weeks feel like a warning. Neither one tells you what actually happened."]
] as const;

export default function HomePage() {
  return (
    <main>
      <BookGateway />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(bookJsonLd()) }} />
      <BookHero />

      <Section eyebrow="The unspoken problem" title="Your hands know the work. Nobody handed you the rest of the job.">
        <p className="max-w-3xl">Technique gets taught. What happens after — the pricing conversation, the boundary that costs you a client if you hold it and costs you more if you don&rsquo;t, the quiet math of a full calendar that still doesn&rsquo;t feel like enough — gets learned alone, usually the expensive way.</p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {problemCards.map(([title, copy]) => <ExperienceCard key={title} title={title}>{copy}</ExperienceCard>)}
        </div>
      </Section>

      <ScrollReveal>
        <section className="mx-auto w-full max-w-4xl px-5 py-16 text-center md:px-6 md:py-24">
          <span aria-hidden="true" className="mx-auto mb-8 block h-px w-16 bg-jade" />
          <p className="font-display text-3xl leading-snug text-white md:text-5xl">
            You&rsquo;re not behind. You were never given the map.<span className="text-antique"> Here it is.</span>
          </p>
        </section>
      </ScrollReveal>

      <Section eyebrow="The path forward" title="Four parts. One calmer way through.">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="editorial-panel rounded-[2rem] p-6 md:p-8">
            <p>Curls & Contemplation moves in order on purpose: name what your work is actually worth, shape the client experience around that standard, build a business rhythm that doesn&rsquo;t eat the version of you that started this — and protect the quiet space that keeps your judgment sharp when the calendar won&rsquo;t.</p>
            <EditorialGrid>
              <ExperienceCard title="Worksheets">The audit tools — pricing, standards, next moves — you&rsquo;d otherwise have to build yourself at 1 a.m.</ExperienceCard>
              <ExperienceCard title="Resources">A member library taking shape behind the book. Nothing sold here that isn&rsquo;t ready yet.</ExperienceCard>
              <ExperienceCard title="Career map">Read it as a map, not a miracle. The chapters are sequenced; the decisions are still yours.</ExperienceCard>
            </EditorialGrid>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <MagneticCurlButton href="/preorder">Preorder — $17.99</MagneticCurlButton>
              <MagneticCurlButton href="/book" variant="secondary">Explore the Book</MagneticCurlButton>
            </div>
          </div>
          <ChapterPathway compact />
        </div>
      </Section>

      <Testimonials />
      <AuthorNote />
    </main>
  );
}
