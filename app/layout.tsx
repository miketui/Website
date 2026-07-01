import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ConsentBanner } from "@/components/ConsentBanner";
import { PostHogProvider } from "@/components/PostHogProvider";
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

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <html lang="en"><body><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd()) }} /><ReducedMotionProvider><Header /><PageTransition>{children}</PageTransition><Footer /><ConsentBanner /><PostHogProvider /><SiteCurlTrail /></ReducedMotionProvider><SpeedInsights /></body></html>;
}
}
