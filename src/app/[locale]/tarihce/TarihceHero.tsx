"use client";

import Link from "@/components/ui/LocaleLink";
import { ChevronRight } from "lucide-react";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { useLocale } from "@/contexts/LocaleContext";

export default function TarihceHero() {
  const { locale, dict } = useLocale();
  const nav = dict.nav;

  const title = locale === "en" ? "Our History" : "Tarihçemiz";
  const subtitle =
    locale === "en"
      ? "Since 1969, Kismet Plastik has been a trusted name in cosmetic packaging. Explore the milestones that define our journey."
      : "1969'dan bu yana Kısmet Plastik, kozmetik ambalaj sektörünün güvenilir ismi. Yolculuğumuzu şekillendiren kilometre taşlarını keşfedin.";

  return (
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
              {nav.home}
            </Link>
            <ChevronRight size={14} />
            <span className="text-white">{title}</span>
          </nav>
          <h1 className="mb-4 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          <p className="max-w-2xl text-lg text-white/70">{subtitle}</p>
        </AnimateOnScroll>
      </div>
    </div>
  );
}
