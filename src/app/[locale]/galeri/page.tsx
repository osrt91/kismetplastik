"use client";

import { useState } from "react";
import Link from "@/components/ui/LocaleLink";
import {
  ChevronRight,
  Camera,
  Factory,
  Package,
  CalendarDays,
  ImageOff,
  Cog,
  FlaskConical,
  Truck,
  Boxes,
  Pipette,
  Sparkles,
  Award,
  Users,
  Presentation,
  Handshake,
} from "lucide-react";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { useLocale } from "@/contexts/LocaleContext";

type TabKey = "uretim" | "urunler" | "etkinlikler";

interface PlaceholderCard {
  titleKey: string;
  descKey: string;
  icon: typeof Factory;
  accent: string;
}

const placeholderKeys: Record<TabKey, PlaceholderCard[]> = {
  uretim: [
    { titleKey: "injectionLine", descKey: "injectionLineDesc", icon: Cog, accent: "from-blue-500/10 to-blue-600/5" },
    { titleKey: "blowMolding", descKey: "blowMoldingDesc", icon: Factory, accent: "from-indigo-500/10 to-indigo-600/5" },
    { titleKey: "qualityLab", descKey: "qualityLabDesc", icon: FlaskConical, accent: "from-emerald-500/10 to-emerald-600/5" },
    { titleKey: "rawStorage", descKey: "rawStorageDesc", icon: Boxes, accent: "from-amber-500/10 to-amber-600/5" },
    { titleKey: "moldWorkshop", descKey: "moldWorkshopDesc", icon: Cog, accent: "from-purple-500/10 to-purple-600/5" },
    { titleKey: "shippingArea", descKey: "shippingAreaDesc", icon: Truck, accent: "from-teal-500/10 to-teal-600/5" },
  ],
  urunler: [
    { titleKey: "cosmeticBottles", descKey: "cosmeticBottlesDesc", icon: Pipette, accent: "from-pink-500/10 to-pink-600/5" },
    { titleKey: "cosmeticPackaging", descKey: "cosmeticPackagingDesc", icon: Package, accent: "from-rose-500/10 to-rose-600/5" },
    { titleKey: "capVarieties", descKey: "capVarietiesDesc", icon: Sparkles, accent: "from-violet-500/10 to-violet-600/5" },
    { titleKey: "airlessPumps", descKey: "airlessPumpsDesc", icon: Pipette, accent: "from-cyan-500/10 to-cyan-600/5" },
    { titleKey: "tubePackaging", descKey: "tubePackagingDesc", icon: Package, accent: "from-orange-500/10 to-orange-600/5" },
    { titleKey: "customDesigns", descKey: "customDesignsDesc", icon: Sparkles, accent: "from-fuchsia-500/10 to-fuchsia-600/5" },
    { titleKey: "sprayBottles", descKey: "sprayBottlesDesc", icon: Pipette, accent: "from-sky-500/10 to-sky-600/5" },
    { titleKey: "setPackaging", descKey: "setPackagingDesc", icon: Boxes, accent: "from-lime-500/10 to-lime-600/5" },
  ],
  etkinlikler: [
    { titleKey: "beautyworld", descKey: "beautyworldDesc", icon: Award, accent: "from-amber-500/10 to-amber-600/5" },
    { titleKey: "cosmoprof", descKey: "cosmoprofDesc", icon: Presentation, accent: "from-red-500/10 to-red-600/5" },
    { titleKey: "istanbulFair", descKey: "istanbulFairDesc", icon: CalendarDays, accent: "from-blue-500/10 to-blue-600/5" },
    { titleKey: "factoryVisits", descKey: "factoryVisitsDesc", icon: Users, accent: "from-green-500/10 to-green-600/5" },
    { titleKey: "dealerMeetings", descKey: "dealerMeetingsDesc", icon: Handshake, accent: "from-purple-500/10 to-purple-600/5" },
    { titleKey: "trainingSeminars", descKey: "trainingSeminarsDesc", icon: Presentation, accent: "from-teal-500/10 to-teal-600/5" },
  ],
};

