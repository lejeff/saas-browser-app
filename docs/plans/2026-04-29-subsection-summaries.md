---
name: Task 2 — Subsection summaries (Liquid / Non-Liquid / Debt)
overview: Add collapsed-state summaries to the Liquid, Non-Liquid, and Debt sub-pills inside Assets & Debt. Liquid and Non-Liquid get a single-line total; Debt gets a two-line summary matching the New Debt life-event card format (headline = balance only, no start year, plus the schedule helper line). Extract a shared schedule-text formatter so the in-card paragraph and both collapsed summaries stay in lock-step.
todos:
  - id: task2-extract-formatter
    content: Extract shared formatDebtScheduleText helper; refactor formatNewDebtScheduleText (adapter) and DebtScheduleSummary (uses helper) to call it
    status: completed
  - id: task2-summary-helpers
    content: Add summarizeLiquidSubsection / summarizeNonLiquidSubsection / summarizeDebtSubsectionHeadline helpers
    status: completed
  - id: task2-wire-subsections
    content: Pass summary props to the three CollapsibleSubsection call sites (Liquid + Non-Liquid single-line totals, Debt two-line headline + schedule)
    status: completed
  - id: task2-tests
    content: Add three regression tests for the new collapsed-summary content (Liquid, Non-Liquid, Debt with both lines)
    status: completed
  - id: task2-checks-pause
    content: Run lint/typecheck/test, then pause for manual verification before Task 3
    status: completed
isProject: false
---

# Task 2 — Subsection summaries (Liquid / Non-Liquid / Debt)

Continues the wave on `feat/collapsible-cards-and-summaries`. Pause for manual verification before Task 3.

---

## 1. Extract a shared schedule-text formatter

**Why:** Two near-duplicate implementations exist today: [`formatNewDebtScheduleText`](app/src/features/planner/PlannerForm.tsx) (added in Task 1 refinement) for life-event New Debt cards, and the inline logic inside [`DebtScheduleSummary`](app/src/features/planner/PlannerForm.tsx) for the existing Debt subsection. Their success branches are identical; only the two edge-case messages differ. With Task 2 surfacing the same text in the collapsed Debt summary, three call sites would need to stay in sync — pulling them through one helper now prevents drift.

**How:** Add a single primitive in [`PlannerForm.tsx`](app/src/features/planner/PlannerForm.tsx):

```tsx
function formatDebtScheduleText(args: {
  principal: number;
  interestRate: number;
  repaymentType: DebtRepaymentType;
  startYear: number;
  endYear: number;
  format: (n: number) => string;
  /** Per-call edge-case wording so existing-debt vs new-debt phrasing
   *  stays accurate ("No outstanding debt." vs "No principal entered."). */
  messages: { noPrincipal: string; termInPast: string };
}): string {
  const { principal, interestRate, repaymentType, startYear, endYear, format, messages } = args;
  const term = Math.max(0, endYear - startYear);
  if (principal <= 0) return messages.noPrincipal;
  if (term <= 0) return messages.termInPast;
  if (repaymentType === "overTime") {
    const annual = computeOverTimeAnnualPayment(principal, interestRate, term);
    return `Annual repayment (capital + interest): ${format(annual)} for ${term} year${term === 1 ? "" : "s"}.`;
  }
  const annualInterest = principal * interestRate;
  return `Annual interest payment: ${format(annualInterest)} \u00b7 Lump sum of ${format(principal)} in ${endYear}.`;
}
```

Then:
- `formatNewDebtScheduleText(event, inflatedPrincipal, format)` becomes a thin adapter calling `formatDebtScheduleText` with `messages: { noPrincipal: "No principal entered.", termInPast: "End year is at or before start year \u2014 no scheduled payments." }`.
- `DebtScheduleSummary`'s inline IIFE is replaced by a call to `formatDebtScheduleText` with `startYear: currentYear`, `principal: value.startDebt`, and `messages: { noPrincipal: "No outstanding debt.", termInPast: "Loan end year is in the past \u2014 no scheduled payments." }`. Its `data-testid="debt-schedule-summary"` and the existing test selector targeting it stay intact.

---

## 2. Subsection summary helpers

Add three small helpers next to the existing `summarize*` family in [`PlannerForm.tsx`](app/src/features/planner/PlannerForm.tsx):

