import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/design/PageHero";
import { Section } from "@/components/design/Section";
import { WorksheetCard } from "@/components/WorksheetCard";
import { CaptureBand } from "@/components/CaptureBand";
import { worksheets } from "@/content/worksheets";

export const metadata = pageMetadata("Worksheets", "Preview the worksheets that accompany the book.", { path: "/worksheets", noIndex: true });

export default function Page() {
  return <main><PageHero eyebrow="Worksheets" title="Turn reflection into a next action." description="Every chapter of the book ends in a worksheet — the audit you'd otherwise build yourself at 1 a.m. Preview two of them here; the full set ships with the book." primaryHref="/preorder" primaryLabel="Preorder — $17.99" /><Section eyebrow="Preview" title="Two starter tools for the direct edition path."><div className="grid gap-5 md:grid-cols-2">{worksheets.map((worksheet) => <WorksheetCard key={worksheet.slug} worksheet={worksheet} />)}</div></Section><CaptureBand source="worksheets" heading="Get the worksheets as they ship." copy="Subscribers hear first when new tools go live — plus the occasional letter on pricing, craft, and the business nobody taught you." /></main>;
}
