import type { CurrencyCode } from "./types";

const formatterCache = new Map<CurrencyCode, Intl.NumberFormat>();
const symbolCache = new Map<CurrencyCode, string>();

function getFormatter(code: CurrencyCode): Intl.NumberFormat {
  let fmt = formatterCache.get(code);
  if (!fmt) {
    fmt = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: code,
      maximumFractionDigits: 0
    });
    formatterCache.set(code, fmt);
  }
  return fmt;
}

export function formatCurrency(value: number, code: CurrencyCode): string {
  if (!Number.isFinite(value)) return getFormatter(code).format(0);
  return getFormatter(code).format(Math.round(value));
}

export function getCurrencySymbol(code: CurrencyCode): string {
  let sym = symbolCache.get(code);
  if (sym !== undefined) return sym;
  const parts = getFormatter(code).formatToParts(0);
  const currencyPart = parts.find((p) => p.type === "currency");
  sym = currencyPart?.value ?? code;
  symbolCache.set(code, sym);
  return sym;
}

export function formatCurrencyCompact(value: number, code: CurrencyCode): string {
  if (!Number.isFinite(value)) return `${getCurrencySymbol(code)}0`;
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  const sym = getCurrencySymbol(code);
  if (abs >= 1_000_000_000) return `${sign}${sym}${(abs / 1_000_000_000).toFixed(1)}B`;
  if (abs >= 1_000_000) return `${sign}${sym}${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${sign}${sym}${(abs / 1_000).toFixed(0)}K`;
  return `${sign}${sym}${abs.toFixed(0)}`;
}

export function parseCurrencyInput(raw: string): number {
  if (!raw) return 0;
  const isNegative = /^\s*-/.test(raw);
  const digits = raw.replace(/[^\d]/g, "");
  if (!digits) return 0;
  const n = Number(digits);
  if (!Number.isFinite(n)) return 0;
  return isNegative ? -n : n;
}
