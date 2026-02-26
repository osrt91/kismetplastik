"use client";

import Link from "@/components/ui/LocaleLink";
import { ChevronRight } from "lucide-react";
import { FaFlask, FaCubes, FaLeaf, FaGear, FaRuler } from "react-icons/fa6";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { useLocale } from "@/contexts/LocaleContext";

const labels: Record<string, Record<string, string>> = {
  tr: {
    title: "AR-GE & İnovasyon",
    subtitle: "Yenilikçi kozmetik ambalaj çözümleri için sürekli araştırma ve geliştirme yapıyoruz.",
    approachTitle: "AR-GE Yaklaşımımız",
    approachDesc: "Kısmet Plastik olarak, sektördeki en son trendleri ve teknolojileri takip ederek müşterilerimize en yenilikçi ambalaj çözümlerini sunuyoruz.",
    area1: "Malzeme Araştırma",
    area1Desc: "Yeni PET ve HDPE formülleri, biyobozunur malzemeler ve geri dönüştürülebilir alternatifler üzerinde çalışıyoruz.",
    area2: "Kalıp Tasarımı",
    area2Desc: "CAD/CAM teknolojisi ile özel kalıp tasarımı yapıyor, 3D prototipleme ile hızlı geliştirme sağlıyoruz.",
    area3: "Sürdürülebilir Ambalaj",
    area3Desc: "rPET kullanımı, hafifletme çalışmaları ve karbon ayak izi azaltma projeleri yürütüyoruz.",
    processTitle: "Özel Kalıp Tasarım Süreci",
    step1: "Müşteri Brifingi",
    step1Desc: "İhtiyaç analizi ve teknik gereksinimler belirlenir.",
    step2: "CAD Tasarım",
    step2Desc: "3D modelleme ve teknik çizimler hazırlanır.",
    step3: "Prototip Üretim",
    step3Desc: "3D baskı veya pilot kalıp ile numune üretilir.",
    step4: "Test & Onay",
    step4Desc: "Mekanik testler ve müşteri onayı alınır.",
    step5: "Seri Üretim",
    step5Desc: "Kalıp kesilir ve seri üretim başlatılır.",
    ctaTitle: "Özel Kalıp Talebi",
    ctaButton: "Teklif Al",
  },
  en: {
    title: "R&D & Innovation",
    subtitle: "We conduct continuous research and development for innovative cosmetic packaging solutions.",
    approachTitle: "Our R&D Approach",
    approachDesc: "At Kısmet Plastik, we follow the latest trends and technologies in the sector to offer our customers the most innovative packaging solutions.",
    area1: "Material Research",
    area1Desc: "We work on new PET and HDPE formulas, biodegradable materials and recyclable alternatives.",
    area2: "Mold Design",
    area2Desc: "Custom mold design with CAD/CAM technology, rapid development with 3D prototyping.",
    area3: "Sustainable Packaging",
    area3Desc: "We run rPET usage, lightweighting studies and carbon footprint reduction projects.",
    processTitle: "Custom Mold Design Process",
    step1: "Customer Brief",
    step1Desc: "Needs analysis and technical requirements are determined.",
    step2: "CAD Design",
    step2Desc: "3D modeling and technical drawings are prepared.",
    step3: "Prototype Production",
    step3Desc: "Samples are produced with 3D printing or pilot mold.",
    step4: "Testing & Approval",
    step4Desc: "Mechanical tests and customer approval are obtained.",
    step5: "Mass Production",
    step5Desc: "Mold is cut and mass production begins.",
    ctaTitle: "Custom Mold Request",
    ctaButton: "Request Quote",
  },
};

const areaIcons = [FaFlask, FaCubes, FaLeaf];
const stepIcons = [FaRuler, FaCubes, FaGear, FaFlask, FaGear];

export default function ArgePage() {
  const { locale, dict } = useLocale();
  const t = labels[locale] || labels.tr;
  const nav = dict.nav;

  const areas = [
    { icon: areaIcons[0], title: t.area1, desc: t.area1Desc },
    { icon: areaIcons[1], title: t.area2, desc: t.area2Desc },
    { icon: areaIcons[2], title: t.area3, desc: t.area3Desc },
  ];

  const steps = [
    { icon: stepIcons[0], title: t.step1, desc: t.step1Desc },
    { icon: stepIcons[1], title: t.step2, desc: t.step2Desc },
    { icon: stepIcons[2], title: t.step3, desc: t.step3Desc },
    { icon: stepIcons[3], title: t.step4, desc: t.step4Desc },
    { icon: stepIcons[4], title: t.step5, desc: t.step5Desc },
  ];

  return (
    <section className="bg-white">
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-700 to-primary-900 py-20 lg:py-28">
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="h-full w-full" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`, backgroundSize: "40px 40px" }} />
        </div>
        <FaFlask size={300} className="pointer-events-none absolute -right-10 top-1/2 -translate-y-1/2 text-white/[0.04]" />
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

      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-6 lg:py-24">
        <AnimateOnScroll animation="fade-up">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-2xl font-extrabold text-primary-900 sm:text-3xl">{t.approachTitle}</h2>
            <p className="mx-auto max-w-2xl text-neutral-500">{t.approachDesc}</p>
          </div>
        </AnimateOnScroll>

        <div className="mb-20 grid gap-8 lg:grid-cols-3">
          {areas.map((area, i) => (
            <AnimateOnScroll key={area.title} animation="fade-up" delay={i * 100}>
              <div className="group rounded-2xl border border-neutral-100 bg-white p-8 transition-all hover:-translate-y-1 hover:border-primary-200 hover:shadow-xl">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-primary-50 text-primary-700 transition-all group-hover:bg-primary-900 group-hover:text-white">
                  <area.icon size={26} />
                </div>
                <h3 className="mb-3 text-lg font-bold text-primary-900">{area.title}</h3>
                <p className="text-sm leading-relaxed text-neutral-500">{area.desc}</p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>

        <AnimateOnScroll animation="fade-up">
          <h2 className="mb-10 text-center text-2xl font-extrabold text-primary-900">{t.processTitle}</h2>
        </AnimateOnScroll>
        <div className="relative grid gap-6 lg:grid-cols-5">
          <div className="pointer-events-none absolute left-0 right-0 top-[40px] hidden h-0.5 bg-gradient-to-r from-primary-200 via-accent-300 to-primary-200 lg:block" />
          {steps.map((step, i) => (
            <AnimateOnScroll key={step.title} animation="fade-up" delay={i * 80}>
              <div className="relative text-center">
                <div className="relative z-10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-4 border-primary-100 bg-white text-primary-700 shadow-sm transition-all hover:border-accent-400 hover:scale-110">
                  <step.icon size={24} />
                </div>
                <span className="mb-1 block text-xs font-bold text-accent-500">{i + 1}. Adım</span>
                <h3 className="mb-1.5 text-sm font-bold text-primary-900">{step.title}</h3>
                <p className="text-xs leading-relaxed text-neutral-500">{step.desc}</p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>

        <AnimateOnScroll animation="fade-up">
          <div className="mt-16 rounded-2xl bg-gradient-to-r from-primary-900 to-primary-700 p-8 text-center">
            <h3 className="mb-4 text-2xl font-bold text-white">{t.ctaTitle}</h3>
            <Link href="/teklif-al" className="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-8 py-3.5 font-bold text-primary-900 transition-all hover:bg-accent-600 hover:scale-105">
              {t.ctaButton}
            </Link>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
