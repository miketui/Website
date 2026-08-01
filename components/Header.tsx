import { LaunchModeCTA } from "@/components/LaunchModeCTA";
import { SiteHeader } from "@/components/SiteHeader";
import { getLaunchCta } from "@/lib/launch-mode";

/**
 * Server shell for the header: resolves launch mode on the server, then hands
 * the interactive scroll-aware chrome to the client SiteHeader. LaunchModeCTA
 * stays a server component (passed down as a ReactNode).
 */
export function Header() {
  const cta = getLaunchCta();
  return <SiteHeader cta={<LaunchModeCTA showHelper={false} />} mobileCta={{ href: cta.href, label: cta.priceTier === "preorder" ? "Preorder" : cta.priceTier === "regular" ? "Buy" : "Free Pricing Kit" }} />;
}
