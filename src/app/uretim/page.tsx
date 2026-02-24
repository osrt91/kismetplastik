"use client";

import Link from "next/link";
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
  { name: "PET Enjeksiyon Makineleri", count: "12 Adet", detail: "Husky, Netstal" },
  { name: "Şişirme Makineleri", count: "18 Adet", detail: "Sidel, SMF" },
  { name: "Lineer Şişirme Hatları", count: "8 Adet", detail: "Otomatik" },
  { name: "Kalıp CNC İşleme", count: "4 Adet", detail: "5 eksenli" },
  { name: "Kalite Kontrol Cihazları", count: "15+ Adet", detail: "AGR, CMC" },
  { name: "Paketleme Hatları", count: "6 Adet", detail: "Tam otomatik" },
];

export default function UretimPage() {
  const { dict } = useLocale();
  const p = dict.production;
  const nav = dict.nav;

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
            <nav className="mb-6 flex items-center gap-1.5 text-sm text-white/60">
              <Link href="/" className="hover:text-white">{nav.home}</Link>
              <ChevronRight size={14} />
              <span className="text-white">Üretim Tesisi</span>
            </nav>
            <h1 className="mb-4 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
              {p.heroTitle}
            </h1>
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
              <div className="rounded-2xl border border-neutral-100 bg-white p-5 text-center shadow-lg">
                <p className="text-2xl font-black text-primary-900 sm:text-3xl">{stat.value}</p>
                <p className="text-sm text-neutral-500">{stat.label}</p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>

      {/* Tesis Tanıtımı */}
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-6 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <AnimateOnScroll animation="fade-right">
            <div className="aspect-[4/3] overflow-hidden rounded-3xl bg-gradient-to-br from-primary-100 to-primary-50">
              <div className="flex h-full items-center justify-center">
                <Factory size={80} className="text-primary-300" />
              </div>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll animation="fade-left">
            <div>
              <span className="mb-3 inline-block text-sm font-bold uppercase tracking-widest text-accent-500">
                {p.facilityOverline}
              </span>
              <h2 className="mb-6 text-2xl font-extrabold text-primary-900 sm:text-3xl">
                {p.facilityTitle}
              </h2>
              <p className="mb-4 leading-relaxed text-neutral-600">
                İstanbul Organize Sanayi Bölgesi&apos;nde yer alan 15.000 m² kapalı alana sahip
                üretim tesisimiz, Avrupa standartlarında donatılmış modern makinelerle hizmet vermektedir.
              </p>
              <p className="mb-6 leading-relaxed text-neutral-600">
                Enjeksiyondan şişirmeye, kalıp üretiminden paketlemeye kadar tüm süreçler
                tek çatı altında gerçekleştirilmekte olup aylık milyonlarca adet üretim kapasitesine sahibiz.
              </p>
              <Link
                href="/teklif-al"
                className="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-6 py-3.5 font-bold text-primary-900 shadow-lg transition-all hover:bg-accent-400 hover:-translate-y-0.5"
              >
                {p.visitCta}
                <ArrowRight size={16} />
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </div>

      {/* Üretim Aşamaları */}
      <div className="bg-neutral-50 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <AnimateOnScroll animation="fade-up">
            <div className="mb-14 text-center">
              <span className="mb-3 inline-block text-sm font-bold uppercase tracking-widest text-accent-500">
                {p.processOverline}
              </span>
              <h2 className="mb-4 text-3xl font-extrabold text-primary-900 sm:text-4xl">
                {p.processTitle}
              </h2>
              <p className="mx-auto max-w-2xl text-neutral-500">
                {p.processSubtitle}
              </p>
            </div>
          </AnimateOnScroll>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {productionStages.map((stage, i) => (
              <AnimateOnScroll key={stage.title} animation="fade-up" delay={i * 80}>
                <div className="flex h-full flex-col rounded-2xl border border-neutral-100 bg-white p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
                      <stage.icon size={20} />
                    </div>
                    <span className="text-sm font-bold text-primary-300">
                      Aşama {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="mb-2 font-bold text-primary-900">{stage.title}</h3>
                  <p className="flex-1 text-sm leading-relaxed text-neutral-500">
                    {stage.description}
                  </p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </div>

      {/* Makine Parkuru */}
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-6 lg:py-24">
        <AnimateOnScroll animation="fade-up">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-block text-sm font-bold uppercase tracking-widest text-accent-500">
              {p.machinesOverline}
            </span>
            <h2 className="mb-4 text-3xl font-extrabold text-primary-900 sm:text-4xl">
              {p.machinesTitle}
            </h2>
          </div>
        </AnimateOnScroll>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {machines.map((machine, i) => (
            <AnimateOnScroll key={machine.name} animation="fade-up" delay={i * 60}>
              <div className="flex items-center gap-4 rounded-xl border border-neutral-200 bg-white p-5 transition-all hover:border-primary-100 hover:shadow-md">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-50">
                  <Cog size={22} className="text-primary-700" />
                </div>
                <div>
                  <h3 className="font-bold text-primary-900">{machine.name}</h3>
                  <p className="text-sm text-neutral-500">
                    {machine.count} &middot; {machine.detail}
                  </p>
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
