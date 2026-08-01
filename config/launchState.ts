import { siteConfig } from "@/content/site";
import { priceConfig } from "@/content/book";

/**
 * Launch-state machine — PRD v2 §2 ("Metamorphosis Experience").
 *
 * One env value drives site-wide copy, CTAs, badges, urgency, and pricing
 * language: `NEXT_PUBLIC_LAUNCH_STATE` (PREORDER | LAUNCH | EVERGREEN).
 *
 * Compatibility: the legacy `NEXT_PUBLIC_LAUNCH_MODE` (preorder | launched |
 * paused) continues to work — it maps onto the v2 states so nothing already
 * deployed breaks. `paused` is honored as a commerce overlay (checkout CTAs
 * fall back to the free pricing kit) without being a visual state of its own.
 *
 * Guardrail (env-var incident class, see lib/env.ts envOrDefault): a blank or
 * invalid value NEVER blank-renders or crashes a deploy. Resolution order:
 *   1. valid NEXT_PUBLIC_LAUNCH_STATE
 *   2. valid legacy NEXT_PUBLIC_LAUNCH_MODE
 *   3. date-derived: before RELEASE_DATE → PREORDER, within the 14-day launch
 *      window → LAUNCH, after → EVERGREEN
 * All state strings live in this one file — no scattered ternaries.
 */

export type LaunchState = "PREORDER" | "LAUNCH" | "EVERGREEN";
/** PRD §2.3 — long-runway countdown behavior. A ticking counter only renders
 *  in the final 14 days; before that the badge is a quiet date chip. */
export type PreorderSubPhase = "building" | "countdown";

/**
 * The launch window is **14 days**, decided once and stated here only.
 * A second number written anywhere else is a bug — the 2026-07-31 audit found
 * code and copy disagreeing (14 vs 15) and could not tell which was intended.
 */
export const LAUNCH_WINDOW_DAYS = 14;
const COUNTDOWN_WINDOW_DAYS = 14;
const MS_PER_DAY = 86_400_000;

/**
 * The release instant is midnight **America/Los_Angeles** on RELEASE_DATE, not
 * midnight UTC. Deriving it from `${date}T00:00:00Z` flipped every state,
 * price, and CTA at 4:00 p.m. Pacific on November 23 — a full evening of
 * buyers seeing launch pricing a day early, with no deploy to explain it.
 */
export const RELEASE_TIMEZONE = "America/Los_Angeles";

/** Milliseconds `timeZone` is ahead of UTC at `instant` (negative west of UTC). */
function zoneOffsetMs(instant: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  })
    .formatToParts(instant)
    .reduce<Record<string, string>>((acc, part) => {
      if (part.type !== "literal") acc[part.type] = part.value;
      return acc;
    }, {});
  const asUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour) % 24,
    Number(parts.minute),
    Number(parts.second)
  );
  return asUtc - instant.getTime();
}

/**
 * Midnight on `dateIso` in `timeZone`, as a UTC instant. Two passes so a date
 * that straddles a DST transition resolves against its own offset rather than
 * the offset of the naive guess. Falls back to UTC midnight if the runtime has
 * no tz database — a wrong-by-8-hours date beats a crashed render.
 */
function zonedMidnight(dateIso: string, timeZone: string): Date {
  const naive = new Date(`${dateIso}T00:00:00Z`);
  if (Number.isNaN(naive.getTime())) return naive;
  try {
    const firstPass = new Date(naive.getTime() - zoneOffsetMs(naive, timeZone));
    return new Date(naive.getTime() - zoneOffsetMs(firstPass, timeZone));
  } catch {
    return naive;
  }
}

/** The one release instant. Everything date-derived resolves through this. */
export function releaseInstant(): Date {
  return zonedMidnight(siteConfig.releaseDate, RELEASE_TIMEZONE);
}

