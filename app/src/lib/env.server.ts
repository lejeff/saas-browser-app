import "server-only";
import { z } from "zod";

// Server env: secrets that must never reach the client bundle.
// Importing this from a Client Component will fail the Next.js build
// thanks to the `server-only` guard above.
//
// Local dev (not on Vercel, not in CI) allows placeholder defaults so that
// `npm run dev` and `npm run build` work without a fully populated .env.local.
// Vercel and CI builds must provide every required variable — missing values
// throw at module load so the deploy fails fast, loudly, and with a useful
// message instead of silently shipping placeholder secrets.

const isDeployBuild = process.env.VERCEL === "1" || process.env.CI === "true";
const required = <T extends z.ZodTypeAny>(schema: T, devDefault: z.input<T>) =>
  isDeployBuild ? schema : schema.default(devDefault);

const serverSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: required(z.string().min(1), "dev-service-role-key"),
  STRIPE_SECRET_KEY: required(z.string().min(1), "sk_test_dev"),
  STRIPE_WEBHOOK_SECRET: required(z.string().min(1), "whsec_dev"),
  STRIPE_PRICE_ID_PRO: required(z.string().min(1), "price_dev"),
  RESEND_API_KEY: required(z.string().min(1), "re_dev"),
  // SENTRY_AUTH_TOKEN is only used during `next build` to upload source maps.
  // The DSN itself lives in NEXT_PUBLIC_SENTRY_DSN (see app/src/lib/env.ts).
  SENTRY_AUTH_TOKEN: z.string().min(1).optional()
});

const parsed = serverSchema.safeParse(process.env);
if (!parsed.success) {
  const issues = parsed.error.issues
    .map((issue) => `  - ${issue.path.join(".") || "(root)"}: ${issue.message}`)
    .join("\n");
  throw new Error(
    `[env.server] Invalid or missing server environment variables:\n${issues}\n` +
      `See .env.example for the required shape. Set these in Vercel project settings for production deploys.`
  );
}

export const serverEnv = parsed.data;
export type ServerEnv = typeof serverEnv;
