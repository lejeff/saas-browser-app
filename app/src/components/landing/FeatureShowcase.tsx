function ChartBarIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <rect width="48" height="48" rx="12" fill="var(--teal)" fillOpacity="0.1" />
      <path d="M14 34V22M24 34V14M34 34V26" stroke="var(--teal)" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <rect width="48" height="48" rx="12" fill="var(--coral)" fillOpacity="0.1" />
      <path d="M24 18c-6 0-11 4-13 6 2 2 7 6 13 6s11-4 13-6c-2-2-7-6-13-6z" stroke="var(--coral)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="24" cy="24" r="3" stroke="var(--coral)" strokeWidth="2.5" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <rect width="48" height="48" rx="12" fill="var(--navy)" fillOpacity="0.1" />
      <rect x="16" y="22" width="16" height="12" rx="2" stroke="var(--navy)" strokeWidth="2.5" />
      <path d="M20 22v-4a4 4 0 0 1 8 0v4" stroke="var(--navy)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function TrendingIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <rect width="48" height="48" rx="12" fill="var(--gold)" fillOpacity="0.1" />
      <path d="M14 30l8-8 4 4 8-10" stroke="var(--gold)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M28 16h6v6" stroke="var(--gold)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

interface FeatureBlockProps {
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  description: string;
  benefits: string[];
  reversed?: boolean;
  visual: React.ReactNode;
}

