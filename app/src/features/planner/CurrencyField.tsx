"use client";

import { useEffect, useState } from "react";
import { useCurrency } from "@/features/currency/CurrencyContext";
import { parseCurrencyInput } from "@/features/currency/format";
import { FramedField } from "./FramedField";

type Props = {
  label: string;
  helper?: string;
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
};

function formatThousands(n: number): string {
  if (!Number.isFinite(n)) return "";
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(Math.round(n));
}

export function CurrencyField({ label, helper, value, onChange, min = 0, max }: Props) {
  const { symbol } = useCurrency();
  const [draft, setDraft] = useState<string>(formatThousands(value));
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!focused) {
      setDraft(formatThousands(value));
    }
  }, [value, focused]);

  const commit = () => {
    let parsed = parseCurrencyInput(draft);
    if (max !== undefined && parsed > max) parsed = max;
    if (parsed < min) parsed = min;
    if (parsed !== value) onChange(parsed);
    setDraft(formatThousands(parsed));
  };

  return (
    <FramedField label={label} helper={helper}>
      <span className="field-symbol" aria-hidden="true">
        {symbol}
      </span>
      <input
        type="text"
        inputMode="numeric"
        className="field-input tabular-nums"
        value={draft}
        aria-label={label}
        onFocus={(event) => {
          setFocused(true);
          event.currentTarget.select();
        }}
        onChange={(event) => {
          const next = event.target.value;
          const parsed = parseCurrencyInput(next);
          const reformatted = next.trim() === "" ? "" : formatThousands(parsed);
          setDraft(reformatted);
          onChange(parsed);
        }}
        onBlur={() => {
          setFocused(false);
          commit();
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            event.currentTarget.blur();
          }
        }}
      />
    </FramedField>
  );
}
