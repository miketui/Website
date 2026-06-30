"use client";

import { usePathname } from "next/navigation";
import CurlTrail from "@/components/CurlTrail";
import { isDecorativeMotionExcludedRoute } from "@/lib/route-policy";

/**
 * Site-wide mount for the CurlTrail glyph cursor. Decorative motion stays off
 * utility and legal routes per route-policy; reduced-motion is handled
 * reactively inside CurlTrail itself.
 */
export function SiteCurlTrail() {
  const pathname = usePathname() ?? "/";
  if (isDecorativeMotionExcludedRoute(pathname)) return null;
  return <CurlTrail />;
}
