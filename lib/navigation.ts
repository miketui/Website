/**
 * Single source of truth for the launch navigation IA.
 * Every nav surface (desktop header, mobile panel, future footers) consumes
 * this array — the desktop/mobile drift this replaces is documented in
 * docs/AUDIT-2026-07-02-ERROR-DOC.md (P1-4).
 *
 * Launch spec (locked): Home · About the Book · About the Author · Order · Contact.
 * "Order" is where checkout lives — /preorder until NEXT_PUBLIC_LAUNCH_MODE
 * flips to "launched", at which point the header CTA (LaunchModeCTA) already
 * routes buyers to /buy. The nav item stays stable so wayfinding never shifts
 * underneath a returning visitor mid-launch-week.
 */
export type NavItem = { href: string; label: string };

export const primaryNav: readonly NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/book", label: "About the Book" },
  { href: "/about", label: "About the Author" },
  { href: "/preorder", label: "Order" },
  { href: "/contact", label: "Contact" }
] as const;

/** Active-route test: exact match for home, prefix match elsewhere. */
export function isActiveRoute(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
