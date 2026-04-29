---
name: click-to-expand-pill
overview: "Make clicking anywhere on a collapsed pill (parent or child) open it. Click-to-expand is one-way: it only opens, never closes, so children inside an open pill keep their independent open/collapsed state and never get accidentally collapsed when the user clicks inside the parent body."
todos:
  - id: click-handler
    content: "Wire `onClick={open ? undefined : () => setOpen(true)}` on the `<fieldset>` in `CollapsiblePill` and add `cursor-pointer` when collapsed."
    status: completed
  - id: tests
    content: "Add three regression tests: click-to-open on a parent pill, click-to-open on a sub-pill, and \"clicking inside an open parent does not collapse it or its expanded child\"."
    status: completed
  - id: lint-typecheck-test
    content: Run `npm run lint`, `npm run typecheck`, `npm test` and report results.
    status: completed
  - id: manual-verification-pause
    content: Pause for manual dev-server verification (parent + child + life-event card click-to-open, plus parent-stays-open with child interactions).
    status: in_progress
  - id: ship
    content: "After approval: branch, commit, push, open PR, watch CI, squash-merge, clean up branches, archive plan."
    status: pending
isProject: false
---

## Behavior

- Clicking anywhere on a COLLAPSED pill (parent category or child sub-pill / life-event card / Real Estate holding) opens it.
- The legend button and corner chevron continue to TOGGLE in both directions (this is how you collapse).
- Clicking inside an OPEN pill does NOT collapse it. This satisfies the "does not affect the open/collapsed status of child pills" constraint: nested children keep their own state, and clicks on inputs/sliders/sub-pills inside an open parent can never bubble up to collapse it.

## File-by-file changes

### 1. [app/src/features/planner/PlannerForm.tsx](app/src/features/planner/PlannerForm.tsx) — `CollapsiblePill` (lines 822-943)

The shared primitive already powers every pill (top-level categories via `CollapsibleCategory`, sub-pills via `CollapsibleSubsection`, plus life-event and Real Estate holding cards). One change covers them all.

- Attach `onClick={open ? undefined : () => setOpen(true)}` to the outer `<fieldset>` (line 882). The `open ? undefined` guard makes the click-to-expand strictly one-way and removes any handler at all when the pill is open, so React doesn't even register a listener that could fire on bubble.
- Append `cursor-pointer` to `fieldsetClass` when `!open` so the affordance is visible to mouse users.
- Existing legend `<button>` (line 893) and corner chevron `<button>` (line 917) keep their `setOpen((v) => !v)` toggle. When collapsed, clicking either still opens the pill; if their click also bubbles up, the fieldset handler is `() => setOpen(true)` which is idempotent (state is already toggling true). When open, the fieldset handler is `undefined`, so chevron / legend remain the only ways to collapse.
- No `role="button"` or `aria-*` additions on the fieldset: the legend `<button>` is the canonical keyboard / screen-reader toggle (already carries `aria-expanded` + the title). The fieldset click is a redundant mouse/touch convenience.

```tsx
const fieldsetClass = (isLg
  ? `relative rounded-[1.25rem] border bg-[var(--surface)] px-4 md:px-5 ${verticalPadding}`
  : `relative rounded-[1rem] border bg-[var(--surface)] px-3 md:px-4 ${verticalPadding}`) +
  (open ? "" : " cursor-pointer");

return (
  <fieldset
    className={fieldsetClass}
    data-testid={testId}
    onClick={open ? undefined : () => setOpen(true)}
    style={...}
  >
    ...existing legend, chevron, body...
  </fieldset>
);
```

### 2. [app/src/features/planner/PlannerForm.test.tsx](app/src/features/planner/PlannerForm.test.tsx)

Three regression tests (group near the existing collapsible tests):

1. "clicking anywhere on a COLLAPSED parent pill opens it" — render, target the Macro pill (defaults closed) by its `testid`, click directly on the fieldset / summary area (NOT the legend button), assert `aria-expanded="true"` on the legend button and that an inner field becomes visible.
2. "clicking anywhere on a COLLAPSED sub-pill opens it" — render, expand Assets and Debt, target the Liquid sub-pill summary by `subsection-liquid-summary` testid, click it, assert the Liquid `Financial Assets / Portfolio` input is now visible.
3. "clicking inside an OPEN parent pill does NOT collapse it, and child pills keep their state" — render, expand Assets and Debt, expand Liquid sub-pill (so a child is open), click on the parent fieldset's inner body region (e.g. the Liquid sub-pill's own outer fieldset, or a label inside the parent body), assert the parent legend's `aria-expanded` is still `"true"` AND the Liquid sub-pill's legend's `aria-expanded` is still `"true"`.

These three tests pin both the new behavior and the explicit non-coupling with children.

## Out of scope (confirmed unchanged)

- `packages/core/` — no schema or projection changes.
- `docs/architecture.md` — UI behavior only, not part of the documented data model. No regen of `architecture.html` / `architecture.pdf`.
- `.env.example`, env schema, `README.md`, `ROADMAP.md` — no change.
- `docs/plans/` — archive on ship.
- The legend button and corner chevron — unchanged; both still toggle in both directions.

## Workflow

Per [.cursor/rules/workflow.mdc](.cursor/rules/workflow.mdc):

1. Branch `feat/click-to-expand-pill` off `main`.
2. Implement the changes above.
3. `npm run lint`, `npm run typecheck`, `npm test`.
4. Pause and ask to dev-test in `npm run dev`:
   - Collapse Assets and Debt; click anywhere on the pill (header, summary text, empty space inside the border) — pill opens.
   - With Assets and Debt expanded, collapse Liquid; click anywhere on the Liquid pill — it opens.
   - Same for life-event cards (Windfall, Real Estate Investment, New Debt) and Real Estate holdings: collapsed cards open on body click.
   - With Assets and Debt + Liquid both open, click somewhere inside the parent body that isn't the legend or chevron — parent stays open, Liquid stays open. Editing Liquid inputs / sliders / pressing buttons does not collapse the parent.
   - Legend button and corner chevron still toggle in BOTH directions (open AND close).
5. Wait for explicit "ship it" before commit, push, PR, CI, squash-merge, branch cleanup, and plan archive.