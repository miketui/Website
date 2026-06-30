import { cookies } from "next/headers";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseServerConfig } from "@/lib/env";

export const tableNames = [
  "profiles",
  "products",
  "prices",
  "orders",
  "purchases",
  "download_tokens",
  "download_events",
  "bonus_claims",
  "subscribers",
  "subscriber_events",
  "consent_log",
  "webhook_events",
  "analytics_events",
  "gate_ledger",
  "admin_users"
] as const;

export type TableName = (typeof tableNames)[number];
export type SessionUser = { id: string; email: string };

export function createServerSupabaseClient(useServiceRole = false): SupabaseClient | null {
  const config = getSupabaseServerConfig(useServiceRole);
  if (!config.ok) return null;
  return createClient(config.value.url, config.value.key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  // Demo-session cookies are a sandbox convenience only. They are unsigned and
  // spoofable, so they are honored ONLY behind an explicit owner opt-in that
  // must never be set in production (entitlement + admin checks key on email).
  if (process.env.ALLOW_DEMO_SESSION === "1") {
    const email = cookieStore.get("cc_demo_email")?.value;
    const userId = cookieStore.get("cc_demo_user")?.value;
    if (email && userId) return { id: userId, email };
  }
  const supabase = createServerSupabaseClient(false);
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user ? { id: data.user.id, email: data.user.email ?? "" } : null;
}

export async function isAdminUser(user: SessionUser | null, allowlist: string[]) {
  if (!user?.email) return false;
  if (allowlist.includes(user.email.toLowerCase())) return true;
  const supabase = createServerSupabaseClient(true);
  if (!supabase) return false;
  const { data } = await supabase.from("admin_users").select("id").or(`user_id.eq.${user.id},email.eq.${user.email.toLowerCase()}`).maybeSingle();
  return Boolean(data?.id);
}