```tsx
function summarizeLiquidSubsection(
  v: PlanInputs,
  format: (n: number) => string
): string {
  const total = v.startAssets + v.cashBalance;
  return total > 0 ? format(total) : "\u2014";
}

function summarizeNonLiquidSubsection(
  v: PlanInputs,
  format: (n: number) => string
): string {
  const total = v.nonLiquidInvestments + v.otherFixedAssets;
  return total > 0 ? format(total) : "\u2014";
}

function summarizeDebtSubsectionHeadline(
  v: PlanInputs,
  format: (n: number) => string
): string {
  return v.startDebt > 0 ? format(v.startDebt) : "\u2014";
}
```

Single-line totals for Liquid + Non-Liquid (parent pill title gives context, no extra label needed). The em-dash fallback mirrors the existing `summarizeRealEstate` convention. Debt headline is just the balance (no "from \<year\>") — your literal request: "same as New Debt but without a start year, as the debt already exists".

---

## 3. Wire the summaries into the three subsections

In [`PlannerForm.tsx`](app/src/features/planner/PlannerForm.tsx) at the three subsection call sites (`subsection-liquid` ~line 468, `subsection-non-liquid` ~line 483, `subsection-debt` ~line 521):

```tsx
// Liquid
<CollapsibleSubsection
  title="Liquid"
  accent={ACCENT.assetsDebt}
  testId="subsection-liquid"
  defaultOpen
  summary={summarizeLiquidSubsection(value, format)}
> ... </CollapsibleSubsection>

// Non-Liquid
<CollapsibleSubsection
  title="Non-Liquid"
  accent={ACCENT.assetsDebt}
  testId="subsection-non-liquid"
  summary={summarizeNonLiquidSubsection(value, format)}
> ... </CollapsibleSubsection>

// Debt — two-line, mirrors the New Debt card pattern
<CollapsibleSubsection
  title="Debt"
  accent={ACCENT.debt}
  testId="subsection-debt"
  summary={
    <>
      <div>{summarizeDebtSubsectionHeadline(value, format)}</div>
      <div>
        {formatDebtScheduleText({
          principal: value.startDebt,
          interestRate: value.debtInterestRate,
          repaymentType: value.debtRepaymentType,
          startYear: currentYear,
          endYear: value.debtEndYear,
          format,
          messages: {
            noPrincipal: "No outstanding debt.",
            termInPast: "Loan end year is in the past \u2014 no scheduled payments."
          }
        })}
      </div>
    </>
  }
> ... </CollapsibleSubsection>
```

`currentYear` is already in scope at this call site (computed once per render at the top of `PlannerForm`).

---

## 4. Tests

In [`app/src/features/planner/PlannerForm.test.tsx`](app/src/features/planner/PlannerForm.test.tsx) add three focused regression tests:

1. **Liquid subsection summary** — collapse the Liquid pill (it defaults to open, so click its legend toggle), assert `subsection-liquid-summary` text contains the formatted total of `startAssets + cashBalance` (default fixture values).
2. **Non-Liquid subsection summary** — already collapsed by default; assert `subsection-non-liquid-summary` shows the formatted total.
3. **Debt subsection summary** — already collapsed by default; assert `subsection-debt-summary` has two stacked `<div>` lines, line 1 = formatted `startDebt`, line 2 = the same string the in-card `debt-schedule-summary` paragraph produces (when expanded). Type a non-zero `startDebt` first so we exercise the success path.

Existing tests should all still pass (366 today including the previous fixup additions). The shared formatter preserves wording so the existing `debt-schedule-summary` selector + content checks keep working.

---

## 5. Local checks + pause

Run `npm run lint`, `npm run typecheck`, `npm test`. Then pause for you to verify in `npm run dev`:

- Collapse Liquid (defaults open). Summary should read the formatted total of portfolio + cash, centered, at the same baseline as a collapsed parent pill.
- Non-Liquid is collapsed by default. With default fixture values, summary should show the total of private equity + other fixed assets (or "\u2014" if both are zero).
- Debt is collapsed by default. Summary should be two centered lines: balance on top, schedule helper below. Edit `Outstanding debt` to a non-zero value, expand+collapse, the headline updates and the schedule line matches the `Annual repayment...` / `Annual interest payment...` text the in-card paragraph shows when expanded.
- Switch `Repayment type` to "In Fine" — collapsed schedule line should swap wording, in lock-step with the in-card paragraph.
- Set `Outstanding debt` back to 0 — schedule line should read "No outstanding debt." (the existing-debt wording, NOT "No principal entered."). Set debt > 0 but `Loan end year` to a past year — schedule line should read "Loan end year is in the past — no scheduled payments.".
- Confirm Task 1 changes still look right (life-event card collapsed summaries unchanged).

After your OK we move to Task 3 (chevron move).