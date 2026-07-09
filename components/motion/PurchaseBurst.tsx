"use client";

import { useEffect } from "react";
import { MotionAsset } from "@/components/motion/MotionAsset";

/** Window CustomEvent that plays the "event-once" gold burst (asset I). */
export const PURCHASE_SUCCESS_EVENT = "purchase-success";

/**
 * PurchaseBurst — a tasteful, non-blocking celebration for the confirmed
 * post-purchase / delivery state. It mounts asset I (gold particle burst,
 * trigger "event-once") and fires the success CustomEvent exactly once on mount
 * so the clip plays a single time.
 *
 * Reduced motion is handled entirely by MotionAsset: under reduced motion it
 * never mounts a <video> (holding the static gold-dot poster instead) and never
 * registers the event listener, so the dispatched event is a harmless no-op.
 * The rAF defer also guarantees the event fires after MotionAsset's own mount
 * effect has registered its listener (child effects run before parent effects,
 * but the frame boundary makes the ordering robust regardless).
 */
export function PurchaseBurst({ className }: { className?: string }) {
  useEffect(() => {
    const raf = window.requestAnimationFrame(() => {
      window.dispatchEvent(new CustomEvent(PURCHASE_SUCCESS_EVENT));
    });
    return () => window.cancelAnimationFrame(raf);
  }, []);

  return (
    <MotionAsset
      id="I"
      playOnEvent={PURCHASE_SUCCESS_EVENT}
      className={["mx-auto w-full max-w-[7rem] rounded-full", className ?? ""].join(" ").trim()}
    />
  );
}
