import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import { Toaster } from "@/components/ui/Toast";
import "@/styles/uiverse.css";
import { SiteNav } from "@/components/nav/SiteNav";
import { Footer } from "@/components/Footer";
import { ConsentBanner } from "@/components/ConsentBanner";
import { PostHogProvider } from "@/components/PostHogProvider";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { SiteCurlTrail } from "@/components/SiteCurlTrail";
import { PageTransition } from "@/components/motion/PageTransition";
import { ReducedMotionProvider } from "@/components/motion/ReducedMotionProvider";
import { displayFont, accentFont, bodyFont } from "@/app/fonts";
import { siteConfig } from "@/content/site";
import { personJsonLd } from "@/lib/schema";
import { getLaunchStateCopy } from "@/config/launchState";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.siteUrl),
  // No `alternates.canonical` here on purpose. A canonical set at the root is
  // inherited by every page that does not override it, so any new route added
  // without pageMetadata() would silently declare itself a duplicate of the
  // homepage. Each page sets its own canonical via lib/seo.ts pageMetadata();
  // a missing canonical is a visible, lintable gap — a wrong one is invisible.
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    url: siteConfig.siteUrl,
    type: "website",
    images: [{ url: "/og-default.png", alt: `${siteConfig.name} by ${siteConfig.author}` }]
  },
  twitter: { card: "summary_large_image", title: siteConfig.name, images: ["/og-default.png"] }
};

/**
 * Runs synchronously before first paint. On the first "/" visit of a session
 * (no cc_cover_seen cookie) it raises the obsidian curtain
 * (html[data-cc-cover]::before in cover.css) so the homepage never flashes
 * before CoverReveal hydrates. CoverReveal removes the attribute when the
 * intro finishes.
 */
const coverCurtainScript = `try{var seen=false;try{seen=document.cookie.indexOf("cc_cover_seen=1")>-1}catch(e){}if(location.pathname==="/"&&!seen)document.documentElement.setAttribute("data-cc-cover","")}catch(e){}`;

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const launch = getLaunchStateCopy();
  const preorder = { href: launch.heroCta.href, label: launch.navOrderLabel };
  const isVercelRuntime = process.env.VERCEL === "1";
  /* suppressHydrationWarning: the cover curtain script (below) sets a
     data attribute on <html> before hydration by design. */
  return <html lang="en" suppressHydrationWarning className={`${displayFont.variable} ${accentFont.variable} ${bodyFont.variable}`}><body><script dangerouslySetInnerHTML={{ __html: coverCurtainScript }} /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd()) }} /><ReducedMotionProvider><CartProvider><SiteNav preorder={preorder} /><PageTransition>{children}</PageTransition><Footer /><ConsentBanner /><PostHogProvider /><GoogleAnalytics /><SiteCurlTrail /><Toaster /></CartProvider></ReducedMotionProvider>{isVercelRuntime ? <SpeedInsights /> : null}</body></html>;
}
