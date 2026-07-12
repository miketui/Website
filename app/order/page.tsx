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
export const dynamic = "force-static";

export default function OrderPage() {
  if (isCheckoutPaused()) redirect("/pricing-kit");
  redirect(getLaunchState() === "PREORDER" ? "/preorder" : "/buy");
}
