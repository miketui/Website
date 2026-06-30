import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/design/PageHero";
import { Section } from "@/components/design/Section";
import { PurchaseSummary } from "@/components/PurchaseSummary";
import { PreorderCheckout } from "@/components/PreorderCheckout";
import { priceConfig } from "@/content/book";

export const metadata = pageMetadata("Preorder", "Reserve the direct digital edition of Curls & Contemplation at the $17.99 launch price.", { path: "/preorder" });

export default function Page() {
  return (
    <main>
      <PageHero
        eyebrow="Direct preorder"
        title="Reserve the direct edition."
        description="The launch price is $17.99 — and stays there through the first fifteen days after release, then becomes $19.99 permanently. Pay today; your EPUB and PDF unlock in your account on release day, with a receipt now and a download note the moment they're live."
        primaryHref="#checkout"
        primaryLabel="Continue to Checkout"
        secondaryHref="/free-chapter"
        secondaryLabel="Read Chapter 1 Free"
      >
        <ul className="space-y-3 text-sm leading-6 text-whitegold/78">
          <li>• EPUB/PDF delivered from private storage only — signed links, 3 downloads over 7 days.</li>
          <li>• Regular direct price becomes ${priceConfig.regularDirect.amount.toFixed(2)} after the launch window.</li>
          <li>• Refunds are a support email away; they close download access. Honest both ways.</li>
        </ul>
      </PageHero>
      <Section eyebrow="Checkout" title="What happens after you pay." id="checkout">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <PreorderCheckout />
          <PurchaseSummary />
        </div>
      </Section>
    </main>
  );
}
