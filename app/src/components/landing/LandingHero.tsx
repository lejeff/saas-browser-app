import Link from "next/link";

function ChartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function SparklesIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v1m0 16v1m8.66-15.66-.71.71M4.05 19.95l-.71.71M21 12h-1M4 12H3m16.66 7.66-.71-.71M4.05 4.05l-.71-.71" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  );
}

export function LandingHero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_1200px_600px_at_50%_-100px,rgba(0,198,184,0.18),transparent_70%),radial-gradient(ellipse_800px_400px_at_80%_100px,rgba(255,122,89,0.12),transparent_60%)]"
      />
      
      <div className="mx-auto max-w-6xl px-6 pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="text-center max-w-4xl mx-auto">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 rounded-full bg-[var(--teal)]/10 px-4 py-1.5 text-sm font-medium text-[var(--teal)]">
            <SparklesIcon />
            A calmer way to plan
          </div>

          {/* Main headline */}
          <h1 className="mt-8 font-display text-4xl leading-[1.1] tracking-tight text-[var(--navy)] sm:text-5xl md:text-6xl lg:text-7xl text-balance">
            Plan the retirement you{" "}
            <em className="italic text-[var(--navy-soft)]">actually</em>{" "}
            want.
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[var(--ink-soft)] md:text-xl">
            Drag a few sliders, watch your net worth projection change in real time. Your numbers
            stay on your device &mdash; no account, no tracking, no noise.
          </p>

          {/* CTA buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="btn-primary text-base px-8 py-3"
            >
              Start planning
              <span aria-hidden className="ml-2">&rarr;</span>
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 text-base font-medium text-[var(--ink-soft)] hover:text-[var(--navy)] transition-colors"
            >
              How it works
            </a>
          </div>

          {/* Trust indicators */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-[var(--ink-muted)]">
            <div className="flex items-center gap-2">
              <ShieldIcon />
              <span>Privacy-first design</span>
            </div>
            <div className="flex items-center gap-2">
              <ChartIcon />
              <span>Real-time projections</span>
            </div>
            <div className="flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>Plan in minutes</span>
            </div>
          </div>
        </div>

        {/* Hero visual - App preview */}
        <div className="mt-16 md:mt-20 relative">
          <div className="relative mx-auto max-w-5xl">
            {/* Browser chrome mockup */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl shadow-[var(--navy)]/10 overflow-hidden">
              {/* Browser bar */}
              <div className="flex items-center gap-2 px-4 py-3 bg-[var(--cream-deep)] border-b border-[var(--border)]">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[var(--coral)]" />
                  <div className="w-3 h-3 rounded-full bg-[var(--gold)]" />
                  <div className="w-3 h-3 rounded-full bg-[var(--teal)]" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="max-w-sm mx-auto h-6 rounded-md bg-[var(--surface)] border border-[var(--border)] flex items-center px-3">
                    <span className="text-xs text-[var(--ink-muted)]">financialplanner.app</span>
                  </div>
                </div>
              </div>
              
              {/* App preview content */}
              <div className="p-6 md:p-8 bg-[var(--cream)]">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Left side - Form preview */}
                  <div className="space-y-4">
                    <div className="card p-5">
                      <div className="eyebrow text-[var(--teal)]">Your Profile</div>
                      <div className="mt-4 space-y-3">
                        <div className="h-10 rounded-lg bg-[var(--cream)] border border-[var(--border)]" />
                        <div className="h-10 rounded-lg bg-[var(--cream)] border border-[var(--border)]" />
                        <div className="h-10 rounded-lg bg-[var(--cream)] border border-[var(--border)]" />
                      </div>
                    </div>
                    <div className="card p-5">
                      <div className="eyebrow text-[var(--coral)]">Savings</div>
                      <div className="mt-4 space-y-3">
                        <div className="h-10 rounded-lg bg-[var(--cream)] border border-[var(--border)]" />
                        <div className="h-10 rounded-lg bg-[var(--cream)] border border-[var(--border)]" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Right side - Chart preview */}
                  <div className="card p-5">
                    <div className="eyebrow">Net Worth Projection</div>
                    <div className="mt-4 h-48 flex items-end gap-2 px-2">
                      {[40, 55, 45, 65, 80, 70, 90, 95, 85, 100].map((height, i) => (
                        <div key={i} className="flex-1 flex flex-col gap-1">
                          <div 
                            className="rounded-t bg-[var(--teal)]" 
                            style={{ height: `${height * 0.6}%` }} 
                          />
                          <div 
                            className="rounded-b bg-[var(--coral)]/60" 
                            style={{ height: `${(100 - height) * 0.3}%` }} 
                          />
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex justify-between text-xs text-[var(--ink-muted)]">
                      <span>2026</span>
                      <span>2050</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[var(--teal)]/10 rounded-full blur-3xl" />
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-[var(--coral)]/10 rounded-full blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
