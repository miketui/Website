import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/design/PageHero";
import { Section } from "@/components/design/Section";
import { PurchaseSummary } from "@/components/PurchaseSummary";
import { PreorderCheckout } from "@/components/PreorderCheckout";
import { priceConfig } from "@/content/book";
import { releaseDateLabel, resolveLaunchOffer } from "@/config/launchState";
import { productJsonLd, breadcrumbJsonLd } from "@/lib/schema";

export const metadata = pageMetadata("Buy Curls & Contemplation", "Buy the protected direct digital edition of Curls & Contemplation. Kindle and paperback store links will be added when confirmed.", { path: "/buy", image: "/gateway-cover.jpg" });

export default function Page() {
  // The charge follows the launch resolver server-side; the label reads off the
  // same object, so a displayed price can never disagree with the Stripe price.
  const offer = resolveLaunchOffer();
  const atRegularPrice = offer.priceTier === "regular";
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([productJsonLd(), breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Buy", path: "/buy" }])]) }} />
      <PageHero
        eyebrow="Purchase paths"
        title="Choose the format that fits how you read."
        description="The direct digital edition is delivered through your protected account — EPUB by signed link. Kindle and paperback editions link out to their stores as each goes live."
        secondaryHref="/book"
        secondaryLabel="Review the Book"
      >
        <div className="grid gap-3 text-sm text-whitegold/78">
          <p>Direct digital: {offer.priceLabel}{atRegularPrice ? "" : ` now — $${priceConfig.regularDirect.amount.toFixed(2)} from release day, ${releaseDateLabel()}`}</p>
          <p>Idea-to-Action Workbook: free with preorder; ${priceConfig.workbook.amount.toFixed(2)} from release day.</p>
          <p>Kindle and paperback: store links will appear here when confirmed.</p>
        </div>
      </PageHero>
      <Section eyebrow="Direct digital" title="Fast path, private delivery.">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <PreorderCheckout
            title="Direct digital edition"
            price={offer.priceLabel}
            ctaLabel={`${offer.state === "PREORDER" ? "Preorder" : "Buy the Book"} — ${offer.priceLabel}`}
            note={
              atRegularPrice
                ? "EPUB, delivered through your protected account the moment payment clears."
                : `EPUB through your protected account. $${priceConfig.regularDirect.amount.toFixed(2)} from release day, ${releaseDateLabel()} — the real schedule, the only urgency.`
            }
            sourcePage="/buy"
          />
          <PurchaseSummary />
        </div>
      </Section>
    </main>
  );
}
