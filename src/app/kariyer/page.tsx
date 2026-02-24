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
              <div className="flex flex-col items-center rounded-2xl border border-neutral-100 bg-white p-5 text-center shadow-lg">
                <perk.icon size={24} className="mb-2 text-accent-500" />
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
            return (
              <AnimateOnScroll key={pos.id} animation="fade-up" delay={i * 60}>
                <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white transition-shadow hover:shadow-md">
                  <button
                    onClick={() => setOpenPosition(isOpen ? null : pos.id)}
                    className="flex w-full items-center justify-between px-6 py-5 text-left"
                  >
                    <div>
                      <h3 className="font-bold text-primary-900">{pos.title}</h3>
                      <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-neutral-500">
                        <span className="flex items-center gap-1">
                          <Briefcase size={12} />
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
                        <h4 className="mb-2 text-sm font-bold text-primary-900">{c.requirements}</h4>
                        <ul className="mb-5 space-y-1.5">
                          {pos.requirements.map((req) => (
                            <li key={req} className="flex items-start gap-2 text-sm text-neutral-500">
                              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500" />
                              {req}
                            </li>
                          ))}
                        </ul>
                        <a
                          href={`mailto:kariyer@kismetplastik.com?subject=Başvuru: ${pos.title}`}
                          className="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-5 py-2.5 text-sm font-bold text-primary-900 shadow-md transition-all hover:bg-accent-600"
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
          <div className="mt-12 rounded-2xl bg-primary-50 p-8 text-center">
            <h3 className="mb-3 text-xl font-bold text-primary-900">
              {c.spontaneTitle}
            </h3>
            <p className="mb-5 text-neutral-600">
              {c.spontaneDesc}
            </p>
            <a
              href="mailto:kariyer@kismetplastik.com?subject=Spontane Başvuru"
              className="inline-flex items-center gap-2 rounded-xl bg-primary-900 px-6 py-3.5 font-bold text-white transition-all hover:bg-primary-700"
            >
              <Send size={18} />
              {c.sendResume}
            </a>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
