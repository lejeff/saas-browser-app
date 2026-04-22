import { act, render, renderHook, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { CurrencyProvider, useCurrency } from "./CurrencyContext";
import type { CurrencyCode } from "./types";

function wrapper({ children }: { children: React.ReactNode }) {
  return <CurrencyProvider>{children}</CurrencyProvider>;
}

describe("CurrencyProvider / useCurrency", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it("defaults to EUR when nothing is stored", () => {
    const { result } = renderHook(() => useCurrency(), { wrapper });
    expect(result.current.code).toBe<CurrencyCode>("EUR");
    expect(result.current.symbol).toBe("€");
  });

  it("hydrates from localStorage when a valid code is stored", () => {
    window.localStorage.setItem("app.currency.v1", "USD");
    const { result } = renderHook(() => useCurrency(), { wrapper });
    expect(result.current.code).toBe<CurrencyCode>("USD");
    expect(result.current.symbol).toBe("$");
  });

  it("ignores invalid stored values and stays on the default", () => {
    window.localStorage.setItem("app.currency.v1", "XYZ");
    const { result } = renderHook(() => useCurrency(), { wrapper });
    expect(result.current.code).toBe<CurrencyCode>("EUR");
  });

  it("persists a change to localStorage", () => {
    const { result } = renderHook(() => useCurrency(), { wrapper });
    act(() => result.current.setCode("GBP"));
    expect(result.current.code).toBe<CurrencyCode>("GBP");
    expect(window.localStorage.getItem("app.currency.v1")).toBe("GBP");
  });

  it("exposes format and formatCompact bound to the active code", () => {
    const { result } = renderHook(() => useCurrency(), { wrapper });
    act(() => result.current.setCode("USD"));
    expect(result.current.format(1_234)).toContain("$");
    expect(result.current.format(1_234)).toContain("1,234");
    expect(result.current.formatCompact(1_500_000)).toBe("$1.5M");
  });

  it("throws when useCurrency is used outside a provider", () => {
    function Probe() {
      useCurrency();
      return null;
    }
    expect(() => render(<Probe />)).toThrow(/CurrencyProvider/);
  });

  it("lets children read the active code via the hook", () => {
    function Probe() {
      const { code } = useCurrency();
      return <span data-testid="code">{code}</span>;
    }
    window.localStorage.setItem("app.currency.v1", "CHF");
    render(
      <CurrencyProvider>
        <Probe />
      </CurrencyProvider>
    );
    expect(screen.getByTestId("code").textContent).toBe("CHF");
  });
});
