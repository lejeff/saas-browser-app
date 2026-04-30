---
name: remove-planner-hero
overview: Drop the `PlannerHero` section (eyebrow, headline, lede paragraph, "Start planning" / "How it works" CTAs) from the planner page so the three summary stat cards become the first content under the `SiteHeader`. Pure layout change — no schema, public API, env, or routes touched.
todos:
  - id: edit-page
    content: Remove `<PlannerHero />` and its import from `app/src/app/page.tsx`; keep the `#planner` anchor wrapper
    status: completed
  - id: delete-hero
    content: Delete the now-unused `app/src/features/planner/PlannerHero.tsx` file
    status: completed
  - id: checks
    content: Run lint, typecheck, and the full test suite locally
    status: in_progress
  - id: manual-pause
    content: Pause for manual verification on the dev server before shipping
    status: pending
  - id: ship
    content: Branch, commit, push, open PR, wait for CI, squash-merge, archive plan, bump plan-count
    status: pending
isProject: false
---

## Scope

Two-file change, plus a deletion. Hero lives in [`app/src/features/planner/PlannerHero.tsx`](app/src/features/planner/PlannerHero.tsx) and is rendered above `PlannerPage` from [`app/src/app/page.tsx`](app/src/app/page.tsx):

```6:18:app/src/app/page.tsx
export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <PlannerHero />
        <div id="planner" className="scroll-mt-20">
          <PlannerPage />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
```

`PlannerHero.tsx` is the only spot in the app rendering the eyebrow / headline / lede / CTAs the user wants gone, and the only consumer of `PlannerHero` is `page.tsx` (verified — every other reference is in archived plans under `docs/plans/`).

## Edits

1. [`app/src/app/page.tsx`](app/src/app/page.tsx)
   - Remove the `import { PlannerHero }` line.
   - Remove the `<PlannerHero />` element.
   - Keep the `<div id="planner" className="scroll-mt-20">` wrapper. The `#planner` anchor is still targeted by [`app/src/components/SiteHeader.tsx`](app/src/components/SiteHeader.tsx) (nav link + "Start planning" CTA) and [`app/src/components/SiteFooter.tsx`](app/src/components/SiteFooter.tsx) (footer nav). `scroll-mt-20` stays so anchor jumps don't tuck the cards under the sticky header.
2. Delete [`app/src/features/planner/PlannerHero.tsx`](app/src/features/planner/PlannerHero.tsx) — unused after step 1.

## Tests

- No unit-test references to `PlannerHero` or its copy ("Start planning", "Plan the retirement", etc.) anywhere in `app/src` (verified). Existing `PlannerPage.test.tsx` already mounts `<PlannerPage />` directly, not the page-level shell, so it isn't affected.
- E2E smoke test [`tests/e2e/smoke.spec.ts`](tests/e2e/smoke.spec.ts) only asserts the page title and the SiteHeader brand link — both still present.
- No new tests needed; this is a deletion of presentational markup with no behavior change.

## Non-goals (call out in the PR body)

- The `#how` anchors in [`app/src/components/SiteHeader.tsx`](app/src/components/SiteHeader.tsx) and [`app/src/components/SiteFooter.tsx`](app/src/components/SiteFooter.tsx) currently point to no element in the page. That predates this change and isn't made worse by it. Leaving them alone — flag separately if you want a follow-up.
- The "Start planning" CTA in [`app/src/components/SiteHeader.tsx`](app/src/components/SiteHeader.tsx) becomes mostly redundant once the cards sit at the top, but removing it would change the global header on the landing route too. Out of scope; ask explicitly if you want it gone.

## Docs audit

- [`docs/architecture.md`](docs/architecture.md) — no mention of `PlannerHero`; presentation-only change, no update needed.
- [`docs/plans/`](docs/plans/) — archive this plan as `2026-04-30-remove-planner-hero.md` and bump the count line in [`docs/plans/README.md`](docs/plans/README.md).
- [`README.md`](README.md), [`ROADMAP.md`](ROADMAP.md), [`.env.example`](.env.example) — no relevant changes.

## Verification gate (per workflow rule)

After lint + typecheck + tests pass, pause for manual verification of:
- Planner page (`/`) shows the SiteHeader, then the three stat cards directly below it — no eyebrow, headline, paragraph, or buttons in between.
- The "Start planning" CTA in the SiteHeader still scrolls to the cards (now a no-op visual jump because they're already at the top, but the anchor resolves).
- Sticky-stat-card behavior on lg+ still works — cards pin under the header when you scroll down.
- Mobile and desktop both still render without layout shifts or extra top whitespace beyond the existing `pb-16` on the planner main.

## Ship

New feature branch `feat/remove-planner-hero` off `main`. Squash-merge after CI green.