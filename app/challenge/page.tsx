import { redirect } from "next/navigation";

/**
 * Funnel retired 2026-07-09 by owner decision: the 5-Day Challenge is removed
 * from the funnel architecture. Any inbound /challenge traffic (old links,
 * campaigns, bookmarks) is folded into the Pricing Confidence Kit funnel instead of
 * hitting a dead end.
 */
export default function Page() {
  redirect("/pricing-kit");
}
