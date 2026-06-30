import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/design/PageHero";
import { Section } from "@/components/design/Section";
import { WorksheetCard } from "@/components/WorksheetCard";
import { worksheets } from "@/content/worksheets";

export const metadata = pageMetadata("Worksheets", "Preview the worksheets that accompany the book.", { path: "/worksheets" });

export default function Page() {
  return <main><PageHero eyebrow="Worksheets" title="Turn reflection into a next action." description="The worksheet area previews practical tools that support the book. Final gated assets still require owner approval before launch." primaryHref="/preorder" primaryLabel="Preorder — $17.99" /><Section eyebrow="Preview" title="Two starter tools for the direct edition path."><div className="grid gap-5 md:grid-cols-2">{worksheets.map((worksheet) => <WorksheetCard key={worksheet.slug} worksheet={worksheet} />)}</div></Section></main>;
}