/** "November 24" — single source for human-readable release copy. */
export function releaseDateLabel(): string {
  return releaseInstant().toLocaleDateString("en-US", { month: "long", day: "numeric", timeZone: RELEASE_TIMEZONE });
}

export function daysToRelease(now: Date = new Date()): number {
  return Math.ceil((releaseInstant().getTime() - now.getTime()) / MS_PER_DAY);
}

function dateDerivedState(now: Date): LaunchState {
  const days = daysToRelease(now);
  if (days > 0) return "PREORDER";
  if (days > -LAUNCH_WINDOW_DAYS) return "LAUNCH";
  return "EVERGREEN";
}

export function getLaunchState(now: Date = new Date()): LaunchState {
  const explicit = process.env.NEXT_PUBLIC_LAUNCH_STATE?.trim().toUpperCase();
  if (explicit === "PREORDER" || explicit === "LAUNCH" || explicit === "EVERGREEN") return explicit;
  if (explicit) {
    // Invalid value: warn at build/render time, degrade to the date-derived
    // state (never a blank render, never a crashed deploy).
    console.warn(`[launchState] Invalid NEXT_PUBLIC_LAUNCH_STATE "${explicit}" — falling back to date-derived state.`);
  }
  const legacy = process.env.NEXT_PUBLIC_LAUNCH_MODE?.trim().toLowerCase();
  if (legacy === "preorder") return "PREORDER";
  if (legacy === "launched") return dateDerivedState(now) === "PREORDER" ? "LAUNCH" : dateDerivedState(now);
  return dateDerivedState(now);
}

/** Commerce overlay: when checkout is administratively paused, CTAs route to
 *  the free pricing kit instead of a dead checkout. Visual state is unaffected. */
export function isCheckoutPaused(): boolean {
  return process.env.NEXT_PUBLIC_LAUNCH_MODE?.trim().toLowerCase() === "paused";
}

export function getPreorderSubPhase(now: Date = new Date()): PreorderSubPhase {
  return daysToRelease(now) <= COUNTDOWN_WINDOW_DAYS ? "countdown" : "building";
}

/** Which Stripe price the book resolves to. Never derived from client input. */
export type PriceTier = "preorder" | "regular";

export type LaunchOffer = {
  state: LaunchState;
  /** Selects the Stripe price ID server-side AND the price shown in copy. */
  priceTier: PriceTier;
  amountDollars: number;
  amountCents: number;
  /** "$17.99" — the only string any surface should render for the book price. */
  priceLabel: string;
  /** Commerce overlay: checkout CTAs fall back to the free pricing kit. */
  checkoutPaused: boolean;
  /**
   * The Idea-to-Action Workbook ships free with a qualifying book order.
   * Distinct from `priceTier`: the launch window keeps preorder *pricing*
   * ($17.99) while the workbook becomes a paid product again ("paid
   * post-launch; free with any preorder that includes the book" — AGENTS.md).
   */
  workbookIncludedFree: boolean;
  releaseDateIso: string;
  releaseInstantIso: string;
  launchWindowDays: number;
};

/**
 * **The** launch resolver. Server-owned, single source for state, displayed
 * price, and the Stripe price tier — navigation, /order, /buy, checkout,
 * structured data, cron jobs, and email templates all read this one function.
 *
 * The 2026-07-31 audit found the site able to display one price while Stripe
 * resolved another, because the UI read NEXT_PUBLIC_LAUNCH_STATE and checkout
 * read the legacy NEXT_PUBLIC_LAUNCH_MODE. Both now resolve here.
 *
 * Price tier follows the locked table in AGENTS.md: preorder **and** the launch
 * window are $17.99; only EVERGREEN moves to $19.99.
 */
