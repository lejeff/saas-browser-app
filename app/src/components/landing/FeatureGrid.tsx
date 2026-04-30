const features = [
  { icon: "chart", label: "Net worth projections", color: "teal" },
  { icon: "fire", label: "Calculate FIRE date", color: "coral" },
  { icon: "home", label: "Plan for buying a home", color: "navy" },
  { icon: "briefcase", label: "Model going part-time", color: "gold" },
  { icon: "plane", label: "Take time off for travel", color: "teal" },
  { icon: "lock", label: "No account required", color: "coral" },
  { icon: "trending", label: "Investment scenarios", color: "navy" },
  { icon: "building", label: "Model rental income", color: "gold" },
  { icon: "calculator", label: "More than a calculator", color: "teal" },
  { icon: "dollar", label: "Cash-flow visualization", color: "coral" },
  { icon: "scissors", label: "Tax planning insights", color: "navy" },
  { icon: "shield", label: "Privacy-friendly", color: "gold" },
  { icon: "heart", label: "Free to get started", color: "teal" },
  { icon: "globe", label: "Multiple currencies", color: "coral" },
  { icon: "users", label: "Plan as a couple", color: "navy" },
  { icon: "target", label: "Goal tracking", color: "gold" },
  { icon: "clock", label: "Time to FI calculator", color: "teal" },
  { icon: "chart-bar", label: "Asset allocation", color: "coral" },
  { icon: "refresh", label: "What-if scenarios", color: "navy" },
  { icon: "download", label: "Export your data", color: "gold" },
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
    fire: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colorVar} strokeWidth="2" strokeLinecap="round">
        <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z" />
      </svg>
    ),
    home: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colorVar} strokeWidth="2" strokeLinecap="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    briefcase: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colorVar} strokeWidth="2" strokeLinecap="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
      </svg>
    ),
    plane: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colorVar} strokeWidth="2" strokeLinecap="round">
        <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
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
    scissors: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colorVar} strokeWidth="2" strokeLinecap="round">
        <circle cx="6" cy="6" r="3" />
        <circle cx="6" cy="18" r="3" />
        <line x1="20" y1="4" x2="8.12" y2="15.88" />
        <line x1="14.47" y1="14.48" x2="20" y2="20" />
        <line x1="8.12" y1="8.12" x2="12" y2="12" />
      </svg>
    ),
    shield: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colorVar} strokeWidth="2" strokeLinecap="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    heart: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colorVar} strokeWidth="2" strokeLinecap="round">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
      </svg>
    ),
    globe: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colorVar} strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
      </svg>
    ),
    users: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colorVar} strokeWidth="2" strokeLinecap="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
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
    "chart-bar": (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colorVar} strokeWidth="2" strokeLinecap="round">
        <line x1="12" y1="20" x2="12" y2="10" />
        <line x1="18" y1="20" x2="18" y2="4" />
        <line x1="6" y1="20" x2="6" y2="16" />
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
