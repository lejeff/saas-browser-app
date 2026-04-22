import Link from "next/link";
import { CurrencySelector } from "@/features/currency/CurrencySelector";

function LogoMark() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="32" height="32" rx="8" fill="var(--navy)" />
      <path
        d="M8 22V10h4.5a4 4 0 0 1 2.8 6.86A4.2 4.2 0 0 1 13 22H8Zm3-7h1.5a1.5 1.5 0 0 0 0-3H11v3Zm0 4h2a1.5 1.5 0 0 0 0-3h-2v3Z"
        fill="var(--teal)"
      />
      <circle cx="23" cy="22" r="2" fill="var(--coral)" />
    </svg>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--cream)]/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <LogoMark />
          <span className="font-display text-lg font-medium text-[var(--navy)]">
            Retirement Planner
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-[var(--ink-soft)] md:flex">
          <a href="#planner" className="transition-colors hover:text-[var(--navy)]">
            Planner
          </a>
          <a href="#how" className="transition-colors hover:text-[var(--navy)]">
            How it works
          </a>
          <a href="#about" className="transition-colors hover:text-[var(--navy)]">
            About
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <CurrencySelector className="hidden sm:inline-flex" />
          <a href="#planner" className="btn-primary">
            Start planning
          </a>
        </div>
      </div>
    </header>
  );
}
