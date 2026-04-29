---
name: collapsible-real-estate-holdings
overview: Migrate `RealEstateHoldingCard` to render via the shared `CollapsibleSubsection` (`CollapsiblePill`), discarding its hand-rolled `<fieldset>`/`<legend>`/border code. Newly-added holdings auto-expand; loaded ones default collapsed and show a one-line summary combining current value and (when non-zero) annual rental income.
todos:
  - id: summary-helper
    content: Add `summarizeRealEstateHoldingCard(holding, format)` helper that returns the one-line value · rent summary (with em-dash fallback)
    status: completed
  - id: auto-expand-wiring
    content: Add `markAndAddHolding` and route `addRealEstateHolding` through it; pass `defaultOpen={newlyAddedIds.has(holding.id)}` to `RealEstateHoldingCard`
    status: completed
  - id: migrate-card
    content: Replace the raw `<fieldset>` body of `RealEstateHoldingCard` with `<CollapsibleSubsection>` and discard the duplicated border/legend/accent code
    status: completed
  - id: regression-tests
    content: "Add tests: collapsed summary updates with value+rent, and a holding loaded from storage defaults collapsed"
    status: completed
  - id: checks-and-pause
    content: Run lint/typecheck/tests, then pause for manual verification before bundling into the ship
    status: completed
isProject: false
---

## Scope

One file changes, plus tests. The "Real Estate" parent pill in [`app/src/features/planner/PlannerForm.tsx`](app/src/features/planner/PlannerForm.tsx) currently renders existing holdings as raw `<fieldset>` cards (lines 1511-1557). That pre-`CollapsiblePill` styling is now duplicated by `CollapsibleSubsection` / `CollapsiblePill`. After this change every sub-pill in the form (Liquid, Non-Liquid, Debt, Real Estate Holding, Windfall, Real Estate Investment, New Debt) flows through one component.

## Behavior

- Sub-pill collapse + top-right small chevron, identical to the Windfall / Real Estate Investment / New Debt cards already shipped this wave.
- Newly-added holdings auto-expand; loaded ones (page reload, hydrated `localStorage`) default collapsed. Reuse the existing `newlyAddedIds: Set<string>` (UUIDs don't collide across collections) by routing `addRealEstateHolding` through a new `markAndAddHolding` helper that mirrors `markAndAdd`.
- Collapsed summary (one line, per the design choice you picked):
  - `value > 0 && rent > 0` → `"€450,000 · €12,000 rent/yr"`
  - `value > 0 && rent === 0` → `"€450,000"`
  - `value === 0 && rent > 0` → `"€12,000 rent/yr"`
  - both 0 → `"—"` (em-dash, matches the Liquid/Non-Liquid empty state)

## Edits in [`app/src/features/planner/PlannerForm.tsx`](app/src/features/planner/PlannerForm.tsx)

1. Add `summarizeRealEstateHoldingCard(holding, format)` next to the other `summarize*Card` helpers (~line 286), returning a `string` per the rules above.
2. In `PlannerForm`, add `markAndAddHolding(newHolding: RealEstateHolding)` next to `markAndAdd` (line 332) and route `addRealEstateHolding` (line 381) through it so freshly-added holdings get auto-expanded just like life events.
3. Pass `defaultOpen={newlyAddedIds.has(holding.id)}` to `<RealEstateHoldingCard>` at the call site (line 654) and add `defaultOpen` to its prop type.
4. Replace the raw `<fieldset>` body in `RealEstateHoldingCard` (lines 1511-1557) with `<CollapsibleSubsection title={...} accent={accent} defaultOpen={defaultOpen} testId={`re-holding-card-${index}`} summary={summarizeRealEstateHoldingCard(holding, format)}>` wrapping the existing `CurrencyField` / `SliderRow` / Remove button children. Drop the locally-rendered `<legend>` and the duplicated border/accent style block since `CollapsibleSubsection` owns them. Pull `useCurrency().format` into the component (mirrors `RealEstateInvestmentCard`).

## Tests in [`app/src/features/planner/PlannerForm.test.tsx`](app/src/features/planner/PlannerForm.test.tsx)

- **Keep green**: existing tests in the "Real estate holdings" describe block (lines 983-1090) all click `+ Add Real Estate` then read fields immediately. With auto-expand-on-add they continue to pass unchanged.
- **New regression test** alongside that block:
  - Click `+ Add Real Estate`, set Value to `450000` and Annual rental income to `12000`, collapse via the new top-right chevron / legend toggle, assert the one-line summary reads `€450,000 · €12,000 rent/yr` and the inner fields are gone.
  - Re-expand and assert the fields are back.
- **New regression test**: a holding loaded from `localStorage` (use the `Host` seed pattern already in this file) defaults collapsed and shows the value-only summary when rent is 0.

## Test sweep

Search [`app/src/features/planner/`](app/src/features/planner/) for `re-holding-card` and `screen.getByText("—")`. The 5 existing assertions all run AFTER an explicit `+ Add Real Estate` click, so auto-expand keeps them valid. The em-dash assertion at line 1078 is scoped via `within(realEstate)` already, so the new holding-card em-dash inside it stays unambiguous because the test has zero holdings at that point. No edits expected, but if anything breaks, scope queries with `within(card)` rather than removing the assertion.

## Verification gate (per workflow rule)

After lint + typecheck + tests pass, pause for manual verification of:
- New holding card mounts expanded, collapses on chevron / legend click to a single summary line.
- Summary updates live as Value or Annual rental income changes (both zero → em-dash; only value → just amount; only rent → just rent; both → joined with `·`).
- Reload the page with at least one saved holding: it loads collapsed.
- Top-right small chevron sits at the same `top-[-9px]` offset as the other sub-pills (Windfall, Real Estate Investment, New Debt) and the focus halo around inner fields stays gold (`--accent` cascade still works through the new wrapper).

## Ship bundle

This change rolls into the same `feat/collapsible-cards-and-summaries` PR alongside the helper text + Tasks 1-3 once approved.