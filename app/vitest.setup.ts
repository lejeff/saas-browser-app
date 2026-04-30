import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// jsdom doesn't ship `ResizeObserver`, but Radix UI's Slider primitive
// (used by `RangeSliderRow` for the New Debt loan-period range slider)
// constructs one in a layout effect on mount, which crashes any test
// that renders a New Debt card. Provide a minimal no-op stub.
if (typeof globalThis.ResizeObserver === "undefined") {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
}

// jsdom doesn't implement the PointerEvent capture APIs that Radix uses
// to track in-flight thumb drags. Stub them so userEvent / fireEvent
// click+drag interactions don't throw.
if (typeof Element.prototype.hasPointerCapture !== "function") {
  Element.prototype.hasPointerCapture = () => false;
}
if (typeof Element.prototype.setPointerCapture !== "function") {
  Element.prototype.setPointerCapture = () => undefined;
}
if (typeof Element.prototype.releasePointerCapture !== "function") {
  Element.prototype.releasePointerCapture = () => undefined;
}

afterEach(() => {
  cleanup();
});
