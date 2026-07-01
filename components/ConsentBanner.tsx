"use client";

import { useAnalyticsConsent, setConsent } from "@/lib/consent";

export function ConsentBanner() {
  const choice = useAnalyticsConsent();
  if (choice && choice !== "pending") return null;

  return (
    <div role="region" aria-label="Analytics consent" className="fixed bottom-3 left-3 right-3 z-40 rounded-2xl border border-antique/40 bg-obsidian p-3 text-xs text-whitegold shadow-gold sm:bottom-4 sm:left-4 sm:right-4 sm:p-4 sm:text-sm md:left-auto md:w-96">
      <p>We use consent-aware analytics. Operational security and order events may still be recorded server-side.</p>
      <div className="mt-2 flex gap-2 sm:mt-3 sm:gap-3">
        <button onClick={() => setConsent("granted")} className="min-h-9 rounded-full bg-antique px-3 py-1.5 font-semibold text-obsidian sm:px-4 sm:py-2">Allow analytics</button>
        <button onClick={() => setConsent("denied")} className="min-h-9 rounded-full border border-whitegold/30 px-3 py-1.5 font-semibold text-whitegold sm:px-4 sm:py-2">Essential only</button>
      </div>
    </div>
  );
}
