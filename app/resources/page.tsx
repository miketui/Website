import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/design/PageHero";
import { Section } from "@/components/design/Section";
import { CaptureBand } from "@/components/CaptureBand";
import { WorksheetCard } from "@/components/WorksheetCard";
import { worksheets } from "@/content/worksheets";

export const metadata = pageMetadata("Resources", "Member resource library for Curls & Contemplation readers.", { path: "/resources", noIndex: true });

export default function Page() {
  return (
    <main>
      <PageHero
        eyebrow="Resources · Members"
        title="You made it in. Here's what's actually ready."
        description="This library grows as the book grows — nothing sold here that isn't finished, nothing promised that isn't real yet."
        primaryHref="/worksheets"
        primaryLabel="Preview Worksheets"
        secondaryHref="/book"
        secondaryLabel="Back to the Book"
      />
      <Section eyebrow="What's live now" title="Useful today, honest about what's next.">
        <div className="grid gap-5 md:grid-cols-2">{worksheets.map((worksheet) => <WorksheetCard key={worksheet.slug} worksheet={worksheet} />)}</div>
      </Section>
      <CaptureBand source="resources" heading="Know when the library grows." copy="Subscribers hear first when new worksheets and resources go live — plus the occasional letter on pricing, craft, and the business nobody taught you." />
    </main>
  );
}
