"use client";

import Link from "@/components/ui/LocaleLink";
import { ChevronRight } from "lucide-react";
import { FaBullseye, FaEye, FaShieldHalved, FaHandshake, FaLightbulb, FaLeaf, FaUsers, FaScaleBalanced } from "react-icons/fa6";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { useLocale } from "@/contexts/LocaleContext";

const labels: Record<string, Record<string, string>> = {
  tr: {
    title: "Vizyon & Misyon",
    subtitle: "Geleceğe yönelik hedeflerimiz ve temel değerlerimiz.",
    visionTitle: "Vizyonumuz",
    visionText: "Kozmetik ambalaj sektöründe Türkiye'nin lider kuruluşu olmak, uluslararası pazarda önemli bir oyuncu haline gelmek ve sürdürülebilir bir geleceğe katkıda bulunmak.",
    missionTitle: "Misyonumuz",
    missionText: "Kozmetik markalarının ihtiyaç ve beklentilerini en iyi şekilde karşılamak, en son teknolojiyi kullanarak en kaliteli kozmetik ambalaj ürünlerini en uygun maliyetle sunmak, sürekli gelişmeyi ve yenilikçiliği ilke edinmek.",
    valuesTitle: "Değerlerimiz",
    value1: "Kalite", value1Desc: "Her ürünümüz ISO standartlarında üretilir.",
    value2: "Güven", value2Desc: "55+ yıllık sektör deneyimi ile güvenilir çözüm ortağıyız.",
    value3: "İnovasyon", value3Desc: "Sürekli AR-GE yatırımı ile yenilikçi ürünler geliştiriyoruz.",
    value4: "Sürdürülebilirlik", value4Desc: "Çevre dostu üretim süreçleri ve geri dönüştürülebilir malzemeler.",
    value5: "Müşteri Odaklılık", value5Desc: "B2B ihtiyaçlara özel, esnek ve hızlı çözümler sunuyoruz.",
    value6: "Şeffaflık", value6Desc: "Açık iletişim ve dürüstlük temel prensiplerimizdir.",
  },
  en: {
    title: "Vision & Mission",
    subtitle: "Our future-oriented goals and core values.",
    visionTitle: "Our Vision",
    visionText: "To be Turkey's leading organization in the cosmetic packaging sector, to become an important player in the international market, and to contribute to a sustainable future.",
    missionTitle: "Our Mission",
    missionText: "To best meet the needs and expectations of cosmetic brands, to offer the highest quality cosmetic packaging products at the most affordable cost using the latest technology, and to embrace continuous development and innovation.",
    valuesTitle: "Our Values",
    value1: "Quality", value1Desc: "Every product is manufactured to ISO standards.",
    value2: "Trust", value2Desc: "We are a reliable solution partner with 55+ years of experience.",
    value3: "Innovation", value3Desc: "We develop innovative products with continuous R&D investment.",
    value4: "Sustainability", value4Desc: "Eco-friendly production processes and recyclable materials.",
    value5: "Customer Focus", value5Desc: "We offer flexible and fast solutions tailored to B2B needs.",
    value6: "Transparency", value6Desc: "Open communication and honesty are our core principles.",
  },
};

const valueIcons = [FaShieldHalved, FaHandshake, FaLightbulb, FaLeaf, FaUsers, FaScaleBalanced];

export default function VizyonMisyonPage() {
  const { locale, dict } = useLocale();
  const t = labels[locale] || labels.tr;
  const nav = dict.nav;

  const values = [
    { icon: valueIcons[0], title: t.value1, desc: t.value1Desc },
    { icon: valueIcons[1], title: t.value2, desc: t.value2Desc },
    { icon: valueIcons[2], title: t.value3, desc: t.value3Desc },
    { icon: valueIcons[3], title: t.value4, desc: t.value4Desc },
    { icon: valueIcons[4], title: t.value5, desc: t.value5Desc },
    { icon: valueIcons[5], title: t.value6, desc: t.value6Desc },
  ];

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

      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-6 lg:py-24">
        <div className="mb-20 grid gap-8 md:grid-cols-2">
          <AnimateOnScroll animation="fade-up">
            <div className="relative overflow-hidden rounded-2xl border border-neutral-100 bg-white p-8 pt-10">
              <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-accent-400 to-accent-500" />
              <span className="pointer-events-none absolute -right-2 -top-4 select-none text-[120px] font-black leading-none text-primary-50">01</span>
              <div className="relative">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-accent-100 text-accent-600">
                  <FaEye size={26} />
                </div>
                <h2 className="mb-3 text-xl font-bold text-primary-900">{t.visionTitle}</h2>
                <p className="leading-relaxed text-neutral-600">{t.visionText}</p>
              </div>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll animation="fade-up" delay={100}>
            <div className="relative overflow-hidden rounded-2xl border border-neutral-100 bg-white p-8 pt-10">
              <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-primary-500 to-primary-700" />
              <span className="pointer-events-none absolute -right-2 -top-4 select-none text-[120px] font-black leading-none text-accent-50">02</span>
              <div className="relative">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary-100 text-primary-700">
                  <FaBullseye size={26} />
                </div>
                <h2 className="mb-3 text-xl font-bold text-primary-900">{t.missionTitle}</h2>
                <p className="leading-relaxed text-neutral-600">{t.missionText}</p>
              </div>
            </div>
          </AnimateOnScroll>
        </div>

        <AnimateOnScroll animation="fade-up">
          <h2 className="mb-10 text-center text-2xl font-extrabold text-primary-900 sm:text-3xl">{t.valuesTitle}</h2>
        </AnimateOnScroll>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((v, i) => (
            <AnimateOnScroll key={v.title} animation="fade-up" delay={i * 80}>
              <div className="group rounded-2xl border border-neutral-100 p-6 transition-all hover:-translate-y-1 hover:border-primary-200 hover:shadow-lg">
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${i % 2 === 0 ? "bg-primary-50 text-primary-700" : "bg-accent-100 text-accent-600"} transition-all group-hover:scale-110`}>
                  <v.icon size={22} />
                </div>
                <h3 className="mb-2 font-bold text-primary-900">{v.title}</h3>
                <p className="text-sm leading-relaxed text-neutral-500">{v.desc}</p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
