import { DEFAULT_PLAN_INPUTS, type PlanInputs } from "./types";

const STORAGE_KEY = "planner.inputs.v1";

export function loadInputs(): PlanInputs {
  if (typeof window === "undefined") return DEFAULT_PLAN_INPUTS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    // #region agent log
    fetch('http://127.0.0.1:7890/ingest/d83f7f4d-0780-4545-a450-bd3bcf173759',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'d4606a'},body:JSON.stringify({sessionId:'d4606a',hypothesisId:'B',location:'storage.ts:loadInputs',message:'raw localStorage payload',data:{hasRaw:Boolean(raw),raw},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    if (!raw) return DEFAULT_PLAN_INPUTS;
    const parsed = JSON.parse(raw) as Partial<PlanInputs>;
    const merged = { ...DEFAULT_PLAN_INPUTS, ...parsed };
    // #region agent log
    fetch('http://127.0.0.1:7890/ingest/d83f7f4d-0780-4545-a450-bd3bcf173759',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'d4606a'},body:JSON.stringify({sessionId:'d4606a',hypothesisId:'B',location:'storage.ts:loadInputs',message:'merged payload',data:{parsed,merged},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    return merged;
  } catch (err) {
    // #region agent log
    fetch('http://127.0.0.1:7890/ingest/d83f7f4d-0780-4545-a450-bd3bcf173759',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'d4606a'},body:JSON.stringify({sessionId:'d4606a',hypothesisId:'B',location:'storage.ts:loadInputs',message:'loadInputs threw',data:{error:String(err)},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
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
