# M0 Deploy Checklist — Financial Planner

Complete, one-time setup from "empty GitHub account" to "app live at `https://planner.boombaleia.com`". Everything here uses free tiers. Total time: roughly **1.5–2 hours of wall-clock**, of which maybe 30 minutes is active keyboard time; the rest is waiting on DNS propagation and one-time email verifications.

Keep this open in a second tab and tick boxes as you go. Detailed per-service docs live alongside:
- `infra/vercel-deploy.md`
- `infra/supabase-setup.md`
- `infra/github-setup.md`

---

## Phase A — GitHub (already set up and renamed)

The repo already exists at `https://github.com/lejeff/financial-planner` (renamed from the old `saas-browser-app` name on 2026-04-24). All PR history, commits, and settings were preserved through the rename.

- [x] ~~Create GitHub repo~~ — already done.
- [x] ~~Rename GitHub repo~~ — done via `gh api --method PATCH repos/lejeff/saas-browser-app -f name=financial-planner`.
- [x] ~~Rename local folder~~ — done (`~/financial-planner`).
- [x] ~~Update local `origin` URL~~ — done (`git remote set-url origin https://github.com/lejeff/financial-planner.git`).
- [ ] Confirm the `gh` CLI is still authenticated (quick sanity check):
  ```bash
  gh auth status
  ```
- [ ] From `~/financial-planner`, push the M0 work to `main`:
  ```bash
  git status              # review the ~40 changed files
  git add -A
  git commit -m "M0: production foundation"
  git push origin main
  ```
- [ ] Open `https://github.com/lejeff/financial-planner` and confirm the new files/folders landed (`app/`, `packages/core/`, `supabase/`, `infra/`, `vercel.json`, `.github/workflows/ci.yml`).

> **Redirect note:** Anyone with the old `saas-browser-app` URL bookmarked will be auto-redirected to the new URL. No further cleanup needed.

---

## Phase B — Create service accounts (parallelizable)

These four signups are independent. Do them in any order; each is self-contained and each gives you one or more values to paste into Vercel in Phase D.

### B.1 Supabase (EU / Frankfurt) — ~5 min

- [ ] Go to https://supabase.com → **Start your project** → sign up (GitHub sign-in is easiest).
- [ ] **New project** → fill in:
  - **Name**: `financial-planner`
  - **Database Password**: generate in a password manager, save it — you'll need it to link the CLI later.
  - **Region**: **Central EU (Frankfurt) — `eu-central-1`** ← this MUST be Frankfurt to match our Vercel region.
  - **Pricing Plan**: Free.
- [ ] Wait ~2 min for provisioning.
- [ ] Go to **Settings → API**. Copy these three values into a scratch note:
  - [ ] **Project URL** → goes into `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] **anon / public key** → goes into `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] **service_role / secret key** → goes into `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Still in Settings, note the **Project Reference** (the `xxxx` in the URL `https://supabase.com/dashboard/project/xxxx`). You'll need this for the CLI link step later.

### B.2 Sentry (EU region) — ~5 min

- [ ] Go to https://sentry.io → **Sign Up**.
- [ ] During signup, on the **Data Region** screen, choose **European Union (Frankfurt)**. ← Critical. You cannot change this later without creating a new account.
- [ ] **Create Project** → choose **Next.js** → name it `financial-planner` → team: whatever default.
- [ ] On the next screen Sentry shows you a DSN. It looks like:
  ```
  https://abc123@o456789.ingest.de.sentry.io/7890
  ```
  Note the `.de.` — that confirms it's EU.
  - [ ] Copy the DSN → goes into `NEXT_PUBLIC_SENTRY_DSN`.
- [ ] Go to **Settings → Auth Tokens → Create New Token**:
  - Name: `vercel-financial-planner`
  - **Scopes**: `project:releases` + `project:read` + `org:read`
  - [ ] Copy token → goes into `SENTRY_AUTH_TOKEN` (only needed in Vercel Production scope).
