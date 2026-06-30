import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { chapters } from "@/content/chapters";
import { PageHero } from "@/components/design/PageHero";
import { Section } from "@/components/design/Section";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() { return chapters.map((chapter) => ({ slug: chapter.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const chapter = chapters.find((item) => item.slug === slug);
  if (!chapter) return pageMetadata("Chapter Preview", "Curls & Contemplation chapter preview.", { path: "/chapters" });
  return pageMetadata(chapter.title, chapter.excerpt, { path: `/chapter/${chapter.slug}` });
}

export default async function ChapterPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const chapter = chapters.find((item) => item.slug === slug);
  if (!chapter) notFound();
  return <main><PageHero eyebrow="Chapter preview" title={chapter.title} description={chapter.excerpt} primaryHref="/free-chapter" primaryLabel="Read Chapter 1 Free" secondaryHref="/chapters" secondaryLabel="All Chapters" /><Section eyebrow="Preview" title="A grounded step in the larger path."><p>This chapter preview keeps the public page useful without exposing paid book files. Full deliverables remain protected behind entitlement checks.</p></Section></main>;
}
