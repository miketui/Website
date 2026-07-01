import * as Sentry from "@sentry/nextjs";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0, // Session replay off by default — enable deliberately if ever needed, it captures real user screens.
    replaysOnErrorSampleRate: 0
  });
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
