import { useState } from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PlannerForm } from "./PlannerForm";
import { DEFAULT_PLAN_INPUTS, type PlanInputs } from "./types";
import { CurrencyProvider } from "@/features/currency/CurrencyContext";

function Host({ onReset = vi.fn() }: { onReset?: () => void } = {}) {
  const [value, setValue] = useState<PlanInputs>(DEFAULT_PLAN_INPUTS);
  return (
    <CurrencyProvider>
      <PlannerForm value={value} onChange={setValue} onReset={onReset} />
    </CurrencyProvider>
  );
}

beforeEach(() => {
  window.localStorage.clear();
});

afterEach(() => {
  window.localStorage.clear();
});

describe("PlannerForm layout", () => {
  it("renders Financial and Real Estate category headings", () => {
    render(<Host />);
    expect(screen.getByText("Financial")).toBeInTheDocument();
    expect(screen.getByText("Real Estate")).toBeInTheDocument();
  });

  it("renders every Financial currency field", () => {
    render(<Host />);
    const financial = screen.getByText("Financial").closest("fieldset")!;
    expect(within(financial).getByLabelText("Starting financial assets")).toBeInTheDocument();
    expect(within(financial).getByLabelText("Cash balance")).toBeInTheDocument();
    expect(
      within(financial).getByLabelText("Non-liquid investments / Private equity")
    ).toBeInTheDocument();
    expect(within(financial).getByLabelText("Other fixed assets")).toBeInTheDocument();
    expect(within(financial).getByLabelText("Starting total debt")).toBeInTheDocument();
    expect(within(financial).getByLabelText("Monthly spending")).toBeInTheDocument();
    expect(within(financial).getByLabelText("Annual non-rental income")).toBeInTheDocument();
  });

  it("renders every Real Estate currency field and both appreciation sliders", () => {
    render(<Host />);
    const realEstate = screen.getByText("Real Estate").closest("fieldset")!;
    expect(within(realEstate).getByLabelText("Primary residence value")).toBeInTheDocument();
    expect(within(realEstate).getByLabelText("Other property value")).toBeInTheDocument();
    expect(within(realEstate).getByText("Primary residence appreciation")).toBeInTheDocument();
    expect(within(realEstate).getByText("Other property appreciation")).toBeInTheDocument();
  });

  it("keeps the Projection horizon slider outside the two categories", () => {
    render(<Host />);
    const horizonLabel = screen.getByText("Projection horizon");
    expect(horizonLabel.closest("fieldset")).toBeNull();
  });

  it("no longer renders the Name field on the planner page", () => {
    render(<Host />);
    expect(screen.queryByLabelText("Name")).toBeNull();
  });

  it("updates the Cash balance field when the user types", async () => {
    const user = userEvent.setup();
    render(<Host />);
    const field = screen.getByLabelText("Cash balance") as HTMLInputElement;
    await user.clear(field);
    await user.type(field, "75000");
    expect(field.value).toBe("75,000");
  });

  it("invokes onReset when the reset button is clicked", async () => {
    const user = userEvent.setup();
    const onReset = vi.fn();
    render(<Host onReset={onReset} />);
    await user.click(screen.getByRole("button", { name: /reset to defaults/i }));
    expect(onReset).toHaveBeenCalledTimes(1);
  });
});