- [ ] From the Sentry URL, note the **org slug** and **project slug** (e.g. `your-org/financial-planner`):
  - [ ] `SENTRY_ORG` = the org slug
  - [ ] `SENTRY_PROJECT` = `financial-planner`

### B.3 PostHog (EU Cloud) — ~3 min

- [ ] Go to **https://eu.posthog.com** (the EU-prefixed URL is important — don't use the US instance).
- [ ] **Sign up** → verify email.
- [ ] Create a project named `financial-planner`.
- [ ] In **Project Settings → General**, copy:
  - [ ] **Project API Key** (starts with `phc_`) → goes into `NEXT_PUBLIC_POSTHOG_KEY`.
- [ ] In **Project Settings → Autocapture**: **turn OFF**. (We're doing manual events only.)
- [ ] No auth token needed for PostHog beyond the project key.

### B.4 Resend — ~2 min (optional for M0, required from M1)

Resend powers transactional email (signup confirmations, password reset). You don't need it for M0 to deploy, but while you're here:
- [ ] Go to https://resend.com → sign up.
- [ ] **API Keys → Create API Key** (default scope is fine for now).
- [ ] Copy → goes into `RESEND_API_KEY`. Free tier: 100 emails/day, 3k/month.
- [ ] Skip "Add Domain" for now; we'll do that in M1 when auth emails go live.

---

## Phase C — Vercel project setup (do NOT deploy yet)

### C.1 Create the project — ~3 min

- [ ] Go to https://vercel.com → sign up with GitHub.
- [ ] **Add New → Project** → import the `financial-planner` repo.
- [ ] **Configure Project** screen:
  - **Framework Preset**: should auto-detect Next.js (from `vercel.json`).
  - **Root Directory**: leave empty (repo root). Do NOT change to `app/` — the monorepo handling lives in `vercel.json`.
  - **Build & Output Settings**: leave everything default — `vercel.json` overrides them.
  - **Environment Variables**: **skip for now** (we'll add them in Phase D before any deploy).
- [ ] Click **Deploy** — it will fail; that's expected because no env vars are set yet. The project is now created; we'll redeploy at the end.

### C.2 Cancel/ignore the failing first deploy

- [ ] On the build log that opens, you'll see the strict env check firing:
  > `[env] Invalid or missing public environment variables: ...`
- [ ] This is exactly what the strict env split is supposed to do. Move on.

---

## Phase D — Paste env vars into Vercel — ~10 min

All env vars live at **Project → Settings → Environment Variables**. For each one, add to the three scopes: **Production**, **Preview**, **Development** — unless I mark otherwise.

### D.1 Public variables (safe to commit, baked into client bundle)

| Variable | Value | Scopes |
|---|---|---|
| `NEXT_PUBLIC_APP_URL` | `https://planner.boombaleia.com` | all three |
| `NEXT_PUBLIC_SUPABASE_URL` | from B.1 | all three |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | from B.1 | all three |
| `NEXT_PUBLIC_POSTHOG_KEY` | from B.3 | all three |
| `NEXT_PUBLIC_POSTHOG_HOST` | `https://eu.i.posthog.com` | all three |
| `NEXT_PUBLIC_SENTRY_DSN` | from B.2 | all three |

### D.2 Server-only secrets

| Variable | Value | Scopes |
|---|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` | from B.1 | all three |
| `STRIPE_SECRET_KEY` | leave empty or `sk_test_placeholder` until M3 | all three |
| `STRIPE_WEBHOOK_SECRET` | leave empty or `whsec_placeholder` until M3 | all three |
| `STRIPE_PRICE_ID_PRO` | leave empty or `price_placeholder` until M3 | all three |
| `RESEND_API_KEY` | from B.4 (or placeholder if skipped) | all three |
| `SENTRY_AUTH_TOKEN` | from B.2 | **Production only** |
| `SENTRY_ORG` | from B.2 | **Production only** |
| `SENTRY_PROJECT` | from B.2 | **Production only** |

> **Why placeholders for Stripe?** M0 includes the Stripe route handlers but billing isn't launched until M3. The strict env schema requires `STRIPE_SECRET_KEY` etc. to be non-empty strings, so passing real OR placeholder strings both satisfy the build. Using placeholders now means you don't have to touch Stripe until you're actually ready to charge users.

- [ ] Double-check Production scope: every row checked.
- [ ] Double-check Preview scope: every row checked except the three `SENTRY_*` auth ones.
- [ ] Double-check Development scope: same as Preview.

---

## Phase E — Custom domain: `planner.boombaleia.com` — ~10 min + DNS propagation

### E.1 In Vercel

- [ ] **Project → Settings → Domains → Add**.
- [ ] Enter `planner.boombaleia.com` → click Add.
- [ ] Vercel shows a message like:
  > Add a CNAME record pointing `planner` to `cname.vercel-dns.com.`
- [ ] Keep this tab open — you'll come back to it.

### E.2 In Gandi

- [ ] Log into https://admin.gandi.net → **Domains → boombaleia.com → DNS Records → Add**.
- [ ] Fill in:
  - **Type**: `CNAME`
  - **Name**: `planner`
  - **TTL**: `1800` (30 min)
  - **Hostname / Value**: `cname.vercel-dns.com.` ← trailing dot is important
- [ ] Save.

### E.3 Wait and verify

- [ ] Propagation: 5–30 minutes. You can check with:
  ```bash
  dig planner.boombaleia.com CNAME +short
  ```
  When it returns `cname.vercel-dns.com.`, you're good.
- [ ] Return to the Vercel Domains tab; it should flip from **Invalid Configuration** to **Valid Configuration**. Vercel auto-issues a Let's Encrypt SSL cert.

---

## Phase F — First production deploy — ~5 min

- [ ] **Project → Deployments → Redeploy** on the failed first deploy (or just push any commit to `main`).
- [ ] Watch the build log. You should see, in order:
  1. `npm install` — ~30s
  2. `npm run build --workspace app` — ~1 min
  3. Sentry source-map upload — ~10s (uses `SENTRY_AUTH_TOKEN`)
  4. Deploy to `fra1`
- [ ] Visit https://planner.boombaleia.com — you should see the Financial Planner landing page.
- [ ] Check the page source: it should include `planner.boombaleia.com` as the canonical URL.

---

## Phase G — Post-deploy configuration

Now that the prod URL exists, a couple of services need to be told about it.

### G.1 Supabase auth URL configuration

- [ ] **Supabase dashboard → Authentication → URL Configuration**:
  - **Site URL**: `https://planner.boombaleia.com`
  - **Redirect URLs** (add all three, one per row):
    - `https://planner.boombaleia.com/**`
    - `http://127.0.0.1:3000/**`
    - `http://localhost:3000/**`
- [ ] Save.

### G.2 Link the Supabase CLI to your project (one-time)

- [ ] Log in:
  ```bash
  npx supabase login
  ```
  (Browser opens; approve access.)
- [ ] Link (replace with your project ref from B.1):
  ```bash
  npx supabase link --project-ref YOUR_PROJECT_REF
  ```
  You'll be prompted for the DB password you saved in B.1.
- [ ] Verify:
  ```bash
  npx supabase projects list
  ```
- [ ] No migrations to push yet (M0 init migration is intentionally empty). M1 will fill it.

### G.3 Sentry: verify the first event

- [ ] Visit https://planner.boombaleia.com in Chrome DevTools open.
- [ ] In the JS console, fire a test error:
  ```js
  Sentry.captureException(new Error("hello from prod"));
  ```
- [ ] Check Sentry dashboard → **Issues**. The event should appear within ~30 seconds. If it does, source map upload worked and the stack trace is readable.

### G.4 PostHog: verify the first event

- [ ] Still on the prod site, open **PostHog dashboard → Activity**.
- [ ] Navigate between pages on your site. Within ~10s, `$pageview` events should appear tagged with your distinct ID.

---

## Phase H — Final sanity sweep

- [ ] https://planner.boombaleia.com loads the planner.
- [ ] HTTPS certificate is valid (no browser warning).
- [ ] Network tab shows PostHog calls going to `/ingest/*` (your domain), NOT `eu.i.posthog.com` directly.
- [ ] Network tab shows Sentry calls going to `/monitoring` (your domain), NOT `ingest.de.sentry.io` directly.
- [ ] No console errors from missing env vars.
- [ ] Open an incognito tab from your phone on cellular — still loads fast (< 2s).
- [ ] Make a trivial commit (e.g. edit a typo in README) and push; Vercel auto-deploys, site updates within ~2 min.

---

## Appendix A — Summary of what's in your password manager now

Collected from Phases B–C:

| Key | Source | Used where |
|---|---|---|
| Supabase DB password | you generated it (B.1) | Supabase CLI link (G.2), dashboard logins |
| Supabase project ref | dashboard URL (B.1) | CLI link (G.2) |
| Supabase URL + 2 keys | B.1 | Vercel env vars (D.1, D.2) |
| Sentry DSN | B.2 | Vercel env var `NEXT_PUBLIC_SENTRY_DSN` (D.1) |
| Sentry auth token | B.2 | Vercel env var `SENTRY_AUTH_TOKEN` (D.2, Production only) |
| Sentry org + project slugs | B.2 | Vercel env vars (D.2, Production only) |
| PostHog project key | B.3 | Vercel env var `NEXT_PUBLIC_POSTHOG_KEY` (D.1) |
| Resend API key | B.4 (optional) | Vercel env var `RESEND_API_KEY` (D.2) |
| GitHub account | A | — |
| Vercel account | C | — |

---

## Appendix B — Recurring costs (all free tiers right now)

| Service | Free-tier cap | Expected M0 usage |
|---|---|---|
| Vercel Hobby | 100 GB bandwidth/mo, 1M serverless invocations/mo | < 1% |
| Supabase Free | 500 MB DB, 2 GB bandwidth, 50k MAU | < 1% |
| Sentry Developer | 5k errors/mo, 10k performance units/mo | < 10% at current traffic |
| PostHog Free | 1M events/mo, 5k session replays (which we disable anyway) | < 1% |
| Resend Free | 100 emails/day, 3k/mo | 0% until M1 auth |
| Gandi | domain renewal only | you already pay this |

**Total new outlay: $0/mo** until traffic gets real.

---

## Troubleshooting — common first-time gotchas

| Symptom | Likely cause | Fix |
|---|---|---|
| Vercel build fails with `[env] Invalid or missing…` | Missing env var(s) | The error lists exactly which; add in Project Settings → Env Vars → redeploy. |
| Domain shows "Invalid Configuration" after 30+ min | DNS typo (wrong value, or missing trailing dot) | `dig planner.boombaleia.com CNAME +short` — should return `cname.vercel-dns.com.` If not, re-check the Gandi record. |
| Sentry dashboard empty after test event | DSN for wrong region, or env var typo | Confirm DSN contains `.ingest.de.sentry.io` (EU). Confirm it's set as `NEXT_PUBLIC_SENTRY_DSN` (not `SENTRY_DSN`). |
| PostHog events not showing | Wrong host (US instead of EU), or autocapture blocked | Confirm `NEXT_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com`. Confirm you're logged into https://eu.posthog.com (not the US dashboard). |
| Can't run `npx supabase link` | Not logged in | `npx supabase login` first. |
| Supabase link asks for password you don't remember | DB password from B.1 | You can reset it in Supabase dashboard → Settings → Database → Reset database password. |

---

When you finish Phase H, ping me and I'll kick off **M1: Auth + per-user scenarios**.
