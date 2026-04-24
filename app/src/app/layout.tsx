import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { PostHogProvider } from "@/components/PostHogProvider";
import { CurrencyProvider } from "@/features/currency/CurrencyContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap"
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  axes: ["opsz"]
});

export const metadata: Metadata = {
  title: "Financial Planner",
  description:
    "Plan the future you actually want. Interactive projections with your numbers, saved locally in your browser."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="min-h-screen flex flex-col">
        <PostHogProvider>
          <CurrencyProvider>
            <SiteHeader />
            <div className="flex-1">{children}</div>
            <SiteFooter />
          </CurrencyProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
