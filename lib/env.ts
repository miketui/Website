import { z } from "zod";

const launchModeSchema = z.enum(["preorder", "launched", "paused"]);

const publicEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
  NEXT_PUBLIC_LAUNCH_MODE: launchModeSchema.optional(),
  NEXT_PUBLIC_LAUNCH_STATE: z.string().optional(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().optional(),
  NEXT_PUBLIC_THANKYOU_VIDEO_ID: z.string().optional(),
  NEXT_PUBLIC_GA4_MEASUREMENT_ID: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_HOST: z.string().url().optional(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional()
});

const serverEnvSchema = publicEnvSchema.extend({
  RELEASE_DATE: z.string().optional(),
  SUPABASE_SECRET_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  SUPABASE_STORAGE_BUCKET: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  STRIPE_PRICE_ID_PREORDER: z.string().optional(),
  STRIPE_PRICE_ID_REGULAR: z.string().optional(),
  STRIPE_PRICE_ID_DAILY_DIRECTIVES_BUNDLE: z.string().optional(),
  STRIPE_PRICE_ID_DAILY_DIRECTIVES_SET_01: z.string().optional(),
  STRIPE_PRICE_ID_DAILY_DIRECTIVES_SET_02: z.string().optional(),
  STRIPE_PRICE_ID_DAILY_DIRECTIVES_SET_03: z.string().optional(),
  STRIPE_PRICE_ID_DAILY_DIRECTIVES_SET_04: z.string().optional(),
  STRIPE_PRICE_ID_DAILY_DIRECTIVES_SET_05: z.string().optional(),
  STRIPE_PRICE_ID_DAILY_DIRECTIVES_SET_06: z.string().optional(),
  STRIPE_PRICE_ID_DAILY_DIRECTIVES_SET_07: z.string().optional(),
  STRIPE_PRICE_ID_DAILY_DIRECTIVES_SET_08: z.string().optional(),
  STRIPE_PRICE_ID_DAILY_DIRECTIVES_SET_09: z.string().optional(),
  STRIPE_PRICE_ID_DAILY_DIRECTIVES_SET_10: z.string().optional(),
  STRIPE_PRICE_ID_DAILY_DIRECTIVES_SET_11: z.string().optional(),
  STRIPE_PRICE_ID_DAILY_DIRECTIVES_SET_12: z.string().optional(),
  STRIPE_PRICE_ID_WORKBOOK: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  RESEND_FROM_EMAIL: z.string().email().optional(),
  SUPPORT_EMAIL: z.string().email().optional(),
  MAILERLITE_API_KEY: z.string().optional(),
  MAILERLITE_GROUP_SUBSCRIBERS: z.string().optional(),
  MAILERLITE_GROUP_PRICING_KIT: z.string().optional(),
  MAILERLITE_GROUP_PREORDERS: z.string().optional(),
  MAILERLITE_GROUP_CUSTOMERS: z.string().optional(),
  MAILERLITE_GROUP_ABANDONED_CHECKOUT: z.string().optional(),
  MAILERLITE_GROUP_BONUS_CLAIM_STARTED: z.string().optional(),
  MAILERLITE_GROUP_BONUS_CLAIM_COMPLETED: z.string().optional(),
  MAILERLITE_GROUP_REFUNDED: z.string().optional(),
  MAILERLITE_GROUP_BLOG_READERS: z.string().optional(),
  MAILERLITE_GROUP_VIP_EARLY_READERS: z.string().optional(),
  MAILERLITE_GROUP_QUIZ: z.string().optional(),
  MAILERLITE_GROUP_CORE_NURTURE: z.string().optional(),
  MAILERLITE_GROUP_DIGITAL_DIRECTIVE_CUSTOMERS: z.string().optional(),
  TURNSTILE_SECRET_KEY: z.string().optional(),
  ADMIN_EMAILS: z.string().optional(),
  GA4_API_SECRET: z.string().optional(),
  SENTRY_ORG: z.string().optional(),
  SENTRY_PROJECT: z.string().optional(),
  SENTRY_AUTH_TOKEN: z.string().optional(),
  CRON_SECRET: z.string().optional(),
  LAUNCH_FULFILLMENT_ENABLED: z.string().optional(),
  LAUNCH_DRYRUN_TEST_EMAIL: z.string().email().optional(),
  LAUNCH_OWNER_EMAIL: z.string().email().optional()
});

