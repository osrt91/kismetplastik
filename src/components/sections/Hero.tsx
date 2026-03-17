"use client";

import { useRef } from "react";
import Link from "@/components/ui/LocaleLink";
import { Button } from "@/components/ui/button";
import { ArrowRight, LogIn, Box, Sparkles } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useLocale } from "@/contexts/LocaleContext";
import type { DbContentSection } from "@/types/database";
import { getLocalizedFieldSync } from "@/lib/content";

interface HeroProps {
  settings?: Record<string, string>;
  content?: Record<string, DbContentSection>;
}

export default function Hero({ settings, content }: HeroProps) {
  const { dict, locale } = useLocale();
  const h = dict.home;

  const heroSection = content?.home_hero;
  const heroTitle = heroSection ? getLocalizedFieldSync(heroSection, "title", locale) : "";
  const heroBadge = heroSection ? getLocalizedFieldSync(heroSection, "subtitle", locale) : "";
  const heroSubtext = heroSection ? getLocalizedFieldSync(heroSection, "content", locale) : "";
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="relative overflow-hidden min-h-[75vh] flex items-center">
      {/* Gradient mesh background */}
      <div className="absolute inset-0 bg-gradient-mesh" />

      {/* Animated ambient orbs */}
      <div aria-hidden="true" className="ambient-orb absolute -left-20 top-1/4 h-[400px] w-[400px] bg-amber-500/[0.07]" />
      <div aria-hidden="true" className="ambient-orb absolute -right-32 top-1/3 h-[350px] w-[350px] bg-blue-500/[0.05]" style={{ animationDelay: "-4s" }} />
      <div aria-hidden="true" className="ambient-orb absolute bottom-0 left-1/3 h-[300px] w-[300px] bg-amber-500/[0.04]" style={{ animationDelay: "-8s" }} />

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Top amber accent line */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />

      <div className="relative mx-auto max-w-7xl w-full px-5 py-24 sm:px-6 sm:py-28 md:py-32 lg:px-8 lg:py-36">
        <div className="grid items-center gap-12 lg:grid-cols-[3fr_2fr] lg:gap-20">
          {/* Left Content */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 1, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.06] px-5 py-2.5 backdrop-blur-md"
            >
              <Sparkles size={14} className="text-amber-400" />
              <span className="font-body text-sm font-medium text-white/80">{heroBadge || h.badge}</span>
            </motion.div>

            {/* Main heading */}
            <motion.h1
              initial={{ opacity: 1, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="hero-title-shimmer font-display mb-8 text-3xl font-bold leading-[1.1] tracking-tight text-white sm:text-4xl md:text-[2.75rem] lg:text-[3.25rem]"
            >
              {heroTitle || h.heroHeading}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 25 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="font-body mb-10 max-w-xl text-base leading-relaxed text-white/55 sm:text-lg"
            >
              {heroSubtext || h.heroSubtext}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-4 sm:flex-row sm:gap-5"
            >
              <Button
                size="lg"
                className="group rounded-xl bg-amber-500 text-navy-950 px-8 py-4 font-body text-base font-bold shadow-[0_0_30px_rgba(245,158,11,0.35)] transition-all duration-300 hover:bg-amber-400 hover:shadow-[0_0_50px_rgba(245,158,11,0.5)] hover:scale-[1.02] active:scale-[0.98]"
                asChild
              >
                <Link href="/urunler">
                  {h.ctaProducts}
                  <ArrowRight
                    size={18}
                    className="ml-1 transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="group rounded-xl border-2 border-white/15 bg-white/[0.04] px-8 py-4 font-body text-base text-white backdrop-blur-md transition-all duration-300 hover:border-white/30 hover:bg-white/[0.08] hover:scale-[1.02] active:scale-[0.98]"
                asChild
              >
                <Link href="/bayi-girisi">
                  <LogIn size={16} className="mr-1" />
                  {h.ctaDealer}
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Right — 3D Viewer Placeholder */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative hidden lg:flex items-center justify-center"
          >
            {/* Glow behind the card */}
            <div className="absolute inset-0 rounded-3xl bg-amber-500/[0.06] blur-[60px]" />

            <div className="glass-card-dark relative flex aspect-square w-full max-w-sm flex-col items-center justify-center rounded-3xl">
              <Box size={52} className="mb-5 text-white/20" strokeWidth={1} />
              <p className="font-body text-sm font-medium text-white/35">
                {h.viewer3DPlaceholder}
              </p>
              <p className="font-body mt-1 text-xs text-white/20">
                {h.viewer3DComingSoon}
              </p>
            </div>

            {/* Floating experience badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="absolute -bottom-4 -left-6 rounded-2xl bg-amber-500 px-5 py-3 shadow-[0_8px_30px_rgba(245,158,11,0.4)]"
            >
              <div className="font-mono text-2xl font-extrabold text-navy-950">{settings?.experience_badge ?? "60+"}</div>
              <div className="font-body text-xs font-semibold text-navy-950/70">{h.cardExperienceLabel}</div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full" preserveAspectRatio="none">
          <path d="M0 60L48 55C96 50 192 40 288 35C384 30 480 30 576 33.3C672 36.7 768 43.3 864 45C960 46.7 1056 43.3 1152 38.3C1248 33.3 1344 26.7 1392 23.3L1440 20V60H1392C1344 60 1248 60 1152 60C1056 60 960 60 864 60C768 60 672 60 576 60C480 60 384 60 288 60C192 60 96 60 48 60H0Z" fill="var(--background)" />
        </svg>
      </div>
    </section>
  );
}
