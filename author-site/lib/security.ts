import { getSessionUser, isAdminUser, type SessionUser } from "@/lib/supabase/server";

export function adminEmailAllowlist() {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export async function requireAdmin(userOverride?: SessionUser | null) {
  const user = userOverride === undefined ? await getSessionUser() : userOverride;
  if (!user?.email) return { ok: false as const, reason: "Admin authentication required." };
  const allowed = await isAdminUser(user, adminEmailAllowlist());
  return allowed ? { ok: true as const, user } : { ok: false as const, reason: "Admin authorization required." };
}

export function adminDataUnavailableMessage() {
  return "Connect Supabase and authorize an admin account to view real operational data.";
}
