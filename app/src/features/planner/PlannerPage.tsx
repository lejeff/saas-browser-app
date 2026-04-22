"use client";

import { useEffect, useMemo, useState } from "react";
import { PlannerForm } from "./PlannerForm";
import { ProjectionChart } from "./ProjectionChart";
import { ageFromDob, projectNetWorth } from "./calculator";
import { loadInputs, saveInputs } from "./storage";
import { DEFAULT_PLAN_INPUTS, type PlanInputs } from "./types";

export function PlannerPage() {
  const [inputs, setInputs] = useState<PlanInputs>(DEFAULT_PLAN_INPUTS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // #region agent log
    const onErr = (e: ErrorEvent) => {
      fetch('http://127.0.0.1:7890/ingest/d83f7f4d-0780-4545-a450-bd3bcf173759',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'d4606a'},body:JSON.stringify({sessionId:'d4606a',hypothesisId:'A/E',location:'window.onerror',message:'window error event',data:{message:e.message,filename:e.filename,lineno:e.lineno,colno:e.colno,stack:e.error?.stack},timestamp:Date.now()})}).catch(()=>{});
    };
    const onRej = (e: PromiseRejectionEvent) => {
      fetch('http://127.0.0.1:7890/ingest/d83f7f4d-0780-4545-a450-bd3bcf173759',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'d4606a'},body:JSON.stringify({sessionId:'d4606a',hypothesisId:'A/E',location:'window.unhandledrejection',message:'unhandled rejection',data:{reason:String(e.reason)},timestamp:Date.now()})}).catch(()=>{});
    };
    window.addEventListener("error", onErr);
    window.addEventListener("unhandledrejection", onRej);
    // #endregion
    const loaded = loadInputs();
    // #region agent log
    fetch('http://127.0.0.1:7890/ingest/d83f7f4d-0780-4545-a450-bd3bcf173759',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'d4606a'},body:JSON.stringify({sessionId:'d4606a',hypothesisId:'A/B',location:'PlannerPage.tsx:hydrate',message:'loadInputs hydration',data:{loaded,rawKeys:Object.keys(loaded)},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    setInputs(loaded);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveInputs(inputs);
  }, [inputs, hydrated]);

  const projection = useMemo(() => projectNetWorth(inputs), [inputs]);
  const finalPoint = projection.at(-1);
  const currentAge = ageFromDob(inputs.dateOfBirth);
  const endAge = finalPoint?.age ?? currentAge;
  const endYear = finalPoint?.year ?? new Date().getFullYear();

  // #region agent log
  if (typeof window !== "undefined") {
    fetch('http://127.0.0.1:7890/ingest/d83f7f4d-0780-4545-a450-bd3bcf173759',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'d4606a'},body:JSON.stringify({sessionId:'d4606a',hypothesisId:'A/C/D/E',location:'PlannerPage.tsx:render',message:'render snapshot',data:{hydrated,inputs,projectionLength:projection.length,firstPoint:projection[0],finalPoint,currentAge,endAge,endYear},timestamp:Date.now()})}).catch(()=>{});
  }
  // #endregion

  const greeting = inputs.name ? `Welcome, ${inputs.name}` : "Welcome";
  const finalNetWorthLabel = finalPoint
    ? finalPoint.netWorth.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0
      })
    : "—";

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold text-teal-800">{greeting}</h1>
        <p className="mt-1 text-sm text-gray-600">
          Interactive retirement projection. Inputs save locally in your browser.
        </p>
      </header>

      <section className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded border border-gray-200 p-4">
          <div className="text-xs uppercase tracking-wide text-gray-500">Current age</div>
          <div className="mt-1 text-2xl font-semibold">{currentAge}</div>
        </div>
        <div className="rounded border border-gray-200 p-4">
          <div className="text-xs uppercase tracking-wide text-gray-500">
            Projected net worth at age {endAge}
          </div>
          <div className="mt-1 text-2xl font-semibold">{finalNetWorthLabel}</div>
        </div>
        <div className="rounded border border-gray-200 p-4">
          <div className="text-xs uppercase tracking-wide text-gray-500">Projection ends at</div>
          <div className="mt-1 text-2xl font-semibold">
            Age {endAge} <span className="text-gray-500">in {endYear}</span>
          </div>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[minmax(0,380px)_1fr]">
        <div className="rounded border border-gray-200 p-5">
          <PlannerForm
            value={inputs}
            onChange={setInputs}
            onReset={() => setInputs(DEFAULT_PLAN_INPUTS)}
          />
        </div>
        <div className="rounded border border-gray-200 p-5">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Projected net worth
          </h2>
          <ProjectionChart data={projection} />
        </div>
      </section>
    </main>
  );
}
