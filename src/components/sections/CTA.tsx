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
    <section className="relative overflow-hidden bg-gradient-to-r from-[#002060] via-[#1F4A7E] to-[#002060] py-20 lg:py-24">
      {/* Animated gradient border — top */}
      <div className="absolute inset-x-0 top-0 h-[2px] animate-[shimmer_3s_ease-in-out_infinite] bg-[length:200%_100%] bg-gradient-to-r from-transparent via-accent-500/70 to-transparent" />
      {/* Animated gradient border — bottom */}
      <div className="absolute inset-x-0 bottom-0 h-[2px] animate-[shimmer_3s_ease-in-out_infinite_0.5s] bg-[length:200%_100%] bg-gradient-to-r from-transparent via-accent-500/70 to-transparent" />
      {/* Animated gradient border — left */}
      <div className="absolute inset-y-0 left-0 w-[2px] animate-[shimmer-v_3s_ease-in-out_infinite_1s] bg-[length:100%_200%] bg-gradient-to-b from-transparent via-accent-500/40 to-transparent" />
      {/* Animated gradient border — right */}
      <div className="absolute inset-y-0 right-0 w-[2px] animate-[shimmer-v_3s_ease-in-out_infinite_1.5s] bg-[length:100%_200%] bg-gradient-to-b from-transparent via-accent-500/40 to-transparent" />

      {/* Dot pattern background */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Decorative blurs */}
      <div className="absolute -left-20 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-accent-500/10 blur-3xl animate-pulse" />
      <div className="absolute -right-20 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-primary-300/10 blur-3xl animate-pulse" />

      {/* Rotating ring decoration */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div
          className="h-[500px] w-[500px] rounded-full border border-dashed border-white/[0.06] lg:h-[700px] lg:w-[700px]"
          style={{ animation: "spin 60s linear infinite" }}
        />
      </div>
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div
          className="h-[400px] w-[400px] rounded-full border border-dashed border-accent-500/[0.06] lg:h-[550px] lg:w-[550px]"
          style={{ animation: "spin 45s linear infinite reverse" }}
        />
      </div>

      {/* Sparkle decorations */}
      <Sparkles
        size={14}
        className="absolute left-[15%] top-[20%] text-accent-400/30 animate-pulse"
        style={{ animationDelay: "0s", animationDuration: "3s" }}
      />
      <Sparkles
        size={10}
        className="absolute right-[20%] top-[15%] text-white/20 animate-pulse"
        style={{ animationDelay: "1s", animationDuration: "4s" }}
      />
      <Sparkles
        size={12}
        className="absolute left-[25%] bottom-[18%] text-accent-300/25 animate-pulse"
        style={{ animationDelay: "2s", animationDuration: "3.5s" }}
      />
      <Sparkles
        size={16}
        className="absolute right-[12%] bottom-[25%] text-white/15 animate-pulse"
        style={{ animationDelay: "0.5s", animationDuration: "4.5s" }}
      />

      <div className="relative mx-auto max-w-5xl px-4 text-center lg:px-8">
        <AnimateOnScroll animation="fade-up">
          <h2 className="mb-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            {h.ctaTitle}{" "}
            <span className="text-accent-400">{h.ctaTitleAccent}</span> {h.ctaTitleSuffix}
          </h2>
        </AnimateOnScroll>

        <AnimateOnScroll animation="fade-up" delay={100}>
          <p className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-white/70 sm:text-xl">
            {h.ctaSubtitle}
          </p>
        </AnimateOnScroll>

        <AnimateOnScroll animation="zoom-in" delay={200}>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
            <Button
              size="lg"
              className="group w-full sm:w-auto rounded-xl bg-accent text-accent-foreground px-8 py-4 shadow-md hover:shadow-lg hover:bg-accent/90"
              asChild
            >
              <Link href="/teklif-al">
                <FileText size={20} />
                {h.ctaForm}
                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto rounded-xl border-2 border-white/25 bg-white/[0.06] px-8 py-4 text-white hover:border-white/40 hover:bg-white/10"
              asChild
            >
              <a href="tel:+902125498703">
                <Phone size={20} />
                {h.ctaCall}
              </a>
            </Button>
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll animation="fade" delay={400}>
          <p className="mt-8 text-sm text-white/55">
            {h.ctaNote}
          </p>
        </AnimateOnScroll>

        {/* Trust badges */}
        <AnimateOnScroll animation="fade-up" delay={500}>
          <div className="mt-10 flex items-center justify-center gap-4 sm:gap-6">
            {trustBadges.map(({ label, icon: Icon }) => (
              <div
                key={label}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 backdrop-blur-sm transition-colors duration-300 hover:border-white/20 hover:bg-white/[0.07]"
              >
                <Icon size={16} className="text-accent-400" />
                <span className="text-xs font-semibold text-white/60">{label}</span>
              </div>
            ))}
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
