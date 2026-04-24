import { z } from "zod";

// Public env: only NEXT_PUBLIC_* variables belong here.
// This module is safe to import from Client Components.
// Secrets live in env.server.ts, which is guarded by `server-only`.

// Strict in actual deploy contexts (Vercel or CI); lenient elsewhere so local
// `npm run dev` and local `npm run build` don't require a fully-populated
// .env.local. The strict branch is what guarantees prod deploys can never
// silently ship with placeholder values.
const isDeployBuild = process.env.VERCEL === "1" || process.env.CI === "true";
const optional = <T extends z.ZodTypeAny>(schema: T, devDefault: z.input<T>) =>
  isDeployBuild ? schema : schema.default(devDefault);

const publicSchema = z.object({
  NEXT_PUBLIC_APP_URL: optional(z.string().url(), "http://127.0.0.1:3000"),
  NEXT_PUBLIC_SUPABASE_URL: optional(z.string().url(), "https://example.supabase.co"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: optional(z.string().min(1), "dev-anon-key"),
  NEXT_PUBLIC_POSTHOG_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_POSTHOG_HOST: z.string().url().default("https://eu.i.posthog.com"),
  // Sentry DSN is a public write-only token by design — making it NEXT_PUBLIC_
  // lets one env var cover client, server, and edge runtimes. Optional: when
  // unset, Sentry stays dormant and nothing is reported.
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional()
});

const parsed = publicSchema.safeParse(process.env);
if (!parsed.success) {
  const issues = parsed.error.issues
    .map((issue) => `  - ${issue.path.join(".") || "(root)"}: ${issue.message}`)
    .join("\n");
  throw new Error(
    `[env] Invalid or missing public environment variables:\n${issues}\n` +
      `See .env.example for the required shape.`
  );
}

export const env = parsed.data;
export type PublicEnv = typeof env;
