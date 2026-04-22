export function PlannerHero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1200px_500px_at_50%_-10%,rgba(0,198,184,0.14),transparent_60%),radial-gradient(800px_400px_at_85%_10%,rgba(255,122,89,0.10),transparent_60%)]"
      />
      <div className="mx-auto max-w-6xl px-6 pt-16 pb-12 md:pt-24 md:pb-16">
        <div className="max-w-3xl">
          <div className="eyebrow">A calmer way to plan</div>
          <h1 className="mt-4 font-display text-4xl leading-[1.05] text-[var(--navy)] md:text-6xl">
            Plan the retirement you <em className="italic text-[var(--navy-soft)]">actually</em>{" "}
            want.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--ink-soft)] md:text-lg">
            Drag a few sliders, watch your net worth projection change in real time. Your numbers
            stay on your device &mdash; no account, no tracking, no noise.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a href="#planner" className="btn-primary">
              Start planning
              <span aria-hidden>&rarr;</span>
            </a>
            <a
              href="#how"
              className="text-sm font-medium text-[var(--ink-soft)] underline-offset-4 hover:text-[var(--navy)] hover:underline"
            >
              How it works
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
