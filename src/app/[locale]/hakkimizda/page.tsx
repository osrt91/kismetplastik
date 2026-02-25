"use client";

import Image from "next/image";
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
    <section className="bg-white">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-700 to-primary-900 py-20 lg:py-28">
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
        <div className="absolute -left-32 -top-32 h-96 w-96 animate-pulse rounded-full bg-accent-500/10 blur-3xl" />
        <div
          className="absolute -bottom-24 right-0 h-80 w-80 rounded-full bg-primary-400/15 blur-3xl"
          style={{ animation: "pulse 4s ease-in-out infinite 1s" }}
        />
        <div
          className="absolute left-1/2 top-1/3 h-64 w-64 rounded-full bg-accent-400/8 blur-3xl"
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
            <p className="max-w-2xl text-lg text-white/70">{a.heroSubtitle}</p>
          </AnimateOnScroll>
        </div>
      </div>

      {/* Story */}
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-6 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <AnimateOnScroll animation="fade-right">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-gradient-to-br from-primary-100 to-primary-50">
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src="/images/logo.jpg"
                  alt="Kısmet Plastik"
                  width={220}
                  height={220}
                  className="rounded-2xl object-contain drop-shadow-2xl"
                />
              </div>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll animation="fade-left">
            <div>
              <span className="mb-3 inline-block text-sm font-bold uppercase tracking-widest text-accent-500">
                {a.storyOverline}
              </span>
              <h2 className="mb-6 text-2xl font-extrabold text-primary-900 sm:text-3xl">
                {a.storyTitle}
              </h2>
              <p className="mb-4 leading-relaxed text-neutral-600">{a.storyP1}</p>
              <p className="mb-8 leading-relaxed text-neutral-600">{a.storyP2}</p>

              {/* Horizontal timeline */}
              <div className="relative">
                {/* Connecting line */}
                <div className="absolute left-0 right-0 top-[18px] hidden h-0.5 bg-gradient-to-r from-primary-200 via-primary-300 to-primary-200 sm:block" />

                <div className="flex flex-col gap-6 sm:flex-row sm:gap-0 sm:justify-between">
                  {milestones.map((m, i) => (
                    <AnimateOnScroll key={m.year} animation="zoom-in" delay={i * 120}>
                      <div className="group relative flex items-start gap-3 sm:flex-col sm:items-center sm:gap-0">
                        {/* Dot */}
                        <div className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-[3px] border-primary-300 bg-white transition-all duration-300 group-hover:border-accent-500 group-hover:scale-110 sm:mb-3">
                          <div className="h-2.5 w-2.5 rounded-full bg-primary-500 transition-colors group-hover:bg-accent-500" />
                        </div>
                        <div className="sm:text-center">
                          <span className="block text-lg font-bold text-primary-900">
                            {m.year}
                          </span>
                          <span className="text-sm text-neutral-600">{m.text}</span>
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
      <div className="bg-neutral-50 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <div className="grid gap-8 md:grid-cols-2">
            <AnimateOnScroll animation="fade-up">
              <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-100 bg-white p-8 pt-10 shadow-sm">
                {/* Accent top border */}
                <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-primary-500 to-primary-700" />
                {/* Background number */}
                <span className="pointer-events-none absolute -right-2 -top-4 select-none text-[120px] font-black leading-none text-primary-50">
                  01
                </span>
                <div className="relative">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary-100 text-primary-700">
                    <Target size={26} />
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-primary-900">{a.missionTitle}</h3>
                  <p className="flex-1 leading-relaxed text-neutral-600">{a.missionText}</p>
                </div>
              </div>
            </AnimateOnScroll>
            <AnimateOnScroll animation="fade-up" delay={100}>
              <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-100 bg-white p-8 pt-10 shadow-sm">
                {/* Accent top border */}
                <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-accent-400 to-accent-600" />
                {/* Background number */}
                <span className="pointer-events-none absolute -right-2 -top-4 select-none text-[120px] font-black leading-none text-accent-50">
                  02
                </span>
                <div className="relative">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-accent-100 text-accent-600">
                    <Eye size={26} />
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-primary-900">{a.visionTitle}</h3>
                  <p className="flex-1 leading-relaxed text-neutral-600">{a.visionText}</p>
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
            <span className="mb-3 inline-block text-sm font-bold uppercase tracking-widest text-accent-500">
              {a.valuesOverline}
            </span>
            <h2 className="text-2xl font-extrabold text-primary-900 sm:text-3xl">
              {a.valuesTitle}
            </h2>
          </div>
        </AnimateOnScroll>
        <div className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Dotted connecting line (desktop) */}
          <div className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-1/2 hidden h-px border-t-2 border-dashed border-primary-100 lg:block" />

          {values.map((v, i) => (
            <AnimateOnScroll key={v.title} animation="fade-up" delay={i * 80}>
              <div
                className={`relative rounded-2xl border border-neutral-100 p-6 transition-all hover:border-primary-200 hover:shadow-lg ${
                  i % 2 === 0 ? "bg-white" : "bg-primary-50/40"
                }`}
              >
                {/* Connecting dot (desktop) */}
                <div className="absolute -top-1.5 left-1/2 hidden h-3 w-3 -translate-x-1/2 rounded-full border-2 border-primary-200 bg-white lg:block" />
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${
                    i % 2 === 0
                      ? "bg-primary-50 text-primary-700"
                      : "bg-accent-50 text-accent-600"
                  }`}
                >
                  <v.icon size={24} />
                </div>
                <h3 className="mb-2 font-bold text-primary-900">{v.title}</h3>
                <p className="text-sm leading-relaxed text-neutral-500">{v.description}</p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>

      {/* Sertifikalar */}
      <div className="bg-primary-900 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <AnimateOnScroll animation="fade-up">
            <div className="flex flex-col items-center text-center">
              <Award size={48} className="mb-4 text-accent-500" />
              <h2 className="mb-4 text-2xl font-extrabold text-white">{a.certsTitle}</h2>
              <p className="mb-8 max-w-xl text-white/70">{a.certsSubtitle}</p>
              <div className="flex flex-wrap justify-center gap-4">
                {["ISO 9001", "ISO 22000", "FSSC 22000"].map((cert) => (
                  <span
                    key={cert}
                    className="rounded-xl bg-white/10 px-6 py-3 font-bold text-white shadow-[0_0_20px_rgba(255,255,255,0.05)] backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/15 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]"
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
