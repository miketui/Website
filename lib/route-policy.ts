export const protectedRoutePrefixes = ["/dashboard", "/downloads", "/bonus-claim", "/admin", "/resources"] as const;

export const authRoutePrefixes = ["/login", "/signup", "/logout"] as const;
export const commerceQuietRoutePrefixes = ["/checkout", "/buy"] as const;
export const legalRoutePrefixes = [
  "/privacy",
  "/terms",
  "/refund-policy",
  "/preorder-policy",
  "/digital-delivery-policy",
  "/cookies",
  "/accessibility"
] as const;
export const utilityQuietRoutePrefixes = ["/dashboard", "/downloads", "/admin", "/bonus-claim", "/thank-you"] as const;

export const decorativeMotionExcludedPrefixes = [
  ...authRoutePrefixes,
  ...commerceQuietRoutePrefixes,
  ...legalRoutePrefixes,
  ...utilityQuietRoutePrefixes
] as const;

export function startsWithRoutePrefix(pathname: string, prefix: string) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export function isProtectedRoute(pathname: string) {
  return protectedRoutePrefixes.some((prefix) => startsWithRoutePrefix(pathname, prefix));
}

export function isDecorativeMotionExcludedRoute(pathname: string) {
  return decorativeMotionExcludedPrefixes.some((prefix) => startsWithRoutePrefix(pathname, prefix));
}

export function isLegalRoute(pathname: string) {
  return legalRoutePrefixes.some((prefix) => startsWithRoutePrefix(pathname, prefix));
}
