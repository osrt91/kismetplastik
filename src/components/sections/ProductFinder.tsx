"use client";

import { useState, useMemo } from "react";
import Link from "@/components/ui/LocaleLink";
import { ArrowRight, RotateCcw, Package, Droplets, Shapes } from "lucide-react";
import { FaFlask, FaSprayCan, FaHandSparkles, FaPumpSoap, FaHotel } from "react-icons/fa6";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { useLocale } from "@/contexts/LocaleContext";
import { products, categories } from "@/data/products";

const sectorOptions = [
  { key: "all", icon: Package },
  { key: "kozmetik", icon: FaFlask },
  { key: "temizlik", icon: FaSprayCan },
  { key: "kisisel-bakim", icon: FaHandSparkles },
  { key: "ilaç", icon: FaPumpSoap },
  { key: "otel", icon: FaHotel },
];

const sectorLabels: Record<string, Record<string, string>> = {
  tr: { all: "Tüm Sektörler", kozmetik: "Kozmetik", temizlik: "Temizlik", "kisisel-bakim": "Kişisel Bakım", "ilaç": "İlaç", otel: "Otel" },
  en: { all: "All Sectors", kozmetik: "Cosmetics", temizlik: "Cleaning", "kisisel-bakim": "Personal Care", "ilaç": "Pharma", otel: "Hotel" },
};

const volumeRanges = [
  { key: "all", min: 0, max: 99999 },
  { key: "small", min: 0, max: 100 },
  { key: "medium", min: 100, max: 500 },
  { key: "large", min: 500, max: 99999 },
];

const shapeOptions = ["all", "silindir", "oval", "yuvarlak", "düz"];
const shapeLabelsMap: Record<string, Record<string, string>> = {
  tr: { all: "Tüm Şekiller", silindir: "Silindir", oval: "Oval", yuvarlak: "Yuvarlak", "düz": "Düz" },
  en: { all: "All Shapes", silindir: "Cylinder", oval: "Oval", yuvarlak: "Round", "düz": "Flat" },
};

