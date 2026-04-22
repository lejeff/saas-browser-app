"use client";

import { MAX_HORIZON_YEARS, MIN_HORIZON_YEARS } from "./calculator";
import type { PlanInputs } from "./types";

type Props = {
  value: PlanInputs;
  onChange: (next: PlanInputs) => void;
  onReset: () => void;
};

type NumericKey = Exclude<keyof PlanInputs, "name" | "dateOfBirth">;

type SliderSpec = {
  key: NumericKey;
  label: string;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
};

const currency = (v: number) =>
  v.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const percent = (v: number) => `${(v * 100).toFixed(1)}%`;

const years = (v: number) => `${v} year${v === 1 ? "" : "s"}`;

const SLIDERS: SliderSpec[] = [
  {
    key: "startAssets",
    label: "Starting financial assets",
    min: 0,
    max: 5_000_000,
    step: 10_000,
    format: currency
  },
  {
    key: "startDebt",
    label: "Starting total debt",
    min: 0,
    max: 2_000_000,
    step: 5_000,
    format: currency
  },
  {
    key: "monthlySpending",
    label: "Base monthly spending (today)",
    min: 0,
    max: 30_000,
    step: 100,
    format: currency
  },
  {
    key: "annualIncome",
    label: "Base annual non-rental income (today)",
    min: 0,
    max: 1_000_000,
    step: 5_000,
    format: currency
  },
  {
    key: "nominalReturn",
    label: "Nominal return on financial assets",
    min: -0.05,
    max: 0.15,
    step: 0.005,
    format: percent
  },
  {
    key: "horizonYears",
    label: "Projection horizon",
    min: MIN_HORIZON_YEARS,
    max: MAX_HORIZON_YEARS,
    step: 1,
    format: years
  }
];

export function PlannerForm({ value, onChange, onReset }: Props) {
  const update = <K extends keyof PlanInputs>(key: K, next: PlanInputs[K]) => {
    onChange({ ...value, [key]: next });
  };

  return (
    <form className="space-y-6" onSubmit={(event) => event.preventDefault()}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Name</span>
          <input
            type="text"
            value={value.name}
            onChange={(event) => update("name", event.target.value)}
            placeholder="Your name"
            className="rounded border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Date of birth</span>
          <input
            type="date"
            value={value.dateOfBirth}
            onChange={(event) => update("dateOfBirth", event.target.value)}
            className="rounded border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none"
          />
        </label>
      </div>

      <div className="space-y-5">
        {SLIDERS.map((spec) => (
          <div key={spec.key} className="space-y-1">
            <div className="flex items-baseline justify-between text-sm">
              <span className="font-medium">{spec.label}</span>
              <span className="tabular-nums text-gray-700">{spec.format(value[spec.key])}</span>
            </div>
            <input
              type="range"
              min={spec.min}
              max={spec.max}
              step={spec.step}
              value={value[spec.key]}
              onChange={(event) => update(spec.key, Number(event.target.value))}
              className="w-full"
            />
            <input
              type="number"
              min={spec.min}
              max={spec.max}
              step={spec.step}
              value={value[spec.key]}
              onChange={(event) => update(spec.key, Number(event.target.value))}
              className="w-full rounded border border-gray-300 px-3 py-1 text-sm focus:border-gray-500 focus:outline-none"
            />
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onReset}
          className="rounded border border-gray-300 px-3 py-1 text-sm hover:bg-gray-100"
        >
          Reset to defaults
        </button>
      </div>
    </form>
  );
}
