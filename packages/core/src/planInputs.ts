import { z } from "zod";

// Bounds for appreciation and horizon are part of the domain contract and are
// shared by UI sliders (app/src/features/planner/PlannerForm.tsx), the
// deterministic projection (projection.ts), and the Zod validator below.
export const MIN_HORIZON_YEARS = 10;
export const MAX_HORIZON_YEARS = 80;
export const MIN_APPRECIATION = -0.05;
export const MAX_APPRECIATION = 0.1;

export const PlanInputsSchema = z.object({
  name: z.string(),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "dateOfBirth must be YYYY-MM-DD"),
  startAssets: z.number().finite().nonnegative(),
  startDebt: z.number().finite().nonnegative(),
  monthlySpending: z.number().finite().nonnegative(),
  annualIncome: z.number().finite().nonnegative(),
  rentalIncome: z.number().finite().nonnegative(),
  rentalIncomeRate: z.number().finite().min(MIN_APPRECIATION).max(MAX_APPRECIATION),
  windfallAmount: z.number().finite().nonnegative(),
  windfallYear: z.number().int(),
  nominalReturn: z.number().finite().min(-0.5).max(0.5),
  inflationRate: z.number().finite().min(-0.05).max(0.15),
  horizonYears: z.number().int().min(MIN_HORIZON_YEARS).max(MAX_HORIZON_YEARS),
  cashBalance: z.number().finite().nonnegative(),
  nonLiquidInvestments: z.number().finite().nonnegative(),
  otherFixedAssets: z.number().finite().nonnegative(),
  primaryResidenceValue: z.number().finite().nonnegative(),
  otherPropertyValue: z.number().finite().nonnegative(),
  primaryResidenceRate: z.number().finite().min(MIN_APPRECIATION).max(MAX_APPRECIATION),
  otherPropertyRate: z.number().finite().min(MIN_APPRECIATION).max(MAX_APPRECIATION)
});

export type PlanInputs = z.infer<typeof PlanInputsSchema>;

export type ProjectionPoint = {
  year: number;
  age: number;
  netWorth: number;
  liquid: number;
  savings: number;
  otherAssets: number;
  realEstate: number;
  debt: number;
};

export const DEFAULT_PLAN_INPUTS: PlanInputs = {
  name: "",
  dateOfBirth: "1985-01-01",
  startAssets: 250_000,
  startDebt: 50_000,
  monthlySpending: 5_000,
  annualIncome: 120_000,
  rentalIncome: 0,
  rentalIncomeRate: 0.02,
  windfallAmount: 0,
  windfallYear: new Date().getFullYear() + 10,
  nominalReturn: 0.06,
  inflationRate: 0.02,
  horizonYears: 30,
  cashBalance: 20_000,
  nonLiquidInvestments: 0,
  otherFixedAssets: 0,
  primaryResidenceValue: 400_000,
  otherPropertyValue: 0,
  primaryResidenceRate: 0.03,
  otherPropertyRate: 0.03
};
