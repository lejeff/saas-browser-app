"use client";

import { useCurrency } from "./CurrencyContext";
import { CURRENCIES, type CurrencyCode } from "./types";

type Props = {
  className?: string;
};

export function CurrencySelector({ className = "" }: Props) {
  const { code, setCode } = useCurrency();
  return (
    <label className={`relative inline-flex items-center ${className}`}>
      <span className="sr-only">Currency</span>
      <select
        value={code}
        onChange={(event) => setCode(event.target.value as CurrencyCode)}
        className="appearance-none rounded-full border border-[var(--border)] bg-white py-1.5 pl-3 pr-8 text-sm font-medium text-[var(--navy)] shadow-sm transition-colors hover:border-[var(--border-strong)] focus:border-[var(--teal)] focus:outline-none focus:ring-2 focus:ring-[color-mix(in_oklab,var(--teal)_25%,transparent)]"
        aria-label="Currency"
      >
        {CURRENCIES.map((c) => (
          <option key={c.code} value={c.code}>
            {c.code}
          </option>
        ))}
      </select>
      <svg
        aria-hidden="true"
        viewBox="0 0 12 8"
        className="pointer-events-none absolute right-3 h-2 w-3 text-[var(--ink-soft)]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M1 1.5l5 5 5-5" />
      </svg>
    </label>
  );
}
