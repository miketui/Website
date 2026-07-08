import { permanentRedirect } from "next/navigation";

/**
 * /author — PRD v2 sitemap alias for the author page.
 *
 * The canonical, already-indexed URL is /about (SEO retention: no equity is
 * thrown away by moving it). This alias exists so PRD-spec campaign links,
 * schema references, and future nav changes can safely use /author.
 */
export default function AuthorAlias() {
  permanentRedirect("/about");
}
