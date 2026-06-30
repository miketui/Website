import { pageMetadata } from "@/lib/seo";
import { faqJsonLd } from "@/lib/schema";
import { PageHero } from "@/components/design/PageHero";
import { Section } from "@/components/design/Section";
import { FAQAccordion } from "@/components/FAQAccordion";

export const metadata = pageMetadata("FAQ", "Frequently asked questions for direct digital delivery.", { path: "/faq" });

export default function Page() {
  return <main><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd()) }} /><PageHero eyebrow="FAQ" title="Clear answers before checkout." description="Pricing, delivery, files, and subscriptions are explained plainly so the purchase path stays calm." primaryHref="/preorder" primaryLabel="Preorder — $17.99" /><Section eyebrow="Answers" title="No hype. Just the useful details."><FAQAccordion /></Section></main>;
}
