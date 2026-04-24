// Client-side Sentry init — runs once in the browser.
// Next.js 15.3+ auto-loads this file when present.
//
// No init happens when NEXT_PUBLIC_SENTRY_DSN is unset: the Sentry SDK never
// ships a single byte of network traffic and the bundle footprint is minimal.

import * as Sentry from "@sentry/nextjs";

const DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (DSN) {
  Sentry.init({
    dsn: DSN,
    environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? process.env.NODE_ENV,
    // Tracing: conservative in prod so we stay under the 5k events/month free
    // tier, full fidelity in dev so we can debug perf locally.
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
    // Session Replay is OFF by default — it's the single biggest privacy and
    // cost surface. M2+ will enable onError at 1.0 if we find it useful.
    replaysSessionSampleRate: 0.0,
    replaysOnErrorSampleRate: 0.0,
    debug: false
  });
}

// Exported so Next.js can instrument router transitions.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/features/navigation-tracing/
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
