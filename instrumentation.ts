import * as Sentry from "@sentry/nextjs";

export async function register() {
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (!dsn) return; // Unconfigured is a valid state — never throw on a missing DSN.

  if (process.env.NEXT_RUNTIME === "nodejs") {
    Sentry.init({ dsn, tracesSampleRate: 0.1, environment: process.env.VERCEL_ENV ?? "development" });
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    Sentry.init({ dsn, tracesSampleRate: 0.1, environment: process.env.VERCEL_ENV ?? "development" });
  }
}

export const onRequestError = Sentry.captureRequestError;
