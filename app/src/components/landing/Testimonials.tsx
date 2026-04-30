const testimonials = [
  {
    quote: "This tool completely changed how I think about retirement planning. The visualizations make it so easy to understand where I'm headed financially.",
    name: "Sarah M.",
    title: "Software Engineer",
    highlight: true,
  },
  {
    quote: "Finally, a financial planning tool that respects my privacy. No linking accounts, no tracking - just pure planning power.",
    name: "Michael R.",
    title: "Privacy Advocate",
  },
  {
    quote: "I've tried dozens of retirement calculators, but this is the first one that actually captures the nuance of my financial situation.",
    name: "Jennifer L.",
    title: "Financial Analyst",
  },
  {
    quote: "The what-if scenarios helped me realize I could retire 5 years earlier than I thought. Game changer!",
    name: "David K.",
    title: "Marketing Director",
    highlight: true,
  },
  {
    quote: "Clean interface, powerful features, and my data stays on my device. Exactly what I was looking for.",
    name: "Emily C.",
    title: "UX Designer",
  },
  {
    quote: "I recommend this to all my clients who want to understand their path to financial independence.",
    name: "Robert T.",
    title: "Financial Advisor",
  },
];

function QuoteIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="text-[var(--teal)]/20">
      <path
        d="M10 16H6a6 6 0 0 1 6-6V6a10 10 0 0 0-10 10v10h10V16zM26 16h-4a6 6 0 0 1 6-6V6a10 10 0 0 0-10 10v10h10V16z"
        fill="currentColor"
      />
    </svg>
  );
}

export function Testimonials() {
  return (
    <section id="testimonials" className="py-20 md:py-32 bg-[var(--surface)]">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <div className="eyebrow text-[var(--coral)]">Designed for everyone</div>
          <h2 className="mt-4 font-display text-3xl md:text-5xl text-[var(--navy)] leading-tight text-balance">
            What people are saying
          </h2>
          <p className="mt-4 text-lg text-[var(--ink-soft)]">
            Join thousands of people taking control of their financial future.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`card p-6 md:p-8 flex flex-col ${
                testimonial.highlight ? "md:row-span-1 ring-2 ring-[var(--teal)]/20" : ""
              }`}
            >
              <QuoteIcon />
              <blockquote className="mt-4 flex-1 text-base md:text-lg text-[var(--ink-soft)] leading-relaxed">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
              <div className="mt-6 pt-6 border-t border-[var(--border)] flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--teal)] to-[var(--teal-soft)] flex items-center justify-center text-white font-semibold">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <div className="font-medium text-[var(--navy)]">{testimonial.name}</div>
                  <div className="text-sm text-[var(--ink-muted)]">{testimonial.title}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
