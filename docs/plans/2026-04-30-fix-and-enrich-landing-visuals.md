# Fix and enrich landing visuals

Iterative redesign of the two broken bar-chart illustrations on the
`/landing` page. Both visuals now render properly and reflect real
planner content + roadmap features (Monte Carlo) with subtle "Preview"
chips for transparency. Pure UI/CSS in two landing-only components;
no schema, env, route, or stack changes.

## Hero browser mockup (`LandingHero.tsx`)

- Slim window chrome: traffic-light dots only — removed the
  `financialplanner.app` address bar.
- Container background flipped to white (`var(--surface)`) so the
  accent-bordered tile cards pop against it.
- Left column rebuilt as a 2×2 grid of compact section pills (one per
  real planner section), each mirroring the planner's
  CollapsibleCategory chrome (accent border, legend with icon + title,
  top-right chevron). `auto-rows-fr` keeps both rows equal-height:
  - **Assets and Debt** (teal / briefcase) — Liquid `$8.5M` /
    8.5% return on Portfolio · Debt `$1.2M` / In Fine · 12 yrs left.
  - **Real Estate** (gold / house) — Primary home `$1.7M` (+3.5%/yr)
    · Rental condo `$530K` (+4.2%/yr).
  - **Income and Expenses** (emerald / dollar) — Annual income `$280K`
    · Monthly expenses `$11K`.
  - **Life Events** (violet / sparkle) — Windfall `$250K` (2032) ·
    RE investment `$850K` (2029) · New debt `$45K` (2031).
- Right column: static SVG mockup of the planner's stacked-bar
  projection chart (mirrors `ProjectionChart`):
  - 30 thin bars (2026–2055) with smooth growth (S-curve savings,
    linear real-estate, late-arriving other-assets, mortgage paydown
    over the first ~12 years).
  - Rounded "pill" tops on the positive stack, rounded bottoms on the
    coral debt segment below the baseline.
  - Y-axis (`$0` … `$20M`) and x-axis year labels rendered as HTML
    overlays positioned by percentage so they stay crisp when the SVG
    stretches; gridlines use `vector-effect="non-scaling-stroke"`.
  - Plot area fixed at `h-56` (~10% taller than the original baseline).
- Floating AI-assistant chat bubble retained, anchored at the
  bottom-right of the chart card with a "Soon" pill.

## Feature showcase visual (`FeatureShowcase.tsx`)

- Replaced the broken bar-chart `VisualizeVisual` with a **Plan
  Confidence** dashboard:
  - Eyebrow: `Plan Confidence` + `Monte Carlo · 10,000 runs · Preview`.
  - Hero metric: 200×200 radial donut gauge with a teal arc covering
    91% of the ring; large `91%` centered inside; uppercase
    `PROBABILITY OF SUCCESS` caption sits **below** the gauge (not
    overlaid).
  - Outcome distribution: three labelled progress bars for
    Worst-case (P10) `$890K`, Median (P50) `$2.4M`, Best-case (P90)
    `$4.2M`.
  - Supporting metrics: Age 57 (FI target), $2.4M (Median peak),
    3.4% (Safe withdrawal).

## Notes

- No tests touched. Both mockups are static markup; `npm test` still
  green at 378/378.
- "Preview" chips are intentionally muted to set expectations around
  Monte Carlo (M2 roadmap) and AI assistant (M3 roadmap) features
  without misrepresenting current functionality.
