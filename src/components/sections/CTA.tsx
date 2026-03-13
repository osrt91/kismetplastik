"use client";

import Link from "@/components/ui/LocaleLink";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, Phone, Shield, Award, BadgeCheck } from "lucide-react";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { useLocale } from "@/contexts/LocaleContext";
import type { DbContentSection } from "@/types/database";
import { getLocalizedFieldSync } from "@/lib/content";

const trustBadges = [
  { label: "ISO 9001", icon: Shield },
  { label: "ISO 14001", icon: Award },
  { label: "CE", icon: BadgeCheck },
];

interface CTAProps {
  content?: Record<string, DbContentSection>;
}

export default function CTA({ content }: CTAProps) {
  const { dict, locale } = useLocale();
  const h = dict.home;

  const ctaSection = content?.home_cta;
  const ctaTitle = ctaSection ? getLocalizedFieldSync(ctaSection, "title", locale) : "";
  const ctaSubtitle = ctaSection ? getLocalizedFieldSync(ctaSection, "subtitle", locale) : "";
  const ctaContent = ctaSection ? getLocalizedFieldSync(ctaSection, "content", locale) : "";

  return (
    <section
      className="relative overflow-hidden py-24 lg:py-32"
      style={{ background: "linear-gradient(135deg, #0A1628 0%, #0F1F3D 30%, #0A1628 60%, #0D1A30 80%, #0A1628 100%)" }}
    >
      {/* Top amber accent line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#F59E0B]/60 to-transparent" />
      {/* Bottom amber accent line */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#F59E0B]/60 to-transparent" />

      {/* Subtle dot pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      {/* Decorative gradient orbs */}
      <div className="absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-[#F59E0B]/[0.08] blur-[100px]" />
      <div className="absolute -right-32 bottom-1/4 h-96 w-96 rounded-full bg-[#F59E0B]/[0.06] blur-[120px]" />

      <div className="relative mx-auto max-w-5xl px-6 text-center lg:px-8">
        <AnimateOnScroll animation="fade-up">
          <h2
            className="font-display mb-6 text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl leading-tight"
            style={{ textShadow: "0 2px 20px rgba(0,0,0,0.4), 0 0 40px rgba(245,158,11,0.08)" }}
          >
            {ctaTitle ? (
              <span>{ctaTitle}</span>
            ) : (
              <>
                {h.ctaTitle}{" "}
                <span
                  className="text-[#F59E0B]"
                  style={{ textShadow: "0 0 30px rgba(245,158,11,0.4), 0 0 60px rgba(245,158,11,0.2)" }}
                >
                  {h.ctaTitleAccent}
                </span>{" "}
                {h.ctaTitleSuffix}
              </>
            )}
          </h2>
        </AnimateOnScroll>

        <AnimateOnScroll animation="fade-up" delay={100}>
          <p className="font-body mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-white/65 sm:text-xl">
            {ctaSubtitle || ctaContent || h.ctaSubtitle}
          </p>
        </AnimateOnScroll>

        <AnimateOnScroll animation="zoom-in" delay={200}>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
            <Button
              size="lg"
              className="group relative animate-glow-pulse rounded-xl bg-[#F59E0B] text-[#0A1628] px-10 py-5 text-base font-bold shadow-[0_0_40px_rgba(245,158,11,0.4)] transition-all duration-300 hover:bg-[#FBBF24] hover:shadow-[0_0_60px_rgba(245,158,11,0.6)] hover:scale-[1.03] active:scale-[0.98] min-h-[52px] min-w-[200px]"
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
          <p className="font-body mt-8 text-sm text-white/35">
            {h.ctaNote}
          </p>
        </AnimateOnScroll>

        {/* Trust badges */}
        <AnimateOnScroll animation="fade-up" delay={500}>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-3 sm:gap-5">
            {trustBadges.map(({ label, icon: Icon }) => (
              <div
                key={label}
                className="card-shine flex items-center gap-2.5 rounded-full border border-white/[0.12] bg-white/[0.04] px-5 py-2.5 backdrop-blur-sm transition-all duration-300 hover:border-[#F59E0B]/30 hover:bg-white/[0.07] hover:scale-105"
              >
                <Icon size={16} className="text-[#F59E0B]" />
                <span className="font-mono text-xs font-semibold tracking-wide text-white/55">{label}</span>
              </div>
            ))}
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
