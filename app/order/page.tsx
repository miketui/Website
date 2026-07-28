import { redirect } from "next/navigation";
import { getLaunchState, isCheckoutPaused } from "@/config/launchState";

/**
 * /order — the stable conversion terminus (PRD v2 §3).
 *
 * Campaigns, emails, and nav all point here forever; the launch-state machine
 * decides which checkout experience actually renders. This keeps the URL
 * stable across PREORDER → LAUNCH → EVERGREEN (no rebuilt links on launch
 * morning) while the proven /preorder and /buy money paths stay untouched.
 */
/**
 * Must stay dynamic. `getLaunchState()` falls back to a date-derived state
 * (PREORDER before RELEASE_DATE, LAUNCH inside the 14-day window, EVERGREEN
 * after) whenever NEXT_PUBLIC_LAUNCH_STATE is unset. Under `force-static` the
 * redirect target is frozen at build time, so on launch morning this route
 * would keep sending buyers to /preorder at preorder pricing until someone
 * redeployed — the exact opposite of the "no rebuilt links" guarantee above.
 * Covered by tests/order-launch-transition.test.ts.
 */
export const dynamic = "force-dynamic";

export default function OrderPage() {
  if (isCheckoutPaused()) redirect("/pricing-kit");
  redirect(getLaunchState() === "PREORDER" ? "/preorder" : "/buy");
}
