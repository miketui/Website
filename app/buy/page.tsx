import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/design/PageHero";
import { Section } from "@/components/design/Section";
import { PurchaseSummary } from "@/components/PurchaseSummary";
import { PreorderCheckout } from "@/components/PreorderCheckout";
import { priceConfig } from "@/content/book";
import { getLaunchMode } from "@/lib/env";

export const metadata = pageMetadata("Buy", "Choose the format that fits how you read — direct digital, Kindle, or paperback.", { path: "/buy" });

export default function Page() {
  // The charge follows launch mode server-side; the label must tell the same story.
  const launched = getLaunchMode() === "launched";
  const price = launched ? priceConfig.regularDirect.amount : priceConfig.preorderDirect.amount;
  return (
    <main>
      <PageHero
        eyebrow="Purchase paths"
        title="Choose the format that fits how you read."
        description="The direct digital edition is delivered through your protected account — EPUB by signed link. Kindle and paperback editions link out to their stores as each goes live."
        secondaryHref="/book"
        secondaryLabel="Review the Book"
      >
        <div className="grid gap-3 text-sm text-whitegold/78">
          <p>Direct digital: ${price.toFixed(2)}{launched ? "" : ` now — $${priceConfig.regularDirect.amount.toFixed(2)} fifteen days after release`}</p>
          <p>Kindle (external store): ${priceConfig.kindleExternal.amount.toFixed(2)}</p>
          <p>Paperback (external, arrives with launch): ${priceConfig.paperbackExternal.amount.toFixed(2)}</p>
        </div>
      </PageHero>
      <Section eyebrow="Direct digital" title="Fast path, private delivery.">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <PreorderCheckout
            title="Direct digital edition"
            price={`$${price.toFixed(2)}`}
            ctaLabel={`${launched ? "Buy the Book" : "Preorder"} — $${price.toFixed(2)}`}
            note={
              launched
                ? "EPUB, delivered through your protected account the moment payment clears."
                : `EPUB through your protected account. $${priceConfig.regularDirect.amount.toFixed(2)} fifteen days after release — the real schedule, the only urgency.`
            }
            sourcePage="/buy"
          />
          <PurchaseSummary />
        </div>
      </Section>
    </main>
  );
}
