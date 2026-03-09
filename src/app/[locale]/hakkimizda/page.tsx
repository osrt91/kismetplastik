"use client";

import Link from "@/components/ui/LocaleLink";
import {
  Target,
  Eye,
  Award,
  Shield,
  Leaf,
  Zap,
  Users,
  ChevronRight,
} from "lucide-react";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { useLocale } from "@/contexts/LocaleContext";

export default function HakkimizdaPage() {
  const { dict } = useLocale();
  const a = dict.about;
  const nav = dict.nav;

  const values = [
    { icon: Shield, title: a.valueQuality, description: a.valueQualityDesc },
    { icon: Leaf, title: a.valueSustainability, description: a.valueSustainabilityDesc },
    { icon: Zap, title: a.valueInnovation, description: a.valueInnovationDesc },
    { icon: Users, title: a.valueCustomer, description: a.valueCustomerDesc },
  ];

  const milestones = [
    { year: "1969", text: a.milestone1969 },
    { year: "1985", text: a.milestone1985 },
    { year: "2000", text: a.milestone2000 },
    { year: "2015", text: a.milestone2015 },
    { year: "2024", text: a.milestone2024 },
  ];

  return (
    <section className="bg-[#FAFAF7] dark:bg-[#0A1628]">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0A1628] via-[#0f2240] to-[#0A1628] py-20 lg:py-28">
        <div className="absolute inset-0 opacity-[0.03]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        {/* Animated gradient orbs */}
        <div className="absolute -left-32 -top-32 h-96 w-96 animate-pulse rounded-full bg-[#F59E0B]/10 blur-3xl" />
        <div
          className="absolute -bottom-24 right-0 h-80 w-80 rounded-full bg-[#0f2240]/30 blur-3xl"
          style={{ animation: "pulse 4s ease-in-out infinite 1s" }}
        />
        <div
          className="absolute left-1/2 top-1/3 h-64 w-64 rounded-full bg-[#F59E0B]/5 blur-3xl"
          style={{ animation: "pulse 5s ease-in-out infinite 2s" }}
        />

        <div className="relative mx-auto max-w-7xl px-4 lg:px-6">
          <AnimateOnScroll animation="fade-up">
            {/* Breadcrumb */}
            <nav className="mb-6 flex items-center gap-1.5 text-sm text-white/60">
              <Link href="/" className="transition-colors hover:text-white">
                {nav.home}
              </Link>
              <ChevronRight size={14} />
              <span className="text-white">{a.heroTitle}</span>
            </nav>
            <h1 className="mb-4 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
              {a.heroTitle}
            </h1>
            <div className="mt-4 mb-6 h-1 w-20 rounded-full bg-[#F59E0B]" />
            <p className="max-w-2xl text-lg text-white/70">{a.heroSubtitle}</p>
          </AnimateOnScroll>
        </div>
      </div>

      {/* Story */}
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-6 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <AnimateOnScroll animation="fade-right">
            <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-[#0A1628]/5 to-[#0A1628]/10 shadow-lg transition-shadow duration-500 hover:shadow-2xl">
              <div className="absolute inset-0 flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/logo2.svg"
                  alt="Kısmet Plastik"
                  className="h-40 w-40 drop-shadow-2xl"
                />
              </div>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll animation="fade-left">
            <div>
              <span className="mb-3 inline-block text-sm font-bold uppercase tracking-widest text-[#F59E0B]">
                {a.storyOverline}
              </span>
              <h2 className="mb-6 text-2xl font-extrabold text-[#0A1628] dark:text-white sm:text-3xl">
                {a.storyTitle}
              </h2>
              <p className="mb-4 leading-relaxed text-neutral-600 dark:text-neutral-300">{a.storyP1}</p>
              <p className="mb-8 leading-relaxed text-neutral-600 dark:text-neutral-300">{a.storyP2}</p>

              {/* Horizontal timeline */}
              <div className="relative">
                {/* Connecting line */}
                <div className="absolute left-0 right-0 top-[18px] hidden h-0.5 bg-gradient-to-r from-[#0A1628]/10 via-[#F59E0B]/40 to-[#0A1628]/10 sm:block" />

                <div className="flex flex-col gap-6 sm:flex-row sm:gap-0 sm:justify-between">
                  {milestones.map((m, i) => (
                    <AnimateOnScroll key={m.year} animation="zoom-in" delay={i * 120}>
                      <div className="group relative flex items-start gap-3 sm:flex-col sm:items-center sm:gap-0">
                        {/* Dot */}
                        <div className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-[3px] border-[#0A1628]/20 bg-white transition-all duration-300 group-hover:border-[#F59E0B] group-hover:scale-110 dark:bg-[#0A1628] sm:mb-3">
                          <div className="h-2.5 w-2.5 rounded-full bg-[#F59E0B] transition-colors" />
                        </div>
                        <div className="sm:text-center">
                          <span className="block text-lg font-bold text-[#0A1628] dark:text-white">
                            {m.year}
                          </span>
                          <span className="text-sm text-neutral-600 dark:text-neutral-300">{m.text}</span>
                        </div>
                      </div>
                    </AnimateOnScroll>
                  ))}
                </div>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </div>

      {/* Misyon & Vizyon */}
      <div className="bg-white dark:bg-[#0A1628]/80 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <div className="grid gap-8 md:grid-cols-2">
            <AnimateOnScroll animation="fade-up">
              <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#0A1628]/5 dark:border-white/10 bg-[#FAFAF7] dark:bg-white/5 p-8 pt-10 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                {/* Accent top border */}
                <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-[#0A1628] to-[#0f2240]" />
                {/* Background number */}
                <span className="pointer-events-none absolute -right-2 -top-4 select-none text-[120px] font-black leading-none text-[#0A1628]/[0.03] dark:text-white/[0.03]">
                  01
                </span>
                <div className="relative">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[#0A1628]/5 text-[#0A1628] dark:bg-white/10 dark:text-white">
                    <Target size={26} />
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-[#0A1628] dark:text-white">{a.missionTitle}</h3>
                  <p className="flex-1 leading-relaxed text-neutral-600 dark:text-neutral-300">{a.missionText}</p>
                </div>
              </div>
            </AnimateOnScroll>
            <AnimateOnScroll animation="fade-up" delay={100}>
              <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#F59E0B]/10 dark:border-[#F59E0B]/20 bg-[#FAFAF7] dark:bg-white/5 p-8 pt-10 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                {/* Accent top border */}
                <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-[#F59E0B] to-[#d97706]" />
                {/* Background number */}
                <span className="pointer-events-none absolute -right-2 -top-4 select-none text-[120px] font-black leading-none text-[#F59E0B]/[0.04] dark:text-[#F59E0B]/[0.04]">
                  02
                </span>
                <div className="relative">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[#F59E0B]/10 text-[#F59E0B]">
                    <Eye size={26} />
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-[#0A1628] dark:text-white">{a.visionTitle}</h3>
                  <p className="flex-1 leading-relaxed text-neutral-600 dark:text-neutral-300">{a.visionText}</p>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </div>

      {/* Değerler */}
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-6 lg:py-24">
        <AnimateOnScroll animation="fade-up">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-block text-sm font-bold uppercase tracking-widest text-[#F59E0B]">
              {a.valuesOverline}
            </span>
            <h2 className="text-2xl font-extrabold text-[#0A1628] dark:text-white sm:text-3xl">
              {a.valuesTitle}
            </h2>
          </div>
        </AnimateOnScroll>
        <div className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Dotted connecting line (desktop) */}
          <div className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-1/2 hidden h-px border-t-2 border-dashed border-[#F59E0B]/20 lg:block" />

          {values.map((v, i) => (
            <AnimateOnScroll key={v.title} animation="fade-up" delay={i * 80}>
              <div
                className={`relative rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                  i % 2 === 0
                    ? "border-[#0A1628]/5 bg-[#FAFAF7] dark:border-white/10 dark:bg-white/5 hover:border-[#0A1628]/15"
                    : "border-[#F59E0B]/10 bg-[#F59E0B]/[0.03] dark:border-[#F59E0B]/15 dark:bg-[#F59E0B]/5 hover:border-[#F59E0B]/25"
                }`}
              >
                {/* Connecting dot (desktop) */}
                <div className="absolute -top-1.5 left-1/2 hidden h-3 w-3 -translate-x-1/2 rounded-full border-2 border-[#F59E0B]/30 bg-white dark:bg-[#0A1628] lg:block" />
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${
                    i % 2 === 0
                      ? "bg-[#0A1628]/5 text-[#0A1628] dark:bg-white/10 dark:text-white"
                      : "bg-[#F59E0B]/10 text-[#F59E0B]"
                  }`}
                >
                  <v.icon size={24} />
                </div>
                <h3 className="mb-2 font-bold text-[#0A1628] dark:text-white">{v.title}</h3>
                <p className="text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">{v.description}</p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>

      {/* Sertifikalar */}
      <div className="bg-[#0A1628] py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <AnimateOnScroll animation="fade-up">
            <div className="flex flex-col items-center text-center">
              <Award size={48} className="mb-4 text-[#F59E0B]" />
              <h2 className="mb-4 text-2xl font-extrabold text-white">{a.certsTitle}</h2>
              <p className="mb-8 max-w-xl text-white/70">{a.certsSubtitle}</p>
              <div className="flex flex-wrap justify-center gap-4">
                {["ISO 9001", "ISO 22000", "FSSC 22000"].map((cert) => (
                  <span
                    key={cert}
                    className="rounded-xl border border-[#F59E0B]/20 bg-white/5 px-6 py-3 font-bold text-white shadow-[0_0_20px_rgba(245,158,11,0.05)] backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-[#F59E0B]/40 hover:bg-[#F59E0B]/10 hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]"
                  >
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
