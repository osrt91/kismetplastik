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

interface TabDef {
  key: TabKey;
  label: string;
  icon: typeof Factory;
}

const tabs: TabDef[] = [
  { key: "uretim", label: "Üretim Tesisi", icon: Factory },
  { key: "urunler", label: "Ürünlerimiz", icon: Package },
  { key: "etkinlikler", label: "Etkinlikler", icon: CalendarDays },
];

interface PlaceholderCard {
  title: string;
  description: string;
  icon: typeof Factory;
  accent: string;
}

const placeholders: Record<TabKey, PlaceholderCard[]> = {
  uretim: [
    {
      title: "Enjeksiyon Üretim Hattı",
      description: "Yüksek kapasiteli enjeksiyon makinelerimiz",
      icon: Cog,
      accent: "from-blue-500/10 to-blue-600/5",
    },
    {
      title: "Şişirme Üretim Alanı",
      description: "PET şişirme ve kalıplama bölümü",
      icon: Factory,
      accent: "from-indigo-500/10 to-indigo-600/5",
    },
    {
      title: "Kalite Kontrol Laboratuvarı",
      description: "Modern test ve ölçüm ekipmanları",
      icon: FlaskConical,
      accent: "from-emerald-500/10 to-emerald-600/5",
    },
    {
      title: "Hammadde Deposu",
      description: "Kontrollü depolama koşulları",
      icon: Boxes,
      accent: "from-amber-500/10 to-amber-600/5",
    },
    {
      title: "Kalıp Atölyesi",
      description: "CNC işleme ve kalıp üretim merkezi",
      icon: Cog,
      accent: "from-purple-500/10 to-purple-600/5",
    },
    {
      title: "Sevkiyat Alanı",
      description: "Lojistik ve paketleme bölümü",
      icon: Truck,
      accent: "from-teal-500/10 to-teal-600/5",
    },
  ],
  urunler: [
    {
      title: "Kozmetik Şişeler",
      description: "Losyon, şampuan ve krem ambalajları",
      icon: Pipette,
      accent: "from-pink-500/10 to-pink-600/5",
    },
    {
      title: "Kozmetik Ambalajlar",
      description: "Kozmetik şişe ve ambalaj serileri",
      icon: Package,
      accent: "from-rose-500/10 to-rose-600/5",
    },
    {
      title: "Kapak Çeşitleri",
      description: "Flip-top, disk-top ve pompa kapaklar",
      icon: Sparkles,
      accent: "from-violet-500/10 to-violet-600/5",
    },
    {
      title: "Airless Pompalar",
      description: "Vakumlu dağıtım sistemleri",
      icon: Pipette,
      accent: "from-cyan-500/10 to-cyan-600/5",
    },
    {
      title: "Tüp Ambalajlar",
      description: "Esnek ve sert tüp çözümleri",
      icon: Package,
      accent: "from-orange-500/10 to-orange-600/5",
    },
    {
      title: "Özel Tasarımlar",
      description: "Markalara özel kalıp ve üretim",
      icon: Sparkles,
      accent: "from-fuchsia-500/10 to-fuchsia-600/5",
    },
    {
      title: "Sprey Şişeler",
      description: "Parfüm ve deodorant ambalajları",
      icon: Pipette,
      accent: "from-sky-500/10 to-sky-600/5",
    },
    {
      title: "Set Ambalajlar",
      description: "Hediye ve seyahat seti paketleri",
      icon: Boxes,
      accent: "from-lime-500/10 to-lime-600/5",
    },
  ],
  etkinlikler: [
    {
      title: "Beautyworld Middle East",
      description: "Dubai kozmetik ve güzellik fuarı katılımı",
      icon: Award,
      accent: "from-amber-500/10 to-amber-600/5",
    },
    {
      title: "Cosmoprof Bologna",
      description: "İtalya uluslararası kozmetik fuarı",
      icon: Presentation,
      accent: "from-red-500/10 to-red-600/5",
    },
    {
      title: "İstanbul Ambalaj Fuarı",
      description: "Tüyap ambalaj ve paketleme fuarı",
      icon: CalendarDays,
      accent: "from-blue-500/10 to-blue-600/5",
    },
    {
      title: "Müşteri Fabrika Ziyaretleri",
      description: "Üretim tesisi tanıtım programları",
      icon: Users,
      accent: "from-green-500/10 to-green-600/5",
    },
    {
      title: "Bayi Toplantıları",
      description: "Yıllık bayi buluşma ve değerlendirme",
      icon: Handshake,
      accent: "from-purple-500/10 to-purple-600/5",
    },
    {
      title: "Eğitim Seminerleri",
      description: "Sektörel bilgi paylaşım etkinlikleri",
      icon: Presentation,
      accent: "from-teal-500/10 to-teal-600/5",
    },
  ],
};

export default function GaleriPage() {
  const { dict } = useLocale();
  const nav = dict.nav;

  const [activeTab, setActiveTab] = useState<TabKey>("uretim");

  const currentCards = placeholders[activeTab];

  return (
    <section className="bg-white">
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
              <span className="text-white">Galeri</span>
            </nav>
            <h1 className="mb-4 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
              Galeri
            </h1>
            <p className="max-w-2xl text-lg text-white/70">
              Üretim tesisimiz, ürün yelpazemiz ve sektörel etkinliklerimizden
              kareler
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
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`relative flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-primary-900 text-white shadow-lg shadow-primary-900/20"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
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
          {currentCards.map((card, i) => (
            <AnimateOnScroll key={`${activeTab}-${i}`} animation="fade-up" delay={i * 70}>
              <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-100 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-primary-100 hover:shadow-xl">
                {/* Placeholder image area */}
                <div
                  className={`relative flex h-48 items-center justify-center bg-gradient-to-br ${card.accent}`}
                >
                  <div className="flex flex-col items-center gap-3 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/80 shadow-sm backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                      <card.icon
                        size={28}
                        className="text-primary-600"
                      />
                    </div>
                    <span className="rounded-full bg-white/70 px-3 py-1 text-[11px] font-semibold text-neutral-500 backdrop-blur-sm">
                      Fotoğraf Yakında Eklenecek
                    </span>
                  </div>

                  {/* Corner decoration */}
                  <div className="absolute right-3 top-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <Camera size={16} className="text-primary-400" />
                  </div>
                </div>

                {/* Card content */}
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="mb-1.5 font-bold text-primary-900">
                    {card.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-neutral-500">
                    {card.description}
                  </p>
                </div>

                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-500 group-hover:w-full" />
              </div>
            </AnimateOnScroll>
          ))}
        </div>

        {/* Info banner */}
        <AnimateOnScroll animation="fade-up">
          <div className="mt-14 flex items-center gap-4 rounded-2xl border border-primary-100 bg-primary-50/50 p-6 sm:p-8">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-700">
              <Camera size={24} />
            </div>
            <div>
              <h3 className="mb-1 font-bold text-primary-900">
                Galeri Güncelleniyor
              </h3>
              <p className="text-sm leading-relaxed text-neutral-600">
                Üretim tesisimiz, ürünlerimiz ve etkinliklerimize ait güncel
                fotoğraflar en kısa sürede eklenecektir. Tesisimizi yerinde
                görmek için{" "}
                <Link
                  href="/iletisim"
                  className="font-semibold text-primary-700 underline-offset-2 transition-colors hover:text-accent-600 hover:underline"
                >
                  bizimle iletişime geçebilirsiniz
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
