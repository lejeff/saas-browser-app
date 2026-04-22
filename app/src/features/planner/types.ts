export type PlanInputs = {
  name: string;
  dateOfBirth: string;
  startAssets: number;
  startDebt: number;
  monthlySpending: number;
  annualIncome: number;
  nominalReturn: number;
  horizonYears: number;
};

export type ProjectionPoint = {
  year: number;
  age: number;
  netWorth: number;
};

export const DEFAULT_PLAN_INPUTS: PlanInputs = {
  name: "",
  dateOfBirth: "1985-01-01",
  startAssets: 250_000,
  startDebt: 50_000,
  monthlySpending: 5_000,
  annualIncome: 120_000,
  nominalReturn: 0.06,
  horizonYears: 30
};
