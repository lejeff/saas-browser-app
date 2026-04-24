import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  transpilePackages: ["@app/core"],
  // Dev-only: allow 127.0.0.1 (used by Playwright) alongside the default
  // localhost. Silences the "Cross origin request detected" warning scheduled
  // to become an error in a future Next.js major.
  allowedDevOrigins: ["127.0.0.1"],
  eslint: {
    ignoreDuringBuilds: true
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" }
        ]
      }
    ];
  },
  // Proxy PostHog EU ingestion through our own domain so browser ad blockers
  // (uBlock, Brave shields, etc.) don't silently drop analytics events. The
  // SDK is configured with api_host: "/ingest" to match this.
  async rewrites() {
    const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://eu.i.posthog.com";
    return [
      { source: "/ingest/static/:path*", destination: `${posthogHost}/static/:path*` },
      { source: "/ingest/:path*", destination: `${posthogHost}/:path*` },
      { source: "/ingest/decide", destination: `${posthogHost}/decide` }
    ];
  },
  skipTrailingSlashRedirect: true
};

// Sentry build-time integration. The wrapper is a no-op at runtime if
// SENTRY_AUTH_TOKEN is unset (source-map upload is skipped). Error and
// performance reporting themselves are controlled by the instrumentation
// files — they're already dormant when NEXT_PUBLIC_SENTRY_DSN is unset.
export default withSentryConfig(nextConfig, {
  // Org + project slugs come from Sentry's project settings. Left undefined
  // so source-map upload is a no-op until the user sets SENTRY_ORG and
  // SENTRY_PROJECT (usually via Vercel's Sentry integration, which injects
  // them automatically).
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: !process.env.CI,
  // Upload source maps to Sentry for readable stack traces, then delete them
  // from the build output so they're never served to end users.
  sourcemaps: {
    deleteSourcemapsAfterUpload: true
  },
  // Proxy Sentry traffic through /monitoring to sidestep browser ad blockers
  // that silently drop requests to ingest.de.sentry.io.
  tunnelRoute: "/monitoring",
  disableLogger: true,
  // We rely on Next.js's built-in instrumentation hook; no auto-instrumentation
  // of middleware or edge routes beyond what we configure explicitly.
  automaticVercelMonitors: false
});
