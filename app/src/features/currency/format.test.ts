import { describe, expect, it } from "vitest";
import {
  formatCurrency,
  formatCurrencyCompact,
  getCurrencySymbol,
  parseCurrencyInput
} from "@/features/currency/format";

describe("formatCurrency", () => {
  it("rounds to whole units (no decimals)", () => {
    expect(formatCurrency(1234.56, "USD")).not.toContain(".");
    expect(formatCurrency(1234.49, "USD")).toContain("1,234");
    expect(formatCurrency(1234.5, "USD")).toContain("1,235");
  });

  it("uses the currency's own symbol", () => {
    expect(formatCurrency(1000, "USD")).toContain("$");
    expect(formatCurrency(1000, "EUR")).toContain("€");
    expect(formatCurrency(1000, "GBP")).toContain("£");
    expect(formatCurrency(1000, "JPY")).toContain("¥");
  });

  it("formats negative values with a leading minus", () => {
    expect(formatCurrency(-5_000, "USD").trim().startsWith("-")).toBe(true);
  });

  it("returns a zero-formatted value for non-finite input", () => {
    expect(formatCurrency(Number.NaN, "USD")).toBe(formatCurrency(0, "USD"));
    expect(formatCurrency(Number.POSITIVE_INFINITY, "EUR")).toBe(formatCurrency(0, "EUR"));
  });
});

describe("getCurrencySymbol", () => {
  it("returns the symbol for common currencies", () => {
    expect(getCurrencySymbol("USD")).toBe("$");
    expect(getCurrencySymbol("EUR")).toBe("€");
    expect(getCurrencySymbol("GBP")).toBe("£");
    expect(getCurrencySymbol("JPY")).toBe("¥");
  });

  it("caches the result (second call returns an equal string)", () => {
    const first = getCurrencySymbol("CHF");
    const second = getCurrencySymbol("CHF");
    expect(second).toBe(first);
  });
});

describe("formatCurrencyCompact", () => {
  it("formats billions with one decimal and B suffix", () => {
    expect(formatCurrencyCompact(1_500_000_000, "USD")).toBe("$1.5B");
    expect(formatCurrencyCompact(9_999_999_999, "USD")).toBe("$10.0B");
  });

  it("formats millions with one decimal and M suffix", () => {
    expect(formatCurrencyCompact(1_500_000, "USD")).toBe("$1.5M");
    expect(formatCurrencyCompact(999_999, "USD")).toBe("$1000K");
  });

  it("formats thousands with K suffix and no decimals", () => {
    expect(formatCurrencyCompact(1_500, "USD")).toBe("$2K");
    expect(formatCurrencyCompact(12_345, "USD")).toBe("$12K");
  });

  it("returns values under 1000 without a suffix", () => {
    expect(formatCurrencyCompact(999, "USD")).toBe("$999");
    expect(formatCurrencyCompact(0, "USD")).toBe("$0");
  });

  it("prefixes negative values with a minus sign", () => {
    expect(formatCurrencyCompact(-1_500_000, "EUR")).toBe("-€1.5M");
    expect(formatCurrencyCompact(-500, "USD")).toBe("-$500");
  });

  it("returns a zero-formatted value for non-finite input", () => {
    expect(formatCurrencyCompact(Number.NaN, "USD")).toBe("$0");
    expect(formatCurrencyCompact(Number.POSITIVE_INFINITY, "EUR")).toBe("€0");
  });
});

describe("parseCurrencyInput", () => {
  it("strips non-digit characters and returns a number", () => {
    expect(parseCurrencyInput("$1,234")).toBe(1234);
    expect(parseCurrencyInput("€12.345")).toBe(12345); // Euro-style separator treated as a digit delimiter
    expect(parseCurrencyInput("1 000 000")).toBe(1_000_000);
  });

  it("returns 0 for empty or digit-less input", () => {
    expect(parseCurrencyInput("")).toBe(0);
    expect(parseCurrencyInput("abc")).toBe(0);
    expect(parseCurrencyInput("$")).toBe(0);
  });

  it("preserves sign when the raw input starts with a minus", () => {
    expect(parseCurrencyInput("-$1,000")).toBe(-1000);
    expect(parseCurrencyInput("  -500")).toBe(-500);
  });

  it("ignores minus signs that do not lead the input", () => {
    expect(parseCurrencyInput("1-000")).toBe(1000);
    expect(parseCurrencyInput("$1,000-")).toBe(1000);
  });
});
