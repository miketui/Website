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
  ["Pricing", "You can create beautiful work and still hesitate when it is time to name the number."],
  ["Networking", "Rooms move differently when you know how to introduce your value without shrinking it."],
  ["On-set etiquette", "Talent matters. So do timing, discretion, prep, cleanup, and reading the room."],
  ["Burnout", "The calendar can look full while your creative confidence quietly thins out."],
  ["Leadership", "Freelance does not mean leaderless. Your standards still need a spine."],
  ["Uncertainty", "The next booking feels less frightening when your decisions have a repeatable map."]
] as const;

export default function HomePage() {
  return (
    <main>
      <BookGateway />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(bookJsonLd()) }} />
      <BookHero />

      <Section eyebrow="The unspoken problem" title="Your craft is not the problem. The missing business map is.">
        <p className="max-w-3xl">The chair, the set, and the client relationship ask for more than technique. They ask for judgment under pressure, boundaries without coldness, and a way to keep your creativity intact while the business grows up around it.</p>
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

      <Section eyebrow="The path forward" title="A four-part path from creative identity to sustainable rhythm.">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="editorial-panel rounded-[2rem] p-6 md:p-8">
            <p>Curls & Contemplation turns scattered lessons into a calmer sequence: define the standard, shape the client experience, understand the business rhythm, and protect the reflective space that keeps the work honest.</p>
            <EditorialGrid>
              <ExperienceCard title="Worksheets">Preview scaffolded tools for auditing service, standards, and next moves.</ExperienceCard>
              <ExperienceCard title="Resources">A future library structure is prepared without advertising a live subscription.</ExperienceCard>
              <ExperienceCard title="Career map">Use the chapters as a map, not a magic promise.</ExperienceCard>
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
