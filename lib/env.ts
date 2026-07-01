import { z } from "zod";

const launchModeSchema = z.enum(["preorder", "launched", "paused"]);

const publicEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
  NEXT_PUBLIC_LAUNCH_MODE: launchModeSchema.optional(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().optional(),
  NEXT_PUBLIC_THANKYOU_VIDEO_ID: z.string().optional(),
  NEXT_PUBLIC_GA4_MEASUREMENT_ID: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_HOST: z.string().url().optional(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional()
});

const serverEnvSchema = publicEnvSchema.extend({
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  SUPABASE_STORAGE_BUCKET: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  STRIPE_PRICE_ID_PREORDER: z.string().optional(),
  STRIPE_PRICE_ID_REGULAR: z.string().optional(),
  STRIPE_PRICE_ID_BUNDLE: z.string().optional(),
  STRIPE_PRICE_ID_CARD_DECK: z.string().optional(),
  STRIPE_PRICE_ID_WORKSHEETS: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  RESEND_FROM_EMAIL: z.string().email().optional(),
  SUPPORT_EMAIL: z.string().email().optional(),
  MAILERLITE_API_KEY: z.string().optional(),
  MAILERLITE_GROUP_SUBSCRIBERS: z.string().optional(),
  MAILERLITE_GROUP_FREE_CHAPTER: z.string().optional(),
  MAILERLITE_GROUP_PREORDERS: z.string().optional(),
  MAILERLITE_GROUP_CUSTOMERS: z.string().optional(),
  MAILERLITE_GROUP_ABANDONED_CHECKOUT: z.string().optional(),
  MAILERLITE_GROUP_BONUS_CLAIM_STARTED: z.string().optional(),
  MAILERLITE_GROUP_BONUS_CLAIM_COMPLETED: z.string().optional(),
  MAILERLITE_GROUP_REFUNDED: z.string().optional(),
  MAILERLITE_GROUP_BLOG_READERS: z.string().optional(),
  MAILERLITE_GROUP_VIP_EARLY_READERS: z.string().optional(),
  MAILERLITE_GROUP_QUIZ: z.string().optional(),
  TURNSTILE_SECRET_KEY: z.string().optional(),
  ADMIN_EMAILS: z.string().optional(),
  GA4_API_SECRET: z.string().optional(),
  SENTRY_ORG: z.string().optional(),
  SENTRY_PROJECT: z.string().optional(),
  SENTRY_AUTH_TOKEN: z.string().optional()
});

export type LaunchMode = z.infer<typeof launchModeSchema>;
export type RuntimeConfigResult<T> = { ok: true; value: T } | { ok: false; reason: "config_missing"; missing: string[] };

export const publicEnv = publicEnvSchema.parse(process.env);
export const env = serverEnvSchema.parse(process.env);

function missing(names: string[]) {
  return names.filter((name) => !process.env[name]);
}

export function requireRuntimeConfig<T>(result: RuntimeConfigResult<T>, label: string): T {
  if (result.ok) return result.value;
  throw new Error(`${label} is not configured. Missing: ${result.missing.join(", ")}`);
}

export function getSiteUrl() {
  return publicEnv.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export function getLaunchMode(): LaunchMode {
  return publicEnv.NEXT_PUBLIC_LAUNCH_MODE ?? "preorder";
}

export function getStripeConfig(): RuntimeConfigResult<{
  secretKey: string;
  webhookSecret?: string;
  preorderPriceId: string;
  regularPriceId: string;
  bundlePriceId?: string;
  cardDeckPriceId?: string;
  worksheetsPriceId?: string;
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
      bundlePriceId: process.env.STRIPE_PRICE_ID_BUNDLE,
      cardDeckPriceId: process.env.STRIPE_PRICE_ID_CARD_DECK,
      worksheetsPriceId: process.env.STRIPE_PRICE_ID_WORKSHEETS
    }
  };
}

export function getStripeWebhookConfig(): RuntimeConfigResult<{ secretKey: string; webhookSecret: string }> {
  const absent = missing(["STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET"]);
  if (absent.length) return { ok: false, reason: "config_missing", missing: absent };
  return { ok: true, value: { secretKey: process.env.STRIPE_SECRET_KEY!, webhookSecret: process.env.STRIPE_WEBHOOK_SECRET! } };
}

export function getSupabaseBrowserConfig(): RuntimeConfigResult<{ url: string; anonKey: string }> {
  const absent = missing(["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"]);
  if (absent.length) return { ok: false, reason: "config_missing", missing: absent };
  return { ok: true, value: { url: process.env.NEXT_PUBLIC_SUPABASE_URL!, anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! } };
}

export function getSupabaseServerConfig(useServiceRole = false): RuntimeConfigResult<{ url: string; key: string; role: "anon" | "service"; bucket: string }> {
  const required = useServiceRole ? ["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"] : ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"];
  const absent = missing(required);
  if (absent.length) return { ok: false, reason: "config_missing", missing: absent };
  return {
    ok: true,
    value: {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
      key: useServiceRole ? process.env.SUPABASE_SERVICE_ROLE_KEY! : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
        free_chapter: process.env.MAILERLITE_GROUP_FREE_CHAPTER,
        preorders: process.env.MAILERLITE_GROUP_PREORDERS,
        customers: process.env.MAILERLITE_GROUP_CUSTOMERS,
        abandoned_checkout: process.env.MAILERLITE_GROUP_ABANDONED_CHECKOUT,
        bonus_claim_started: process.env.MAILERLITE_GROUP_BONUS_CLAIM_STARTED,
        bonus_claim_completed: process.env.MAILERLITE_GROUP_BONUS_CLAIM_COMPLETED,
        refunded: process.env.MAILERLITE_GROUP_REFUNDED,
        blog_readers: process.env.MAILERLITE_GROUP_BLOG_READERS,
        vip_early_readers: process.env.MAILERLITE_GROUP_VIP_EARLY_READERS,
        quiz: process.env.MAILERLITE_GROUP_QUIZ
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
