import { describe, expect, it } from "vitest";
import {
  ageFromDob,
  clampHorizon,
  MAX_HORIZON_YEARS,
  MIN_HORIZON_YEARS,
  projectNetWorth
} from "@/features/planner/calculator";
import type { PlanInputs } from "@/features/planner/types";

const FIXED_NOW = new Date("2026-06-15T00:00:00Z");

const money = (actual: number, expected: number, tolerance = 0.01) => {
  expect(Math.abs(actual - expected)).toBeLessThan(tolerance);
};

const BASE_INPUTS: PlanInputs = {
  name: "Test",
  dateOfBirth: "1990-01-01",
  startAssets: 100_000,
  startDebt: 0,
  monthlySpending: 1_000,
  annualIncome: 50_000,
  nominalReturn: 0.05,
  horizonYears: 30,
  cashBalance: 0,
  nonLiquidInvestments: 0,
  otherFixedAssets: 0,
  primaryResidenceValue: 0,
  otherPropertyValue: 0,
  primaryResidenceRate: 0,
  otherPropertyRate: 0
};

describe("ageFromDob", () => {
  it("computes age before birthday this year", () => {
    expect(ageFromDob("1990-09-10", FIXED_NOW)).toBe(35);
  });

  it("computes age after birthday this year", () => {
    expect(ageFromDob("1990-03-10", FIXED_NOW)).toBe(36);
  });

  it("returns 0 for invalid input", () => {
    expect(ageFromDob("not-a-date", FIXED_NOW)).toBe(0);
  });

  it("counts the birthday itself as already happened", () => {
    // FIXED_NOW = 2026-06-15; DoB on the same month/day in 1990 → exactly 36.
    expect(ageFromDob("1990-06-15", FIXED_NOW)).toBe(36);
  });
});

describe("clampHorizon", () => {
  it("clamps below minimum", () => {
    expect(clampHorizon(0)).toBe(MIN_HORIZON_YEARS);
    expect(clampHorizon(-10)).toBe(MIN_HORIZON_YEARS);
  });

  it("clamps above maximum", () => {
    expect(clampHorizon(999)).toBe(MAX_HORIZON_YEARS);
  });

  it("rounds fractional values", () => {
    expect(clampHorizon(29.6)).toBe(30);
  });

  it("returns the minimum for non-finite values", () => {
    expect(clampHorizon(Number.NaN)).toBe(MIN_HORIZON_YEARS);
    expect(clampHorizon(Number.POSITIVE_INFINITY)).toBe(MIN_HORIZON_YEARS);
    expect(clampHorizon(Number.NEGATIVE_INFINITY)).toBe(MIN_HORIZON_YEARS);
  });
});