export type LaunchMode = z.infer<typeof launchModeSchema>;
export type RuntimeConfigResult<T> = { ok: true; value: T } | { ok: false; reason: "config_missing"; missing: string[] };

export const publicEnv = publicEnvSchema.parse(process.env);
export const env = serverEnvSchema.parse(process.env);

function missing(names: string[]) {
  return names.filter((name) => !process.env[name]);
}

function firstConfigured(...values: Array<string | undefined>): string | undefined {
  return values.map((value) => value?.trim()).find((value): value is string => Boolean(value));
}

function supabaseUrl(): string | undefined {
  return firstConfigured(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_NEXT_SUPABASE_URL,
    process.env.NEXT_SUPABASE_URL,
    process.env.SUPABASE_URL
  );
}

function supabasePublishableKey(): string | undefined {
  return firstConfigured(
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    process.env.NEXT_PUBLIC_NEXT_SUPABASE_PUBLISHABLE_KEY,
    process.env.NEXT_PUBLIC_NEXT_SUPABASE_ANON_KEY,
    process.env.NEXT_SUPABASE_PUBLISHABLE_KEY,
    process.env.NEXT_SUPABASE_ANON_KEY,
    process.env.SUPABASE_ANON_KEY
  );
}

function supabaseSecretKey(): string | undefined {
  return firstConfigured(
    process.env.SUPABASE_SECRET_KEY,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    process.env.NEXT_SUPABASE_SECRET_KEY,
    process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY
  );
}

/**
 * Use this instead of `process.env.X ?? fallback` for any env var that feeds
 * a default. The `??` operator only falls back on null/undefined — an env
 * var saved as an empty string (easy to do by accident in the Vercel
 * dashboard, or when a value is deleted but the key is left behind) passes
 * `??` untouched and silently becomes "". For most vars that's just a bad
 * default; for RELEASE_DATE specifically it crashed the entire production
 * build (new Date("" + "T00:00:00Z") throws RangeError: Invalid time value
 * during static prerender of /book — see tierFlipDate() in lib/schema.ts).
 * This treats "" and whitespace-only strings the same as unset.
 */
export function envOrDefault(value: string | undefined | null, fallback: string): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : fallback;
}

export function requireRuntimeConfig<T>(result: RuntimeConfigResult<T>, label: string): T {
  if (result.ok) return result.value;
  throw new Error(`${label} is not configured. Missing: ${result.missing.join(", ")}`);
}

export function getSiteUrl() {
  return envOrDefault(publicEnv.NEXT_PUBLIC_SITE_URL, "http://localhost:3000");
}

export function getLaunchMode(): LaunchMode {
  const raw = envOrDefault(publicEnv.NEXT_PUBLIC_LAUNCH_MODE, "preorder");
  return launchModeSchema.safeParse(raw).success ? (raw as LaunchMode) : "preorder";
}

export function getStripeConfig(): RuntimeConfigResult<{
  secretKey: string;
  webhookSecret?: string;
  preorderPriceId: string;
  regularPriceId: string;
  dailyDirectivesBundlePriceId?: string;
}> {
  const required = ["STRIPE_SECRET_KEY", "STRIPE_PRICE_ID_PREORDER", "STRIPE_PRICE_ID_REGULAR"];
  const absent = missing(required);
  if (absent.length) return { ok: false, reason: "config_missing", missing: absent };
  return {
    ok: true,
    value: {
      secretKey: process.env.STRIPE_SECRET_KEY!,
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
      preorderPriceId: process.env.STRIPE_PRICE_ID_PREORDER!,
      regularPriceId: process.env.STRIPE_PRICE_ID_REGULAR!,
      dailyDirectivesBundlePriceId: process.env.STRIPE_PRICE_ID_DAILY_DIRECTIVES_BUNDLE
    }
  };
}

export function getStripeWebhookConfig(): RuntimeConfigResult<{ secretKey: string; webhookSecret: string }> {
  const absent = missing(["STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET"]);
  if (absent.length) return { ok: false, reason: "config_missing", missing: absent };
  return { ok: true, value: { secretKey: process.env.STRIPE_SECRET_KEY!, webhookSecret: process.env.STRIPE_WEBHOOK_SECRET! } };
}

