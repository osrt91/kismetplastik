"use client";

import Link from "@/components/ui/LocaleLink";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, Phone, Shield, Award, BadgeCheck, Sparkles } from "lucide-react";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { useLocale } from "@/contexts/LocaleContext";

const trustBadges = [
  { label: "ISO 9001", icon: Shield },
  { label: "ISO 14001", icon: Award },
  { label: "CE", icon: BadgeCheck },
];

export default function CTA() {
  const { dict } = useLocale();
  const h = dict.home;

  return (
    <section
      className="relative overflow-hidden py-24 lg:py-32"
      style={{ background: "linear-gradient(135deg, #0A1628 0%, #0F1F3D 30%, #0A1628 60%, #0D1A30 80%, #0A1628 100%)" }}
    >
      {/* Animated gradient border — top (amber accent line) */}
      <div className="absolute inset-x-0 top-0 h-[3px] animate-[shimmer_3s_ease-in-out_infinite] bg-[length:200%_100%] bg-gradient-to-r from-transparent via-[#F59E0B] to-transparent" />
      {/* Animated gradient border — bottom */}
      <div className="absolute inset-x-0 bottom-0 h-[2px] animate-[shimmer_3s_ease-in-out_infinite_0.5s] bg-[length:200%_100%] bg-gradient-to-r from-transparent via-[#F59E0B]/60 to-transparent" />
      {/* Animated gradient border — left */}
      <div className="absolute inset-y-0 left-0 w-[2px] animate-[shimmer-v_3s_ease-in-out_infinite_1s] bg-[length:100%_200%] bg-gradient-to-b from-transparent via-[#F59E0B]/30 to-transparent" />
      {/* Animated gradient border — right */}
      <div className="absolute inset-y-0 right-0 w-[2px] animate-[shimmer-v_3s_ease-in-out_infinite_1.5s] bg-[length:100%_200%] bg-gradient-to-b from-transparent via-[#F59E0B]/30 to-transparent" />

      {/* Dot pattern overlay */}
      <div className="absolute inset-0 opacity-[0.04]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      {/* Diagonal line pattern overlay */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 60px, rgba(245,158,11,0.3) 60px, rgba(245,158,11,0.3) 61px)`,
          }}
        />
      </div>

      {/* Decorative gradient orbs */}
      <div className="absolute -left-32 top-1/4 h-80 w-80 rounded-full bg-[#F59E0B]/[0.07] blur-[100px]" />
      <div className="absolute -right-32 bottom-1/4 h-96 w-96 rounded-full bg-[#F59E0B]/[0.05] blur-[120px]" />
      <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-blue-500/[0.04] blur-[80px]" />
      <div className="absolute right-1/4 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full bg-[#F59E0B]/[0.04] blur-[60px] animate-pulse" style={{ animationDuration: "6s" }} />

      {/* Geometric shape decorations */}
      <div className="pointer-events-none absolute left-[8%] top-[15%] h-24 w-24 rotate-45 rounded-lg border border-white/[0.04]" />
      <div className="pointer-events-none absolute right-[10%] bottom-[20%] h-16 w-16 rotate-12 rounded-lg border border-[#F59E0B]/[0.06]" />
      <div className="pointer-events-none absolute left-[5%] bottom-[30%] h-3 w-3 rounded-full bg-[#F59E0B]/20" />
      <div className="pointer-events-none absolute right-[8%] top-[25%] h-2 w-2 rounded-full bg-white/15" />

      {/* Rotating ring decoration */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div
          className="h-[500px] w-[500px] rounded-full border border-dashed border-white/[0.04] lg:h-[750px] lg:w-[750px]"
          style={{ animation: "spin 60s linear infinite" }}
        />
      </div>
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div
          className="h-[400px] w-[400px] rounded-full border border-dashed border-[#F59E0B]/[0.05] lg:h-[580px] lg:w-[580px]"
          style={{ animation: "spin 45s linear infinite reverse" }}
        />
      </div>

      {/* Sparkle decorations */}
      <Sparkles
        size={14}
        className="absolute left-[15%] top-[20%] text-[#F59E0B]/30 animate-pulse"
        style={{ animationDelay: "0s", animationDuration: "3s" }}
      />
      <Sparkles
        size={10}
        className="absolute right-[20%] top-[15%] text-white/20 animate-pulse"
        style={{ animationDelay: "1s", animationDuration: "4s" }}
      />
      <Sparkles
        size={12}
        className="absolute left-[25%] bottom-[18%] text-[#F59E0B]/25 animate-pulse"
        style={{ animationDelay: "2s", animationDuration: "3.5s" }}
      />
      <Sparkles
        size={16}
        className="absolute right-[12%] bottom-[25%] text-white/15 animate-pulse"
        style={{ animationDelay: "0.5s", animationDuration: "4.5s" }}
      />

      <div className="relative mx-auto max-w-5xl px-6 text-center lg:px-8">
        <AnimateOnScroll animation="fade-up">
          <h2
            className="mb-6 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl xl:text-[3.5rem] leading-tight"
            style={{ textShadow: "0 2px 20px rgba(0,0,0,0.4), 0 0 40px rgba(245,158,11,0.08)" }}
          >
            {h.ctaTitle}{" "}
            <span
              className="text-[#F59E0B]"
              style={{ textShadow: "0 0 30px rgba(245,158,11,0.3)" }}
            >
              {h.ctaTitleAccent}
            </span>{" "}
            {h.ctaTitleSuffix}
          </h2>
        </AnimateOnScroll>

        <AnimateOnScroll animation="fade-up" delay={100}>
          <p className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-white/65 sm:text-xl">
            {h.ctaSubtitle}
          </p>
        </AnimateOnScroll>

        <AnimateOnScroll animation="zoom-in" delay={200}>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
            <Button
              size="lg"
              className="group relative rounded-xl bg-[#F59E0B] text-[#0A1628] px-10 py-5 text-base font-bold shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all duration-300 hover:bg-[#FBBF24] hover:shadow-[0_0_35px_rgba(245,158,11,0.5)] hover:scale-[1.03] active:scale-[0.98] min-h-[52px] min-w-[200px]"
              asChild
            >
              <Link href="/teklif-al">
                <FileText size={18} />
                {h.ctaForm}
                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1.5"
                />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-xl border-2 border-white/20 bg-white/[0.03] px-10 py-5 text-base font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-[#F59E0B]/40 hover:bg-white/[0.08] hover:scale-[1.03] active:scale-[0.98] min-h-[52px] min-w-[200px]"
              asChild
            >
              <a href="tel:+902125498703">
                <Phone size={18} />
                {h.ctaCall}
              </a>
            </Button>
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll animation="fade" delay={400}>
          <p className="mt-8 text-sm text-white/35">
            {h.ctaNote}
          </p>
        </AnimateOnScroll>

        {/* Trust badges */}
        <AnimateOnScroll animation="fade-up" delay={500}>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-3 sm:gap-5">
            {trustBadges.map(({ label, icon: Icon }) => (
              <div
                key={label}
                className="flex items-center gap-2.5 rounded-full border border-white/[0.08] bg-white/[0.04] px-5 py-2.5 backdrop-blur-sm transition-all duration-300 hover:border-[#F59E0B]/20 hover:bg-white/[0.07] hover:scale-105"
              >
                <Icon size={16} className="text-[#F59E0B]" />
                <span className="text-xs font-semibold tracking-wide text-white/55">{label}</span>
              </div>
            ))}
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