export function resolveLaunchOffer(now: Date = new Date()): LaunchOffer {
  const state = getLaunchState(now);
  const priceTier: PriceTier = state === "EVERGREEN" ? "regular" : "preorder";
  const price = priceTier === "preorder" ? priceConfig.preorderDirect : priceConfig.regularDirect;
  return {
    state,
    priceTier,
    amountDollars: price.amount,
    amountCents: price.cents,
    priceLabel: `$${price.amount.toFixed(2)}`,
    checkoutPaused: isCheckoutPaused(),
    workbookIncludedFree: state === "PREORDER",
    releaseDateIso: siteConfig.releaseDate,
    releaseInstantIso: releaseInstant().toISOString(),
    launchWindowDays: LAUNCH_WINDOW_DAYS
  };
}

export type LaunchStateCopy = {
  state: LaunchState;
  subPhase: PreorderSubPhase | null;
  /** Hero primary CTA — the ONE gold action per page. */
  heroCta: { label: string; href: string };
  /** Gold chip above/below the hero CTA. null = render nothing (EVERGREEN is clean). */
  heroBadge: { label: string; pulse: boolean } | null;
  /** Whether a ticking countdown may render (PREORDER countdown sub-phase only). */
  showCountdown: boolean;
  orderH1: string;
  priceCopy: string;
  deliveryCopy: string;
  emailCaptureFraming: string;
  /** Site-wide closing line — the Threshold. */
  finalCtaLine: string;
  finalCtaLabel: string;
  navOrderLabel: string;
};

export function getLaunchStateCopy(now: Date = new Date()): LaunchStateCopy {
  // Price copy is read off the same resolver checkout uses — never recomputed.
  const offer = resolveLaunchOffer(now);
  const { state, checkoutPaused: paused, priceLabel } = offer;
  const orderHref = paused ? "/pricing-kit" : "/order";
  const release = releaseDateLabel();

  if (state === "PREORDER") {
    const subPhase = getPreorderSubPhase(now);
    const days = daysToRelease(now);
    return {
      state,
      subPhase,
      heroCta: { label: paused ? "Read Chapter 1 Free" : `Preorder the Journey — ${priceLabel}`, href: orderHref },
      heroBadge:
        subPhase === "countdown"
          ? { label: `${Math.max(days, 1)} ${days === 1 ? "Day" : "Days"} to the Journey`, pulse: true }
          : { label: `Coming ${release}`, pulse: false },
      showCountdown: subPhase === "countdown",
      orderH1: "Reserve Your Copy",
      priceCopy: `${priceLabel} — locked at preorder price`,
      deliveryCopy: `Delivered to your inbox on release day, ${release}`,
      emailCaptureFraming: "Join the launch list",
      finalCtaLine: "Your gift is asking for more. Reserve the journey.",
      finalCtaLabel: "Preorder the Journey",
      navOrderLabel: "Preorder"
    };
  }

  if (state === "LAUNCH") {
    return {
      state,
      subPhase: null,
      heroCta: { label: paused ? "Read Chapter 1 Free" : `The Door Is Open — Get the Book`, href: orderHref },
      heroBadge: { label: "Available Now", pulse: true },
      showCountdown: false,
      orderH1: "The Journey Begins Today",
      priceCopy: priceLabel,
      deliveryCopy: "Instant delivery to your inbox",
      emailCaptureFraming: "Join the reader collective",
      finalCtaLine: "Your gift is asking for more. The door is open.",
      finalCtaLabel: "Get the Book",
      navOrderLabel: "Order"
    };
  }

  return {
    state,
    subPhase: null,
    heroCta: { label: paused ? "Read Chapter 1 Free" : `Begin the Journey — ${priceLabel}`, href: orderHref },
    heroBadge: null,
    showCountdown: false,
    orderH1: "Get Curls & Contemplation",
    priceCopy: priceLabel,
    deliveryCopy: "Instant delivery",
    emailCaptureFraming: "Join the collective",
    finalCtaLine: "Your gift is asking for more. Begin.",
    finalCtaLabel: "Begin the Journey",
    navOrderLabel: "Order"
  };
}