function FeatureBlock({ icon, eyebrow, title, description, benefits, reversed, visual }: FeatureBlockProps) {
  return (
    <div className={`grid md:grid-cols-2 gap-12 md:gap-16 items-center ${reversed ? "md:grid-flow-dense" : ""}`}>
      <div className={reversed ? "md:col-start-2" : ""}>
        <div className="mb-6">{icon}</div>
        <div className="eyebrow text-[var(--coral)]">{eyebrow}</div>
        <h2 className="mt-3 font-display text-3xl md:text-4xl text-[var(--navy)] leading-tight text-balance">
          {title}
        </h2>
        <p className="mt-4 text-base md:text-lg text-[var(--ink-soft)] leading-relaxed">
          {description}
        </p>
        <ul className="mt-6 space-y-3">
          {benefits.map((benefit, i) => (
            <li key={i} className="flex items-start gap-3 text-[var(--ink-soft)]">
              <svg className="w-5 h-5 mt-0.5 text-[var(--teal)] flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className={reversed ? "md:col-start-1" : ""}>
        {visual}
      </div>
    </div>
  );
}

function PlanWithNuanceVisual() {
  return (
    <div className="card p-6 md:p-8">
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 rounded-lg bg-[var(--cream)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--teal)]/20 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <div>
              <div className="font-medium text-[var(--navy)]">Financial Independence</div>
              <div className="text-sm text-[var(--ink-muted)]">Target: Age 55</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold text-[var(--teal)]">87%</div>
            <div className="text-xs text-[var(--ink-muted)]">Success rate</div>
          </div>
        </div>
        
        <div className="flex items-center justify-between p-4 rounded-lg bg-[var(--cream)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--coral)]/20 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--coral)" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              </svg>
            </div>
            <div>
              <div className="font-medium text-[var(--navy)]">Buy a Home</div>
              <div className="text-sm text-[var(--ink-muted)]">Target: 2028</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold text-[var(--coral)]">On track</div>
            <div className="text-xs text-[var(--ink-muted)]">$120k saved</div>
          </div>
        </div>
        
        <div className="flex items-center justify-between p-4 rounded-lg bg-[var(--cream)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--gold)]/20 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2">
                <circle cx="12" cy="8" r="5" />
                <path d="M20 21a8 8 0 1 0-16 0" />
              </svg>
            </div>
            <div>
              <div className="font-medium text-[var(--navy)]">Kids&apos; College</div>
              <div className="text-sm text-[var(--ink-muted)]">Target: 2040</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold text-[var(--gold)]">$45k</div>
            <div className="text-xs text-[var(--ink-muted)]">Projected need</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function VisualizeVisual() {
  // Donut gauge geometry
  const r = 72;
  const cx = 100;
  const cy = 100;
  const circumference = 2 * Math.PI * r;
  const successPct = 0.91;
  const arcLen = circumference * successPct;

  // Outcome distribution bars (P10 / P50 / P90 of net worth at age 65)
  const outcomes = [
    { label: "Worst case (P10)", value: "$890K", width: 38, tone: "muted" as const },
    { label: "Median (P50)", value: "$2.4M", width: 70, tone: "teal" as const },
    { label: "Best case (P90)", value: "$4.2M", width: 100, tone: "soft" as const }
  ];

  return (
    <div className="card p-6 md:p-8">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-y-2">
        <div className="eyebrow">Plan Confidence</div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--ink-muted)]">Monte Carlo · 10,000 runs</span>
          <span className="inline-flex items-center rounded-full bg-[var(--coral)]/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--coral)]">
            Preview
          </span>
        </div>
      </div>

      {/* Hero metric: radial gauge */}
      <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] items-center gap-6">
        <div className="mx-auto sm:mx-0 flex flex-col items-center">
          <div className="relative w-[200px] h-[200px]">
            <svg viewBox="0 0 200 200" className="w-full h-full" aria-hidden>
              {/* Track */}
              <circle
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke="var(--border)"
                strokeWidth="14"
              />
              {/* Foreground arc */}
              <circle
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke="var(--teal)"
                strokeWidth="14"
                strokeLinecap="round"
                strokeDasharray={`${arcLen} ${circumference - arcLen}`}
                strokeDashoffset={0}
                transform={`rotate(-90 ${cx} ${cy})`}
              />
            </svg>
            {/* Centered percentage only — label moves outside the gauge */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="font-display text-5xl font-semibold leading-none text-[var(--navy)]">
                91<span className="text-3xl text-[var(--ink-muted)]">%</span>
              </div>
            </div>
          </div>
          <div className="mt-3 text-xs font-semibold uppercase tracking-wide text-[var(--ink-muted)] text-center">
            Probability of success
          </div>
        </div>

        {/* Outcome distribution */}
        <div className="space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-muted)]">
            Net worth at age 65
          </div>
          {outcomes.map((o) => (
            <div key={o.label}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-[var(--ink-muted)]">{o.label}</span>
                <span className="font-semibold text-[var(--navy)] tabular-nums">{o.value}</span>
              </div>
              <div className="h-1.5 rounded-full bg-[var(--cream)] border border-[var(--border)] overflow-hidden">
                <div
                  className={
                    o.tone === "teal"
                      ? "h-full bg-[var(--teal)]"
                      : o.tone === "soft"
                        ? "h-full bg-[var(--teal)]/40"
                        : "h-full bg-[var(--ink-muted)]/30"
                  }
                  style={{ width: `${o.width}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Supporting metrics */}
      <div className="mt-6 grid grid-cols-3 gap-4 text-center border-t border-[var(--border)] pt-5">
        <div>
          <div className="text-xl font-semibold text-[var(--navy)]">Age 57</div>
          <div className="text-xs text-[var(--ink-muted)] mt-1">FI target</div>
        </div>
        <div>
          <div className="text-xl font-semibold text-[var(--teal)]">$2.4M</div>
          <div className="text-xs text-[var(--ink-muted)] mt-1">Median peak</div>
        </div>
        <div>
          <div className="text-xl font-semibold text-[var(--coral)]">3.4%</div>
          <div className="text-xs text-[var(--ink-muted)] mt-1">Safe withdrawal</div>
        </div>
      </div>
    </div>
  );
}

function SecurityVisual() {
  return (
    <div className="card p-6 md:p-8">
      <div className="flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-full bg-[var(--teal)]/10 flex items-center justify-center mb-6">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="2" strokeLinecap="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="M9 12l2 2 4-4" />
          </svg>
        </div>
        <h3 className="font-display text-xl text-[var(--navy)]">Your Data, Your Device</h3>
        <p className="mt-2 text-sm text-[var(--ink-soft)] max-w-sm">
          All your financial information stays in your browser. We never see, store, or transmit your data.
        </p>
        
        <div className="mt-8 w-full space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--cream)]">
            <div className="flex items-center gap-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span className="text-sm text-[var(--ink-soft)]">Browser localStorage</span>
            </div>
            <span className="text-xs font-medium text-[var(--teal)] bg-[var(--teal)]/10 px-2 py-1 rounded">Default</span>
          </div>
          
          <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--cream)]">
            <div className="flex items-center gap-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--ink-muted)" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <span className="text-sm text-[var(--ink-soft)]">Manual export/import</span>
            </div>
            <span className="text-xs font-medium text-[var(--ink-muted)] bg-[var(--cream-deep)] px-2 py-1 rounded">Optional</span>
          </div>
          
          <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--cream)]">
            <div className="flex items-center gap-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--ink-muted)" strokeWidth="2">
                <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
              </svg>
              <span className="text-sm text-[var(--ink-soft)]">Cloud sync (coming soon)</span>
            </div>
            <span className="text-xs font-medium text-[var(--ink-muted)] bg-[var(--cream-deep)] px-2 py-1 rounded">Soon</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProgressVisual() {
  return (
    <div className="card p-6 md:p-8">
      <div className="eyebrow mb-4">Your Progress</div>
      
      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-baseline mb-2">
            <span className="font-medium text-[var(--navy)]">Net Worth</span>
            <span className="text-sm text-[var(--teal)]">+12.4% YTD</span>
          </div>
          <div className="h-24 flex items-end gap-1">
            {[65, 62, 70, 68, 75, 72, 78, 82, 80, 85, 88, 92].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t bg-[var(--teal)] opacity-70 hover:opacity-100 transition-opacity"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          <div className="flex justify-between text-xs text-[var(--ink-muted)] mt-2">
            <span>Jan</span>
            <span>Dec</span>
          </div>
        </div>
        
        <div className="pt-4 border-t border-[var(--border)]">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-[var(--cream)]">
              <div className="text-xs text-[var(--ink-muted)]">Started with</div>
              <div className="text-lg font-semibold text-[var(--navy)] mt-1">$245,000</div>
            </div>
            <div className="p-3 rounded-lg bg-[var(--cream)]">
              <div className="text-xs text-[var(--ink-muted)]">Current value</div>
              <div className="text-lg font-semibold text-[var(--teal)] mt-1">$312,500</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FeatureShowcase() {
  return (
    <section id="how-it-works" className="py-20 md:py-32 bg-[var(--surface)]">
      <div className="mx-auto max-w-6xl px-6">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <div className="eyebrow text-[var(--teal)]">How it works</div>
          <h2 className="mt-4 font-display text-3xl md:text-5xl text-[var(--navy)] leading-tight text-balance">
            A smarter way to plan your financial future
          </h2>
          <p className="mt-4 text-lg text-[var(--ink-soft)]">
            Simple inputs, powerful insights. See exactly where you&apos;re headed.
          </p>
        </div>

        {/* Feature blocks */}
        <div className="space-y-20 md:space-y-32">
          <FeatureBlock
            icon={<ChartBarIcon />}
            eyebrow="Built around real life"
            title="Plan around the moments that move the needle"
            description="Most calculators hand you one number and call it a day. Drop in the windfalls, the years you go part-time, the property you might buy at forty — and watch each choice reshape the projection in front of you."
            benefits={[
              "Add the moments worth planning around",
              "Pick a target age, a number, or both",
              "See how each tweak ripples through the chart",
              "Trade vague money worry for a concrete plan"
            ]}
            visual={<PlanWithNuanceVisual />}
          />

          <FeatureBlock
            icon={<EyeIcon />}
            eyebrow="See the whole arc"
            title="See the full picture"
            description="One chart shows the entire run — today's balance, tomorrow's spending, the year your salary stops. Adjust an input and the projection updates in place, so trade-offs feel concrete instead of theoretical."
            benefits={[
              "Hover any year to see what's driving the bar",
              "Watch cash flow shift as life events land",
              "Plan for what you leave behind",
              "Test scenarios before you commit to them"
            ]}
            visual={<VisualizeVisual />}
            reversed
          />

          <FeatureBlock
            icon={<LockIcon />}
            eyebrow="Privacy first"
            title="Your data stays yours"
            description="We don't connect to your bank, your brokerage, or anything else. Every number you type stays in your browser, and you decide what happens to it."
            benefits={[
              "No account required to get started",
              "Data stored locally in your browser",
              "Optional export/import to files",
              "Zero tracking or data collection"
            ]}
            visual={<SecurityVisual />}
          />

          <FeatureBlock
            icon={<TrendingIcon />}
            eyebrow="Track progress"
            title="Watch your wealth grow"
            description="Plug in your real numbers as the years pass and see how the actual path lines up with the projection you started from."
            benefits={[
              "Track net worth year over year",
              "Compare actual vs projected growth",
              "Spot trends early",
              "Stay grounded as the picture sharpens"
            ]}
            visual={<ProgressVisual />}
            reversed
          />
        </div>
      </div>
    </section>
  );
}
