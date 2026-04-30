const features = [
  { icon: "chart", label: "Net worth projections", color: "teal" },
  { icon: "dollar", label: "Year-by-year cash flow", color: "coral" },
  { icon: "refresh", label: "Inflation-adjusted view", color: "navy" },
  { icon: "percent", label: "Portfolio growth rates", color: "coral" },
  { icon: "globe", label: "Multiple currencies", color: "gold" },
  { icon: "home", label: "Stackable real estate", color: "teal" },
  { icon: "building", label: "Rental income per property", color: "coral" },
  { icon: "percent", label: "Real estate appreciation rates", color: "gold" },
  { icon: "trending", label: "Future windfalls", color: "navy" },
  { icon: "calculator", label: "Custom debt schedules", color: "gold" },
  { icon: "bell", label: "Liquidity warnings", color: "coral" },
  { icon: "target", label: "Pick your projection horizon", color: "teal" },
  { icon: "clock", label: "Live updates as you type", color: "coral" },
  { icon: "lock", label: "Saved locally, no account", color: "navy" },
  { icon: "download", label: "Export your plan to file", color: "gold" },
];

function FeatureIcon({ icon, color }: { icon: string; color: string }) {
  const colorVar = `var(--${color})`;
  
  const icons: Record<string, React.ReactNode> = {
    chart: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colorVar} strokeWidth="2" strokeLinecap="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
    home: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colorVar} strokeWidth="2" strokeLinecap="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    lock: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colorVar} strokeWidth="2" strokeLinecap="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0110 0v4" />
      </svg>
    ),
    trending: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colorVar} strokeWidth="2" strokeLinecap="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    ),
    building: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colorVar} strokeWidth="2" strokeLinecap="round">
        <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
        <path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01" />
      </svg>
    ),
    calculator: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colorVar} strokeWidth="2" strokeLinecap="round">
        <rect x="4" y="2" width="16" height="20" rx="2" />
        <line x1="8" y1="6" x2="16" y2="6" />
        <line x1="8" y1="10" x2="8" y2="10.01" />
        <line x1="12" y1="10" x2="12" y2="10.01" />
        <line x1="16" y1="10" x2="16" y2="10.01" />
        <line x1="8" y1="14" x2="8" y2="14.01" />
        <line x1="12" y1="14" x2="12" y2="14.01" />
        <line x1="16" y1="14" x2="16" y2="14.01" />
        <line x1="8" y1="18" x2="8" y2="18.01" />
        <line x1="12" y1="18" x2="12" y2="18.01" />
        <line x1="16" y1="18" x2="16" y2="18.01" />
      </svg>
    ),
    dollar: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colorVar} strokeWidth="2" strokeLinecap="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
      </svg>
    ),
    globe: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colorVar} strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
      </svg>
    ),
    target: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colorVar} strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    ),
    clock: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colorVar} strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    refresh: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colorVar} strokeWidth="2" strokeLinecap="round">
        <polyline points="23 4 23 10 17 10" />
        <polyline points="1 20 1 14 7 14" />
        <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
      </svg>
    ),
    download: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colorVar} strokeWidth="2" strokeLinecap="round">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    ),
    percent: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colorVar} strokeWidth="2" strokeLinecap="round">
        <line x1="19" y1="5" x2="5" y2="19" />
        <circle cx="6.5" cy="6.5" r="2.5" />
        <circle cx="17.5" cy="17.5" r="2.5" />
      </svg>
    ),
    bell: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colorVar} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 01-3.46 0" />
      </svg>
    ),
  };

  return icons[icon] || null;
}

export function FeatureGrid() {
  return (
    <section id="features" className="py-20 md:py-32 bg-[var(--cream)]">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <div className="eyebrow text-[var(--teal)]">Everything you need</div>
          <h2 className="mt-4 font-display text-3xl md:text-5xl text-[var(--navy)] leading-tight text-balance">
            Powerful features, simple interface
          </h2>
          <p className="mt-4 text-lg text-[var(--ink-soft)]">
            All the tools you need to plan your financial future with confidence.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group flex items-center gap-3 p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--border-strong)] hover:shadow-md transition-all duration-200"
            >
              <div className="flex-shrink-0">
                <FeatureIcon icon={feature.icon} color={feature.color} />
              </div>
              <span className="text-sm font-medium text-[var(--ink-soft)] group-hover:text-[var(--navy)] transition-colors">
                {feature.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
