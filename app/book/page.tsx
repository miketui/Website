import { pageMetadata } from "@/lib/seo";
import { bookJsonLd, productJsonLd } from "@/lib/schema";
import { PageHero } from "@/components/design/PageHero";
import { Section } from "@/components/design/Section";
import { PricingCard } from "@/components/PricingCard";
import { ChapterPathway } from "@/components/motion/ChapterPathway";
import { BookMockup } from "@/components/BookMockup";
import { priceConfig } from "@/content/book";

export const metadata = pageMetadata("Book", "The direct digital edition, pricing, and protected delivery path for Curls & Contemplation.", { path: "/book" });

export default function Page() {
  return <main><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([bookJsonLd(), productJsonLd()]) }} /><PageHero eyebrow="Book" title="A career map for the parts nobody puts on the mood board." description="Move from creative identity to client experience, business rhythm, and contemplative sustainability—without fake promises or inflated claims." primaryHref="/preorder" primaryLabel="Preorder — $17.99" secondaryHref="/free-chapter" secondaryLabel="Read Chapter 1 Free"><BookMockup /></PageHero><Section eyebrow="Inside the book" title="Four parts, one calmer path."><ChapterPathway /><div className="mt-10"><PricingCard /></div><p className="mt-5 text-sm text-whitegold/70">Kindle (${priceConfig.kindleExternal.amount.toFixed(2)}) and paperback (${priceConfig.paperbackExternal.amount.toFixed(2)}) editions follow through their own stores.</p></Section></main>;
}
