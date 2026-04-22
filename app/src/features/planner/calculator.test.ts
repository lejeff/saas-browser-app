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
  horizonYears: 30
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
});
