export type TurnstileVerification =
  | { ok: true; skipped: boolean }
  | { ok: false; reason: "missing_token" | "verification_failed" | "provider_error" };

/**
 * Server-side Cloudflare Turnstile verification.
 * Boundary rule: when TURNSTILE_SECRET_KEY is configured the token is required
 * and must verify; when it is not configured (sandbox), verification is
 * skipped so the funnel stays testable without live keys.
 */
export async function verifyTurnstileToken(token: string | undefined, remoteIp?: string | null): Promise<TurnstileVerification> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return { ok: true, skipped: true };
  if (!token) return { ok: false, reason: "missing_token" };

  const body = new URLSearchParams({ secret, response: token });
  if (remoteIp) body.set("remoteip", remoteIp);

  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body });
    if (!response.ok) return { ok: false, reason: "provider_error" };
    const result = (await response.json()) as { success?: boolean };
    return result.success ? { ok: true, skipped: false } : { ok: false, reason: "verification_failed" };
  } catch {
    return { ok: false, reason: "provider_error" };
  }
}

export function requestIp(request: Request) {
  return request.headers.get("cf-connecting-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
}
