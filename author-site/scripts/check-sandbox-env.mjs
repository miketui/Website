#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

export const providerRequirements = {
  supabase: ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY", "SUPABASE_SERVICE_ROLE_KEY", "SUPABASE_STORAGE_BUCKET"],
  stripe: ["NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY", "STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET", "STRIPE_PRICE_ID_PREORDER", "STRIPE_PRICE_ID_REGULAR"],
  resend: ["RESEND_API_KEY", "RESEND_FROM_EMAIL", "SUPPORT_EMAIL"],
  mailerlite: [
    "MAILERLITE_API_KEY",
    "MAILERLITE_GROUP_SUBSCRIBERS",
    "MAILERLITE_GROUP_FREE_CHAPTER",
    "MAILERLITE_GROUP_PREORDERS",
    "MAILERLITE_GROUP_CUSTOMERS",
    "MAILERLITE_GROUP_REFUNDED"
  ],
  turnstile: ["NEXT_PUBLIC_TURNSTILE_SITE_KEY", "TURNSTILE_SECRET_KEY"],
  analytics: ["NEXT_PUBLIC_GA4_MEASUREMENT_ID", "NEXT_PUBLIC_POSTHOG_KEY", "NEXT_PUBLIC_POSTHOG_HOST"]
};

const secretishNames = new Set([
  "SUPABASE_SERVICE_ROLE_KEY",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "RESEND_API_KEY",
  "MAILERLITE_API_KEY",
  "TURNSTILE_SECRET_KEY",
  "GA4_API_SECRET",
  "POSTHOG_PERSONAL_API_KEY",
  "DOWNLOAD_TOKEN_SECRET",
  "CRON_SECRET"
]);

export function isMeaningfulSandboxValue(value) {
  if (typeof value !== "string") return Boolean(value);
  const trimmed = value.trim();
  if (!trimmed) return false;
  return !/^(?:replace|replace_|replace-with|placeholder|your_|example_|changeme|todo)/i.test(trimmed);
}

export function parseDotenv(source) {
  const parsed = {};
  for (const rawLine of source.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!match) continue;
    const [, key, rawValue] = match;
    parsed[key] = rawValue.replace(/^['"]|['"]$/g, "");
  }
  return parsed;
}

export function loadSandboxEnv(cwd = process.cwd(), baseEnv = process.env) {
  const env = { ...baseEnv };
  for (const name of [".env.sandbox", ".env.local"]) {
    const path = resolve(cwd, name);
    if (!existsSync(path)) continue;
    Object.assign(env, parseDotenv(readFileSync(path, "utf8")));
  }
  return env;
}

export function isLiveStripeValue(value = "") {
  const liveKeyPrefix = "_" + "live" + "_";
  const webhookLivePrefix = "whsec" + liveKeyPrefix;
  return new RegExp(`\\b(?:sk|rk|pk)${liveKeyPrefix}[A-Za-z0-9]+\\b`).test(value) || new RegExp(`\\b${webhookLivePrefix}[A-Za-z0-9_]*\\b`).test(value);
}

export function detectDangerousSandboxEnv(env, options = {}) {
  const issues = [];
  const liveStripeEntries = Object.entries(env).filter(([, value]) => typeof value === "string" && isLiveStripeValue(value));
  if (liveStripeEntries.length) {
    issues.push(`Live Stripe credential pattern detected in: ${liveStripeEntries.map(([key]) => key).join(", ")}`);
  }

  const siteUrl = env.NEXT_PUBLIC_SITE_URL ?? "";
  const allowProductionDomain = env.ALLOW_PRODUCTION_DOMAIN_FOR_SANDBOX === "true" || options.allowProductionDomain === true;
  if (siteUrl && !allowProductionDomain && !/^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0)(:\d+)?\/?/i.test(siteUrl) && !/\.vercel\.app\/?$/i.test(siteUrl)) {
    issues.push("NEXT_PUBLIC_SITE_URL is not localhost or a Vercel preview URL. Set ALLOW_PRODUCTION_DOMAIN_FOR_SANDBOX=true only for an intentional sandbox domain test.");
  }

  return issues;
}

export function providerStatus(env) {
  return Object.fromEntries(
    Object.entries(providerRequirements).map(([provider, names]) => {
      const present = names.filter((name) => isMeaningfulSandboxValue(env[name]));
      const missing = names.filter((name) => !isMeaningfulSandboxValue(env[name]));
      return [provider, { present: present.length, total: names.length, missing }];
    })
  );
}

function printSummary(env) {
  console.log("Sandbox environment readiness (values hidden):");
  for (const [provider, status] of Object.entries(providerStatus(env))) {
    const label = status.missing.length ? "missing/partial" : "present";
    console.log(`- ${provider}: ${label} (${status.present}/${status.total})${status.missing.length ? ` missing ${status.missing.join(", ")}` : ""}`);
  }

  const populatedSecretNames = Object.keys(env).filter((name) => secretishNames.has(name) && isMeaningfulSandboxValue(env[name]));
  console.log(`Secret-bearing variables populated: ${populatedSecretNames.length ? populatedSecretNames.join(", ") : "none"} (values not printed)`);
}

export function runSandboxEnvCheck({ cwd = process.cwd(), env = loadSandboxEnv(cwd) } = {}) {
  const issues = detectDangerousSandboxEnv(env);
  printSummary(env);
  if (issues.length) {
    for (const issue of issues) console.error(`DANGEROUS: ${issue}`);
    return { ok: false, issues };
  }
  console.log("Sandbox env check completed. Missing provider configs are allowed for readiness scaffolding; dangerous live values fail.");
  return { ok: true, issues: [] };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = runSandboxEnvCheck();
  process.exit(result.ok ? 0 : 1);
}
