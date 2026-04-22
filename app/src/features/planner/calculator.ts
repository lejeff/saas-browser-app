import type { PlanInputs, ProjectionPoint } from "./types";

export const MIN_HORIZON_YEARS = 10;
export const MAX_HORIZON_YEARS = 80;

export function ageFromDob(dateOfBirth: string, now: Date = new Date()): number {
  const dob = new Date(dateOfBirth);
  if (Number.isNaN(dob.getTime())) return 0;
  let age = now.getFullYear() - dob.getFullYear();
  const hadBirthdayThisYear =
    now.getMonth() > dob.getMonth() ||
    (now.getMonth() === dob.getMonth() && now.getDate() >= dob.getDate());
  if (!hadBirthdayThisYear) age -= 1;
  return Math.max(0, age);
}

export function clampHorizon(horizonYears: number): number {
  if (!Number.isFinite(horizonYears)) return MIN_HORIZON_YEARS;
  return Math.min(Math.max(Math.round(horizonYears), MIN_HORIZON_YEARS), MAX_HORIZON_YEARS);
}

export function projectNetWorth(input: PlanInputs, now: Date = new Date()): ProjectionPoint[] {
  const currentAge = ageFromDob(input.dateOfBirth, now);
  const years = clampHorizon(input.horizonYears);
  const debt = input.startDebt;
  let assets = input.startAssets;
  const points: ProjectionPoint[] = [];

  for (let i = 0; i <= years; i += 1) {
    if (i > 0) {
      assets =
        assets * (1 + input.nominalReturn) - input.monthlySpending * 12 + input.annualIncome;
    }
    points.push({
      year: now.getFullYear() + i,
      age: currentAge + i,
      netWorth: assets - debt
    });
  }

  return points;
}
