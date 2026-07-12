import { PricingKitForm } from "@/components/PricingKitForm";
import { PageHero } from "@/components/design/PageHero";
import { Section } from "@/components/design/Section";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Free Pricing Confidence Checklist for Hairstylists",
  "A practical free checklist to help freelance hairstylists calculate a rate floor, communicate prices clearly, and protect sustainable boundaries.",
  { path: "/pricing-kit", image: "/gateway-cover.jpg" }
);

export default function PricingKitPage() {
  return (
    <main>
      <PageHero eyebrow="Free Pricing Confidence Kit" title="Price the work without apologizing for it." description="Use this focused checklist to calculate your rate floor, communicate the number clearly, and protect the boundaries that make excellent work sustainable." primaryHref="#get-kit" primaryLabel="Get the free checklist" secondaryHref="/book" secondaryLabel="Explore the book" />
      <Section id="get-kit" eyebrow="One page. Three decisions." title="Know the number. Say it clearly. Hold the boundary.">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <PricingKitForm />
          <div className="editorial-panel rounded-3xl p-7">
            <p className="font-display text-3xl text-white">Inside the PDF</p>
            <ul className="mt-5 space-y-4 leading-7 text-whitegold/75">
              <li>— A simple rate-floor calculation that includes both direct and indirect business costs.</li>
              <li>— A short script for stating your price without shrinking or overexplaining.</li>
              <li>— A boundary check for deposits, cancellations, notice periods, and discount requests.</li>
              <li>— A next-step prompt drawn from the business and financial practices in <em>Curls &amp; Contemplation</em>.</li>
            </ul>
          </div>
        </div>
      </Section>
    </main>
  );
}
