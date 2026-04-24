export {
  DEFAULT_PLAN_INPUTS,
  MAX_APPRECIATION,
  MAX_HORIZON_YEARS,
  MIN_APPRECIATION,
  MIN_HORIZON_YEARS,
  PlanInputsSchema
} from "./planInputs";
export type { PlanInputs, ProjectionPoint } from "./planInputs";
export { ageFromDob, clampHorizon, deflateToToday, projectNetWorth } from "./projection";
