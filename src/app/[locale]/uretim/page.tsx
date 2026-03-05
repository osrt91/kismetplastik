"use client";

import Link from "@/components/ui/LocaleLink";
import {
  ChevronRight,
  Factory,
  Zap,
  Gauge,
  Cog,
  Thermometer,
  Droplets,
  Package,
  Truck,
  ArrowRight,
  CalendarCheck,
} from "lucide-react";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { useLocale } from "@/contexts/LocaleContext";

const facilityStats = [
  { value: "15.000 m²", label: "Kapalı Üretim Alanı" },
  { value: "24/7", label: "Kesintisiz Üretim" },
  { value: "50+", label: "Üretim Makinesi" },
  { value: "200+", label: "Uzman Personel" },
];

const productionStages = [
  {
    icon: Droplets,
    title: "Hammadde Hazırlama",
    description:
      "Virgin PET granüller kurutma fırınlarında nem oranı optimum seviyeye getirilir. Renk masterbatch'leri hassas dozajlama ile karıştırılır.",
  },
  {
    icon: Thermometer,
    title: "Enjeksiyon Kalıplama",
    description:
      "Yüksek hassasiyetli enjeksiyon makinelerinde PET preformlar üretilir. Ağız kısmı kristalizasyon işlemiyle güçlendirilir.",
  },
  {
    icon: Zap,
    title: "Şişirme (Blow Molding)",
    description:
      "Preformlar yüksek basınç altında kalıplara şişirilir. Isıtma ve şişirme parametreleri otomatik olarak kontrol edilir.",
  },
  {
    icon: Gauge,
    title: "Kalite Kontrol",
    description:
      "Her parti ürün boyutsal ölçüm, sızdırmazlık testi, basınç dayanım testi ve görsel kontrolden geçirilir.",
  },
  {
    icon: Package,
    title: "Paketleme",
    description:
      "Onaylanan ürünler hijyenik koşullarda polietilen torbalara paketlenir ve paletlenir.",
  },
  {
    icon: Truck,
    title: "Depolama & Sevkiyat",
    description:
      "Klimalı depolarda muhafaza edilen ürünler, müşteri talebine göre zamanında sevk edilir.",
  },
];

const machines = [
  { name: "PET Enjeksiyon Makineleri", count: "12 Adet", detail: "Husky, Netstal", qty: 12 },
  { name: "Şişirme Makineleri", count: "18 Adet", detail: "Sidel, SMF", qty: 18 },
  { name: "Lineer Şişirme Hatları", count: "8 Adet", detail: "Otomatik", qty: 8 },
  { name: "Kalıp CNC İşleme", count: "4 Adet", detail: "5 eksenli", qty: 4 },
  { name: "Kalite Kontrol Cihazları", count: "15+ Adet", detail: "AGR, CMC", qty: 15 },
  { name: "Paketleme Hatları", count: "6 Adet", detail: "Tam otomatik", qty: 6 },
];

const machineIcons = [Thermometer, Zap, Zap, Cog, Gauge, Package];
const maxQty = Math.max(...machines.map((m) => m.qty));

