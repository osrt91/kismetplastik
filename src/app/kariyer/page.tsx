"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Briefcase,
  MapPin,
  Clock,
  Users,
  Heart,
  GraduationCap,
  Coffee,
  Send,
  ChevronDown,
  CheckCircle2,
} from "lucide-react";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { useLocale } from "@/contexts/LocaleContext";

interface JobPosition {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
}

const departmentColors: Record<string, { bg: string; border: string; text: string }> = {
  Üretim: { bg: "bg-blue-50", border: "border-blue-400", text: "text-blue-700" },
  Kalite: { bg: "bg-emerald-50", border: "border-emerald-400", text: "text-emerald-700" },
  Satış: { bg: "bg-amber-50", border: "border-amber-400", text: "text-amber-700" },
};

const positions: JobPosition[] = [
  {
    id: "uretim-muhendisi",
    title: "Üretim Mühendisi",
    department: "Üretim",
    location: "İstanbul (Fabrika)",
    type: "Tam Zamanlı",
    description:
      "PET şişe üretim hatlarının yönetimi, süreç optimizasyonu ve kalite kontrol faaliyetlerinin koordinasyonu.",
    requirements: [
      "Makine, Endüstri veya Kimya Mühendisliği mezunu",
      "Plastik enjeksiyon / şişirme tecrübesi (min. 3 yıl)",
      "Kalite yönetim sistemleri bilgisi",
      "Takım yönetimi becerisi",
    ],
  },
  {
    id: "kalite-kontrol-uzmani",
    title: "Kalite Kontrol Uzmanı",
    department: "Kalite",
    location: "İstanbul (Fabrika)",
    type: "Tam Zamanlı",
    description:
      "Üretim sürecinde ve bitmiş ürünlerde kalite kontrol testlerinin yapılması, raporlanması ve iyileştirme önerilerinin sunulması.",
    requirements: [
      "Kimya, Gıda veya Malzeme Mühendisliği mezunu",
      "ISO 9001, FSSC 22000 bilgisi",
      "Laboratuvar test cihazları kullanım tecrübesi",
      "Detay odaklı ve analitik düşünce",
    ],
  },
  {
    id: "b2b-satis-uzmani",
    title: "B2B Satış Uzmanı",
    department: "Satış",
    location: "İstanbul (Ofis)",
    type: "Tam Zamanlı",
    description:
      "Kurumsal müşteri portföyü yönetimi, yeni müşteri kazanımı ve mevcut müşteri ilişkilerinin geliştirilmesi.",
    requirements: [
      "İşletme, Pazarlama veya ilgili bölüm mezunu",
      "B2B satış tecrübesi (min. 2 yıl)",
      "Ambalaj veya plastik sektörü bilgisi tercih sebebi",
      "Seyahat engeli olmayan",
    ],
  },
  {
    id: "kalip-teknisyeni",
    title: "Kalıp Teknisyeni",
    department: "Üretim",
    location: "İstanbul (Fabrika)",
    type: "Tam Zamanlı",
    description:
      "Şişe ve kapak kalıplarının bakım, onarım ve ayar işlemlerinin yapılması.",
    requirements: [
      "Makine veya Kalıp bölümü mezunu",
      "CNC ve konvansiyonel tezgah kullanım tecrübesi",
      "PET kalıp bilgisi tercih sebebi",
      "Vardiyalı çalışmaya uygun",
    ],
  },
];

const perkAccentColors = [
  "from-rose-400 to-rose-500",
  "from-amber-400 to-amber-500",
  "from-sky-400 to-sky-500",
  "from-violet-400 to-violet-500",
];

const perks = [
  { icon: Heart, title: "Sağlık Sigortası", description: "Özel sağlık sigortası" },
  { icon: Coffee, title: "Yemek & Servis", description: "Ücretsiz yemek ve personel servisi" },
  { icon: GraduationCap, title: "Eğitim", description: "Sürekli mesleki gelişim programları" },
  { icon: Users, title: "Takım Ruhu", description: "Sosyal etkinlikler ve takım aktiviteleri" },
];

