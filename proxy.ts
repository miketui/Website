import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { isProtectedRoute } from "@/lib/route-policy";
import { getSupabaseBrowserConfig } from "@/lib/env";

// Pages that redirect an unauthenticated visitor to /login. This list is
// intentionally NOT the same as protectedRoutePrefixes in lib/route-policy.ts:
// /admin has its own requireAdmin() server-side check per page, and
// /bonus-claim is a JSON API route that would break if a redirect Response
// replaced its response. Resources is gated here per product decision:
// it's members-only content. Blog stays public — it's the organic-search
// acquisition surface and should not be removed from indexing.
const LOGIN_REDIRECT_PREFIXES = ["/dashboard", "/downloads", "/resources"] as const;

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  let response = NextResponse.next({ request });
  response.headers.set("x-author-site", "curls-commerce-scaffold");

  if (isProtectedRoute(pathname)) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  // Refresh the Supabase Auth session cookie on every request (Supabase's
  // documented pattern for Next.js — without this, sessions silently expire
  // even with a valid refresh token). See LOGIN_REDIRECT_PREFIXES above for
  // which routes actually redirect to /login; API routes like /bonus-claim
  // are excluded on purpose — they return JSON, not a page, and would break
  // if a redirect Response replaced their response.
  const config = getSupabaseBrowserConfig();
  const needsAuthCheck = LOGIN_REDIRECT_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));

  if (config.ok) {
    const supabase = createServerClient(config.value.url, config.value.anonKey, {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          response.headers.set("x-author-site", "curls-commerce-scaffold");
          if (isProtectedRoute(pathname)) response.headers.set("X-Robots-Tag", "noindex, nofollow");
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        }
      }
    });

    const { data } = await supabase.auth.getUser();

    if (needsAuthCheck && !data.user) {
      const redirectUrl = new URL("/login", request.url);
      redirectUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
