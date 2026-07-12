import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/design/PageHero";
import { Section } from "@/components/design/Section";
import { PurchaseSummary } from "@/components/PurchaseSummary";
import { PreorderCheckout } from "@/components/PreorderCheckout";
import { PreorderCountdown } from "@/components/PreorderCountdown";
import { MotionAsset } from "@/components/motion/MotionAsset";
import { KineticHeadline } from "@/components/motion/KineticHeadline";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { priceConfig } from "@/content/book";
import { releaseDateLabel } from "@/config/launchState";
import { productJsonLd, breadcrumbJsonLd } from "@/lib/schema";

export const metadata = pageMetadata("Preorder", "Reserve the direct digital edition of Curls & Contemplation at the $17.99 launch price.", { path: "/preorder", image: "/gateway-cover.jpg" });

export default function Page() {
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd()) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Preorder", path: "/preorder" }
            ])
          )
        }}
      />
      {/* L — THE CROWN. Preorder hero motion (16:9), placed above the offer with a
          kinetic-type overline and the live countdown. Reserved dims + poster keep
          it CLS-safe and off the LCP path; reduced motion shows the poster only. */}
      <section className="relative overflow-hidden px-5 pt-12 md:px-6 md:pt-16">
        <div className="mx-auto max-w-5xl">
          <MotionAsset id="L" priority className="rounded-[2rem] border border-whitegold/10 shadow-gold">
            <KineticHeadline text="The crown is earned, then worn." className="text-2xl md:text-4xl" accentFrom={3} />
          </MotionAsset>
          <div className="mt-8">
            <p className="mb-4 text-center text-xs uppercase tracking-[0.3em] text-whitegold/70">
              Releasing {releaseDateLabel()}
            </p>
            <PreorderCountdown />
          </div>
        </div>
      </section>

      <PageHero
        eyebrow="Direct preorder"
        title="Reserve the direct edition."
        description="The launch price is $17.99 — and stays there through the first fifteen days after release, then becomes $19.99 permanently. Pay today; your EPUB unlocks in your account on release day, with a receipt now and a download note the moment it's live."
        primaryHref="#checkout"
        primaryLabel="Continue to Checkout"
        secondaryHref="/pricing-kit"
        secondaryLabel="Get the Free Pricing Kit"
      >
        <ul className="space-y-3 text-sm leading-6 text-whitegold/78">
          <li>• EPUB delivered from private storage only — signed links, 3 downloads over 7 days.</li>
          <li>• <span className="text-antique font-semibold">Preorder gift:</span> the $19.99 Idea-to-Action Workbook — free with every preorder. Interactive on the site plus a printable PDF, unlocked with your book.</li>
          <li>• Regular direct price becomes ${priceConfig.regularDirect.amount.toFixed(2)} after the launch window.</li>
          <li>• Refunds are a support email away; they close download access. Honest both ways.</li>
        </ul>
      </PageHero>
      {/* K — THE HANDS. An emotional beat before the ask. DEFERRED (real footage
          required), so MotionAsset renders poster-only with its own TODO marker —
          no invented substitute, no <video> mounted. */}
      <ScrollReveal>
        <section className="relative overflow-hidden px-5 py-10 md:px-6 md:py-16">
          <div className="mx-auto grid max-w-5xl items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="editorial-kicker mb-4">Before you decide</p>
              <p className="max-w-xl font-display text-2xl leading-snug text-white md:text-3xl">
                These are working hands. This book is for what they carry.
              </p>
              <p className="mt-4 max-w-xl leading-8 text-whitegold/80">
                Everything after this page is practical &mdash; pricing, boundaries, the
                rhythm that keeps you in the chair for years. This is just the moment
                before you say yes to it.
              </p>
            </div>
            <div className="mx-auto w-full max-w-md">
              <MotionAsset id="K" className="rounded-[2rem] border border-whitegold/10" />
            </div>
          </div>
        </section>
      </ScrollReveal>

      <Section eyebrow="Checkout" title="What happens after you pay." id="checkout">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <PreorderCheckout />
          <PurchaseSummary />
        </div>
      </Section>
    </main>
  );
}
