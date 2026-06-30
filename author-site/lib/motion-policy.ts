import { isDecorativeMotionExcludedRoute } from "@/lib/route-policy";

export function shouldDisableCurlTrail(pathname: string, reducedMotion: boolean) {
  return reducedMotion || isDecorativeMotionExcludedRoute(pathname);
}
