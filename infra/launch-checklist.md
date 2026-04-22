# Production Launch Checklist

## Security
- [ ] Main branch protection enabled (PR + checks + approval)
- [ ] GitHub environments configured (`preview`, `production`)
- [ ] Secrets set in GitHub, Vercel, Supabase, Stripe
- [ ] Stripe webhook endpoint configured and tested
- [ ] Security headers validated in deployed app
- [ ] Rate limits enabled on auth and public endpoints

## Reliability
- [ ] Sentry DSN configured and test error observed
- [ ] PostHog events visible in dashboard
- [ ] E2E smoke test required in CI before deploy
- [ ] Rollback procedure documented

## Compliance
- [ ] Privacy policy published
- [ ] Terms of service published
- [ ] Cookie consent shown where required
- [ ] Vendor DPAs signed (Supabase, Vercel, Stripe, Sentry, PostHog)
