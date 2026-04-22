export type CurrencyCode =
  | "EUR"
  | "USD"
  | "GBP"
  | "CHF"
  | "CAD"
  | "AUD"
  | "JPY"
  | "SEK"
  | "NOK"
  | "DKK"
  | "SGD"
  | "HKD";

export type CurrencyOption = {
  code: CurrencyCode;
  label: string;
};

export const CURRENCIES: readonly CurrencyOption[] = [
  { code: "EUR", label: "Euro" },
  { code: "USD", label: "US Dollar" },
  { code: "GBP", label: "British Pound" },
  { code: "CHF", label: "Swiss Franc" },
  { code: "CAD", label: "Canadian Dollar" },
  { code: "AUD", label: "Australian Dollar" },
  { code: "JPY", label: "Japanese Yen" },
  { code: "SEK", label: "Swedish Krona" },
  { code: "NOK", label: "Norwegian Krone" },
  { code: "DKK", label: "Danish Krone" },
  { code: "SGD", label: "Singapore Dollar" },
  { code: "HKD", label: "Hong Kong Dollar" }
] as const;

const VALID_CODES = new Set<string>(CURRENCIES.map((c) => c.code));

export function isCurrencyCode(value: unknown): value is CurrencyCode {
  return typeof value === "string" && VALID_CODES.has(value);
}

export const DEFAULT_CURRENCY: CurrencyCode = "EUR";
