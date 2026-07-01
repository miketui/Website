import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ConsentBanner } from "@/components/ConsentBanner";
import { PostHogProvider } from "@/components/PostHogProvider";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { SiteCurlTrail } from "@/components/SiteCurlTrail";
import { PageTransition } from "@/components/motion/PageTransition";
import { ReducedMotionProvider } from "@/components/motion/ReducedMotionProvider";
import { siteConfig } from "@/content/site";
import { personJsonLd } from "@/lib/schema";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.siteUrl),
  alternates: { canonical: siteConfig.siteUrl },
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
 * Runs synchronously before first paint. When the cinematic gateway is going
 * to play (first visit this session), it raises the obsidian curtain
 * (html[data-cc-gateway] body::before in gateway.css) so the homepage never
 * flashes before the overlay hydrates. BookGateway removes the attribute.
 */
const gatewayCurtainScript = `try{var seen=false;try{seen=sessionStorage.getItem("curls-gateway-seen")==="1"}catch(e){}if(location.pathname==="/"&&!seen)document.documentElement.setAttribute("data-cc-gateway","")}catch(e){}`;

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  /* suppressHydrationWarning: the gateway curtain script (below) sets a
     data attribute on <html> before hydration by design. */
  return <html lang="en" suppressHydrationWarning><body><script dangerouslySetInnerHTML={{ __html: gatewayCurtainScript }} /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd()) }} /><ReducedMotionProvider><Header /><PageTransition>{children}</PageTransition><Footer /><ConsentBanner /><PostHogProvider /><GoogleAnalytics /><SiteCurlTrail /></ReducedMotionProvider><SpeedInsights /></body></html>;
}
