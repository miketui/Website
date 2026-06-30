import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/design/PageHero";
import { Section } from "@/components/design/Section";
import { WorksheetCard } from "@/components/WorksheetCard";
import { worksheets } from "@/content/worksheets";

export const metadata = pageMetadata("Resources", "A quiet resource library for the work behind the work.", { path: "/resources" });

export default function Page() {
  return <main><PageHero eyebrow="Resources" title="Tools for the work behind the work." description="Resource-library surfaces are prepared for future expansion, without activating a live subscription offer." primaryHref="/worksheets" primaryLabel="Preview Worksheets" secondaryHref="/preorder" secondaryLabel="Preorder — $17.99" /><Section eyebrow="Scaffolded library" title="Useful, quiet, not overpromised."><div className="grid gap-5 md:grid-cols-2">{worksheets.map((worksheet) => <WorksheetCard key={worksheet.slug} worksheet={worksheet} />)}</div></Section></main>;
}
