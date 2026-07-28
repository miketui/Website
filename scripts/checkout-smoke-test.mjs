#!/usr/bin/env node
/**
 * Checkout smoke test — the live counterpart to scripts/stripe-test-mode-check.mjs.
 *
 * That script validates the *shape* of the Stripe env values (sk_test_ prefix,
 * price_ pattern). It never contacts Stripe, so it cannot detect the two
 * failures that actually produced the historical 502s on POST /api/checkout:
 *
 *   1. authentication_error — the key is well-formed but rotated/revoked.
 *   2. resource_missing     — the price ID is well-formed but belongs to a
 *                             different Stripe account.
 *
 * Both are invisible to static checks and to typecheck/lint/unit/build. This
 * script resolves every configured price against the API and then creates a
 * real test-mode Checkout Session, which is the same call /api/checkout makes.
 *
 * Safety: refuses to run against anything that is not a test-mode key.
 * Skips cleanly (exit 0) when Stripe env vars are absent, so CI without
 * secrets is unaffected — set STRIPE_SMOKE_REQUIRED=true to make absence fail.
 *
 * Usage:
 *   pnpm check:checkout
 *   STRIPE_SMOKE_REQUIRED=true pnpm check:checkout
 */

import Stripe from "stripe";

const PRICE_VARS = [
  { name: "STRIPE_PRICE_ID_PREORDER", required: true, label: "book — preorder tier" },
  { name: "STRIPE_PRICE_ID_REGULAR", required: true, label: "book — regular tier" },
  { name: "STRIPE_PRICE_ID_DAILY_DIRECTIVES_BUNDLE", required: false, label: "Daily Directives bundle" },
  { name: "STRIPE_PRICE_ID_WORKBOOK", required: false, label: "Idea-to-Action Workbook" }
];

function fail(message) {
  console.error(`\n✗ ${message}\n`);
  process.exit(1);
}

function describeStripeError(err) {
  const type = err?.type ?? "unknown_error";
  const code = err?.code ?? "";
  if (type === "StripeAuthenticationError" || code === "authentication_error") {
    return "STRIPE_SECRET_KEY was rejected by Stripe. The key is well-formed but rotated, revoked, or from a deleted account. Regenerate it in the Stripe dashboard and update the environment.";
  }
  if (code === "resource_missing") {
    return "Stripe returned resource_missing. The ID is well-formed but does not exist in THIS Stripe account — the classic symptom of price IDs copied from a different account or from live into test.";
  }
  return `${type}${code ? ` (${code})` : ""}: ${err?.message ?? "no message"}`;
}

async function main() {
  const secretKey = (process.env.STRIPE_SECRET_KEY ?? "").trim();
  const required = process.env.STRIPE_SMOKE_REQUIRED === "true";

  if (!secretKey) {
    const message = "STRIPE_SECRET_KEY is not set — checkout smoke test skipped.";
    if (required) fail(`${message} STRIPE_SMOKE_REQUIRED=true, so this is a failure.`);
    console.log(`- ${message}`);
    return;
  }

  if (!/^sk_test_/.test(secretKey)) {
    fail("STRIPE_SECRET_KEY is not a test-mode key. This script creates real Checkout Sessions and refuses to run against live credentials.");
  }

  const stripe = new Stripe(secretKey);
  console.log("Checkout smoke test (Stripe test mode)\n");

  // 1. Prove the key authenticates at all.
  try {
    const account = await stripe.accounts.retrieve();
    console.log(`  ✓ key authenticates (account ${account.id})`);
  } catch (err) {
    fail(`Key authentication failed. ${describeStripeError(err)}`);
  }

  // 2. Resolve every configured price against THIS account.
  const resolved = [];
  for (const { name, required: priceRequired, label } of PRICE_VARS) {
    const id = (process.env[name] ?? "").trim();
    if (!id) {
      if (priceRequired) fail(`${name} is not set. The book cannot be sold without it.`);
      console.log(`  - ${name} not set (optional: ${label}) — skipped`);
      continue;
    }
    try {
      const price = await stripe.prices.retrieve(id);
      if (!price.active) fail(`${name} (${id}) resolves but is INACTIVE in Stripe. Checkout will fail for ${label}.`);
      const amount = price.unit_amount == null ? "n/a" : `${(price.unit_amount / 100).toFixed(2)} ${String(price.currency).toUpperCase()}`;
      console.log(`  ✓ ${name} → ${amount} (${label})`);
      resolved.push({ price: id, quantity: 1 });
    } catch (err) {
      fail(`${name} (${id}) could not be resolved. ${describeStripeError(err)}`);
    }
  }

  if (!resolved.length) fail("No prices resolved — nothing to test a session against.");

  // 3. The real thing: the same call /api/checkout makes.
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [resolved[0]],
      success_url: "https://example.test/thank-you?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "https://example.test/preorder",
      metadata: { smoke_test: "true" }
    });
    if (!session.url) fail("Session was created but returned no URL — the buyer would have nowhere to go.");
    console.log(`  ✓ checkout session created (${session.id})`);
  } catch (err) {
    fail(`stripe.checkout.sessions.create failed — this is the exact call behind POST /api/checkout. ${describeStripeError(err)}`);
  }

  console.log("\n✓ Checkout path verified end to end against Stripe test mode.\n");
}

main().catch((err) => fail(`Unexpected failure: ${err?.message ?? err}`));
