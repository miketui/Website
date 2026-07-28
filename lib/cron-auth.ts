import { timingSafeEqual } from "node:crypto";

export type CronAuthResult = { ok: true } | { ok: false; status: number; code: string };

/**
 * Bearer-token check for the cron routes.
 *
 * The previous inline form was `if (cronSecret && authHeader !== ...)`, which
 * authenticated only when CRON_SECRET happened to be set. With the variable
 * absent — a fresh environment, a typo, a deleted Vercel var — the guard
 * evaluated false and every caller was admitted unauthenticated. These routes
 * send launch email to real buyers, so failing open is the wrong direction:
 * a missing secret is a misconfiguration (503), not an invitation.
 */
export function authorizeCronRequest(request: Request): CronAuthResult {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) return { ok: false, status: 503, code: "cron_secret_missing" };

  const authHeader = request.headers.get("authorization");
  if (!authHeader) return { ok: false, status: 401, code: "unauthorized" };

  const expected = Buffer.from(`Bearer ${cronSecret}`);
  const received = Buffer.from(authHeader);
  // timingSafeEqual throws on length mismatch, so compare length first. The
  // length of the expected value is not secret; its contents are.
  const matches = expected.length === received.length && timingSafeEqual(expected, received);
  if (!matches) return { ok: false, status: 401, code: "unauthorized" };

  return { ok: true };
}
