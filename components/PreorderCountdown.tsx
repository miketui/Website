"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/content/site";

/**
 * Live countdown to release (2026-11-24, from siteConfig.releaseDate). Renders
 * four fixed-width unit tiles so the width never changes as digits tick — zero
 * layout shift. The units are information, not decoration, so they update every
 * second in every state; reduced-motion adds nothing to animate here (there are
 * no flips or pulses), which is exactly the point. Before hydration the tiles
 * show "--" placeholders at the final width, so the server/client markup matches
 * and the box is already the right size.
 */

const TARGET = new Date(`${siteConfig.releaseDate}T00:00:00Z`).getTime();
const UNITS = [
  ["Days", 86_400_000],
  ["Hours", 3_600_000],
  ["Minutes", 60_000],
  ["Seconds", 1000]
] as const;

function parts(now: number): number[] {
  let remaining = Math.max(0, TARGET - now);
  return UNITS.map(([, ms]) => {
    const value = Math.floor(remaining / ms);
    remaining -= value * ms;
    return value;
  });
}

export function PreorderCountdown({ className }: { className?: string }) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    // First value on the next frame (not synchronously in the effect body) so the
    // "--" placeholder is what hydrates, matching the server markup; then tick.
    const raf = requestAnimationFrame(() => setNow(Date.now()));
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(timer);
    };
  }, []);

  const released = now !== null && TARGET - now <= 0;
  const values = now === null ? null : parts(now);

  if (released) {
    return (
      <p className={["editorial-kicker text-antique", className ?? ""].join(" ").trim()}>
        The journey is available now.
      </p>
    );
  }

  return (
    <div
      className={["flex items-stretch justify-center gap-3 sm:gap-4", className ?? ""].join(" ").trim()}
      role="timer"
      aria-label="Time remaining until release"
    >
      {UNITS.map(([label], i) => (
        <div
          key={label}
          className="glass-panel flex min-w-[4.25rem] flex-col items-center rounded-[1.25rem] px-3 py-3 sm:min-w-[5rem] sm:px-4"
        >
          <span className="font-display text-3xl leading-none tabular-nums text-white sm:text-4xl">
            {values === null ? "--" : String(values[i]).padStart(2, "0")}
          </span>
          <span className="mt-2 text-[0.6rem] uppercase tracking-[0.28em] text-whitegold/55">{label}</span>
        </div>
      ))}
    </div>
  );
}
