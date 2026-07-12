import { PricingKitForm } from "@/components/PricingKitForm";
import { PageHero } from "@/components/design/PageHero";
import { Section } from "@/components/design/Section";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Free Detailed Pricing Guide for Hairstylists",
  "A practical seven-page guide to help freelance hairstylists calculate a rate floor, define scope, communicate prices, and protect sustainable boundaries.",
  { path: "/pricing-kit", image: "/gateway-cover.jpg" }
);

export default function PricingKitPage() {
  return (
    <main>
      <PageHero eyebrow="Free Detailed Pricing Guide" title="Price the work without apologizing for it." description="Use this seven-page decision guide to calculate your rate floor, define scope, choose a pricing model, communicate the number clearly, and protect sustainable boundaries." primaryHref="#get-kit" primaryLabel="Get the free guide" secondaryHref="/book" secondaryLabel="Explore the book" />
      <Section id="get-kit" eyebrow="Seven practical pages" title="Know the number. Define the scope. Hold the boundary.">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <PricingKitForm />
          <div className="editorial-panel rounded-3xl p-7">
            <p className="font-display text-3xl text-white">Inside the PDF</p>
            <ul className="mt-5 space-y-4 leading-7 text-whitegold/75">
              <li>— Rate-floor and billable-capacity worksheets for direct costs, overhead, compensation, and recovery.</li>
              <li>— Pricing-model and quote-scope comparisons for hourly, day, service, project, retainer, and usage work.</li>
              <li>— Policy prompts for deposits, cancellations, overtime, travel, add-ons, and scope changes.</li>
              <li>— Copy-ready pricing language, a 30-day evidence review, and a complete quote record.</li>
            </ul>
          </div>
        </div>
      </Section>
    </main>
  );
}
