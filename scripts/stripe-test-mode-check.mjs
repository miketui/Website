#!/usr/bin/env node
import { isLiveStripeValue, isMeaningfulSandboxValue, loadSandboxEnv } from "./check-sandbox-env.mjs";

export const stripeEnvNames = [
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "STRIPE_PRICE_ID_PREORDER",
  "STRIPE_PRICE_ID_REGULAR"
];

export function stripeTestModeStatus(env = loadSandboxEnv(process.cwd())) {
  const liveOffenders = stripeEnvNames.filter((name) => isLiveStripeValue(env[name] ?? ""));
  if (liveOffenders.length) return { ok: false, reason: `Live Stripe credential pattern detected in ${liveOffenders.join(", ")}` };

  const missing = stripeEnvNames.filter((name) => !isMeaningfulSandboxValue(env[name]));
  const secretKey = env.STRIPE_SECRET_KEY ?? "";
  const publishableKey = env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";
  if (secretKey && !/^sk_test_/.test(secretKey)) return { ok: false, reason: "STRIPE_SECRET_KEY is present but is not a Stripe test secret key pattern." };
  if (publishableKey && !/^pk_test_/.test(publishableKey)) return { ok: false, reason: "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is present but is not a Stripe test publishable key pattern." };
  for (const name of ["STRIPE_PRICE_ID_PREORDER", "STRIPE_PRICE_ID_REGULAR"]) {
    if (isMeaningfulSandboxValue(env[name]) && !/^price_[A-Za-z0-9_]+$/.test(env[name])) {
      return { ok: false, reason: `${name} is present but does not look like a Stripe price ID.` };
    }
  }

  if (missing.length) return { ok: true, skipped: true, missing };
  return { ok: true, skipped: false };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const status = stripeTestModeStatus();
  if (!status.ok) {
    console.error(`Stripe test-mode check failed: ${status.reason}`);
    process.exit(1);
  }
  if (status.skipped) {
    console.log(`Stripe test-mode check skipped: missing ${status.missing.join(", ")}. Live key patterns were not detected.`);
    process.exit(0);
  }
  console.log("Stripe test-mode check passed: only test-mode key patterns are configured and price env names are present.");
}
