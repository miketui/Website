import clsx from "clsx";

/**
 * Hand-drawn hair-motif SVG art for the lush editorial layer: oversized
 * silky curls (deep jade, gold-lit) and fine gold strand flourishes. Pure
 * decoration — every export renders aria-hidden vector art with no pointer
 * events, colors derived from the locked ACISS palette (via flourish.css
 * tokens), no external assets. Server-component safe.
 */

/* A continuous curl: a flowing tail that coils into a decreasing arc spiral
   (half-turn arcs with shared endpoints — the classic spiral construction). */
const CURL_PATH =
  "M 44 4 C 96 46, 152 80, 165 150 A 55 53 0 1 0 55 150 A 42 40 0 1 1 139 150 A 30 29 0 1 0 79 150 A 19 18 0 1 1 117 150 A 9 9 0 1 0 99 150";

export function CurlBloom({ className, tone = "deep", flip = false }: { className?: string; tone?: "deep" | "mid"; flip?: boolean }) {
  const base = tone === "deep" ? "var(--aciss-strand-deep)" : "var(--aciss-strand-mid)";
  return (
    <svg viewBox="0 0 220 240" fill="none" aria-hidden="true" className={className} style={flip ? { transform: "scaleX(-1)" } : undefined}>
      {/* Silky bundle: the same curl drawn as layered strands of falling width */}
      <path d={CURL_PATH} stroke={base} strokeWidth="13" strokeLinecap="round" opacity="0.9" />
      <path d={CURL_PATH} stroke="var(--aciss-deep-jade)" strokeWidth="7" strokeLinecap="round" opacity="0.85" transform="translate(4 -3)" />
      <path d={CURL_PATH} stroke="var(--aciss-strand-mid)" strokeWidth="3.5" strokeLinecap="round" opacity="0.7" transform="translate(-4 3)" />
      {/* Gold rim light tracing the lock */}
      <path d={CURL_PATH} stroke="var(--aciss-dawn-gold)" strokeWidth="1.4" strokeLinecap="round" opacity="0.55" transform="translate(9 -7)" />
      {/* Floating light beads */}
      <circle cx="70" cy="52" r="2" fill="var(--aciss-antique-gold)" opacity="0.8" />
      <circle cx="178" cy="118" r="1.6" fill="var(--aciss-soft-jade-mist)" opacity="0.7" />
      <circle cx="52" cy="182" r="1.8" fill="var(--aciss-antique-gold)" opacity="0.6" />
    </svg>
  );
}

/* Small spiral curl used along strands (same arc construction, small). */
const MINI_CURL = "M 14 0 A 7 7 0 1 0 0 0 A 5 5 0 1 1 10 0 A 3.2 3.2 0 1 0 3.6 0";

export function GoldStrand({ className, draw = false }: { className?: string; draw?: boolean }) {
  return (
    <svg viewBox="0 0 300 110" fill="none" aria-hidden="true" className={className}>
      {/* Main strand of light */}
      <path
        d="M2 96 C 60 88, 96 66, 132 52 C 176 35, 224 30, 262 38 C 280 42, 292 52, 296 66"
        stroke="var(--aciss-dawn-gold)"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.9"
        pathLength={1}
        className={draw ? "strand-draw" : undefined}
      />
      {/* Loose companion strand */}
      <path
        d="M10 88 C 70 78, 110 58, 150 46 C 196 33, 236 32, 268 44"
        stroke="var(--aciss-antique-gold)"
        strokeWidth="0.9"
        strokeLinecap="round"
        opacity="0.5"
        pathLength={1}
        className={draw ? "strand-draw" : undefined}
      />
      {/* Small curls sprouting along the strand */}
      <g stroke="var(--aciss-dawn-gold)" strokeWidth="1.5" strokeLinecap="round" fill="none">
        <path d={MINI_CURL} transform="translate(96 66) rotate(-28)" />
        <path d={MINI_CURL} transform="translate(196 36) rotate(10) scale(1.2)" />
        <path d={MINI_CURL} transform="translate(282 52) rotate(48) scale(0.9)" />
      </g>
      <g stroke="var(--aciss-soft-jade-mist)" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.7">
        <path d={MINI_CURL} transform="translate(150 47) rotate(-8) scale(0.8)" />
      </g>
      {/* Light beads */}
      <circle cx="132" cy="52" r="2.2" fill="var(--aciss-antique-gold)" />
      <circle cx="236" cy="33" r="1.7" fill="var(--aciss-antique-gold)" opacity="0.85" />
      <circle cx="62" cy="87" r="1.4" fill="var(--aciss-soft-jade-mist)" opacity="0.7" />
    </svg>
  );
}

/** A gold strand that drapes over a card corner (top-right by default). */
export function CornerStrand({ className, position = "top-right" }: { className?: string; position?: "top-right" | "bottom-left" }) {
  return (
    <span
      aria-hidden="true"
      className={clsx(
        "strand-ornament",
        position === "top-right" ? "-right-4 -top-3 w-40 md:w-44" : "-bottom-3 -left-4 w-40 rotate-180 md:w-44",
        className
      )}
    >
      <GoldStrand className="w-full" />
    </span>
  );
}

/** Composed cluster of curls for section edges; place inside .flourish-layer. */
export function CurlCluster({ className, side = "left" }: { className?: string; side?: "left" | "right" }) {
  const flip = side === "right";
  return (
    <span aria-hidden="true" className={clsx("flourish-item block", className)}>
      <span className="relative block">
        <CurlBloom tone="deep" flip={flip} className="w-full opacity-90" />
        <CurlBloom
          tone="mid"
          flip={!flip}
          className={clsx("absolute w-3/5 opacity-70", flip ? "-right-1/4 top-1/3" : "-left-1/4 top-1/3")}
        />
      </span>
    </span>
  );
}
