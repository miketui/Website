import { CinematicJourney } from "@/components/journey/CinematicJourney";
import { getLaunchStateCopy } from "@/config/launchState";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "An Immersive Curls & Contemplation Experience",
  "Enter the cinematic, scroll-driven world of Curls & Contemplation.",
  { path: "/website", image: "/gateway-cover.jpg" }
);

/**
 * Campaign-safe alias for the immersive journey. Reusing the component keeps
 * its 3D canvas, depth, particles, and scroll choreography consistent while
 * preserving its reduced-motion, save-data, and low-memory fallbacks.
 */
export default function WebsitePage() {
  const launch = getLaunchStateCopy();
  return (
    <main>
      <CinematicJourney ctaHref={launch.heroCta.href} ctaLabel={launch.finalCtaLabel} finalLine={launch.finalCtaLine} />
    </main>
  );
}
