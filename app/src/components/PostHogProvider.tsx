"use client";

import posthog from "posthog-js";
import { PostHogProvider as Provider } from "posthog-js/react";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { env } from "@/lib/env";

// PostHog initialization is opt-in via NEXT_PUBLIC_POSTHOG_KEY. When the key
// is absent (local dev without a .env entry, or a Vercel preview without
// analytics configured), this provider is a pass-through and the SDK never
// touches the network — zero analytics overhead, zero cookie footprint.
//
// Privacy decisions baked in:
//   - persistence: "memory" → no cookies, no localStorage. Sessions don't
//     survive a refresh, but we avoid needing a consent banner on day one.
//     When M1 introduces proper auth + a consent CMP, flip to "localStorage".
//   - autocapture: false → every event is explicit. Easier to reason about
//     what leaves the browser and cheaper in PostHog event volume.
//   - capture_pageview: false → we capture pageviews manually in the hook
//     below so the App Router's client-side navigations are counted.

const posthogKey = env.NEXT_PUBLIC_POSTHOG_KEY;

function initPostHogOnce() {
  if (typeof window === "undefined" || !posthogKey) return;
  if (posthog.__loaded) return;
  posthog.init(posthogKey, {
    // Route through our own /ingest rewrite (configured in next.config.ts)
    // so browser ad blockers don't silently drop events sent to posthog.com.
    api_host: "/ingest",
    ui_host: env.NEXT_PUBLIC_POSTHOG_HOST,
    persistence: "memory",
    autocapture: false,
    capture_pageview: false,
    capture_pageleave: true,
    disable_session_recording: true,
    loaded: (ph) => {
      if (process.env.NODE_ENV === "development") ph.debug();
    }
  });
}

function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!posthogKey || !posthog.__loaded) return;
    const search = searchParams?.toString();
    const url = search ? `${pathname}?${search}` : pathname;
    posthog.capture("$pageview", { $current_url: url });
  }, [pathname, searchParams]);

  return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initPostHogOnce();
  }, []);

  if (!posthogKey) {
    return <>{children}</>;
  }

  return (
    <Provider client={posthog}>
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
      {children}
    </Provider>
  );
}
