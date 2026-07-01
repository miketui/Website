import { pageMetadata } from "@/lib/seo";
import { bookJsonLd, productJsonLd } from "@/lib/schema";
import { PageHero } from "@/components/design/PageHero";
import { Section } from "@/components/design/Section";
import { PricingCard } from "@/components/PricingCard";
import { ChapterPathway } from "@/components/motion/ChapterPathway";
import Image from "next/image";
import { priceConfig } from "@/content/book";

export const metadata = pageMetadata("Book", "Pricing, chapters, and the protected delivery path for Curls & Contemplation.", { path: "/book", image: "/gateway-cover.jpg" });

export default function Page() {
  return <main><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([bookJsonLd(), productJsonLd()]) }} /><PageHero eyebrow="Book" title="A map for the parts of this job nobody photographs." description="Creative identity, client experience, business rhythm, and the sustainability to keep doing this for years — without the fake promises or the countdown-timer urgency." primaryHref="/preorder" primaryLabel="Preorder — $17.99" secondaryHref="/free-chapter" secondaryLabel="Read Chapter 1 Free"><Image src="/gateway-cover.jpg" alt="Curls & Contemplation — cover" width={800} height={1200} className="mx-auto w-full max-w-xs rounded-lg shadow-gold" /></PageHero><Section eyebrow="Inside the book" title="Four parts, one calmer path."><ChapterPathway /><div className="mt-10"><PricingCard /></div><p className="mt-5 text-sm text-whitegold/70">Kindle (${priceConfig.kindleExternal.amount.toFixed(2)}) and paperback (${priceConfig.paperbackExternal.amount.toFixed(2)}) editions follow through their own stores.</p></Section></main>;
}
