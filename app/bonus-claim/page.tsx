import { permanentRedirect } from "next/navigation";

/**
 * /bonus-claim — the standalone claim page is inert (no form, no fetch) and its
 * bonus assets/rules require Michael's approval before launch. Per the rebuild
 * plan we redirect visitors to the live free-chapter funnel instead of showing a
 * dead-end scaffold.
 *
 * Reversibility: the `/api/bonus-claim` handler is intentionally left untouched,
 * so re-enabling a real claim UI later is a page-only change.
 */
export default function BonusClaimRedirect() {
  permanentRedirect("/pricing-kit");
}
