import { z } from "zod";

const schema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://127.0.0.1:3000"),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().default("https://example.supabase.co"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).default("dev-anon-key"),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).default("dev-service-role-key"),
  STRIPE_SECRET_KEY: z.string().min(1).default("sk_test_dev"),
  STRIPE_WEBHOOK_SECRET: z.string().min(1).default("whsec_dev"),
  STRIPE_PRICE_ID_PRO: z.string().min(1).default("price_dev"),
  RESEND_API_KEY: z.string().min(1).default("re_dev"),
  SENTRY_DSN: z.string().url().optional(),
  NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_HOST: z.string().url().optional()
});

export const env = schema.parse(process.env);
