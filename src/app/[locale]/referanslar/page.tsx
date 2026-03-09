"use client";

import Link from "@/components/ui/LocaleLink";
import {
  ChevronRight,
  Building2,
  Handshake,
  Globe,
  ArrowRight,
} from "lucide-react";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import ReferenceLogos from "@/components/ui/ReferenceLogos";
import { useLocale } from "@/contexts/LocaleContext";

export default function ReferanslarPage() {
  const { locale } = useLocale();
  const isTr = locale === "tr";

  const stats = [
    {
      icon: Building2,
      value: "500+",
      label: isTr ? "Firma" : "Companies",
    },
    {
      icon: Handshake,
      value: "30+",
      label: isTr ? "Yıllık İş Birliği" : "Years of Collaboration",
    },
    {
      icon: Globe,
      value: "8+",
      label: isTr ? "Sektör" : "Sectors",
    },
  ];

  return (
    <section className="bg-white dark:bg-neutral-900">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-700 to-primary-900 py-20 lg:py-28">
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

        {/* Animated gradient orbs */}
        <div className="absolute -left-32 -top-32 h-96 w-96 animate-pulse rounded-full bg-accent-500/10 blur-3xl" />
        <div
          className="absolute -bottom-24 right-0 h-80 w-80 rounded-full bg-primary-400/15 blur-3xl"
          style={{ animation: "pulse 4s ease-in-out infinite 1s" }}
        />

        <div className="relative mx-auto max-w-7xl px-4 lg:px-6">
          <AnimateOnScroll animation="fade-up">
            {/* Breadcrumb */}
            <nav className="mb-6 flex items-center gap-1.5 text-sm text-white/60">
              <Link href="/" className="transition-colors hover:text-white">
                {isTr ? "Ana Sayfa" : "Home"}
              </Link>
              <ChevronRight size={14} />
              <span className="text-white">
                {isTr ? "Referanslarımız" : "Our References"}
              </span>
            </nav>
            <h1 className="mb-4 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
              {isTr ? "Referanslarımız" : "Our References"}
            </h1>
            <p className="max-w-2xl text-lg text-white/70">
              {isTr
                ? "Kozmetik, parfümeri, temizlik ve kişisel bakım sektörlerinde güvenilir ambalaj çözüm ortağınız. 500'den fazla firma ile uzun soluklu iş birlikleri."
                : "Your trusted packaging partner in cosmetics, perfumery, cleaning, and personal care. Long-term collaborations with over 500 companies."}
            </p>
          </AnimateOnScroll>
        </div>
      </div>

      {/* Logos Grid */}
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-6 lg:py-24">
        <AnimateOnScroll animation="fade-up">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-block text-sm font-bold uppercase tracking-widest text-accent-500">
              {isTr ? "Güvenilir İş Ortaklıkları" : "Trusted Partnerships"}
            </span>
            <h2 className="text-2xl font-extrabold text-primary-900 dark:text-white sm:text-3xl">
              {isTr
                ? "Birlikte Çalıştığımız Markalar"
                : "Brands We Work With"}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-neutral-600 dark:text-neutral-300">
              {isTr
                ? "Farklı sektörlerden lider markalar, ambalaj ihtiyaçları için bizi tercih ediyor."
                : "Leading brands from various sectors choose us for their packaging needs."}
            </p>
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll animation="fade-up" delay={100}>
          <ReferenceLogos variant="full" />
        </AnimateOnScroll>
      </div>

      {/* Stats */}
      <div className="bg-primary-900 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <AnimateOnScroll animation="fade-up">
            <div className="grid gap-8 sm:grid-cols-3">
              {stats.map((stat) => (
                <div
                  key={stat.value}
                  className="group flex flex-col items-center text-center"
                >
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-accent-500 transition-all duration-300 group-hover:scale-110 group-hover:bg-white/15">
                    <stat.icon size={28} />
                  </div>
                  <span className="mb-1 text-4xl font-extrabold text-white lg:text-5xl">
                    {stat.value}
                  </span>
                  <span className="text-sm font-medium text-white/70">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </AnimateOnScroll>
        </div>
      </div>

      {/* CTA Section */}
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-6 lg:py-24">
        <AnimateOnScroll animation="fade-up">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-50 to-accent-50 p-8 text-center dark:from-neutral-800 dark:to-neutral-800/50 sm:p-12 lg:p-16">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-[0.03]">
              <div
                className="h-full w-full"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 1px 1px, var(--primary-900) 1px, transparent 0)",
                  backgroundSize: "32px 32px",
                }}
              />
            </div>

            <div className="relative">
              <h2 className="mb-4 text-2xl font-extrabold text-primary-900 dark:text-white sm:text-3xl">
                {isTr
                  ? "Referanslarımız Arasında Yerinizi Alın"
                  : "Join Our References"}
              </h2>
              <p className="mx-auto mb-8 max-w-xl text-neutral-600 dark:text-neutral-300">
                {isTr
                  ? "Kozmetik ambalaj ihtiyaçlarınız için uzman ekibimizle tanışın. Size özel çözümler sunalım."
                  : "Meet our expert team for your cosmetic packaging needs. Let us offer you custom solutions."}
              </p>
              <Link
                href="/teklif-al"
                className="inline-flex items-center gap-2 rounded-xl bg-primary-900 px-8 py-4 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-700 hover:shadow-xl dark:bg-primary-500 dark:hover:bg-primary-400"
              >
                {isTr ? "Teklif Alın" : "Get a Quote"}
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