export default function UretimPage() {
  const { dict } = useLocale();
  const p = dict.production;
  const nav = dict.nav;

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
        <div className="pointer-events-none absolute -right-20 -top-20 opacity-[0.04]">
          <Factory size={500} className="text-white" strokeWidth={0.7} />
        </div>
        <div className="pointer-events-none absolute -bottom-10 -left-10 opacity-[0.03]">
          <Cog size={300} className="animate-[spin_60s_linear_infinite] text-white" strokeWidth={0.7} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#F59E0B]/5 via-transparent to-[#F59E0B]/5 animate-pulse" style={{ animationDuration: "6s" }} />
        <div className="relative mx-auto max-w-7xl px-4 lg:px-6">
          <AnimateOnScroll animation="fade-up">
            <nav className="mb-6 flex items-center gap-1.5 text-sm text-white/60">
              <Link href="/" className="hover:text-white">{nav.home}</Link>
              <ChevronRight size={14} />
              <span className="text-white">Üretim Tesisi</span>
            </nav>
            <h1 className="mb-4 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
              {p.heroTitle}
            </h1>
            <div className="mt-4 mb-6 h-1 w-20 rounded-full bg-[#F59E0B]" />
            <p className="max-w-2xl text-lg text-white/70">
              {p.heroSubtitle}
            </p>
          </AnimateOnScroll>
        </div>
      </div>

      {/* Tesis İstatistikleri */}
      <div className="relative -mt-10 mx-auto max-w-5xl px-4 lg:px-6">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {facilityStats.map((stat, i) => (
            <AnimateOnScroll key={stat.label} animation="fade-up" delay={i * 80}>
              <div className="group rounded-2xl border border-[#0A1628]/5 bg-white p-5 text-center shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-b-[3px] border-b-[#F59E0B]/60 dark:border-white/10 dark:bg-white/5 dark:border-b-[#F59E0B]/60">
                <p className="text-2xl font-black text-[#0A1628] sm:text-3xl group-hover:text-[#F59E0B] transition-colors dark:text-white">
                  {stat.value}
                </p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">{stat.label}</p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>

      {/* Tesis Tanıtımı */}
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-6 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <AnimateOnScroll animation="fade-right">
            <div className="group aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-[#0A1628]/5 to-[#0A1628]/10 shadow-lg transition-shadow duration-500 hover:shadow-2xl">
              <div className="flex h-full items-center justify-center transition-transform duration-500 group-hover:scale-105">
                <Factory size={80} className="text-[#0A1628]/20 dark:text-white/20" />
              </div>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll animation="fade-left">
            <div>
              <span className="mb-3 inline-block text-sm font-bold uppercase tracking-widest text-[#F59E0B]">
                {p.facilityOverline}
              </span>
              <h2 className="mb-6 text-2xl font-extrabold text-[#0A1628] dark:text-white sm:text-3xl">
                {p.facilityTitle}
              </h2>
              <p className="mb-4 leading-relaxed text-neutral-600 dark:text-neutral-300">
                İkitelli OSB Başakşehir&apos;de yer alan 15.000 m² kapalı alana sahip
                üretim tesisimiz, Avrupa standartlarında donatılmış modern makinelerle hizmet vermektedir.
              </p>
              <p className="mb-6 leading-relaxed text-neutral-600 dark:text-neutral-300">
                Enjeksiyondan şişirmeye, kalıp üretiminden paketlemeye kadar tüm süreçler
                tek çatı altında gerçekleştirilmekte olup aylık milyonlarca adet üretim kapasitesine sahibiz.
              </p>
              <Link
                href="/teklif-al"
                className="inline-flex items-center gap-2 rounded-xl bg-[#F59E0B] px-6 py-3.5 font-bold text-[#0A1628] shadow-lg shadow-[#F59E0B]/20 transition-all hover:bg-[#F59E0B]/90 hover:-translate-y-0.5 hover:shadow-xl"
              >
                {p.visitCta}
                <ArrowRight size={16} />
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </div>

      {/* Üretim Aşamaları — Pipeline */}
      <div className="bg-white py-16 dark:bg-[#0A1628]/80 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <AnimateOnScroll animation="fade-up">
            <div className="mb-14 text-center">
              <span className="mb-3 inline-block text-sm font-bold uppercase tracking-widest text-[#F59E0B]">
                {p.processOverline}
              </span>
              <h2 className="mb-4 text-3xl font-extrabold text-[#0A1628] dark:text-white sm:text-4xl">
                {p.processTitle}
              </h2>
              <p className="mx-auto max-w-2xl text-neutral-500 dark:text-neutral-400">
                {p.processSubtitle}
              </p>
            </div>
          </AnimateOnScroll>

          <div className="relative">
            {/* Desktop: vertical connector line */}
            <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-[#0A1628]/10 via-[#F59E0B]/30 to-[#0A1628]/10 lg:block" />

            <div className="space-y-6 lg:space-y-0">
              {productionStages.map((stage, i) => {
                const isEven = i % 2 === 0;
                return (
                  <AnimateOnScroll
                    key={stage.title}
                    animation={isEven ? "fade-right" : "fade-left"}
                    delay={i * 100}
                  >
                    <div className="relative lg:flex lg:items-center lg:min-h-[180px]">
                      {/* Card — alternating sides on desktop */}
                      <div
                        className={`w-full lg:w-[calc(50%-40px)] ${
                          isEven ? "lg:mr-auto" : "lg:ml-auto lg:order-2"
                        }`}
                      >
                        <div className="group flex h-full flex-col rounded-2xl border border-[#0A1628]/5 bg-[#FAFAF7] p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-[#F59E0B]/20 dark:border-white/10 dark:bg-white/5">
                          <div className="mb-4 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0A1628]/5 text-[#0A1628] transition-colors group-hover:bg-[#F59E0B] group-hover:text-[#0A1628] dark:bg-white/10 dark:text-white">
                              <stage.icon size={20} />
                            </div>
                            <h3 className="font-bold text-[#0A1628] dark:text-white">{stage.title}</h3>
                          </div>
                          <p className="flex-1 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
                            {stage.description}
                          </p>
                        </div>
                      </div>

                      {/* Center circle step indicator — desktop only */}
                      <div className="absolute left-1/2 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 lg:flex">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full border-[3px] border-[#F59E0B] bg-white shadow-md dark:bg-[#0A1628]">
                          <span className="text-sm font-extrabold text-[#0A1628] dark:text-white">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                        </div>
                      </div>

                      {/* Mobile step badge */}
                      <div className="absolute -left-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#F59E0B] bg-white text-xs font-extrabold text-[#0A1628] shadow dark:bg-[#0A1628] dark:text-white lg:hidden">
                        {i + 1}
                      </div>

                      {/* Arrow connector — mobile only (except last item) */}
                      {i < productionStages.length - 1 && (
                        <div className="flex justify-center py-1 lg:hidden">
                          <ArrowRight size={20} className="rotate-90 text-[#F59E0B]" />
                        </div>
                      )}
                    </div>
                  </AnimateOnScroll>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Makine Parkuru */}
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-6 lg:py-24">
        <AnimateOnScroll animation="fade-up">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-block text-sm font-bold uppercase tracking-widest text-[#F59E0B]">
              {p.machinesOverline}
            </span>
            <h2 className="mb-4 text-3xl font-extrabold text-[#0A1628] dark:text-white sm:text-4xl">
              {p.machinesTitle}
            </h2>
          </div>
        </AnimateOnScroll>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {machines.map((machine, i) => {
            const Icon = machineIcons[i] ?? Cog;
            const pct = Math.round((machine.qty / maxQty) * 100);
            return (
              <AnimateOnScroll key={machine.name} animation="fade-up" delay={i * 60}>
                <div className="group relative overflow-hidden rounded-2xl border border-[#0A1628]/5 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#F59E0B]/20 hover:shadow-xl dark:border-white/10 dark:bg-white/5">
                  <div className="pointer-events-none absolute -right-4 -top-4 opacity-[0.04] transition-opacity group-hover:opacity-[0.08]">
                    <Icon size={90} strokeWidth={0.8} />
                  </div>
                  <div className="relative">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0A1628]/5 transition-colors group-hover:bg-[#F59E0B]/10 dark:bg-white/10">
                        <Icon size={22} className="text-[#0A1628] transition-colors group-hover:text-[#F59E0B] dark:text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-[#0A1628] dark:text-white">{machine.name}</h3>
                        <p className="text-xs text-neutral-400">{machine.detail}</p>
                      </div>
                    </div>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span className="font-semibold text-[#0A1628] dark:text-white">{machine.count}</span>
                      <span className="text-xs text-neutral-400">{pct}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-[#0A1628]/5 dark:bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#0A1628] to-[#F59E0B] transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              </AnimateOnScroll>
            );
          })}
        </div>
      </div>

      {/* Fabrika Turu CTA */}
      <div className="bg-gradient-to-br from-[#0A1628] via-[#0f2240] to-[#0A1628] py-16 lg:py-20">
        <div className="relative mx-auto max-w-4xl px-4 text-center lg:px-6">
          <div className="pointer-events-none absolute inset-0 opacity-[0.03]">
            <div
              className="h-full w-full"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                backgroundSize: "32px 32px",
              }}
            />
          </div>
          <AnimateOnScroll animation="fade-up">
            <div className="relative">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F59E0B]/20">
                <CalendarCheck size={32} className="text-[#F59E0B]" />
              </div>
              <h2 className="mb-4 text-2xl font-extrabold text-white sm:text-3xl">
                Üretim Tesisimizi Yerinde Görün
              </h2>
              <p className="mx-auto mb-8 max-w-xl text-white/60">
                Modern üretim hatlarımızı, kalite kontrol süreçlerimizi ve makine parkurumuzu
                yerinde incelemek için fabrika turu randevusu alın.
              </p>
              <Link
                href="/teklif-al"
                className="inline-flex items-center gap-2.5 rounded-xl bg-[#F59E0B] px-8 py-4 font-bold text-[#0A1628] shadow-lg shadow-[#F59E0B]/20 transition-all hover:bg-[#F59E0B]/90 hover:-translate-y-0.5 hover:shadow-xl"
              >
                <CalendarCheck size={18} />
                Fabrika Turu Randevusu Al
                <ArrowRight size={16} />
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
