---
name: Refine Task 1 — pill unify, summary font, New Debt detail
overview: "Refine Task 1 of the wave: bump the collapsed child-pill summary font to match the parent, enrich the New Debt collapsed summary with the schedule helper line (two-line summary), and unify CollapsibleCategory + CollapsibleSubsection into a single shared CollapsiblePill component."
todos:
  - id: refactor-pill
    content: Extract CollapsiblePill internal component; make CollapsibleCategory and CollapsibleSubsection thin wrappers presetting size="lg"/"sm"
    status: completed
  - id: shared-summary-class
    content: Apply shared summary class (text-base font-medium tabular-nums, drop flex items-center) so child + parent summaries match and multi-line content stacks
    status: completed
  - id: extract-schedule-text
    content: Extract formatNewDebtScheduleText pure helper from NewDebtScheduleSummary; have the in-card paragraph reuse it
    status: completed
  - id: compose-newdebt-summary
    content: Compose two-line New Debt collapsed summary at the NewDebtEventCard call site (headline + schedule line)
    status: completed
  - id: test-newdebt-summary
    content: Add a focused regression test asserting both lines are present in new-debt-card-0-summary when collapsed
    status: completed
  - id: checks-and-pause
    content: Run lint/typecheck/test; pause for manual verification before moving to Task 2
    status: completed
isProject: false
---

# Refine Task 1 — pill unify, summary font, New Debt detail

This is a refinement pass on Task 1 of the wave (collapsible life-event cards). All other wave items (Task 2: subsection summaries, Task 3: chevron at top-right) remain untouched until you re-verify after this pass.

All work lands on the existing branch `feat/collapsible-cards-and-summaries`. We pause for manual verification before moving to Task 2.

---

## 1. Unify CollapsibleCategory and CollapsibleSubsection

**Why:** Their structure (fieldset + legend + toggle button + chevron + collapsible body + optional summary slot) is identical. Differences are pure styling: size, padding, border softness, font size, icon support, chevron position. Parameterizing those lets us delete the duplicated JSX and gives Task 3's chevron move a single one-line touch point.

**How:** Extract a single internal component `CollapsiblePill` in [`app/src/features/planner/PlannerForm.tsx`](app/src/features/planner/PlannerForm.tsx). Keep both `CollapsibleCategory` and `CollapsibleSubsection` as thin wrappers that preset `size="lg"` / `size="sm"` so every existing call site stays unchanged.

Shape:

```tsx
function CollapsiblePill({
  title, icon, accent, defaultOpen = false, testId, summary, size, children
}: {
  title: string;
  icon?: ReactNode;
  accent: string;
  defaultOpen?: boolean;
  testId?: string;
  summary?: ReactNode;
  size: "lg" | "sm";
  children: ReactNode;
}) { /* ...one body, branches on `size` for class names + chevron placement */ }

function CollapsibleCategory(props) {
  return <CollapsiblePill {...props} size="lg" />;
}

function CollapsibleSubsection(props) {
  return <CollapsiblePill {...props} size="sm" />;
}
```

**Per-size deltas baked in:**

- `lg` (parent): `rounded-[1.25rem]`, `px-4 md:px-5`, open `py-3 md:py-4` / closed `pb-2 pt-1 md:pb-3 md:pt-1`, solid `borderColor: accent`, legend `text-sm font-semibold` with `gap-2.5`, icon slot rendered, separate top-right chevron button (`absolute right-3 top-[-10px] ...`), no inline chevron.
- `sm` (child): `rounded-[1rem]`, `px-3 py-3 md:px-4` (constant), soft `borderColor: color-mix(in oklab, accent 50%, transparent)`, legend `text-[12px] font-semibold` with `gap-1.5`, no icon slot, inline `<Chevron small />` next to title (Task 3 will move it).

**Shared:** the `--accent` CSS-var cascade on the fieldset (focus-style fix from earlier wave), `useState(defaultOpen)` toggle, `useId()` for `aria-controls`, conditional render of `children` vs `summary`.

**Public API at call sites is unchanged**, so:
- Liquid / Non-Liquid / Debt subsection sites (5 in [`PlannerForm.tsx`](app/src/features/planner/PlannerForm.tsx)) keep their existing props.
- All `CollapsibleCategory` sites (Goals, Income & Expenses, Assets & Debt, Real Estate, Life Events, Macro) keep theirs.
- The three life-event card refactors from Task 1 (now using `CollapsibleSubsection`) keep theirs.

