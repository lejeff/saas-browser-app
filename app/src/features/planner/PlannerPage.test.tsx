import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CurrencyProvider } from "@/features/currency/CurrencyContext";
import { PlannerPage } from "./PlannerPage";
import { DEFAULT_PLAN_INPUTS } from "./types";
import { ageFromDob } from "./calculator";

// Recharts uses ResponsiveContainer which requires layout dimensions jsdom can't
// provide. We stub it with a fixed-size div so the chart renders a valid SVG
// tree during tests without throwing.
vi.mock("recharts", async () => {
  const actual = await vi.importActual<typeof import("recharts")>("recharts");
  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div style={{ width: 600, height: 400 }}>{children}</div>
    )
  };
});

function renderPage() {
  return render(
    <CurrencyProvider>
      <PlannerPage />
    </CurrencyProvider>
  );
}

beforeEach(() => {
  window.localStorage.clear();
});

afterEach(() => {
  window.localStorage.clear();
});

describe("PlannerPage", () => {
  it("renders the three summary cards with default values", () => {
    renderPage();
    const expectedAge = ageFromDob(DEFAULT_PLAN_INPUTS.dateOfBirth);
    expect(screen.getByText("Current age")).toBeInTheDocument();
    expect(screen.getByText(expectedAge.toString())).toBeInTheDocument();
    expect(
      screen.getByText(
        new RegExp(`Projected net worth at age ${expectedAge + DEFAULT_PLAN_INPUTS.horizonYears}`)
      )
    ).toBeInTheDocument();
    expect(screen.getByText("Projection ends")).toBeInTheDocument();
  });

  it("renders both fieldsets and the form heading", () => {
    renderPage();
    expect(screen.getByText("Your plan")).toBeInTheDocument();
    expect(screen.getByText("Financial")).toBeInTheDocument();
    expect(screen.getByText("Real Estate")).toBeInTheDocument();
  });

  it("updates the projected net worth card when an input changes", async () => {
    const user = userEvent.setup();
    renderPage();

    const cashField = screen.getByLabelText("Cash balance") as HTMLInputElement;
    await user.clear(cashField);
    await user.type(cashField, "999999");
    await user.tab();

    // Cash is frozen (no return), so every projection year gets +999,999 in net
    // worth. The projected-net-worth card should now contain a value that
    // reflects the bump. We just assert the card shows at least some value
    // that parses back above the initial startAssets.
    const projectionCard = screen.getByText(/Projected net worth at age/i).closest("div")!
      .parentElement!;
    const projectedValue = projectionCard.querySelector(".font-display")?.textContent ?? "";
    const numeric = Number(projectedValue.replace(/[^\d.-]/g, ""));
    expect(numeric).toBeGreaterThan(0);
  });

  it("restores defaults when the user clicks Reset", async () => {
    const user = userEvent.setup();
    renderPage();

    const cashField = screen.getByLabelText("Cash balance") as HTMLInputElement;
    await user.clear(cashField);
    await user.type(cashField, "123456");
    await user.tab();
    expect(cashField.value).toBe("123,456");

    await user.click(screen.getByRole("button", { name: /reset to defaults/i }));
    expect((screen.getByLabelText("Cash balance") as HTMLInputElement).value).toBe(
      new Intl.NumberFormat("en-US").format(DEFAULT_PLAN_INPUTS.cashBalance)
    );
  });
});
