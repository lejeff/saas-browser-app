---
name: Task 3 — Move sub-pill chevrons to top-right
overview: Move the chevron toggle on every CollapsibleSubsection / life-event card from inline-next-to-title to the top-right corner, matching CollapsibleCategory exactly. One small change inside the shared CollapsiblePill component now that lg + sm route through it.
todos:
  - id: task3-pill-edit
    content: Drop the per-size chevron branches in CollapsiblePill so both sizes render the same top-right chevron and no inline chevron
    status: completed
  - id: task3-test
    content: Add a regression test asserting a sub-pill (windfall card) has the top-right aria-hidden chevron button matching the parent pattern
    status: completed
  - id: task3-checks-pause
    content: Run lint/typecheck/test, fix any breakages, pause for manual verification before the bundled ship
    status: completed
isProject: false
---

# Task 3 — Move sub-pill chevrons to top-right

Final visual task in the wave on `feat/collapsible-cards-and-summaries`. Pause for manual verification before the bundled ship.

---

## 1. Single change inside `CollapsiblePill`

In [`app/src/features/planner/PlannerForm.tsx`](app/src/features/planner/PlannerForm.tsx), drop the per-size branches around the chevron so both sizes render the same top-right chevron button. Concretely:

- Remove the inline chevron in the legend button:

```tsx
// BEFORE
<span>{title}</span>
{!isLg ? <Chevron open={open} small /> : null}

// AFTER
<span>{title}</span>
```

- Drop the `isLg ?` guard around the top-right chevron button so it always renders:

```tsx
// BEFORE
{isLg ? (
  <button ...>
    <Chevron open={open} />
  </button>
) : null}

// AFTER
<button ...>
  <Chevron open={open} />
</button>
```

The top-right button keeps the exact classes / inline style it has today: `absolute right-3 top-[-10px] inline-flex items-center bg-[var(--surface)] px-1 leading-none focus:outline-none md:right-4` plus `style={{ color: accent, transform: "translateY(-50%)" }}`. That puts the chevron over the top border at the right side, "punched out" by the surface-coloured background, identical to the parent today.

The legend `legendButtonClass` (`flex items-center gap-2.5` for lg / `flex items-center gap-1.5` for sm) becomes effectively redundant since the button only contains the title now (icon for lg only). I'll leave the gap intact in case future content lands in the button.

**Chevron size:** use the default (14px) for both sizes. The user's wording "just like the parent category chevron" reads as full parity. If the larger chevron looks too prominent on sm pills during verification, easy follow-up to switch back to `small` for sm.

**Accessibility:** unchanged. The legend button retains the title as accessible name and stays the keyboard/SR toggle. The top-right button stays `aria-hidden="true" tabIndex={-1}` (decorative duplicate). Existing tests using `getByRole("button", { name: /title/i })` continue to find exactly the legend button.

---

## 2. Tests

Add one focused regression in [`app/src/features/planner/PlannerForm.test.tsx`](app/src/features/planner/PlannerForm.test.tsx) asserting parity:

- After expanding Life Events and adding a Windfall, the resulting card (`windfall-card-0`) should contain an `aria-hidden="true"` button with the chevron SVG positioned at the top-right (assert via class substring `absolute right-3` on the button), mirroring the parent's pattern. This locks in that the inline chevron is gone and the top-right chevron is in.

Existing tests should all stay green (369 today). The legend toggle's accessible name and behavior are unchanged. The two existing tests that asserted "tests can find the toggle by name" already work for parent pills with the same structure, so the same query continues to work for sub-pills.

Watch out for one possible breakage: the existing "renders the Debt subsection with the coral accent" type tests inspect inline style on the fieldset itself; unaffected. Tests that check `button.textContent === "Title"` would have previously included an SVG (no text content from SVG) plus title text, so still effectively `"Title"` — no breakage expected. Will fix on the fly if any test surprises us.

---

## 3. Local checks + pause

Run `npm run lint`, `npm run typecheck`, `npm test`. Then pause for you to verify in `npm run dev`:

- Every collapsible pill — top-level (Goals, Income & Expenses, Assets & Debt, Real Estate, Life Events, Macro), inner subsection (Liquid, Non-Liquid, Debt), life-event card (Windfall, Real Estate Investment, New Debt) — has its chevron in the top-right corner. No more chevrons inline next to titles.
- Click the chevron on any pill — toggles open/closed. Click the legend (title) — also toggles. Both still work.
- Keyboard: Tab to a pill's legend, Enter or Space toggles. The chevron isn't in the tab order (it's `tabIndex={-1}`).
- Visual: chevron sits over the top border at the right edge, "punched out" by the surface colour. Same look across parent + child pills.
- Re-confirm Task 1 + Task 2: collapsed life-event cards still show their headlines/summaries; collapsed subsection summaries (Liquid total, Non-Liquid total, Debt two-line) still render at the same baseline.

After your OK, the wave is feature-complete and we move to the **bundled ship**: doc audit (`docs/architecture.md`, `README.md`, `ROADMAP.md`, `.env.example`, plan archive), commit, push, PR, watch CI green, squash-merge, branch cleanup.