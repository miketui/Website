export interface NavItem {
  href: string;
  label: string;
}

export const primaryNav: readonly NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/book", label: "About the Book" },
  { href: "/about", label: "About the Author" },
  { href: "/order", label: "Order" },
  { href: "/contact", label: "Contact" }
] as const;

/** Routes that count as the Order surface for active-nav purposes: /order is
 *  the stable terminus (PRD v2 §3); it resolves by launch state to the
 *  underlying checkout experiences. */
const ORDER_SURFACE = ["/order", "/preorder", "/buy"];

/** Active-route test: exact match for home, prefix match elsewhere. */
export function isActiveRoute(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  if (href === "/order") return ORDER_SURFACE.some((route) => pathname === route || pathname.startsWith(`${route}/`));
  return pathname === href || pathname.startsWith(`${href}/`);
}
