import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CurrencyField } from "./CurrencyField";
import { CurrencyProvider } from "@/features/currency/CurrencyContext";

function ControlledHost({
  initial,
  min,
  max,
  onChange
}: {
  initial: number;
  min?: number;
  max?: number;
  onChange?: (next: number) => void;
}) {
  const [value, setValue] = useState(initial);
  return (
    <CurrencyProvider>
      <CurrencyField
        label="Test field"
        value={value}
        min={min}
        max={max}
        onChange={(next) => {
          setValue(next);
          onChange?.(next);
        }}
      />
    </CurrencyProvider>
  );
}

beforeEach(() => {
  window.localStorage.clear();
});

afterEach(() => {
  window.localStorage.clear();
});

describe("CurrencyField", () => {
  it("renders the current value with thousand separators on mount", () => {
    render(<ControlledHost initial={1_234_567} />);
    const input = screen.getByLabelText("Test field") as HTMLInputElement;
    expect(input.value).toBe("1,234,567");
  });

  it("shows the currency symbol from the active context", () => {
    render(<ControlledHost initial={0} />);
    expect(screen.getByText("€")).toBeInTheDocument();
  });

  it("reformats typed input with thousand separators", async () => {
    const user = userEvent.setup();
    render(<ControlledHost initial={0} />);
    const input = screen.getByLabelText("Test field") as HTMLInputElement;
    await user.clear(input);
    await user.type(input, "50000");
    expect(input.value).toBe("50,000");
  });

  it("calls onChange with the parsed number while typing", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ControlledHost initial={0} onChange={onChange} />);
    const input = screen.getByLabelText("Test field");
    await user.clear(input);
    await user.type(input, "1234");
    expect(onChange).toHaveBeenLastCalledWith(1234);
  });

  it("clamps to max on blur", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ControlledHost initial={0} max={10_000} onChange={onChange} />);
    const input = screen.getByLabelText("Test field") as HTMLInputElement;
    await user.clear(input);
    await user.type(input, "99999");
    await user.tab();
    expect(input.value).toBe("10,000");
    expect(onChange).toHaveBeenLastCalledWith(10_000);
  });

  it("clamps to min on blur (defaulting to 0)", async () => {
    const user = userEvent.setup();
    render(<ControlledHost initial={500} />);
    const input = screen.getByLabelText("Test field") as HTMLInputElement;
    await user.clear(input);
    await user.tab();
    expect(input.value).toBe("0");
  });

  it("commits on Enter by blurring the input", async () => {
    const user = userEvent.setup();
    render(<ControlledHost initial={0} max={1_000} />);
    const input = screen.getByLabelText("Test field") as HTMLInputElement;
    await user.clear(input);
    await user.type(input, "2500");
    // While focused, value stays raw (2,500); Enter triggers blur → clamp to 1,000
    await user.type(input, "{Enter}");
    expect(input.value).toBe("1,000");
  });

  it("syncs the displayed value when the parent prop changes and the field is not focused", () => {
    const { rerender } = render(
      <CurrencyProvider>
        <CurrencyField
          label="Test field"
          value={100}
          onChange={() => {
            /* noop */
          }}
        />
      </CurrencyProvider>
    );
    expect((screen.getByLabelText("Test field") as HTMLInputElement).value).toBe("100");
    rerender(
      <CurrencyProvider>
        <CurrencyField
          label="Test field"
          value={9_999}
          onChange={() => {
            /* noop */
          }}
        />
      </CurrencyProvider>
    );
    expect((screen.getByLabelText("Test field") as HTMLInputElement).value).toBe("9,999");
  });
});
