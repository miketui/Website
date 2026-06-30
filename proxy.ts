import { NextResponse, type NextRequest } from "next/server";
import { isProtectedRoute } from "@/lib/route-policy";

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const response = NextResponse.next();
  response.headers.set("x-author-site", "curls-commerce-scaffold");

  if (isProtectedRoute(pathname)) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
