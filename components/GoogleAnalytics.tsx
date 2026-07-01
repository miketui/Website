"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { useAnalyticsConsent } from "@/lib/consent";

const measurementId = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

function GA4PageviewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!measurementId || typeof window.gtag !== "function") return;
    const query = searchParams.toString();
    const pagePath = query ? `${pathname}?${query}` : pathname;
    window.gtag("event", "page_view", { page_path: pagePath });
  }, [pathname, searchParams]);

  return null;
}

/**
 * Consent-gated Google Analytics 4 (gtag.js). Renders once from the root
 * layout, so it is present on every route — the App Router equivalent of
 * "paste this tag on every page" without actually duplicating a <script>
 * tag into every route file (which App Router doesn't support anyway; there
 * is one root <head>, not one per page).
 *
 * Mirrors PostHogProvider's consent pattern: nothing fires until the
 * visitor clicks "Allow analytics" on the ConsentBanner. If NEXT_PUBLIC_GA4_
 * MEASUREMENT_ID is unset, this renders nothing — safe to ship even before
 * the Vercel env var is configured.
 */
export function GoogleAnalytics() {
  const consent = useAnalyticsConsent();

  useEffect(() => {
    if (consent === "denied" && typeof window.gtag === "function") {
      window.gtag("consent", "update", { analytics_storage: "denied" });
    }
  }, [consent]);

  if (!measurementId || consent !== "granted") return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('consent', 'default', { analytics_storage: 'granted' });
          gtag('js', new Date());
          gtag('config', '${measurementId}', { send_page_view: false });
        `}
      </Script>
      <Suspense fallback={null}>
        <GA4PageviewTracker />
      </Suspense>
    </>
  );
}
