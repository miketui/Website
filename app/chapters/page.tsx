import { pageMetadata } from "@/lib/seo";
import { Section } from "@/components/design/Section";
import { PageHero } from "@/components/design/PageHero";
import { ChapterPathway } from "@/components/motion/ChapterPathway";
export const metadata = pageMetadata("Chapters", "The four-part chapter pathway of Curls & Contemplation.", { path: "/chapters" });
export default function ChaptersPage() { return <main><PageHero eyebrow="Chapter pathway" title="Move through the work with intention." description="A four-part structure for creative standards, client experience, business rhythm, and reflective sustainability." primaryHref="/preorder" primaryLabel="Preorder — $17.99" secondaryHref="/free-chapter" secondaryLabel="Read Chapter 1 Free" /><Section eyebrow="Pathway" title="Each chapter is a step, not a shortcut."><ChapterPathway /></Section></main>; }
