# Vercel Deployment — Financial Planner

End-to-end playbook for the first production deploy at **https://planner.boombaleia.com**.

Everything here is a one-time setup. Subsequent deploys happen automatically on every push to `main` (production) and every PR (preview).

---

## 1. Vercel project setup

1. Sign in at https://vercel.com (free "Hobby" tier is enough to start).
2. **Add New → Project** → import the GitHub repository.
3. **Project Settings** on the import screen:
   - **Framework Preset**: auto-detected as Next.js from `vercel.json`.
   - **Root Directory**: leave empty (repo root). `vercel.json` handles the monorepo:
     - `installCommand`: `npm install` (hoists `@app/core` via npm workspaces)
     - `buildCommand`: `npm run build --workspace app`
     - `outputDirectory`: `app/.next`
   - **Node.js Version**: 20.x.
4. **Do not click Deploy yet** — we need environment variables first (next section). Cancel the auto-deploy if it starts.

## 2. Environment variables

In **Project Settings → Environment Variables**, add the following to all three scopes (Production, Preview, Development) unless noted otherwise.

### Public (baked into the client bundle)

| Name | Value |
| ---- | ----- |
| `NEXT_PUBLIC_APP_URL` | `https://planner.boombaleia.com` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API → `anon` `public` key |
| `NEXT_PUBLIC_POSTHOG_KEY` | PostHog → Project Settings → Project API Key |
| `NEXT_PUBLIC_POSTHOG_HOST` | `https://eu.i.posthog.com` |

### Server-only secrets (never exposed to the browser)

| Name | Value |
| ---- | ----- |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API → `service_role` key |
| `STRIPE_SECRET_KEY` | Stripe dashboard → Developers → API keys (M3+) |
| `STRIPE_WEBHOOK_SECRET` | Stripe dashboard → Developers → Webhooks (M3+) |
| `STRIPE_PRICE_ID_PRO` | Stripe → Products → Pro tier price id (M3+) |
| `RESEND_API_KEY` | Resend dashboard → API keys |
| `SENTRY_DSN` | Sentry → Project Settings → Client Keys (DSN) |
| `SENTRY_AUTH_TOKEN` | Sentry → User Auth Tokens (scope: `project:releases`) |

> The build sets `CI=true` implicitly on Vercel, so the strict env path kicks in. If any required var is missing or malformed, the deploy fails with a clear list of offenders instead of silently shipping placeholders.

## 3. Custom domain — `planner.boombaleia.com`

### In Vercel

1. **Project Settings → Domains → Add** `planner.boombaleia.com`.
2. Vercel shows a DNS target like `cname.vercel-dns.com.` and says "Invalid Configuration" until DNS propagates.

### In Gandi.net

1. Log in → **Domains → boombaleia.com → DNS Records**.
2. Add a record:
   - **Name**: `planner`
   - **Type**: `CNAME`
   - **TTL**: `1800` (30 min — low enough to iterate, high enough to be polite)
   - **Value**: `cname.vercel-dns.com.` (trailing dot is important)
3. Save. Propagation takes 5–30 minutes.
4. Return to Vercel → Domains — it flips to **Valid Configuration** and auto-provisions a Let's Encrypt certificate.

### Optional: apex redirect

If you want `boombaleia.com` → `planner.boombaleia.com`, handle it in Gandi with a web forwarding rule or a separate A record pointing to Vercel's IP (`76.76.21.21`). Keep the planner app as a dedicated subdomain so the apex is free for marketing later.

## 4. Supabase EU project

1. https://supabase.com → **New project**.
2. **Region**: `Central EU (Frankfurt) — eu-central-1`.
3. Database password: store in a password manager.
4. Once provisioned, grab the three keys from **Settings → API** and paste into Vercel (previous section).
5. **Authentication → URL Configuration**:
   - Site URL: `https://planner.boombaleia.com`
   - Redirect URLs: `https://planner.boombaleia.com/**`, `http://127.0.0.1:3000/**`
6. Connect the project locally with the Supabase CLI (covered in `infra/supabase-setup.md` — written in Step 4 of the M0 plan).

## 5. Sentry EU project

1. https://sentry.io → sign up, choose **Data region: EU** (critical — this must match Supabase for GDPR consistency).
2. **Create Project → Next.js**.
3. Copy the DSN (format: `https://xxx@oYYY.ingest.de.sentry.io/ZZZ`) and paste as `SENTRY_DSN` in Vercel.
4. **User Settings → Auth Tokens → Create New**:
   - Name: `vercel-financial-planner`
   - Scopes: `project:releases`, `project:read`, `org:read`
   - Paste as `SENTRY_AUTH_TOKEN` in Vercel → Production only.

## 6. PostHog EU project

1. https://eu.posthog.com → sign up (must use the EU-prefixed URL).
2. Create project → copy the **Project API Key** → paste as `NEXT_PUBLIC_POSTHOG_KEY` in Vercel.
3. Project Settings → Autocapture: **disabled** (we only want explicit events for now to keep payloads lean and privacy footprint small).

## 7. First deploy

1. Back in Vercel → **Deployments → Redeploy** (or push any commit to `main`).
2. Watch the build log — it should:
   - `npm install` (≈30s, installs workspaces)
   - `npm run build --workspace app` (≈1 min, Next.js production build)
   - Deploy to `fra1` region
3. Visit `https://planner.boombaleia.com` and confirm the app shell loads.

## Rollback

- Every deploy keeps its build. **Deployments → (pick one) → Promote to Production** rolls back in ~5 seconds.
- No code change required; DNS stays pointed at Vercel.

## Troubleshooting

- **"Module not found: @app/core"** during build → `vercel.json` `installCommand` missing or wrong; must be `npm install` (not `npm ci --workspace app`).
- **"Invalid or missing public/server environment variables"** at build time → a required env var is missing in Vercel. The error names each offender; add and redeploy.
- **DNS shows Invalid Configuration** → Gandi propagation can take up to 30 min; check with `dig planner.boombaleia.com CNAME +short` — should return `cname.vercel-dns.com.`.
- **Auth redirect bounces back to localhost after login (M1+)** → Supabase → Authentication → URL Configuration's Site URL still points at localhost. Update to the production URL.
