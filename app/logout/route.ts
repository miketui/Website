import { NextResponse } from "next/server";
import { createSupabaseSessionClient } from "@/lib/supabase/server";
import { getSiteUrl } from "@/lib/env";

export async function GET() {
  const supabase = await createSupabaseSessionClient();
  if (supabase) await supabase.auth.signOut();

  const response = NextResponse.redirect(new URL("/", getSiteUrl()));
  response.cookies.delete("cc_demo_email");
  response.cookies.delete("cc_demo_user");
  return response;
}