describe("projectNetWorth", () => {
  it("produces horizonYears+1 points with correct start and end ages", () => {
    const points = projectNetWorth(BASE_INPUTS, FIXED_NOW);
    const currentAge = ageFromDob(BASE_INPUTS.dateOfBirth, FIXED_NOW);
    expect(points).toHaveLength(BASE_INPUTS.horizonYears + 1);
    expect(points[0].age).toBe(currentAge);
    expect(points.at(-1)?.age).toBe(currentAge + BASE_INPUTS.horizonYears);
  });

  it("returns the start assets at year 0", () => {
    const points = projectNetWorth(BASE_INPUTS, FIXED_NOW);
    expect(points[0].netWorth).toBe(BASE_INPUTS.startAssets);
  });

  it("applies the deterministic recurrence at year 1", () => {
    const points = projectNetWorth(BASE_INPUTS, FIXED_NOW);
    const expected =
      BASE_INPUTS.startAssets * (1 + BASE_INPUTS.nominalReturn) -
      BASE_INPUTS.monthlySpending * 12 +
      BASE_INPUTS.annualIncome;
    money(points[1].netWorth, expected);
  });

  it("matches closed-form value at year 10", () => {
    const points = projectNetWorth(BASE_INPUTS, FIXED_NOW);
    const r = BASE_INPUTS.nominalReturn;
    const flow = BASE_INPUTS.annualIncome - BASE_INPUTS.monthlySpending * 12;
    const n = 10;
    const expected =
      BASE_INPUTS.startAssets * (1 + r) ** n + (flow * ((1 + r) ** n - 1)) / r;
    money(points[n].netWorth, expected, 0.5);
  });

  it("subtracts debt from net worth", () => {
    const points = projectNetWorth(
      { ...BASE_INPUTS, startAssets: 100_000, startDebt: 40_000 },
      FIXED_NOW
    );
    expect(points[0].netWorth).toBe(60_000);
  });

  it("changes linearly when return is zero", () => {
    const points = projectNetWorth({ ...BASE_INPUTS, nominalReturn: 0 }, FIXED_NOW);
    const flow = BASE_INPUTS.annualIncome - BASE_INPUTS.monthlySpending * 12;
    expect(points[5].netWorth).toBe(BASE_INPUTS.startAssets + flow * 5);
  });

  it("compounds losses under a negative return", () => {
    const points = projectNetWorth(
      { ...BASE_INPUTS, nominalReturn: -0.1, annualIncome: 0, monthlySpending: 0 },
      FIXED_NOW
    );
    money(points[3].netWorth, BASE_INPUTS.startAssets * 0.9 ** 3, 0.5);
  });

  it.each([MIN_HORIZON_YEARS, 30, MAX_HORIZON_YEARS])(
    "produces horizon+1 points for horizon=%i",
    (h) => {
      const points = projectNetWorth({ ...BASE_INPUTS, horizonYears: h }, FIXED_NOW);
      expect(points).toHaveLength(h + 1);
      expect(points.at(-1)?.age).toBe(points[0].age + h);
    }
  );

  it("clamps horizon to MIN and MAX bounds", () => {
    expect(projectNetWorth({ ...BASE_INPUTS, horizonYears: 0 }, FIXED_NOW)).toHaveLength(
      MIN_HORIZON_YEARS + 1
    );
    expect(projectNetWorth({ ...BASE_INPUTS, horizonYears: 999 }, FIXED_NOW)).toHaveLength(
      MAX_HORIZON_YEARS + 1
    );
  });

  it("does not alter earlier-year values when horizon grows", () => {
    const short = projectNetWorth({ ...BASE_INPUTS, horizonYears: 20 }, FIXED_NOW);
    const long = projectNetWorth({ ...BASE_INPUTS, horizonYears: 50 }, FIXED_NOW);
    for (let i = 0; i <= 20; i += 1) money(long[i].netWorth, short[i].netWorth);
  });

  it("labels years starting from now.getFullYear()", () => {
    const points = projectNetWorth(BASE_INPUTS, FIXED_NOW);
    expect(points[0].year).toBe(FIXED_NOW.getFullYear());
    expect(points[5].year).toBe(FIXED_NOW.getFullYear() + 5);
    expect(points.at(-1)?.year).toBe(FIXED_NOW.getFullYear() + BASE_INPUTS.horizonYears);
  });

  it("does not mutate its input", () => {
    const input: PlanInputs = { ...BASE_INPUTS };
    const snapshot = JSON.stringify(input);
    projectNetWorth(input, FIXED_NOW);
    expect(JSON.stringify(input)).toBe(snapshot);
  });

  it("is referentially deterministic for the same input", () => {
    const a = projectNetWorth(BASE_INPUTS, FIXED_NOW);
    const b = projectNetWorth(BASE_INPUTS, FIXED_NOW);
    expect(a).toEqual(b);
  });

  it("sums every bucket minus debt at year 0", () => {
    const points = projectNetWorth(
      {
        ...BASE_INPUTS,
        startAssets: 100_000,
        cashBalance: 25_000,
        nonLiquidInvestments: 50_000,
        otherFixedAssets: 10_000,
        primaryResidenceValue: 400_000,
        otherPropertyValue: 150_000,
        startDebt: 80_000
      },
      FIXED_NOW
    );
    expect(points[0].netWorth).toBe(100_000 + 25_000 + 50_000 + 10_000 + 400_000 + 150_000 - 80_000);
  });

  it("compounds primary residence at its own rate and ignores spending shortfalls", () => {
    // No income, no cash, no starting assets, no return — only a pure −120k/yr drag
    // on financial assets. Residence must still compound at 4% and contribute fully.
    const points = projectNetWorth(
      {
        ...BASE_INPUTS,
        startAssets: 0,
        cashBalance: 0,
        annualIncome: 0,
        monthlySpending: 10_000,
        nominalReturn: 0,
        primaryResidenceValue: 500_000,
        primaryResidenceRate: 0.04
      },
      FIXED_NOW
    );
    const residenceAt10 = 500_000 * 1.04 ** 10;
    const assetsAt10 = -10_000 * 12 * 10;
    money(points[10].netWorth, residenceAt10 + assetsAt10, 0.5);
  });

  it("grows primary residence and other property at independent rates", () => {
    const points = projectNetWorth(
      {
        ...BASE_INPUTS,
        startAssets: 0,
        annualIncome: 0,
        monthlySpending: 0,
        primaryResidenceValue: 100_000,
        primaryResidenceRate: 0.02,
        otherPropertyValue: 100_000,
        otherPropertyRate: 0.05
      },
      FIXED_NOW
    );
    const residence = 100_000 * 1.02 ** 5;
    const other = 100_000 * 1.05 ** 5;
    money(points[5].netWorth, residence + other, 0.5);
  });

  it("drains cash before financial assets on a pure shortfall", () => {
    const points = projectNetWorth(
      {
        ...BASE_INPUTS,
        startAssets: 100_000,
        cashBalance: 20_000,
        annualIncome: 0,
        monthlySpending: 1_000,
        nominalReturn: 0
      },
      FIXED_NOW
    );
    // year 1: shortfall = 12_000. Cash 20_000 → 8_000. Assets untouched at 100_000.
    expect(points[1].netWorth).toBe(8_000 + 100_000);
    // year 2: shortfall = 12_000. Cash 8_000 → 0. Assets -4_000 → 96_000.
    expect(points[2].netWorth).toBe(0 + 96_000);
  });

  it("continues depleting financial assets after cash reaches zero", () => {
    const points = projectNetWorth(
      {
        ...BASE_INPUTS,
        startAssets: 50_000,
        cashBalance: 5_000,
        annualIncome: 0,
        monthlySpending: 1_000,
        nominalReturn: 0
      },
      FIXED_NOW
    );
    // year 1: shortfall 12_000. Cash 5_000 → 0, remaining 7_000 from assets → 43_000.
    expect(points[1].netWorth).toBe(0 + 43_000);
    // year 2: shortfall 12_000 all from assets → 31_000.
    expect(points[2].netWorth).toBe(0 + 31_000);
  });

  it("keeps non-liquid and other fixed assets flat across all years", () => {
    const points = projectNetWorth(
      {
        ...BASE_INPUTS,
        startAssets: 0,
        cashBalance: 0,
        annualIncome: 0,
        monthlySpending: 0,
        nominalReturn: 0,
        nonLiquidInvestments: 75_000,
        otherFixedAssets: 25_000
      },
      FIXED_NOW
    );
    for (const p of points) {
      expect(p.netWorth).toBe(100_000);
    }
  });

  it("does not apply nominal return to cash", () => {
    const points = projectNetWorth(
      {
        ...BASE_INPUTS,
        startAssets: 0,
        cashBalance: 10_000,
        annualIncome: 0,
        monthlySpending: 0,
        nominalReturn: 0.5
      },
      FIXED_NOW
    );
    expect(points[5].netWorth).toBe(10_000);
  });

  it("leaves cash untouched when income exactly matches spending (netFlow = 0)", () => {
    const points = projectNetWorth(
      {
        ...BASE_INPUTS,
        startAssets: 100_000,
        cashBalance: 50_000,
        annualIncome: 12_000,
        monthlySpending: 1_000,
        nominalReturn: 0
      },
      FIXED_NOW
    );
    // Year 0 and every subsequent year: assets stay at 100k (afterReturn + 0),
    // cash stays at 50k, NW = 150k at every point.
    for (const p of points) {
      expect(p.netWorth).toBe(150_000);
    }
  });

  it("does not draw down residence or other property during deep shortfall", () => {
    // Zero cash, zero assets, zero income, spending > 0. Residence and other
    // property must still compound; assets may go negative, but the property
    // buckets must equal their deterministic compounded values.
    const points = projectNetWorth(
      {
        ...BASE_INPUTS,
        startAssets: 0,
        cashBalance: 0,
        annualIncome: 0,
        monthlySpending: 2_000,
        nominalReturn: 0,
        primaryResidenceValue: 300_000,
        primaryResidenceRate: 0.03,
        otherPropertyValue: 200_000,
        otherPropertyRate: 0.02
      },
      FIXED_NOW
    );
    const residenceAt5 = 300_000 * 1.03 ** 5;
    const otherAt5 = 200_000 * 1.02 ** 5;
    const assetsAt5 = -2_000 * 12 * 5;
    money(points[5].netWorth, residenceAt5 + otherAt5 + assetsAt5, 0.5);
  });

  it("applies debt as a constant subtraction at every year", () => {
    const withoutDebt = projectNetWorth({ ...BASE_INPUTS, startDebt: 0 }, FIXED_NOW);
    const withDebt = projectNetWorth({ ...BASE_INPUTS, startDebt: 75_000 }, FIXED_NOW);
    expect(withDebt).toHaveLength(withoutDebt.length);
    for (let i = 0; i < withDebt.length; i += 1) {
      money(withoutDebt[i].netWorth - withDebt[i].netWorth, 75_000);
    }
  });

  it("matches hand-computed values across all buckets for 2 years", () => {
    const points = projectNetWorth(
      {
        ...BASE_INPUTS,
        startAssets: 100_000,
        cashBalance: 10_000,
        nonLiquidInvestments: 5_000,
        otherFixedAssets: 5_000,
        primaryResidenceValue: 100_000,
        primaryResidenceRate: 0.1,
        otherPropertyValue: 100_000,
        otherPropertyRate: 0,
        startDebt: 50_000,
        annualIncome: 0,
        monthlySpending: 1_000,
        nominalReturn: 0.1
      },
      FIXED_NOW
    );
    // Year 0: 100 + 100 + 10 + 100 + 5 + 5 - 50 = 270k
    expect(points[0].netWorth).toBe(270_000);
    // Year 1: residence 110k, other 100k, afterReturn 110k, shortfall 12k drains
    // cash 10k → 0 and pulls 2k from assets → 108k. NW = 110+100+0+108+5+5-50 = 278k
    money(points[1].netWorth, 278_000);
    // Year 2: residence 121k, other 100k, afterReturn 118.8k, shortfall 12k all
    // from assets → 106.8k. NW = 121+100+0+106.8+5+5-50 = 287.8k
    money(points[2].netWorth, 287_800);
  });
});
