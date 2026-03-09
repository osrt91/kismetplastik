"use client";

import Link from "@/components/ui/LocaleLink";
import { Button } from "@/components/ui/button";
import { ArrowRight, LogIn, Box } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";

export default function Hero() {
  const { dict } = useLocale();
  const h = dict.home;

  return (
    <section className="relative overflow-hidden bg-[var(--primary-900)] dark:bg-[#0A1628]">
      {/* Simplified navy gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, var(--primary-900) 0%, var(--primary-700) 50%, #0A1628 100%)`,
        }}
      />

      {/* Subtle dot pattern */}
      <div className="absolute inset-0 opacity-[0.04]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.6) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-6 sm:py-24 md:py-28 lg:px-8 lg:py-32">
        <div className="grid items-center gap-10 lg:grid-cols-[3fr_2fr] lg:gap-16">
          {/* Left Content — 60% */}
          <div>
            {/* Badge */}
            <div
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-body text-white/80 backdrop-blur-sm opacity-0"
              style={{ animation: "hero-fade-up 800ms cubic-bezier(0.16, 1, 0.3, 1) forwards" }}
            >
              <span className="h-2 w-2 animate-pulse rounded-full bg-accent-500" />
              {h.badge}
            </div>

            {/* Main heading */}
            <h1
              className="font-display mb-6 text-3xl font-bold leading-[1.1] tracking-tight text-white sm:text-4xl md:text-5xl lg:text-[3.5rem] opacity-0"
              style={{ animation: "hero-fade-up 800ms cubic-bezier(0.16, 1, 0.3, 1) 150ms forwards" }}
            >
              {h.heroHeading}
            </h1>

            {/* Subtitle */}
            <p
              className="font-body mb-10 max-w-xl text-base leading-relaxed text-white/65 sm:text-lg opacity-0"
              style={{ animation: "hero-fade-up 800ms cubic-bezier(0.16, 1, 0.3, 1) 300ms forwards" }}
            >
              {h.heroSubtext}
            </p>

            {/* CTA Buttons */}
            <div
              className="flex flex-col gap-3 sm:flex-row sm:gap-4 opacity-0"
              style={{ animation: "hero-fade-up 800ms cubic-bezier(0.16, 1, 0.3, 1) 450ms forwards" }}
            >
              <Button
                size="lg"
                className="group rounded-xl bg-accent text-accent-foreground px-7 py-3.5 font-body font-semibold transition-all duration-300 hover:bg-accent/90 hover:scale-[1.02] hover:shadow-[0_0_24px_rgba(245,158,11,0.35),0_0_48px_rgba(245,158,11,0.12)]"
                asChild
              >
                <Link href="/urunler">
                  {h.ctaProducts}
                  <ArrowRight
                    size={18}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-xl border-2 border-white/20 px-7 py-3.5 font-body text-white backdrop-blur-sm transition-all duration-300 hover:border-white/40 hover:bg-white/10 hover:scale-[1.02]"
                asChild
              >
                <Link href="/bayi-girisi">
                  <LogIn size={16} />
                  {h.ctaDealer}
                </Link>
              </Button>
            </div>
          </div>

          {/* Right — 40% — 3D Viewer Placeholder */}
          <div
            className="relative hidden lg:flex items-center justify-center opacity-0"
            style={{ animation: "hero-fade-in 1000ms cubic-bezier(0.16, 1, 0.3, 1) 500ms forwards" }}
          >
            <div className="flex aspect-square w-full max-w-sm flex-col items-center justify-center rounded-3xl border border-white/[0.12] bg-white/[0.04] backdrop-blur-md">
              <Box size={48} className="mb-4 text-white/20" strokeWidth={1} />
              <p className="font-body text-sm font-medium text-white/30">
                {h.viewer3DPlaceholder}
              </p>
              <p className="font-body mt-1 text-xs text-white/15">
                {h.viewer3DComingSoon}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0 60L48 55C96 50 192 40 288 35C384 30 480 30 576 33.3C672 36.7 768 43.3 864 45C960 46.7 1056 43.3 1152 38.3C1248 33.3 1344 26.7 1392 23.3L1440 20V60H1392C1344 60 1248 60 1152 60C1056 60 960 60 864 60C768 60 672 60 576 60C480 60 384 60 288 60C192 60 96 60 48 60H0Z"
            fill="var(--background)"
          />
        </svg>
      </div>
    </section>
  );
}
