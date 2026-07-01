import { NextResponse } from "next/server";
import { createSupabaseSessionClient } from "@/lib/supabase/server";
import { getSiteUrl } from "@/lib/env";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/dashboard";
  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";

  if (code) {
    const supabase = await createSupabaseSessionClient();
    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) return NextResponse.redirect(new URL(safeNext, getSiteUrl()));
    }
  }

  const failureUrl = new URL("/login", getSiteUrl());
  failureUrl.searchParams.set("error", "auth_callback_failed");
  return NextResponse.redirect(failureUrl);
}
