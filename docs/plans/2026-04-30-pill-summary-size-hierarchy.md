# Pill summary · size hierarchy (V2-C)

Apply canvas variant **C** to every collapsed `CollapsiblePill` summary: bold 16px navy value + 13px soft-slate label, baseline-aligned, left-aligned, with `flex-wrap` so long labels (Debt inFine schedule) drop to a second row gracefully.

## Where the change happens

All 12 `summary={...}` call sites flow through one component (`CollapsiblePill`, [app/src/features/planner/PlannerForm.tsx](../../app/src/features/planner/PlannerForm.tsx) ~line 823) and one shared `summaryClass` constant (~line 882). Restyle once and every pill picks it up — including the per-card pills inside Life Events, Real Estate Investments, New Debt, Real Estate Holdings.

## Steps

### 1. Add a `splitSummary` helper inside `CollapsiblePill`

```tsx
const SUMMARY_SEP = " \u00b7 "; // " · "

function splitSummary(s: string): { value: string; label: string | null } {
  const i = s.indexOf(SUMMARY_SEP);
  if (i === -1) return { value: s, label: null };
  return { value: s.slice(0, i), label: s.slice(i + SUMMARY_SEP.length) };
}
```

Splits on the **first** middle-dot only — preserves the inner dot inside Debt's inFine schedule line (`Annual interest payment: €X · Lump sum of €Y in 2030.`).

### 2. Replace the `summaryClass` div with the new flex layout

Today (PlannerForm.tsx ~882):

```ts
const summaryClass =
  "pt-1 text-center text-base font-medium tabular-nums text-[var(--ink-muted)]";
```

After: in the JSX, replace the single `<div className={summaryClass}>{summary}</div>` with:

```tsx
<div
  data-testid={testId ? `${testId}-summary` : undefined}
  className="pt-1 text-left flex flex-wrap items-baseline gap-x-2 gap-y-0.5"
>
  {typeof summary === "string"
    ? (() => {
        const { value, label } = splitSummary(summary);
        return (
          <>
            <span className="text-[16px] font-bold tabular-nums text-[var(--ink)]">
              {value}
            </span>
            {label ? (
              <span className="text-[13px] tabular-nums text-[var(--ink-soft)]">
                {label}
              </span>
            ) : null}
          </>
        );
      })()
    : summary}
</div>
```

- `text-[var(--ink)]` = navy `#0f2239`
- `text-[var(--ink-soft)]` = slate `#4b5b74`
- `tabular-nums` on both spans keeps numbers aligned across pills

### 3. Convert the two ReactNode summaries to strings

Two call sites currently pass `<><div>{headline}</div><div>{schedule}</div></>`. Replace each with a single interpolated string so the new flex/wrap layout handles the two-line behavior automatically:

- **Debt sub-pill** (~592):

```tsx
summary={
  `${summarizeDebtSubsectionHeadline(value, format)}${SUMMARY_SEP}` +
  formatDebtScheduleText({ /* same args */ })
}
```

- **NewDebtEventCard** (~1344):

```tsx
summary={
  `${summarizeNewDebtCard(event, inflatedPrincipal, format)}${SUMMARY_SEP}` +
  formatNewDebtScheduleText(event, inflatedPrincipal, format)
}
```

The `summary` prop type stays `ReactNode` — string is just the only path we ship today.

### 4. Update affected tests

Visual separation between value and label comes from `gap-x-2` (CSS), not a literal " · " character — so `textContent` concatenates the two spans directly (`"—5.0% return on Portfolio"`). Two consequences:

- The four tests that previously asserted `summary.querySelectorAll("div")` returned 2 children now assert against `summary.textContent` directly.
- Tests using `screen.getByText(...)` with the literal " · " in their regex needed to either drop the dot OR switch to a small `getElementByJoinedText` helper that walks down to the deepest element whose flattened text matches the regex (`getByText` won't match across two adjacent text nodes by default).

The helper lives at the top of `PlannerForm.test.tsx` and is reused for the four parent-category summary assertions (Assets and Debt summary, Income & Expenses summary, Life Events with windfall + RE investment).

### 5. Run checks + manual verification

- `npm run lint` / `npm run typecheck` / `npm test` — 378/378 green.
- Manual check at `npm run dev`. Verified:
  - Every category pill at the top level (About you, Assets and Debt, Income & Expenses, Real Estate, Life Events, Macro) reads as bold value + small label, left-aligned, no longer placeholder gray.
  - Sub-pills (Liquid, Non-Liquid, Debt) match.
  - Debt sub-pill in **In Fine** mode wraps cleanly to a second flex row when the schedule line is long.
  - Per-card collapsed summaries inside Life Events / Real Estate Holdings pick up the same style.
  - Empty-state em-dash (`"—"`) renders as a single bold-navy 16px em-dash.

### 6. Doc audit

- `docs/architecture.md`: no change (UI-only restyle).
- `README.md`, `ROADMAP.md`, `.env.example`: no change.
- Archive plan to `docs/plans/2026-04-30-pill-summary-size-hierarchy.md`, bump count in [docs/plans/README.md](./README.md) from 37 → 38.

### 7. Ship after "ship it"

Branch + commit + push + PR + watch CI + squash-merge + delete branch.

## Defaults locked in

- Value: **16px** (down from the original plan's 18px after a quick visual pass), `font-bold`, `var(--ink)` (navy), `tabular-nums`.
- Label: **13px**, normal weight, `var(--ink-soft)` (slate), `tabular-nums`.
- Layout: `text-left`, `flex flex-wrap items-baseline gap-x-2 gap-y-0.5`, `pt-1`.
