import { getPageContent, getLocalizedFieldSync } from "@/lib/content";
import {
  ChevronRight,
  FlaskConical,
  Microscope,
  Lightbulb,
  Cpu,
  Recycle,
  ArrowRight,
} from "lucide-react";
import Link from "@/components/ui/LocaleLink";

const defaultAreas = {
  tr: [
    {
      icon: FlaskConical,
      title: "Malzeme Araştırması",
      desc: "Yeni polimer formülasyonları ve biyobozunur malzemeler üzerine çalışıyoruz.",
    },
    {
      icon: Microscope,
      title: "Test & Analiz",
      desc: "İleri düzeyde laboratuvar ekipmanlarıyla ürün performans testleri gerçekleştiriyoruz.",
    },
    {
      icon: Lightbulb,
      title: "Ürün Tasarımı",
      desc: "Ergonomik ve estetik ambalaj tasarımları ile markalarınızı öne çıkarıyoruz.",
    },
    {
      icon: Cpu,
      title: "Proses Optimizasyonu",
      desc: "Üretim süreçlerini sürekli iyileştirerek verimlilik ve kaliteyi artırıyoruz.",
    },
    {
      icon: Recycle,
      title: "Sürdürülebilirlik",
      desc: "Geri dönüştürülmüş malzeme kullanımını artırmak için yenilikçi çözümler geliştiriyoruz.",
    },
  ],
  en: [
    {
      icon: FlaskConical,
      title: "Material Research",
      desc: "We work on new polymer formulations and biodegradable materials.",
    },
    {
      icon: Microscope,
      title: "Testing & Analysis",
      desc: "We perform product performance tests with advanced laboratory equipment.",
    },
    {
      icon: Lightbulb,
      title: "Product Design",
      desc: "We highlight your brands with ergonomic and aesthetic packaging designs.",
    },
    {
      icon: Cpu,
      title: "Process Optimization",
      desc: "We continuously improve production processes to increase efficiency and quality.",
    },
    {
      icon: Recycle,
      title: "Sustainability",
      desc: "We develop innovative solutions to increase the use of recycled materials.",
    },
  ],
};

export default async function ArgePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const content = await getPageContent("rnd");
  const isTr = locale === "tr";
  const areas = isTr ? defaultAreas.tr : defaultAreas.en;

  const hero = content?.rnd_hero;
  const intro = content?.rnd_intro;

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
        <div className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 opacity-[0.04]">
          <FlaskConical size={400} strokeWidth={0.5} className="text-white" />
        </div>
        <div className="absolute -left-20 -top-20 h-72 w-72 animate-pulse rounded-full bg-[#F59E0B]/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 lg:px-6">
          <nav className="mb-6 flex items-center gap-1.5 text-sm text-white/60">
            <Link href="/" className="transition-colors hover:text-white">
              {isTr ? "Ana Sayfa" : "Home"}
            </Link>
            <ChevronRight size={14} />
            <span className="text-white">
              {hero ? getLocalizedFieldSync(hero, "title", locale) : (isTr ? "AR-GE" : "R&D")}
            </span>
          </nav>
          <h1 className="mb-4 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
            {hero ? getLocalizedFieldSync(hero, "title", locale) : (isTr ? "Araştırma & Geliştirme" : "Research & Development")}
          </h1>
          <div className="mt-4 mb-6 h-1 w-20 rounded-full bg-[#F59E0B]" />
          <p className="max-w-2xl text-lg text-white/70">
            {hero
              ? getLocalizedFieldSync(hero, "subtitle", locale)
              : (isTr
                ? "İnovasyona dayalı üretim anlayışımız ile geleceğe yatırım yapıyoruz."
                : "We invest in the future with our innovation-driven production approach.")}
          </p>
        </div>
      </div>

      {/* Introduction */}
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-6 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <span className="mb-3 inline-block text-sm font-bold uppercase tracking-widest text-[#F59E0B]">
            {intro ? getLocalizedFieldSync(intro, "title", locale) : (isTr ? "İnovasyon Merkezi" : "Innovation Hub")}
          </span>
          <h2 className="mb-6 text-2xl font-extrabold text-[#0A1628] dark:text-white sm:text-3xl">
            {intro ? getLocalizedFieldSync(intro, "subtitle", locale) : (isTr ? "Sürekli Geliştirme ve Yenilik" : "Continuous Development and Innovation")}
          </h2>
          <p className="text-lg leading-relaxed text-neutral-600 dark:text-neutral-300">
            {intro
              ? getLocalizedFieldSync(intro, "content", locale)
              : (isTr
                ? "AR-GE merkezimizde uzman mühendis kadromuz ile malzeme bilimi, ürün tasarımı ve süreç optimizasyonu alanlarında çalışıyoruz. Amacımız, müşterilerimize en yenilikçi ve sürdürülebilir ambalaj çözümlerini sunmaktır."
                : "At our R&D center, we work with our expert engineering team in the fields of material science, product design, and process optimization. Our goal is to offer our customers the most innovative and sustainable packaging solutions.")}
          </p>
        </div>
      </div>

      {/* R&D Areas */}
      <div className="bg-white py-16 dark:bg-[#0A1628]/80 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-extrabold text-[#0A1628] dark:text-white sm:text-3xl">
              {isTr ? "Çalışma Alanlarımız" : "Our Focus Areas"}
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {areas.map((area, i) => {
              const sectionKey = `rnd_area_${i + 1}`;
              const dbSection = content?.[sectionKey];

              const title = dbSection
                ? getLocalizedFieldSync(dbSection, "title", locale) || area.title
                : area.title;
              const desc = dbSection
                ? getLocalizedFieldSync(dbSection, "content", locale) || area.desc
                : area.desc;

              return (
                <div
                  key={area.title}
                  className={`group rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                    i % 2 === 0
                      ? "border-[#0A1628]/5 bg-[#FAFAF7] dark:border-white/10 dark:bg-white/5"
                      : "border-[#F59E0B]/10 bg-[#F59E0B]/[0.03] dark:border-[#F59E0B]/15 dark:bg-[#F59E0B]/5"
                  }`}
                >
                  <div
                    className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 ${
                      i % 2 === 0
                        ? "bg-[#0A1628]/5 text-[#0A1628] dark:bg-white/10 dark:text-white"
                        : "bg-[#F59E0B]/10 text-[#F59E0B]"
                    }`}
                  >
                    <area.icon size={24} />
                  </div>
                  <h3 className="mb-2 font-bold text-[#0A1628] dark:text-white">{title}</h3>
                  <p className="text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">{desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA */}
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
          <div className="relative">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F59E0B]/20">
              <FlaskConical size={32} className="text-[#F59E0B]" />
            </div>
            <h2 className="mb-4 text-2xl font-extrabold text-white sm:text-3xl">
              {isTr ? "Projeniz İçin AR-GE Desteği" : "R&D Support for Your Project"}
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-white/60">
              {isTr
                ? "Özel ambalaj ihtiyaçlarınız için AR-GE ekibimizle birlikte çözüm üretelim."
                : "Let our R&D team develop solutions for your custom packaging needs."}
            </p>
            <Link
              href="/iletisim"
              className="inline-flex items-center gap-2 rounded-xl bg-[#F59E0B] px-8 py-4 font-bold text-[#0A1628] shadow-lg shadow-[#F59E0B]/20 transition-all hover:bg-[#F59E0B]/90 hover:-translate-y-0.5 hover:shadow-xl"
            >
              {isTr ? "İletişime Geçin" : "Contact Us"}
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
