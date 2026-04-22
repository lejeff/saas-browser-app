export function captureServerError(error: unknown) {
  // Plug into Sentry.captureException in production.
  console.error("SERVER_ERROR", error);
}

export function trackProductEvent(name: string, properties?: Record<string, string>) {
  // Plug into PostHog on client/server side where appropriate.
  console.info("PRODUCT_EVENT", { name, properties });
}
