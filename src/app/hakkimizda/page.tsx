"use client";

import Image from "next/image";
import {
  Target,
  Eye,
  Award,
  Shield,
  Leaf,
  Zap,
  Users,
} from "lucide-react";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { useLocale } from "@/contexts/LocaleContext";

export default function HakkimizdaPage() {
  const { dict } = useLocale();
  const a = dict.about;

  const values = [
    { icon: Shield, title: a.valueQuality, description: a.valueQualityDesc },
    { icon: Leaf, title: a.valueSustainability, description: a.valueSustainabilityDesc },
    { icon: Zap, title: a.valueInnovation, description: a.valueInnovationDesc },
    { icon: Users, title: a.valueCustomer, description: a.valueCustomerDesc },
  ];

  const milestones = [
    { year: "2004", text: a.milestone2004 },
    { year: "2010", text: a.milestone2010 },
    { year: "2015", text: a.milestone2015 },
    { year: "2020", text: a.milestone2020 },
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
        <div className="relative mx-auto max-w-7xl px-4 lg:px-6">
          <AnimateOnScroll animation="fade-up">
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
                  src="/images/maskot.jpg"
                  alt="Kismet Plastik"
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
              <p className="mb-6 leading-relaxed text-neutral-600">{a.storyP2}</p>
              <div className="flex flex-wrap gap-4">
                {milestones.map((m) => (
                  <div
                    key={m.year}
                    className="rounded-xl border border-primary-100 bg-primary-50/50 px-4 py-2"
                  >
                    <span className="block text-lg font-bold text-primary-900">{m.year}</span>
                    <span className="text-sm text-neutral-600">{m.text}</span>
                  </div>
                ))}
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
              <div className="flex h-full flex-col rounded-2xl border border-neutral-100 bg-white p-8">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary-100 text-primary-700">
                  <Target size={26} />
                </div>
                <h3 className="mb-3 text-xl font-bold text-primary-900">{a.missionTitle}</h3>
                <p className="flex-1 leading-relaxed text-neutral-600">{a.missionText}</p>
              </div>
            </AnimateOnScroll>
            <AnimateOnScroll animation="fade-up" delay={100}>
              <div className="flex h-full flex-col rounded-2xl border border-neutral-100 bg-white p-8">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-accent-100 text-accent-600">
                  <Eye size={26} />
                </div>
                <h3 className="mb-3 text-xl font-bold text-primary-900">{a.visionTitle}</h3>
                <p className="flex-1 leading-relaxed text-neutral-600">{a.visionText}</p>
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
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => (
            <AnimateOnScroll key={v.title} animation="fade-up" delay={i * 80}>
              <div className="rounded-2xl border border-neutral-100 bg-white p-6 transition-all hover:border-primary-100 hover:shadow-lg">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
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
                <span className="rounded-xl bg-white/10 px-6 py-3 font-bold text-white">ISO 9001</span>
                <span className="rounded-xl bg-white/10 px-6 py-3 font-bold text-white">ISO 22000</span>
                <span className="rounded-xl bg-white/10 px-6 py-3 font-bold text-white">FSSC 22000</span>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
