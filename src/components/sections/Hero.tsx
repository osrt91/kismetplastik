"use client";

import Image from "next/image";
import Link from "@/components/ui/LocaleLink";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  FileText,
  Shield,
  Package,
  Globe,
  Factory,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLocale } from "@/contexts/LocaleContext";

const PARTICLES = Array.from({ length: 8 }, (_, i) => ({
  left: `${(i * 23 + 5) % 95}%`,
  top: `${(i * 29 + 10) % 90}%`,
  size: i % 3 === 0 ? 4 : i % 3 === 1 ? 3 : 2,
  delay: `${(i * 0.9) % 5}s`,
  duration: `${3 + (i % 4)}s`,
  isAccent: i % 2 === 0,
}));

export default function Hero() {
  const { dict } = useLocale();
  const h = dict.home;
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

  const trustItems = [
    { icon: Shield, text: h.trustIso },
    { icon: Package, text: h.trustProducts },
    { icon: Globe, text: h.trustExport },
    { icon: Factory, text: h.trustExperience },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0A1628] via-[#1B2A4A] to-[#0A1628]">
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-accent-500/[0.08] blur-3xl animate-pulse" />
      <div className="absolute -bottom-32 -left-32 h-[500px] w-[500px] rounded-full bg-primary-300/[0.08] blur-3xl animate-pulse" />

      {PARTICLES.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            backgroundColor: p.isAccent
              ? "var(--accent-500)"
              : "var(--primary-300)",
            opacity: 0.12 + (i % 3) * 0.06,
            animation: `particle-float ${p.duration} ease-in-out ${p.delay} infinite`,
          }}
        />
      ))}

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:py-24 lg:px-6 lg:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="opacity-0 animate-[fade-in-up_1000ms_ease-out_forwards]">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-white/90 backdrop-blur-sm">
              <span className="h-2 w-2 animate-pulse rounded-full bg-accent-500" />
              {h.badge}
            </div>

            <h1 className="mb-6 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
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

            <p className="mb-8 max-w-lg text-base leading-relaxed text-white/80 sm:text-lg opacity-0 animate-[fade-in-up_1000ms_ease-out_200ms_forwards]">
              {h.subtitle}
            </p>

            <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:gap-4 opacity-0 animate-[fade-in-up_1000ms_ease-out_300ms_forwards]">
              <Button
                size="lg"
                className="group w-full rounded-xl bg-accent px-8 py-4 text-accent-foreground shadow-md hover:bg-accent/90 hover:shadow-lg sm:w-auto"
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
                className="w-full rounded-xl border-2 border-white/25 bg-white/[0.06] px-8 py-4 text-white hover:border-white/40 hover:bg-white/10 sm:w-auto"
                asChild
              >
                <Link href="/teklif-al">
                  <FileText size={16} />
                  {h.ctaQuote}
                </Link>
              </Button>
            </div>

            <div className="opacity-0 animate-[fade-in-up_1000ms_ease-out_500ms_forwards]">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-3 sm:flex-nowrap sm:divide-x sm:divide-white/10">
                {trustItems.map((item, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-2 text-sm text-white/80 ${
                      idx > 0 ? "sm:pl-4" : ""
                    }`}
                  >
                    <item.icon
                      size={16}
                      className="shrink-0 text-accent-400"
                    />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative hidden opacity-0 animate-[fade-in_1000ms_ease-out_300ms_forwards] lg:block">
            <div className="relative mx-auto aspect-square max-w-lg">
              <div className="absolute inset-2 rounded-full border border-white/[0.06] animate-[spin_40s_linear_infinite]" />
              <div className="absolute inset-10 rounded-full border border-dashed border-white/[0.04] animate-[spin_25s_linear_infinite_reverse]" />
              <div className="absolute inset-20 rounded-full border border-white/[0.03] animate-[spin_35s_linear_infinite]" />

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative flex h-80 w-80 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.07] shadow-2xl backdrop-blur-md transition-transform duration-500 hover:scale-105">
                  <Image
                    src="/images/logo2.svg"
                    alt="Kısmet Plastik"
                    width={180}
                    height={180}
                    className="h-44 w-44 brightness-0 invert drop-shadow-2xl"
                  />
                </div>
              </div>

              <div className="absolute -left-6 top-10 rounded-xl border border-white/[0.15] bg-gradient-to-br from-white/[0.10] to-white/[0.03] p-4 shadow-[0_8px_32px_rgba(0,0,0,0.25)] ring-1 ring-inset ring-white/[0.05] backdrop-blur-xl backdrop-saturate-150 animate-[float_4s_ease-in-out_infinite]">
                <div className="text-2xl font-bold text-white">
                  {h.cardProducts}
                </div>
                <div className="text-xs text-white/80">
                  {h.cardProductsLabel}
                </div>
              </div>

              <div className="absolute -right-6 top-1/3 rounded-xl border border-white/[0.15] bg-gradient-to-br from-white/[0.10] to-white/[0.03] p-4 shadow-[0_8px_32px_rgba(0,0,0,0.25)] ring-1 ring-inset ring-white/[0.05] backdrop-blur-xl backdrop-saturate-150 animate-[float_4s_ease-in-out_infinite_1s]">
                <div className="text-2xl font-bold text-accent-400">
                  {h.cardCustomers}
                </div>
                <div className="text-xs text-white/80">
                  {h.cardCustomersLabel}
                </div>
              </div>

              <div className="absolute -left-2 bottom-16 rounded-xl border border-white/[0.15] bg-gradient-to-br from-white/[0.10] to-white/[0.03] p-4 shadow-[0_8px_32px_rgba(0,0,0,0.25)] ring-1 ring-inset ring-white/[0.05] backdrop-blur-xl backdrop-saturate-150 animate-[float_4s_ease-in-out_infinite_2s]">
                <div className="text-2xl font-bold text-white">
                  {h.cardExperience}
                </div>
                <div className="text-xs text-white/80">
                  {h.cardExperienceLabel}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
