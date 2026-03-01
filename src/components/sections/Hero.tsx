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
  ChevronDown,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useLocale } from "@/contexts/LocaleContext";

function AnimatedCounter({ target, suffix = "" }: { target: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [displayed, setDisplayed] = useState("0");
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!ref.current || hasAnimated) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasAnimated(true);
          const num = parseInt(target.replace(/\D/g, ""), 10);
          const duration = 2000;
          const steps = 40;
          const increment = num / steps;
          let current = 0;
          let step = 0;
          const timer = setInterval(() => {
            step++;
            current = Math.min(Math.round(increment * step), num);
            setDisplayed(current.toLocaleString("tr-TR"));
            if (step >= steps) clearInterval(timer);
          }, duration / steps);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, hasAnimated]);

  return (
    <span ref={ref}>
      {displayed}{suffix}
    </span>
  );
}

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

  const stats = [
    { value: "500", suffix: "+", label: h.cardProductsLabel, color: "text-white" },
    { value: "1000", suffix: "+", label: h.cardCustomersLabel, color: "text-accent-400" },
    { value: "55", suffix: "+", label: h.cardExperienceLabel, color: "text-primary-300" },
  ];

  const VIDEO_SRC = "/videos/hero-bg.mp4";
  const [videoLoaded, setVideoLoaded] = useState(false);

  return (
    <section className="relative overflow-hidden bg-[#0A1628] min-h-[92vh] flex items-center">
      <video
        src={VIDEO_SRC}
        poster="/images/hero-poster.jpg"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        onCanPlay={() => setVideoLoaded(true)}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${videoLoaded ? "opacity-15" : "opacity-0"}`}
      />

      <div className="absolute inset-0">
        <div
          className="absolute inset-0 opacity-[0.012]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 0.5px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute top-[-10%] right-[-5%] w-[65%] h-[65%] rounded-full bg-[#2D9CDB]/[0.07] blur-[140px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[55%] h-[55%] rounded-full bg-[#F2994A]/[0.05] blur-[120px]" />
        <div className="absolute top-1/2 left-1/3 w-[30%] h-[30%] rounded-full bg-[#2D9CDB]/[0.03] blur-[80px] animate-pulse" />
        <div className="absolute top-1/4 right-1/4 w-[20%] h-[20%] rounded-full bg-[#00A878]/[0.03] blur-[60px]" />
      </div>

      <div className="absolute inset-y-0 right-0 w-1/2 hidden lg:block">
        <div className="absolute inset-0 bg-gradient-to-l from-[#2D9CDB]/[0.03] to-transparent" />
        <svg className="absolute inset-0 w-full h-full opacity-[0.025]" viewBox="0 0 800 800">
          <circle cx="400" cy="400" r="350" stroke="white" strokeWidth="0.5" fill="none" />
          <circle cx="400" cy="400" r="280" stroke="white" strokeWidth="0.3" fill="none" strokeDasharray="8 8">
            <animateTransform attributeName="transform" type="rotate" from="0 400 400" to="360 400 400" dur="120s" repeatCount="indefinite" />
          </circle>
          <circle cx="400" cy="400" r="200" stroke="white" strokeWidth="0.3" fill="none">
            <animateTransform attributeName="transform" type="rotate" from="360 400 400" to="0 400 400" dur="90s" repeatCount="indefinite" />
          </circle>
          <circle cx="400" cy="400" r="120" stroke="white" strokeWidth="0.2" fill="none" strokeDasharray="4 12">
            <animateTransform attributeName="transform" type="rotate" from="0 400 400" to="360 400 400" dur="60s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl w-full px-4 py-20 sm:py-24 lg:px-6 lg:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div>
            <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-white/[0.08] bg-white/[0.04] px-5 py-2 backdrop-blur-sm opacity-0 animate-[fade-in-up_800ms_ease-out_forwards]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00A878] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00A878]" />
              </span>
              <span className="text-sm font-medium text-white/80">{h.badge}</span>
            </div>

            <h1 className="mb-6 text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-[3.5rem] lg:text-[4rem] xl:text-[4.5rem] opacity-0 animate-[fade-in-up_800ms_ease-out_100ms_forwards]">
              {h.titleBefore}{" "}
              <span className="relative inline-block align-bottom">
                <span className="inline-block overflow-hidden">
                  <span
                    key={wordIndex}
                    className={`inline-block bg-gradient-to-r from-[#F2994A] via-[#F5AD6E] to-[#F2994A] bg-clip-text text-transparent ${
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
                  className="absolute -bottom-1 left-0 h-[3px] rounded-full bg-gradient-to-r from-[#F2994A]/80 to-[#2D9CDB]/60 animate-[typewriter-line_2.5s_ease-in-out_forwards]"
                />
              </span>{" "}
              {h.titleAfter}
            </h1>

            <p className="mb-8 max-w-lg text-base leading-relaxed text-white/55 sm:text-lg lg:text-xl opacity-0 animate-[fade-in-up_800ms_ease-out_200ms_forwards]">
              {h.subtitle}
            </p>

            <div className="mb-10 flex flex-col gap-3 sm:flex-row opacity-0 animate-[fade-in-up_800ms_ease-out_300ms_forwards]">
              <Button
                size="lg"
                className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-[#F2994A] to-[#D98A35] px-8 py-5 text-base font-bold text-white shadow-lg shadow-[#F2994A]/25 transition-all hover:shadow-xl hover:shadow-[#F2994A]/35 hover:scale-[1.02] active:scale-[0.98] sm:w-auto"
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
                className="w-full rounded-xl border border-white/15 bg-white/[0.04] px-8 py-5 text-base font-semibold text-white backdrop-blur-sm transition-all hover:border-[#2D9CDB]/50 hover:bg-[#2D9CDB]/10 hover:scale-[1.02] active:scale-[0.98] sm:w-auto"
                asChild
              >
                <Link href="/teklif-al">
                  <FileText size={16} />
                  {h.ctaQuote}
                </Link>
              </Button>
            </div>

            <div className="opacity-0 animate-[fade-in-up_800ms_ease-out_500ms_forwards]">
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2.5 sm:flex-nowrap sm:divide-x sm:divide-white/[0.08]">
                {trustItems.map((item, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-2 text-[13px] text-white/55 transition-colors hover:text-white/80 ${
                      idx > 0 ? "sm:pl-5" : ""
                    }`}
                  >
                    <item.icon
                      size={15}
                      className="shrink-0 text-[#2D9CDB]"
                    />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile Stats */}
            <div className="mt-10 grid grid-cols-3 gap-3 lg:hidden opacity-0 animate-[fade-in-up_800ms_ease-out_600ms_forwards]">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-2 py-3 text-center backdrop-blur-sm"
                >
                  <div className={`text-xl font-extrabold ${stat.color}`}>
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="mt-0.5 text-[10px] leading-tight text-white/45">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative hidden lg:flex flex-col items-center justify-center opacity-0 animate-[fade-in_1000ms_ease-out_400ms_forwards]">
            <div className="relative flex h-72 w-72 items-center justify-center">
              <div className="absolute inset-0 rounded-[2rem] border border-white/[0.06] rotate-6 animate-[spin_60s_linear_infinite]" />
              <div className="absolute inset-4 rounded-[2rem] border border-dashed border-white/[0.04] -rotate-3" />
              <div className="absolute inset-8 rounded-[1.75rem] border border-white/[0.03] rotate-12 animate-[spin_90s_linear_infinite_reverse]" />
              <div className="relative flex h-56 w-56 items-center justify-center rounded-[1.5rem] border border-white/[0.08] bg-gradient-to-br from-white/[0.06] to-white/[0.02] shadow-2xl shadow-black/20 backdrop-blur-xl">
                <Image
                  src="/images/logo2.svg"
                  alt="Kısmet Plastik"
                  width={140}
                  height={140}
                  className="h-32 w-32 brightness-0 invert drop-shadow-2xl"
                />
              </div>
            </div>

            <div className="mt-10 grid w-full max-w-sm grid-cols-3 gap-3">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="group rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-4 text-center backdrop-blur-sm transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.06] opacity-0 animate-[fade-in-up_600ms_ease-out_forwards]"
                  style={{ animationDelay: `${600 + i * 150}ms` }}
                >
                  <div className={`text-2xl font-extrabold ${stat.color} transition-transform group-hover:scale-105`}>
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="mt-1 text-[11px] leading-tight text-white/50">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 opacity-0 animate-[fade-in_1200ms_ease-out_1200ms_forwards]">
        <ChevronDown size={20} className="text-white/30 animate-[bounce-down_1.5s_ease-in-out_infinite]" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#2D9CDB]/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[var(--background)] to-transparent" />
    </section>
  );
}