export default function KariyerPage() {
  const { dict } = useLocale();
  const c = dict.career;
  const nav = dict.nav;
  const [openPosition, setOpenPosition] = useState<string | null>(positions[0].id);

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

        {/* Geometric team illustration shapes */}
        <div className="pointer-events-none absolute right-[5%] top-[10%] hidden opacity-[0.06] lg:block">
          <div className="relative h-64 w-64">
            <div className="absolute left-0 top-0 h-20 w-20 rounded-full bg-accent-400" />
            <div className="absolute right-4 top-8 h-28 w-28 rounded-2xl bg-white/80 rotate-12" />
            <div className="absolute bottom-0 left-8 h-24 w-24 rounded-full bg-white/60" />
            <div className="absolute bottom-4 right-0 h-16 w-16 rounded-xl bg-accent-300 -rotate-6" />
            <div className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/40" />
          </div>
        </div>
        <div className="pointer-events-none absolute -bottom-6 left-[8%] hidden opacity-[0.04] lg:block">
          <div className="relative h-40 w-56">
            <div className="absolute left-0 top-0 h-14 w-14 rounded-full bg-white" />
            <div className="absolute right-0 top-4 h-20 w-20 rounded-xl bg-accent-400 rotate-6" />
            <div className="absolute bottom-0 left-12 h-16 w-16 rounded-full bg-white/70" />
          </div>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 lg:px-6">
          <AnimateOnScroll animation="fade-up">
            <nav className="mb-6 flex items-center gap-1.5 text-sm text-white/60">
              <Link href="/" className="hover:text-white">{nav.home}</Link>
              <ChevronRight size={14} />
              <span className="text-white">{nav.career}</span>
            </nav>
            <h1 className="mb-4 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
              {c.heroTitle}
            </h1>
            <p className="max-w-2xl text-lg text-white/70">
              {c.heroSubtitle}
            </p>
          </AnimateOnScroll>
        </div>
      </div>

      {/* Yan Haklar */}
      <div className="relative -mt-8 mx-auto max-w-4xl px-4 lg:px-6">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {perks.map((perk, i) => (
            <AnimateOnScroll key={perk.title} animation="fade-up" delay={i * 80}>
              <div className="group relative flex flex-col items-center overflow-hidden rounded-2xl border border-neutral-100 bg-white p-5 text-center shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-accent-200">
                <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${perkAccentColors[i]}`} />
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-50 transition-all duration-300 group-hover:bg-accent-500/10 group-hover:scale-110">
                  <perk.icon size={24} className="text-accent-500 transition-colors group-hover:text-accent-600" />
                </div>
                <p className="font-bold text-primary-900">{perk.title}</p>
                <p className="text-xs text-neutral-500">{perk.description}</p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>

      {/* Açık Pozisyonlar */}
      <div className="mx-auto max-w-4xl px-4 py-16 lg:px-6 lg:py-24">
        <AnimateOnScroll animation="fade-up">
          <div className="mb-10 text-center">
            <span className="mb-3 inline-block text-sm font-bold uppercase tracking-widest text-accent-500">
              {c.positionsOverline}
            </span>
            <h2 className="mb-4 text-3xl font-extrabold text-primary-900 sm:text-4xl">
              {c.positionsTitle}
            </h2>
          </div>
        </AnimateOnScroll>

        <div className="space-y-3">
          {positions.map((pos, i) => {
            const isOpen = openPosition === pos.id;
            const colors = departmentColors[pos.department] ?? {
              bg: "bg-neutral-50",
              border: "border-neutral-300",
              text: "text-neutral-600",
            };
            return (
              <AnimateOnScroll key={pos.id} animation="fade-up" delay={i * 60}>
                <div
                  className={`overflow-hidden rounded-xl border bg-white transition-all duration-300 hover:shadow-md ${
                    isOpen
                      ? `border-l-[3px] ${colors.border} shadow-md`
                      : "border-neutral-200"
                  }`}
                >
                  <button
                    onClick={() => setOpenPosition(isOpen ? null : pos.id)}
                    className="flex w-full items-center justify-between px-6 py-5 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`hidden h-10 w-10 items-center justify-center rounded-lg sm:flex ${colors.bg}`}
                      >
                        <Briefcase size={18} className={colors.text} />
                      </div>
                      <div>
                        <h3 className="font-bold text-primary-900">{pos.title}</h3>
                        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-neutral-500">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${colors.bg} ${colors.text}`}
                          >
                            {pos.department}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin size={12} />
                            {pos.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {pos.type}
                          </span>
                        </div>
                      </div>
                    </div>
                    <ChevronDown
                      size={20}
                      className={`shrink-0 text-neutral-400 transition-transform duration-300 ${
                        isOpen ? "rotate-180 text-accent-500" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="border-t border-neutral-100 px-6 py-5">
                        <p className="mb-4 text-neutral-600">{pos.description}</p>
                        <h4 className="mb-3 text-sm font-bold text-primary-900">{c.requirements}</h4>
                        <ul className="mb-5 space-y-2">
                          {pos.requirements.map((req, ri) => (
                            <li
                              key={req}
                              className="flex items-start gap-2.5 text-sm text-neutral-600"
                              style={{
                                animation: isOpen
                                  ? `fadeInUp 0.35s ease-out ${ri * 80}ms both`
                                  : "none",
                              }}
                            >
                              <CheckCircle2
                                size={16}
                                className="mt-0.5 shrink-0 text-accent-500"
                              />
                              {req}
                            </li>
                          ))}
                        </ul>
                        <a
                          href={`mailto:bilgi@kismetplastik.com?subject=Başvuru: ${pos.title}`}
                          className="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-5 py-2.5 text-sm font-bold text-primary-900 shadow-md transition-all hover:bg-accent-400 hover:-translate-y-0.5"
                        >
                          <Send size={14} />
                          {c.applyButton}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimateOnScroll>
            );
          })}
        </div>

        {/* Spontane Başvuru */}
        <AnimateOnScroll animation="fade-up">
          <div className="group relative mt-12 overflow-hidden rounded-2xl bg-primary-50 p-8 text-center transition-all hover:shadow-lg">
            {/* Decorative corner shapes */}
            <div className="pointer-events-none absolute -left-6 -top-6 h-24 w-24 rounded-full bg-accent-500/10" />
            <div className="pointer-events-none absolute -bottom-4 -right-4 h-20 w-20 rounded-2xl bg-primary-200/40 rotate-12" />
            <div className="pointer-events-none absolute right-1/4 top-2 h-3 w-3 rounded-full bg-accent-400/20" />
            <div className="pointer-events-none absolute bottom-6 left-1/4 h-2 w-2 rounded-full bg-primary-300/30" />

            {/* Animated border ring */}
            <div
              className="pointer-events-none absolute inset-0 rounded-2xl"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, var(--accent-500, #f59e0b) 50%, transparent 100%)",
                backgroundSize: "200% 2px",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "top",
                animation: "shimmerBorder 3s ease-in-out infinite",
              }}
            />

            <div className="relative">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-100">
                <Send size={24} className="text-primary-700" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-primary-900">
                {c.spontaneTitle}
              </h3>
              <p className="mb-5 text-neutral-600">
                {c.spontaneDesc}
              </p>
              <a
                href="mailto:bilgi@kismetplastik.com?subject=Spontane Başvuru"
                className="inline-flex items-center gap-2 rounded-xl bg-primary-900 px-6 py-3.5 font-bold text-white transition-all hover:bg-primary-700 hover:-translate-y-0.5 hover:shadow-lg"
              >
                <Send size={18} />
                {c.sendResume}
              </a>
            </div>
          </div>
        </AnimateOnScroll>
      </div>

      {/* Inline keyframes for requirement animation */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes shimmerBorder {
          0%,
          100% {
            background-position: -200% top;
          }
          50% {
            background-position: 200% top;
          }
        }
      `}</style>
    </section>
  );
}