export default function ProductFinder() {
  const { locale, dict } = useLocale();
  const h = dict.home;

  const [sector, setSector] = useState("all");
  const [volume, setVolume] = useState("all");
  const [shape, setShape] = useState("all");

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (shape !== "all" && p.shape !== shape) return false;
      if (volume !== "all") {
        const vol = parseInt(p.volume?.replace(/\D/g, "") || "0", 10);
        const range = volumeRanges.find((r) => r.key === volume);
        if (range && (vol < range.min || vol > range.max)) return false;
      }
      return true;
    });
  }, [sector, volume, shape]);

  const reset = () => { setSector("all"); setVolume("all"); setShape("all"); };
  const labels = sectorLabels[locale] ?? sectorLabels.tr;
  const shapeLabels = shapeLabelsMap[locale] ?? shapeLabelsMap.tr;

  const steps = [
    { num: 1, title: h.finderStep1, icon: Droplets },
    { num: 2, title: h.finderStep2, icon: Package },
    { num: 3, title: h.finderStep3, icon: Shapes },
  ];

  return (
    <section className="relative overflow-hidden bg-neutral-50 py-20 dark:bg-neutral-900 lg:py-28">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-accent-500/[0.03] blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 lg:px-6">
        <AnimateOnScroll animation="fade-up">
          <div className="mb-14 text-center">
            <span className="mb-3 inline-block text-xs font-bold uppercase tracking-[0.2em] bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
              {h.finderOverline}
            </span>
            <h2 className="mb-4 text-3xl font-extrabold text-primary-900 dark:text-white sm:text-4xl lg:text-5xl">
              {h.finderTitle}
            </h2>
            <p className="mx-auto max-w-2xl text-neutral-600 dark:text-neutral-400">
              {h.finderSubtitle}
            </p>
          </div>
        </AnimateOnScroll>

        <div className="mx-auto max-w-4xl">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Step 1: Sector */}
            <AnimateOnScroll animation="fade-up" delay={0}>
              <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-sm font-bold text-white">1</span>
                  <span className="text-sm font-bold text-primary-900 dark:text-white">{h.finderStep1}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {sectorOptions.map((s) => {
                    const Icon = s.icon;
                    const isActive = sector === s.key;
                    return (
                      <button
                        key={s.key}
                        onClick={() => setSector(s.key)}
                        className={`flex flex-col items-center gap-1.5 rounded-xl px-2 py-3 text-center transition-all ${
                          isActive
                            ? "bg-primary-500 text-white shadow-md shadow-primary-500/20"
                            : "bg-neutral-50 text-neutral-500 hover:bg-neutral-100 dark:bg-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-600"
                        }`}
                      >
                        <Icon size={18} />
                        <span className="text-[10px] font-semibold leading-tight">{labels[s.key]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </AnimateOnScroll>

            {/* Step 2: Volume */}
            <AnimateOnScroll animation="fade-up" delay={120}>
              <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-accent-500 to-accent-400 text-sm font-bold text-white">2</span>
                  <span className="text-sm font-bold text-primary-900 dark:text-white">{h.finderStep2}</span>
                </div>
                <div className="flex flex-col gap-2">
                  {volumeRanges.map((r) => {
                    const isActive = volume === r.key;
                    const label = r.key === "all" ? h.finderAllSectors : r.key === "small" ? h.finderVolSmall : r.key === "medium" ? h.finderVolMedium : h.finderVolLarge;
                    return (
                      <button
                        key={r.key}
                        onClick={() => setVolume(r.key)}
                        className={`rounded-xl px-4 py-2.5 text-left text-sm font-medium transition-all ${
                          isActive
                            ? "bg-accent-500 text-white shadow-md shadow-accent-500/20"
                            : "bg-neutral-50 text-neutral-500 hover:bg-neutral-100 dark:bg-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-600"
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </AnimateOnScroll>

            {/* Step 3: Shape */}
            <AnimateOnScroll animation="fade-up" delay={240}>
              <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-eco-500 to-eco-400 text-sm font-bold text-white">3</span>
                  <span className="text-sm font-bold text-primary-900 dark:text-white">{h.finderStep3}</span>
                </div>
                <div className="flex flex-col gap-2">
                  {shapeOptions.map((s) => {
                    const isActive = shape === s;
                    return (
                      <button
                        key={s}
                        onClick={() => setShape(s)}
                        className={`rounded-xl px-4 py-2.5 text-left text-sm font-medium transition-all ${
                          isActive
                            ? "bg-eco-500 text-white shadow-md shadow-eco-500/20"
                            : "bg-neutral-50 text-neutral-500 hover:bg-neutral-100 dark:bg-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-600"
                        }`}
                      >
                        {shapeLabels[s]}
                      </button>
                    );
                  })}
                </div>
              </div>
            </AnimateOnScroll>
          </div>

          <div className="mt-8">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-primary-900 dark:text-white">
                {h.finderResults} <span className="text-sm font-normal text-neutral-500">({filtered.length})</span>
              </h3>
              {(sector !== "all" || volume !== "all" || shape !== "all") && (
                <button
                  onClick={reset}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-primary-500 dark:hover:bg-neutral-800"
                >
                  <RotateCcw size={12} />
                  {h.finderReset}
                </button>
              )}
            </div>

            {filtered.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-8 text-center dark:border-neutral-600 dark:bg-neutral-800">
                <p className="text-sm text-neutral-500">{h.finderNoResult}</p>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.slice(0, 6).map((p) => {
                  const cat = categories.find((c) => c.slug === p.category);
                  return (
                    <Link
                      key={p.id}
                      href={`/urunler/${p.category}/${p.slug}`}
                      className="group flex items-center gap-4 rounded-xl border border-neutral-200 bg-white p-4 transition-all hover:border-primary-500/20 hover:shadow-lg hover:shadow-primary-500/5 hover:-translate-y-0.5 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-primary-500/30"
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-50 to-accent-50 text-primary-500 dark:from-neutral-700 dark:to-neutral-600 dark:text-primary-300">
                        <Package size={20} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-bold text-primary-900 dark:text-white">{p.name}</div>
                        <div className="flex items-center gap-2 text-[11px] text-neutral-500">
                          {p.volume && <span>{p.volume}</span>}
                          {cat && <span>&middot; {cat.name}</span>}
                        </div>
                      </div>
                      <ArrowRight size={14} className="shrink-0 text-neutral-300 transition-all group-hover:text-primary-500 group-hover:translate-x-0.5" />
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
