import { cookies } from "next/headers";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { getSupabaseServerConfig } from "@/lib/env";
import { orEquals } from "@/lib/supabase/filters";

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

/**
 * Cookie-aware server client — the ONLY client that can actually see a signed-in
 * user's session, because it reads/writes the real Supabase Auth cookies via
 * Next's cookies() API. The plain createServerSupabaseClient() below cannot do
 * this (persistSession: false, no cookie store) and must never be used for
 * session reads — it exists for service-role and stateless anon writes only.
 */
export async function createSupabaseSessionClient(): Promise<SupabaseClient | null> {
  const config = getSupabaseServerConfig(false);
  if (!config.ok) return null;
  const cookieStore = await cookies();
  return createServerClient(config.value.url, config.value.key, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookiesToSet) => {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Called from a Server Component render — middleware refreshes the
          // session cookie on the next request instead. Safe to ignore.
        }
      }
    }
  });
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
  const supabase = await createSupabaseSessionClient();
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user ? { id: data.user.id, email: data.user.email ?? "" } : null;
}

export async function isAdminUser(user: SessionUser | null, allowlist: string[]) {
  if (!user?.email) return false;
  if (allowlist.includes(user.email.toLowerCase())) return true;
  const supabase = createServerSupabaseClient(true);
  if (!supabase) return false;
  const { data } = await supabase.from("admin_users").select("id").or(orEquals([["user_id", user.id], ["email", user.email.toLowerCase()]])).maybeSingle();
  return Boolean(data?.id);
}
