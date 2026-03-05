"use client";

import Link from "@/components/ui/LocaleLink";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Shield, Truck, Award } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocale } from "@/contexts/LocaleContext";

export default function Hero() {
  const { dict } = useLocale();
  const h = dict.home;
  const highlights = [
    { icon: Shield, text: h.highlight1 },
    { icon: Truck, text: h.highlight2 },
    { icon: Award, text: h.highlight3 },
  ];
  const words = h.words as string[];

  const [wordIndex, setWordIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const interval = setInterval(() => {
      setIsExiting(true);
      timeoutId = setTimeout(() => {
        setWordIndex((prev) => (prev + 1) % words.length);
        setIsExiting(false);
      }, 400);
    }, 3000);
    return () => {
      clearInterval(interval);
      clearTimeout(timeoutId);
    };
  }, [words.length]);

  return (
    <section className="relative overflow-hidden bg-[var(--primary-900)] dark:bg-[#0A1628]">
      {/* Base gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, var(--primary-900) 0%, var(--primary-700) 40%, var(--primary-900) 70%, #0A1628 100%)`,
        }}
      />

      {/* Dot Pattern */}
      <div className="absolute inset-0 opacity-[0.05]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.7) 1px, transparent 0)`,
            backgroundSize: "36px 36px",
          }}
        />
      </div>

      {/* Gradient Orbs */}
      <div className="absolute -right-32 -top-32 h-[600px] w-[600px] rounded-full bg-accent-500/[0.12] blur-[100px]" />
      <div className="absolute -bottom-32 -left-32 h-[600px] w-[600px] rounded-full bg-primary-300/[0.10] blur-[100px]" />
      <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-500/[0.07] blur-[80px]" />

      <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-6 sm:py-24 md:py-28 lg:px-8 lg:py-32">
        <div className="grid items-center gap-10 sm:gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left Content */}
          <div
            className="opacity-0"
            style={{ animation: "hero-fade-up 800ms cubic-bezier(0.16, 1, 0.3, 1) forwards" }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 backdrop-blur-sm">
              <span className="h-2 w-2 animate-pulse rounded-full bg-accent-500" />
              {h.badge}
            </div>

            <h1 className="hero-title-shimmer mb-6 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
              {h.titleBefore}{" "}
              <span className="relative inline-block align-bottom">
                <span className="inline-block overflow-hidden">
                  <span
                    key={wordIndex}
                    className={`inline-block bg-gradient-to-r from-accent-400 to-accent-500 bg-clip-text text-transparent ${
                      isExiting
                        ? "translate-y-[-100%] opacity-0 transition-all duration-[400ms] ease-in"
                        : "animate-[word-enter_400ms_ease-out]"
                    }`}
                  >
                    {words[wordIndex]}
                  </span>
                </span>
                <span
                  key={`line-${wordIndex}`}
                  className="absolute -bottom-1 left-0 h-[3px] rounded-full bg-gradient-to-r from-accent-400/60 to-accent-500/60 animate-[typewriter-line_2.5s_ease-in-out_forwards]"
                />
              </span>{" "}
              {h.titleAfter}
            </h1>

            <p
              className="mb-8 max-w-lg text-base leading-relaxed text-white/70 sm:text-lg opacity-0"
              style={{ animation: "hero-fade-up 800ms cubic-bezier(0.16, 1, 0.3, 1) 300ms forwards" }}
            >
              {h.subtitle}
            </p>

            {/* CTA Buttons */}
            <div
              className="mb-10 flex flex-col gap-3 sm:flex-row sm:gap-4 opacity-0"
              style={{ animation: "hero-fade-up 800ms cubic-bezier(0.16, 1, 0.3, 1) 550ms forwards" }}
            >
              <Button
                size="lg"
                className="group rounded-xl bg-accent text-accent-foreground px-6 py-3.5 sm:px-8 sm:py-4 transition-all duration-300 hover:bg-accent/90 hover:scale-[1.03] hover:shadow-[0_0_24px_rgba(245,158,11,0.4),0_0_48px_rgba(245,158,11,0.15)]"
                asChild
              >
                <Link href="/urunler">
                  {h.ctaProducts}
                  <ArrowRight
                    size={18}
                    className="transition-transform duration-300 group-hover:translate-x-1.5"
                  />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="rounded-xl border-2 border-white/20 px-6 py-3.5 text-white backdrop-blur-sm sm:px-8 sm:py-4 transition-all duration-300 hover:border-white/40 hover:bg-white/10 hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(255,255,255,0.08)]" asChild>
                <Link href="/teklif-al">
                  <Play size={16} className="fill-current" />
                  {h.ctaQuote}
                </Link>
              </Button>
            </div>

            {/* Highlights */}
            <div
              className="flex flex-wrap gap-4 sm:gap-6 opacity-0"
              style={{ animation: "hero-fade-up 800ms cubic-bezier(0.16, 1, 0.3, 1) 750ms forwards" }}
            >
              {highlights.map((item) => (
                <div
                  key={item.text}
                  className="flex items-center gap-2 text-sm text-white/60"
                >
                  <item.icon size={16} className="text-accent-500" />
                  {item.text}
                </div>
              ))}
            </div>

            {/* Trusted Strip */}
            <div
              className="mt-8 border-t border-white/[0.06] pt-6 opacity-0"
              style={{ animation: "hero-fade-up 800ms cubic-bezier(0.16, 1, 0.3, 1) 950ms forwards" }}
            >
              <p className="mb-3 text-xs font-medium uppercase tracking-widest text-white/30">
                {dict.components.trustedBy}
              </p>
              <div className="flex items-center gap-3">
                {Array.from({ length: 6 }, (_, i) => (
                  <div
                    key={i}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04]"
                  >
                    <div className="h-4 w-4 rounded-full bg-white/[0.12]" />
                  </div>
                ))}
                <span className="ml-1 text-xs text-white/25">+</span>
              </div>
            </div>
          </div>

          {/* Right - Mascot Visual */}
          <div
            className="relative hidden lg:block opacity-0"
            style={{ animation: "hero-fade-in 1000ms cubic-bezier(0.16, 1, 0.3, 1) 500ms forwards" }}
          >
            <div className="relative mx-auto aspect-square max-w-md">
              {/* Rotating Rings */}
              <div className="absolute inset-4 rounded-full border border-dashed border-white/10 animate-[spin_30s_linear_infinite]" />
              <div className="absolute inset-12 rounded-full border border-dashed border-white/[0.05] animate-[spin_20s_linear_infinite_reverse]" />

              {/* Mascot */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative flex h-72 w-72 items-center justify-center rounded-3xl border border-white/[0.15] bg-white/[0.08] shadow-[0_8px_40px_rgba(0,0,0,0.3)] backdrop-blur-2xl transition-transform duration-500 hover:scale-105">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/logo2.svg"
                    alt="Kısmet Plastik"
                    className="h-40 w-40 brightness-0 invert drop-shadow-2xl"
                  />
                </div>
              </div>

              {/* Glassmorphism Floating Cards */}
              <div className="absolute -left-4 top-12 rounded-2xl border border-white/[0.18] bg-gradient-to-br from-white/[0.12] to-white/[0.04] p-4 shadow-[0_8px_40px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)] ring-1 ring-inset ring-white/[0.08] backdrop-blur-2xl backdrop-saturate-150 animate-[hero-float_5s_cubic-bezier(0.37,0,0.63,1)_infinite]">
                <div className="text-2xl font-bold text-white">
                  {h.cardProducts}
                </div>
                <div className="text-xs text-white/60">
                  {h.cardProductsLabel}
                </div>
              </div>

              <div className="absolute -right-4 bottom-20 rounded-2xl border border-white/[0.18] bg-gradient-to-br from-white/[0.12] to-white/[0.04] p-4 shadow-[0_8px_40px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)] ring-1 ring-inset ring-white/[0.08] backdrop-blur-2xl backdrop-saturate-150 animate-[hero-float_5s_cubic-bezier(0.37,0,0.63,1)_1.5s_infinite]">
                <div className="text-2xl font-bold text-accent-400">
                  {h.cardCustomers}
                </div>
                <div className="text-xs text-white/60">
                  {h.cardCustomersLabel}
                </div>
              </div>

              <div className="absolute bottom-4 left-8 rounded-2xl border border-white/[0.18] bg-gradient-to-br from-white/[0.12] to-white/[0.04] p-4 shadow-[0_8px_40px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)] ring-1 ring-inset ring-white/[0.08] backdrop-blur-2xl backdrop-saturate-150 animate-[hero-float_5s_cubic-bezier(0.37,0,0.63,1)_3s_infinite]">
                <div className="text-2xl font-bold text-white">
                  {h.cardExperience}
                </div>
                <div className="text-xs text-white/60">
                  {h.cardExperienceLabel}
                </div>
              </div>
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
