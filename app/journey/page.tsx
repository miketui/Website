import { pageMetadata } from "@/lib/seo";
import { CinematicJourney } from "@/components/journey/CinematicJourney";
import { getLaunchStateCopy } from "@/config/launchState";

/**
 * /journey — the full cinematic scroll experience (audit §5 / animated-website
 * pipeline). Lives on its own route so the homepage LCP budget is untouched;
 * campaign and social traffic can land here directly. The page degrades to a
 * complete static document for crawlers, no-JS, and reduced-motion visitors.
 */
export const metadata = pageMetadata(
  "The Journey",
  "Scroll through the world of Curls & Contemplation — a cinematic journey from craft to calling, ending at the door.",
  { path: "/journey", image: "/gateway-cover.jpg" }
);

export default function Page() {
  const launch = getLaunchStateCopy();
  return (
    <main>
      <CinematicJourney ctaHref={launch.heroCta.href} ctaLabel={launch.finalCtaLabel} finalLine={launch.finalCtaLine} />
    </main>
  );
}
