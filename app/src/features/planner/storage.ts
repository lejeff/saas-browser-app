import { DEFAULT_PLAN_INPUTS, type PlanInputs } from "@app/core";

const STORAGE_KEY = "planner.inputs.v1";

export function loadInputs(): PlanInputs {
  if (typeof window === "undefined") return DEFAULT_PLAN_INPUTS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PLAN_INPUTS;
    const parsed = JSON.parse(raw) as Partial<PlanInputs>;
    return { ...DEFAULT_PLAN_INPUTS, ...parsed };
  } catch {
    return DEFAULT_PLAN_INPUTS;
  }
}

export function saveInputs(inputs: PlanInputs): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(inputs));
  } catch {
    // Silently ignore storage errors (quota, private mode, etc.).
  }
}

export function clearInputs(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}
