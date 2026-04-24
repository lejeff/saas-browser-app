// Next.js instrumentation hook — runs once per runtime at boot.
// https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
//
// When NEXT_PUBLIC_SENTRY_DSN is unset (local dev, or a fresh deploy without
// observability configured), Sentry stays fully dormant — no network requests,
// no instrumentation overhead. Flip it on by setting the env var on Vercel.

import * as Sentry from "@sentry/nextjs";

const DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

export async function register() {
  if (!DSN) return;

  if (process.env.NEXT_RUNTIME === "nodejs") {
    Sentry.init({
      dsn: DSN,
      environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV,
      // Low sample rate in prod keeps the 5k events/month free tier viable
      // while still surfacing ~1 in 10 traces when performance regresses.
      tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
      debug: false
    });
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    Sentry.init({
      dsn: DSN,
      environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV,
      tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
      debug: false
    });
  }
}

// Re-export so Next.js can surface request errors to Sentry automatically.
export const onRequestError = Sentry.captureRequestError;
