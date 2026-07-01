"use client";

import { Suspense, useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { useAnalyticsConsent } from "@/lib/consent";

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";

function PageviewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  useEffect(() => {
    if (!posthogKey || !posthog.__loaded) return;
    const query = searchParams.toString();
    posthog.capture("$pageview", { $current_url: query ? `${pathname}?${query}` : pathname });
  }, [pathname, searchParams]);
  return null;
}

export function PostHogProvider() {
  const consent = useAnalyticsConsent();
  const initialized = useRef(false);

  useEffect(() => {
    if (!posthogKey || consent !== "granted") return;
    if (!initialized.current) {
      posthog.init(posthogKey, {
        api_host: posthogHost,
        person_profiles: "identified_only",
        capture_pageview: false, // handled manually below for App Router route changes
        capture_pageleave: true
      });
      initialized.current = true;
    }
  }, [consent]);

  useEffect(() => {
    if (consent === "denied" && posthog.__loaded) posthog.opt_out_capturing();
  }, [consent]);

  if (!posthogKey || consent !== "granted") return null;

  return (
    <Suspense fallback={null}>
      <PageviewTracker />
    </Suspense>
  );
}
