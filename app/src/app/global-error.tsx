"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

// Next.js App Router top-level error boundary. Must be a Client Component
// and must render its own <html>/<body> because this replaces RootLayout
// when an uncaught error escapes all nested boundaries.

export default function GlobalError({
  error
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", padding: "4rem 2rem" }}>
        <h1>Something went wrong.</h1>
        <p>We&apos;ve logged the issue. Please refresh the page or try again later.</p>
      </body>
    </html>
  );
}
