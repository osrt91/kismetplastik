"use client";

import Link from "@/components/ui/LocaleLink";
import { ChevronRight, ArrowRight } from "lucide-react";
import { FaFlask, FaSprayCan, FaHandSparkles, FaPumpSoap, FaHotel, FaGears } from "react-icons/fa6";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { useLocale } from "@/contexts/LocaleContext";

const sectorIcons = [FaFlask, FaSprayCan, FaHandSparkles, FaPumpSoap, FaHotel, FaGears];
const sectorSlugs = ["kozmetik-guzellik", "kolonya-parfumeri", "kisisel-bakim", "temizlik-hijyen", "otelcilik-horeca", "ozel-kaliplama"];
const sectorColors = [
  "from-pink-500/10 to-pink-600/5",
  "from-amber-500/10 to-amber-600/5",
  "from-blue-500/10 to-blue-600/5",
  "from-emerald-500/10 to-emerald-600/5",
  "from-purple-500/10 to-purple-600/5",
  "from-orange-500/10 to-orange-600/5",
];

const labels: Record<string, Record<string, string>> = {
  tr: {
    title: "Sektörel Çözümler",
    subtitle: "Her sektörün ihtiyacına özel kozmetik ambalaj çözümleri. Sektörünüze uygun ürünleri keşfedin.",
    viewProducts: "Ürünleri İncele",
  },
  en: {
    title: "Industry Solutions",
    subtitle: "Cosmetic packaging solutions tailored to every industry. Discover products suitable for your sector.",
    viewProducts: "View Products",
  },
};

export default function SektorlerPage() {
  const { locale, dict } = useLocale();
  const t = labels[locale] || labels.tr;
  const nav = dict.nav;
  const sectors = dict.homeSectors as { name: string; description: string }[];

  return (
    <section className="bg-white">
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-700 to-primary-900 py-20 lg:py-28">
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="h-full w-full" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`, backgroundSize: "40px 40px" }} />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 lg:px-6">
          <AnimateOnScroll animation="fade-up">
            <nav className="mb-6 flex items-center gap-1.5 text-sm text-white/60">
              <Link href="/" className="transition-colors hover:text-white">{nav.home}</Link>
              <ChevronRight size={14} />
              <span className="text-white">{t.title}</span>
            </nav>
            <h1 className="mb-4 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">{t.title}</h1>
            <p className="max-w-2xl text-lg text-white/70">{t.subtitle}</p>
          </AnimateOnScroll>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6 lg:py-20">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {sectors.map((sector, i) => {
            const Icon = sectorIcons[i];
            return (
              <AnimateOnScroll key={sector.name} animation="fade-up" delay={i * 80}>
                <Link
                  href={`/sektorler/${sectorSlugs[i]}`}
                  className="group relative block overflow-hidden rounded-2xl border border-neutral-100 bg-white transition-all hover:-translate-y-1 hover:border-primary-200 hover:shadow-xl"
                >
                  <div className={`flex h-48 items-center justify-center bg-gradient-to-br ${sectorColors[i]}`}>
                    <Icon size={64} className="text-primary-300 transition-transform duration-300 group-hover:scale-125" />
                  </div>
                  <div className="p-6">
                    <h3 className="mb-2 text-lg font-bold text-primary-900">{sector.name}</h3>
                    <p className="mb-4 text-sm leading-relaxed text-neutral-500">{sector.description}</p>
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700 transition-colors group-hover:text-accent-600">
                      {t.viewProducts}
                      <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-accent-400 to-primary-500 transition-all duration-500 group-hover:w-full" />
                </Link>
              </AnimateOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
