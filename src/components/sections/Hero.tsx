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
    <section className="relative overflow-hidden bg-[#0A1628] min-h-[90vh] flex items-center">
      <video
        src={VIDEO_SRC}
        autoPlay
        loop
        muted
        playsInline
        onCanPlay={() => setVideoLoaded(true)}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${videoLoaded ? "opacity-20" : "opacity-0"}`}
      />

      <div className="absolute inset-0">
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 0.5px, transparent 0)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="absolute top-0 right-0 w-[60%] h-[60%] rounded-full bg-[#2D9CDB]/[0.06] blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[50%] h-[50%] rounded-full bg-[#F2994A]/[0.04] blur-[100px]" />
        <div className="absolute top-1/2 left-1/3 w-[30%] h-[30%] rounded-full bg-[#2D9CDB]/[0.03] blur-[80px] animate-pulse" />
      </div>

      <div className="absolute inset-y-0 right-0 w-1/2 hidden lg:block">
        <div className="absolute inset-0 bg-gradient-to-l from-[#2D9CDB]/[0.03] to-transparent" />
        <svg className="absolute inset-0 w-full h-full opacity-[0.02]" viewBox="0 0 800 800">
          <circle cx="400" cy="400" r="350" stroke="white" strokeWidth="0.5" fill="none" />
          <circle cx="400" cy="400" r="280" stroke="white" strokeWidth="0.3" fill="none" strokeDasharray="8 8" />
          <circle cx="400" cy="400" r="200" stroke="white" strokeWidth="0.3" fill="none" />
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl w-full px-4 py-24 sm:py-28 lg:px-6 lg:py-36">
        <div className="grid items-center gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <div>
            <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-white/[0.08] bg-white/[0.04] px-5 py-2.5 backdrop-blur-sm opacity-0 animate-[fade-in-up_800ms_ease-out_forwards]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#2D9CDB] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#2D9CDB]" />
              </span>
              <span className="text-sm font-medium text-white/80">{h.badge}</span>
            </div>

            <h1 className="mb-8 text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-[4.25rem] opacity-0 animate-[fade-in-up_800ms_ease-out_100ms_forwards]">
              {h.titleBefore}{" "}
              <span className="relative inline-block align-bottom">
                <span className="inline-block overflow-hidden">
                  <span
                    key={wordIndex}
                    className={`inline-block bg-gradient-to-r from-[#F2994A] to-[#F5AD6E] bg-clip-text text-transparent ${
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
                  className="absolute -bottom-1.5 left-0 h-[3px] rounded-full bg-gradient-to-r from-[#F2994A]/70 to-[#2D9CDB]/50 animate-[typewriter-line_2.5s_ease-in-out_forwards]"
                />
              </span>{" "}
              {h.titleAfter}
            </h1>

            <p className="mb-10 max-w-xl text-lg leading-relaxed text-white/60 sm:text-xl opacity-0 animate-[fade-in-up_800ms_ease-out_200ms_forwards]">
              {h.subtitle}
            </p>

            <div className="mb-12 flex flex-col gap-4 sm:flex-row opacity-0 animate-[fade-in-up_800ms_ease-out_300ms_forwards]">
              <Button
                size="lg"
                className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-[#F2994A] to-[#D98A35] px-8 py-5 text-base font-bold text-white shadow-lg shadow-[#F2994A]/20 transition-all hover:shadow-xl hover:shadow-[#F2994A]/30 sm:w-auto"
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
                className="w-full rounded-xl border border-white/15 bg-white/[0.04] px-8 py-5 text-base font-semibold text-white backdrop-blur-sm transition-all hover:border-[#2D9CDB]/40 hover:bg-[#2D9CDB]/10 sm:w-auto"
                asChild
              >
                <Link href="/teklif-al">
                  <FileText size={16} />
                  {h.ctaQuote}
                </Link>
              </Button>
            </div>

            <div className="opacity-0 animate-[fade-in-up_800ms_ease-out_500ms_forwards]">
              <div className="flex flex-wrap items-center gap-x-5 gap-y-3 sm:flex-nowrap sm:divide-x sm:divide-white/[0.08]">
                {trustItems.map((item, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-2 text-[13px] text-white/60 ${
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
          </div>

          <div className="relative hidden lg:flex flex-col items-center justify-center opacity-0 animate-[fade-in_1000ms_ease-out_400ms_forwards]">
            <div className="relative flex h-72 w-72 items-center justify-center">
              <div className="absolute inset-0 rounded-[2rem] border border-white/[0.06] rotate-6 animate-[spin_60s_linear_infinite]" />
              <div className="absolute inset-4 rounded-[2rem] border border-dashed border-white/[0.04] -rotate-3" />
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

            <div className="mt-12 grid w-full max-w-sm grid-cols-3 gap-4">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-4 text-center backdrop-blur-sm opacity-0 animate-[fade-in-up_600ms_ease-out_forwards]"
                  style={{ animationDelay: `${600 + i * 150}ms` }}
                >
                  <div className={`text-2xl font-extrabold ${stat.color}`}>
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

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#2D9CDB]/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[var(--background)] to-transparent" />
    </section>
  );
}