---

## 2. Bump child-pill summary font to match parent

**Why:** You asked the child collapsed summary to read at the same weight as the parent's category summary.

**How:** This falls out of unification — the new shared `summaryClass` is the same for both sizes. The class becomes:

```
pt-1 text-base font-medium tabular-nums text-[var(--ink-muted)]
```

Two intentional changes from today's parent summary class:
- Drop `flex items-center` so multi-line summary content (item 3 below) stacks vertically.
- Apply this same class for both `lg` and `sm` (today the child uses the smaller `text-xs ... pt-0.5`).

Net visual effect on existing parent summaries (all single-string today, e.g. `summarizeMacro`, `summarizeAssetsDebt`): identical look and size; only the layout container changes from flex-row to block, which is a no-op for a single string child.

---

## 3. Enrich New Debt collapsed summary to two lines

**Why:** You want the New Debt collapsed view to also surface the schedule text that appears as helper text inside the expanded card.

**How:**

(a) Extract the schedule-text computation from [`NewDebtScheduleSummary`](app/src/features/planner/PlannerForm.tsx) into a pure helper:

```tsx
function formatNewDebtScheduleText(
  event: NewDebtEvent,
  inflatedPrincipal: number,
  format: (n: number) => string
): string {
  const term = Math.max(0, event.endYear - event.startYear);
  if (inflatedPrincipal <= 0) return "No principal entered.";
  if (term <= 0)
    return "End year is at or before start year \u2014 no scheduled payments.";
  if (event.repaymentType === "overTime") {
    const annual = computeOverTimeAnnualPayment(
      inflatedPrincipal, event.interestRate, term
    );
    const yearsLabel = `${term} year${term === 1 ? "" : "s"}`;
    return `Annual repayment (capital + interest): ${format(annual)} for ${yearsLabel}.`;
  }
  const annualInterest = inflatedPrincipal * event.interestRate;
  return `Annual interest payment: ${format(annualInterest)} \u00b7 Lump sum of ${format(inflatedPrincipal)} in ${event.endYear}.`;
}
```

`NewDebtScheduleSummary` (the in-card helper paragraph) becomes a one-line wrapper around `formatNewDebtScheduleText`, so its existing test selectors (`new-debt-schedule-summary-${index}`) keep working.

(b) Compose the two-line collapsed summary at the `NewDebtEventCard` call site (it already has `event`, `inflatedPrincipal`, `format`, `currentYear` in scope):

```tsx
summary={
  <>
    <div>{summarizeNewDebtCard(event, format)}</div>
    <div>{formatNewDebtScheduleText(event, inflatedPrincipal, format)}</div>
  </>
}
```

Renders, when collapsed, as:

```
\u20ac100,000 from 2030
Annual repayment (capital + interest): \u20ac11,234 for 10 years.
```

Windfall and RE Investment summaries stay single-line strings (no schedule concept for them).

---

## 4. Tests

- The Task 1 test I added (`auto-expands a freshly-added...`) doesn't assert on font classes, so it stays green.
- Add one focused regression test in [`app/src/features/planner/PlannerForm.test.tsx`](app/src/features/planner/PlannerForm.test.tsx) covering the New Debt two-line summary: add a New Debt with `principal = 100000`, `startYear = 2030`, `endYear = 2040`, default `repaymentType = "overTime"`, collapse it, assert both lines are present in the `new-debt-card-0-summary` testid.
- Existing tests should all still pass (363 today). Public component APIs preserved.

---

## 5. Local checks + pause

After the edits, run `npm run lint`, `npm run typecheck`, `npm test`. Then pause and ask you to verify in `npm run dev`:

- Open a default plan (no events). Add a Windfall, set Amount + Year, collapse: summary should now read at the same font size as e.g. the Assets & Debt category summary.
- Add a New Debt, set `Principal = 100000`, `Start year = 2030`, `End year = 2040`. Collapse: see two lines, headline on top, schedule helper below, both at the bigger font.
- Toggle Repayment type between Over Time and In Fine while collapsed (need to expand to change, then re-collapse): the schedule line should swap to the In Fine wording.
- Reload the page after entering data: cards collapsed by default, summaries visible at the new size.
- Parent category summaries (e.g. Macro: "Inflation 2.0%", Assets & Debt total) should look visually unchanged.

Only after your OK do we move to Task 2 (subsection summaries).