# SaaS Browser App (Commercial Starter)

Fast-launch commercial stack for a SaaS browser app using Next.js, Supabase, Stripe, and Vercel.

## Stack
- Next.js + TypeScript + Tailwind
- Supabase (Auth, Postgres, storage)
- Stripe subscriptions + webhook handling
- Sentry + PostHog observability
- GitHub Actions CI/CD

## Quick start
1. Copy `.env.example` to `.env.local` and fill values.
2. Run `npm install`.
3. Run `npm run dev`.

## GitHub setup checklist
- Create a GitHub repository and push this folder.
- Add environments: `preview`, `production`.
- Protect `main`: require PR, status checks, and 1 approval.
- Set repo secrets used by workflows:
  - `VERCEL_TOKEN`
  - `VERCEL_ORG_ID`
  - `VERCEL_PROJECT_ID`

## Branch strategy
- Trunk-based development
- Short-lived feature branches
- Merge via PR only
