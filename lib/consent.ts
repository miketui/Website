"use client";

import { useSyncExternalStore } from "react";

export const CONSENT_KEY = "cc_analytics_consent";
export type ConsentValue = "granted" | "denied" | null;

const listeners = new Set<() => void>();

export function subscribeToConsent(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getConsentSnapshot(): string | null {
  return window.localStorage.getItem(CONSENT_KEY);
}

/* Server/hydration snapshot: report a value so consumers render the same
   thing server-side and on first client paint, then the real localStorage
   value takes over after hydration — avoids a hydration mismatch. */
export function getConsentServerSnapshot() {
  return "pending";
}

export function setConsent(value: "granted" | "denied") {
  window.localStorage.setItem(CONSENT_KEY, value);
  listeners.forEach((listener) => listener());
}

/** Returns "granted" | "denied" | "pending" (no choice made yet, or SSR). */
export function useAnalyticsConsent(): ConsentValue | "pending" {
  return useSyncExternalStore(subscribeToConsent, getConsentSnapshot, getConsentServerSnapshot) as ConsentValue | "pending";
}
