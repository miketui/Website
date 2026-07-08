import { notFound } from "next/navigation";
import { chapters } from "@/content/chapters";
import { PageHero } from "@/components/design/PageHero";
import { Section } from "@/components/design/Section";
import { CaptureBand } from "@/components/CaptureBand";
import { pageMetadata, absoluteUrl } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/schema";
import { book } from "@/content/book";

export function generateStaticParams() { return chapters.map((chapter) => ({ slug: chapter.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const chapter = chapters.find((item) => item.slug === slug);
  if (!chapter) return pageMetadata("Chapter Preview", "Curls & Contemplation chapter preview.", { path: "/chapters" });
  return pageMetadata(`${chapter.title} — Chapter Preview`, `${chapter.excerpt} ${chapter.focus}`, { path: `/chapter/${chapter.slug}` });
}

/** schema.org Chapter, tied to the parent Book — unique structured data per
 *  preview page (audit P1: chapter dedupe + expanded schema). */
function chapterJsonLd(chapter: (typeof chapters)[number]) {
  return {
    "@context": "https://schema.org",
    "@type": "Chapter",
    name: chapter.title,
    description: chapter.excerpt,
    url: absoluteUrl(`/chapter/${chapter.slug}`),
    isPartOf: { "@type": "Book", name: book.title, author: { "@type": "Person", name: book.author }, url: absoluteUrl("/book") }
  };
}

export default async function ChapterPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const chapter = chapters.find((item) => item.slug === slug);
  if (!chapter) notFound();
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(chapterJsonLd(chapter)) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd([{ name: "Chapters", path: "/chapters" }, { name: chapter.title, path: `/chapter/${chapter.slug}` }]))
        }}
      />
      <PageHero eyebrow="Chapter preview" title={chapter.title} description={chapter.excerpt} primaryHref="/free-chapter" primaryLabel="Read Chapter 1 Free" secondaryHref="/chapters" secondaryLabel="All Chapters" />
      <Section eyebrow="The focus" title={chapter.focus}>
        <ul className="max-w-3xl space-y-4">
          {chapter.takeaways.map((takeaway) => (
            <li key={takeaway} className="flex items-start gap-3.5 text-whitegold/85">
              <span aria-hidden="true" className="circuit-dot mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full" />
              <span>{takeaway}</span>
            </li>
          ))}
        </ul>
        <p className="mt-8 max-w-3xl text-sm leading-7 text-whitegold/60">
          This preview stays at the theme level on purpose — the full chapter, its worksheet, and the guided prompts unlock with the book. Paid deliverables remain protected behind entitlement checks.
        </p>
      </Section>
      <CaptureBand source="chapter" heading="Start with Chapter 1 — free." copy="Join the letters and the full Chapter 1 PDF lands in your inbox tonight, with the Pricing Confidence Checklist alongside it." />
    </main>
  );
}
