"use client";

import { CurrencyField } from "./CurrencyField";
import { FramedField } from "./FramedField";
import {
  MAX_APPRECIATION,
  MAX_HORIZON_YEARS,
  MIN_APPRECIATION,
  MIN_HORIZON_YEARS
} from "./calculator";
import type { PlanInputs } from "./types";

type Props = {
  value: PlanInputs;
  onChange: (next: PlanInputs) => void;
  onReset: () => void;
};

type SliderKey =
  | "nominalReturn"
  | "horizonYears"
  | "primaryResidenceRate"
  | "otherPropertyRate";

type SliderSpec = {
  key: SliderKey;
  label: string;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
};

const percent = (v: number) => `${(v * 100).toFixed(1)}%`;
const years = (v: number) => `${v} year${v === 1 ? "" : "s"}`;

const FINANCIAL_SLIDERS: SliderSpec[] = [
  {
    key: "nominalReturn",
    label: "Nominal return on financial assets",
    min: -0.05,
    max: 0.15,
    step: 0.005,
    format: percent
  }
];

const REAL_ESTATE_SLIDERS: SliderSpec[] = [
  {
    key: "primaryResidenceRate",
    label: "Primary residence appreciation",
    min: MIN_APPRECIATION,
    max: MAX_APPRECIATION,
    step: 0.005,
    format: percent
  },
  {
    key: "otherPropertyRate",
    label: "Other property appreciation",
    min: MIN_APPRECIATION,
    max: MAX_APPRECIATION,
    step: 0.005,
    format: percent
  }
];

const HORIZON_SLIDER: SliderSpec = {
  key: "horizonYears",
  label: "Projection horizon",
  min: MIN_HORIZON_YEARS,
  max: MAX_HORIZON_YEARS,
  step: 1,
  format: years
};

type AmountKey =
  | "startAssets"
  | "startDebt"
  | "monthlySpending"
  | "annualIncome"
  | "cashBalance"
  | "nonLiquidInvestments"
  | "otherFixedAssets"
  | "primaryResidenceValue"
  | "otherPropertyValue";

type AmountSpec = {
  key: AmountKey;
  label: string;
  min: number;
  max: number;
};

const FINANCIAL_AMOUNTS: AmountSpec[] = [
  { key: "startAssets", label: "Starting financial assets", min: 0, max: 100_000_000 },
  { key: "cashBalance", label: "Cash balance", min: 0, max: 50_000_000 },
  {
    key: "nonLiquidInvestments",
    label: "Non-liquid investments / Private equity",
    min: 0,
    max: 100_000_000
  },
  { key: "otherFixedAssets", label: "Other fixed assets", min: 0, max: 100_000_000 },
  { key: "startDebt", label: "Starting total debt", min: 0, max: 50_000_000 },
  { key: "monthlySpending", label: "Monthly spending", min: 0, max: 1_000_000 },
  { key: "annualIncome", label: "Annual non-rental income", min: 0, max: 10_000_000 }
];

const REAL_ESTATE_AMOUNTS: AmountSpec[] = [
  { key: "primaryResidenceValue", label: "Primary residence value", min: 0, max: 100_000_000 },
  { key: "otherPropertyValue", label: "Other property value", min: 0, max: 100_000_000 }
];

export function PlannerForm({ value, onChange, onReset }: Props) {
  const update = <K extends keyof PlanInputs>(key: K, next: PlanInputs[K]) => {
    onChange({ ...value, [key]: next });
  };

  return (
    <form className="space-y-8" onSubmit={(event) => event.preventDefault()}>
      <fieldset className="space-y-4">
        <legend className="eyebrow">About you</legend>
        <div className="grid grid-cols-1 gap-4">
          <FramedField label="Date of birth">
            <input
              type="date"
              value={value.dateOfBirth}
              onChange={(event) => update("dateOfBirth", event.target.value)}
              className="field-input"
              aria-label="Date of birth"
            />
          </FramedField>
        </div>
      </fieldset>

      <div className="space-y-2">
        <p className="eyebrow">
          Your numbers{" "}
          <span className="font-normal normal-case tracking-normal text-[var(--ink-muted)]">
            &middot; in today&apos;s money
          </span>
        </p>

        <fieldset className="space-y-5 rounded-[1.25rem] border border-[var(--border)] bg-[var(--surface)] p-5">
          <legend className="eyebrow px-1 text-[var(--navy)]">Financial</legend>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {FINANCIAL_AMOUNTS.map((spec) => (
              <CurrencyField
                key={spec.key}
                label={spec.label}
                value={value[spec.key]}
                onChange={(next) => update(spec.key, next)}
                min={spec.min}
                max={spec.max}
              />
            ))}
          </div>
          <div className="space-y-5 pt-2">
            {FINANCIAL_SLIDERS.map((spec) => (
              <SliderRow
                key={spec.key}
                spec={spec}
                value={value[spec.key]}
                onChange={(next) => update(spec.key, next)}
              />
            ))}
          </div>
        </fieldset>

        <fieldset className="space-y-5 rounded-[1.25rem] border border-[var(--border)] bg-[var(--surface)] p-5">
          <legend className="eyebrow px-1 text-[var(--navy)]">Real Estate</legend>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {REAL_ESTATE_AMOUNTS.map((spec) => (
              <CurrencyField
                key={spec.key}
                label={spec.label}
                value={value[spec.key]}
                onChange={(next) => update(spec.key, next)}
                min={spec.min}
                max={spec.max}
              />
            ))}
          </div>
          <div className="space-y-5 pt-2">
            {REAL_ESTATE_SLIDERS.map((spec) => (
              <SliderRow
                key={spec.key}
                spec={spec}
                value={value[spec.key]}
                onChange={(next) => update(spec.key, next)}
              />
            ))}
          </div>
        </fieldset>

        <div className="pt-2">
          <SliderRow
            spec={HORIZON_SLIDER}
            value={value.horizonYears}
            onChange={(next) => update("horizonYears", next)}
          />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button type="button" onClick={onReset} className="btn-ghost">
          Reset to defaults
        </button>
      </div>
    </form>
  );
}

function SliderRow({
  spec,
  value,
  onChange
}: {
  spec: SliderSpec;
  value: number;
  onChange: (next: number) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-sm font-medium text-[var(--navy)]">{spec.label}</span>
        <span className="font-display text-base tabular-nums text-[var(--navy)]">
          {spec.format(value)}
        </span>
      </div>
      <input
        type="range"
        className="range"
        min={spec.min}
        max={spec.max}
        step={spec.step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <div className="flex items-center justify-between text-[11px] text-[var(--ink-muted)]">
        <span>{spec.format(spec.min)}</span>
        <span>{spec.format(spec.max)}</span>
      </div>
    </div>
  );
}
