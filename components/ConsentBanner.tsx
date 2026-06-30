"use client";

import { useSyncExternalStore } from "react";

const CONSENT_KEY = "cc_analytics_consent";
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return window.localStorage.getItem(CONSENT_KEY);
}

/* Server/hydration snapshot: report a value so the banner is absent in the
   server HTML and on the first client paint, then the real localStorage
   snapshot takes over after hydration. (Reading localStorage during the
   initial render caused a hydration mismatch — React error #418 — on every
   page.) */
function getServerSnapshot() {
  return "pending";
}

export function ConsentBanner() {
  const choice = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  if (choice) return null;
  function choose(value: "granted" | "denied") {
    window.localStorage.setItem(CONSENT_KEY, value);
    listeners.forEach((listener) => listener());
  }
  return (
    <div role="region" aria-label="Analytics consent" className="fixed bottom-3 left-3 right-3 z-40 rounded-2xl border border-antique/40 bg-obsidian p-3 text-xs text-whitegold shadow-gold sm:bottom-4 sm:left-4 sm:right-4 sm:p-4 sm:text-sm md:left-auto md:w-96">
      <p>We use consent-aware analytics. Operational security and order events may still be recorded server-side.</p>
      <div className="mt-2 flex gap-2 sm:mt-3 sm:gap-3">
        <button onClick={() => choose("granted")} className="min-h-9 rounded-full bg-antique px-3 py-1.5 font-semibold text-obsidian sm:px-4 sm:py-2">Allow analytics</button>
        <button onClick={() => choose("denied")} className="min-h-9 rounded-full border border-whitegold/30 px-3 py-1.5 font-semibold text-whitegold sm:px-4 sm:py-2">Essential only</button>
      </div>
    </div>
  );
}