export default function GaleriPage() {
  const { dict } = useLocale();
  const nav = dict.nav;
  const g = dict.gallery;

  const tabDefs: { key: TabKey; label: string; icon: typeof Factory }[] = [
    { key: "uretim", label: g.tabProduction, icon: Factory },
    { key: "urunler", label: g.tabProducts, icon: Package },
    { key: "etkinlikler", label: g.tabEvents, icon: CalendarDays },
  ];

  const [activeTab, setActiveTab] = useState<TabKey>("uretim");
  const currentCards = placeholderKeys[activeTab];

  return (
    <section className="bg-white dark:bg-neutral-900">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 py-20 lg:py-28">
        <div className="absolute inset-0 opacity-[0.03]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-[0.04]">
          <Camera size={400} strokeWidth={0.5} className="text-white" />
        </div>
        <div className="absolute -left-20 bottom-0 opacity-[0.03]">
          <ImageOff size={300} strokeWidth={0.5} className="text-white" />
        </div>

        <div className="absolute -left-20 -top-20 h-72 w-72 animate-pulse rounded-full bg-accent-500/10 blur-3xl" />
        <div
          className="absolute -bottom-16 right-10 h-64 w-64 rounded-full bg-primary-400/15 blur-3xl"
          style={{ animation: "pulse 4s ease-in-out infinite 1s" }}
        />

        <div className="relative mx-auto max-w-7xl px-4 lg:px-6">
          <AnimateOnScroll animation="fade-up">
            <nav className="mb-6 flex items-center gap-1.5 text-sm text-white/60">
              <Link href="/" className="transition-colors hover:text-white">
                {nav.home}
              </Link>
              <ChevronRight size={14} />
              <span className="text-white">{g.heroTitle}</span>
            </nav>
            <h1 className="mb-4 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
              {g.heroTitle}
            </h1>
            <p className="max-w-2xl text-lg text-white/70">
              {g.heroSubtitle}
            </p>
          </AnimateOnScroll>
        </div>
      </div>

      <div className="h-1 bg-gradient-to-r from-transparent via-primary-200 to-transparent" />

      {/* Tab Navigation + Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6 lg:py-20">
        {/* Tabs */}
        <AnimateOnScroll animation="fade-up">
          <div className="mb-12 flex flex-wrap justify-center gap-2">
            {tabDefs.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`relative flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-primary-900 text-white shadow-lg shadow-primary-900/20"
                      : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                  }`}
                >
                  <tab.icon size={18} />
                  {tab.label}
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 h-[3px] w-8 -translate-x-1/2 rounded-full bg-accent-500" />
                  )}
                </button>
              );
            })}
          </div>
        </AnimateOnScroll>

        {/* Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {currentCards.map((card, i) => {
            const title = (g as Record<string, string>)[card.titleKey];
            const desc = (g as Record<string, string>)[card.descKey];
            return (
              <AnimateOnScroll key={`${activeTab}-${i}`} animation="fade-up" delay={i * 70}>
                <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-100 dark:border-neutral-700 bg-white dark:bg-neutral-800 transition-all duration-300 hover:-translate-y-1 hover:border-primary-100 hover:shadow-xl">
                  <div
                    className={`relative flex h-48 items-center justify-center bg-gradient-to-br ${card.accent}`}
                  >
                    <div className="flex flex-col items-center gap-3 text-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/80 shadow-sm backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                        <card.icon size={28} className="text-primary-600" />
                      </div>
                      <span className="rounded-full bg-white/70 px-3 py-1 text-[11px] font-semibold text-neutral-500 backdrop-blur-sm">
                        {g.photoComingSoon}
                      </span>
                    </div>
                    <div className="absolute right-3 top-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <Camera size={16} className="text-primary-400" />
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="mb-1.5 font-bold text-primary-900 dark:text-white">{title}</h3>
                    <p className="text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">{desc}</p>
                  </div>
                  <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-500 group-hover:w-full" />
                </div>
              </AnimateOnScroll>
            );
          })}
        </div>

        {/* Info banner */}
        <AnimateOnScroll animation="fade-up">
          <div className="mt-14 flex items-center gap-4 rounded-2xl border border-primary-100 dark:border-neutral-700 bg-primary-50/50 dark:bg-neutral-800/50 p-6 sm:p-8">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-700">
              <Camera size={24} />
            </div>
            <div>
              <h3 className="mb-1 font-bold text-primary-900 dark:text-white">{g.updatingTitle}</h3>
              <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                {g.updatingDesc}{" "}
                <Link
                  href="/iletisim"
                  className="font-semibold text-primary-700 underline-offset-2 transition-colors hover:text-accent-600 hover:underline"
                >
                  {g.updatingLink}
                </Link>
                .
              </p>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
