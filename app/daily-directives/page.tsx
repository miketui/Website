import Image from "next/image";
import { AddToCartButton } from "@/components/AddToCartButton";
import { PageHero } from "@/components/design/PageHero";
import { Section } from "@/components/design/Section";
import { dailyDirectives, dailyDirectiveSets, dailyDirectiveSku } from "@/content/daily-directives";
import { breadcrumbJsonLd } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Daily Directive Affirmation Cards for Creative Professionals",
  "Choose one of 12 digital affirmation card sets for $7.99, or get all 372 Daily Directives in the complete bundle for $59.",
  { path: "/daily-directives", image: "/daily-directives/set-12-back.png" }
);

export default function DailyDirectivesPage() {
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Daily Directives", path: "/daily-directives" }])) }} />
      <PageHero
        eyebrow="Daily Directives"
        title="A steadier voice for the work in front of you."
        description="Twelve focused digital sets. Thirty-one directives in each set. Use one card a day as a prompt for confidence, boundaries, visibility, recovery, leadership, and the next version of your creative practice."
        primaryHref="#sets"
        primaryLabel="Explore the 12 sets"
        secondaryHref="/book"
        secondaryLabel="See the book"
      >
        <div className="rounded-2xl border border-antique/30 bg-white/[0.04] p-5">
          <p className="font-display text-2xl text-white">Complete 12-set digital bundle</p>
          <p className="mt-2 text-whitegold/75">{dailyDirectives.totalCards} cards · printable PNG files · personal digital use</p>
          <div className="mt-5 flex flex-wrap items-center gap-4">
            <span className="font-display text-3xl text-antique">${dailyDirectives.bundlePrice.toFixed(2)}</span>
            <AddToCartButton sku="daily_directives_bundle">Add complete bundle</AddToCartButton>
          </div>
        </div>
      </PageHero>

      <Section id="sets" eyebrow="Choose your focus" title="Start with the directive you need now.">
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {dailyDirectiveSets.map((set) => {
            const padded = String(set.number).padStart(2, "0");
            return (
              <article key={set.slug} className="overflow-hidden rounded-[1.5rem] border border-whitegold/15 bg-white/[0.035]">
                <div className="relative aspect-[3/4] overflow-hidden bg-obsidian">
                  <Image src={`/daily-directives/set-${padded}-back.png`} alt={`${set.title} digital affirmation card set cover`} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition duration-500 hover:scale-[1.02]" />
                </div>
                <div className="p-6">
                  <p className="editorial-kicker">Set {padded} · 31 cards</p>
                  <h2 className="mt-2 font-display text-2xl text-white">{set.title}</h2>
                  <p className="mt-3 min-h-12 leading-6 text-whitegold/70">{set.focus}</p>
                  <div className="mt-5 flex items-center justify-between gap-3">
                    <span className="font-display text-2xl text-antique">${dailyDirectives.individualPrice.toFixed(2)}</span>
                    <AddToCartButton sku={dailyDirectiveSku(set.number)} className="px-4 py-2">Add set</AddToCartButton>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        <div className="mt-12 rounded-[2rem] border border-antique/30 bg-[radial-gradient(circle_at_top_right,rgba(176,141,87,0.14),transparent_48%)] p-7 md:p-10">
          <p className="editorial-kicker">Best value</p>
          <h2 className="mt-3 font-display text-3xl text-white md:text-4xl">All twelve sets. One intentional year.</h2>
          <p className="mt-4 max-w-2xl leading-8 text-whitegold/75">The complete bundle includes every set and all {dailyDirectives.totalCards} cards for ${dailyDirectives.bundlePrice.toFixed(2)} — a ${((dailyDirectives.individualPrice * 12) - dailyDirectives.bundlePrice).toFixed(2)} savings compared with buying each set separately.</p>
          <AddToCartButton sku="daily_directives_bundle" className="mt-6">Add the complete bundle — ${dailyDirectives.bundlePrice.toFixed(2)}</AddToCartButton>
        </div>
      </Section>
    </main>
  );
}
