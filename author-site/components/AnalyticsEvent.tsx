"use client";

import { useEffect } from "react";
import type { AnalyticsEventName } from "@/lib/analytics";
import { shouldSendClientAnalytics } from "@/lib/analytics";

export function AnalyticsEvent({ name, metadata }: { name: AnalyticsEventName; metadata?: Record<string, unknown> }) {
  useEffect(() => {
    const consent = (window.localStorage.getItem("cc_analytics_consent") as "granted" | "denied" | null) ?? "unknown";
    if (!shouldSendClientAnalytics(consent)) return;
    void fetch("/api/track", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ eventName: name, metadata, consent }) });
  }, [name, metadata]);
  return null;
}
