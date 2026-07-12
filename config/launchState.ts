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

const LAUNCH_WINDOW_DAYS = 14;
const COUNTDOWN_WINDOW_DAYS = 14;
const MS_PER_DAY = 86_400_000;

function releaseDateUtc(): Date {
  return new Date(`${siteConfig.releaseDate}T00:00:00Z`);
}

/** "November 24" — single source for human-readable release copy. */
export function releaseDateLabel(): string {
  return releaseDateUtc().toLocaleDateString("en-US", { month: "long", day: "numeric", timeZone: "UTC" });
}

export function daysToRelease(now: Date = new Date()): number {
  return Math.ceil((releaseDateUtc().getTime() - now.getTime()) / MS_PER_DAY);
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
  const state = getLaunchState(now);
  const paused = isCheckoutPaused();
  const price = state === "PREORDER" ? priceConfig.preorderDirect.amount : priceConfig.regularDirect.amount;
  const priceLabel = `$${price.toFixed(2)}`;
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
