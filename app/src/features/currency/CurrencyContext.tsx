"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { formatCurrency, formatCurrencyCompact, getCurrencySymbol } from "./format";
import { DEFAULT_CURRENCY, isCurrencyCode, type CurrencyCode } from "./types";

const STORAGE_KEY = "app.currency.v1";

type CurrencyContextValue = {
  code: CurrencyCode;
  setCode: (next: CurrencyCode) => void;
  format: (value: number) => string;
  formatCompact: (value: number) => string;
  symbol: string;
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [code, setCodeState] = useState<CurrencyCode>(DEFAULT_CURRENCY);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored && isCurrencyCode(stored)) {
        setCodeState(stored);
      }
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, code);
    } catch {
      // ignore quota / private mode errors
    }
  }, [code, hydrated]);

  const setCode = useCallback((next: CurrencyCode) => setCodeState(next), []);

  const value = useMemo<CurrencyContextValue>(
    () => ({
      code,
      setCode,
      format: (v: number) => formatCurrency(v, code),
      formatCompact: (v: number) => formatCurrencyCompact(v, code),
      symbol: getCurrencySymbol(code)
    }),
    [code, setCode]
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return ctx;
}