export function getSupabaseBrowserConfig(): RuntimeConfigResult<{ url: string; anonKey: string }> {
  const url = supabaseUrl();
  const publishableKey = supabasePublishableKey();
  const absent = [!url ? "NEXT_PUBLIC_SUPABASE_URL" : null, !publishableKey ? "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY" : null].filter((value): value is string => Boolean(value));
  if (absent.length) return { ok: false, reason: "config_missing", missing: absent };
  return { ok: true, value: { url: url!, anonKey: publishableKey! } };
}

export function getSupabaseServerConfig(useServiceRole = false): RuntimeConfigResult<{ url: string; key: string; role: "anon" | "service"; bucket: string }> {
  const url = supabaseUrl();
  const key = useServiceRole ? supabaseSecretKey() : supabasePublishableKey();
  const absent = [
    !url ? "NEXT_PUBLIC_SUPABASE_URL" : null,
    !key ? (useServiceRole ? "SUPABASE_SECRET_KEY" : "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY") : null
  ].filter((value): value is string => Boolean(value));
  if (absent.length) return { ok: false, reason: "config_missing", missing: absent };
  return {
    ok: true,
    value: {
      url: url!,
      key: key!,
      role: useServiceRole ? "service" : "anon",
      bucket: process.env.SUPABASE_STORAGE_BUCKET ?? "curls-deliverables"
    }
  };
}

export function getMailerLiteConfig(): RuntimeConfigResult<{ apiKey: string; groups: Record<string, string | undefined> }> {
  if (!process.env.MAILERLITE_API_KEY) return { ok: false, reason: "config_missing", missing: ["MAILERLITE_API_KEY"] };
  return {
    ok: true,
    value: {
      apiKey: process.env.MAILERLITE_API_KEY,
      groups: {
        subscribers: process.env.MAILERLITE_GROUP_SUBSCRIBERS,
        // MailerLite group IDs are non-secret identifiers. The connected
        // provider created this canonical group on 2026-07-12; env may override.
        pricing_kit: process.env.MAILERLITE_GROUP_PRICING_KIT || "192789958246794286",
        preorders: process.env.MAILERLITE_GROUP_PREORDERS,
        customers: process.env.MAILERLITE_GROUP_CUSTOMERS,
        abandoned_checkout: process.env.MAILERLITE_GROUP_ABANDONED_CHECKOUT,
        bonus_claim_started: process.env.MAILERLITE_GROUP_BONUS_CLAIM_STARTED,
        bonus_claim_completed: process.env.MAILERLITE_GROUP_BONUS_CLAIM_COMPLETED,
        refunded: process.env.MAILERLITE_GROUP_REFUNDED,
        blog_readers: process.env.MAILERLITE_GROUP_BLOG_READERS,
        vip_early_readers: process.env.MAILERLITE_GROUP_VIP_EARLY_READERS,
        quiz: process.env.MAILERLITE_GROUP_QUIZ,
        core_nurture: process.env.MAILERLITE_GROUP_CORE_NURTURE || "192794786755773469",
        digital_directive_customers: process.env.MAILERLITE_GROUP_DIGITAL_DIRECTIVE_CUSTOMERS || "192794787632383140"
      }
    }
  };
}

export function getResendConfig(): RuntimeConfigResult<{ apiKey: string; fromEmail: string; supportEmail: string }> {
  const absent = missing(["RESEND_API_KEY", "RESEND_FROM_EMAIL", "SUPPORT_EMAIL"]);
  if (absent.length) return { ok: false, reason: "config_missing", missing: absent };
  return { ok: true, value: { apiKey: process.env.RESEND_API_KEY!, fromEmail: process.env.RESEND_FROM_EMAIL!, supportEmail: process.env.SUPPORT_EMAIL! } };
}

export function getAnalyticsConfig() {
  return {
    ga4MeasurementId: publicEnv.NEXT_PUBLIC_GA4_MEASUREMENT_ID,
    ga4ApiSecretConfigured: Boolean(process.env.GA4_API_SECRET),
    posthogKey: publicEnv.NEXT_PUBLIC_POSTHOG_KEY,
    posthogHost: publicEnv.NEXT_PUBLIC_POSTHOG_HOST,
    serverAnalyticsConfigured: getSupabaseServerConfig(true).ok
  } as const;
}

export function safeConfigError(result: RuntimeConfigResult<unknown>) {
  return result.ok ? null : { code: result.reason, missing: result.missing };
}
