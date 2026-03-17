import {
  Shield,
  Award,
  CheckCircle2,
  FileCheck,
  Download,
  ChevronRight,
  Leaf,
  Microscope,
  FlaskConical,
  BadgeCheck,
  ArrowRight,
  Ruler,
  Gauge,
  Droplets,
  ShieldCheck,
  Palette,
  Scan,
  Apple,
  Sun,
} from "lucide-react";
import Link from "@/components/ui/LocaleLink";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { getLocalizedFieldSync } from "@/lib/content";
import type { DbContentSection } from "@/types/database";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/locales";

const certificates = [
  {
    name: "ISO 9001:2015",
    title: "Kalite Yonetim Sistemi",
    description:
      "Urun ve hizmetlerin musteri beklentilerini karsilamasini saglayan uluslararasi kalite yonetim standardi.",
    icon: Shield,
    color: "bg-primary-50 text-primary-700",
    file: "/sertifikalar/ISO-9001.pdf",
  },
  {
    name: "ISO 14001:2015",
    title: "Cevre Yonetim Sistemi",
    description:
      "Cevresel performansin surekli iyilestirilmesini saglayan yonetim sistemi standardi.",
    icon: Leaf,
    color: "bg-success/10 text-success",
    file: "/sertifikalar/ISO-14001.pdf",
  },
  {
    name: "ISO 45001:2018",
    title: "Is Sagligi ve Guvenligi",
    description:
      "Calisanlarin saglik ve guvenligini korumaya yonelik sistematik yaklasim standardi.",
    icon: BadgeCheck,
    color: "bg-accent-100 text-accent-600",
    file: "/sertifikalar/ISO-45001.pdf",
  },
  {
    name: "ISO 10002:2018",
    title: "Musteri Memnuniyeti",
    description:
      "Musteri sikayetlerinin etkin yonetimi ve memnuniyetin surekli artirilmasi standardi.",
    icon: FileCheck,
    color: "bg-navy-700/10 text-navy-700",
    file: "/sertifikalar/ISO-10002.pdf",
  },
  {
    name: "ISO/IEC 27001",
    title: "Bilgi Guvenligi Yonetimi",
    description:
      "Bilgi varliklarinin korunmasi ve bilgi guvenligi risklerinin yonetilmesi standardi.",
    icon: Microscope,
    color: "bg-primary-50 text-primary-700",
    file: "/sertifikalar/ISO-IEC-27001.pdf",
  },
  {
    name: "CE Isareti",
    title: "Avrupa Uygunluk Belgesi",
    description:
      "Urunlerin Avrupa Birligi saglik, guvenlik ve cevre standartlarina uygunlugunu gosteren belge.",
    icon: Award,
    color: "bg-destructive/10 text-destructive",
    file: "/sertifikalar/CE.pdf",
  },
];

const qualitySteps = [
  {
    step: "01",
    title: "Hammadde Kontrolu",
    description: "Tedarikçilerden gelen tum hammaddeler laboratuvar testlerinden gecirilir.",
  },
  {
    step: "02",
    title: "Uretim Surec Kontrolu",
    description: "Her uretim asamasinda kalite parametreleri surekli izlenir ve kayit altina alinir.",
  },
  {
    step: "03",
    title: "Urun Testleri",
    description: "Bitmis urunler basinc, sizdimazlik, boyut ve gorsel testlerden gecirilir.",
  },
  {
    step: "04",
    title: "Son Kontrol & Sevkiyat",
    description: "Paketleme oncesi son kalite kontrolu yapilir ve uygun kosullarda sevk edilir.",
  },
];

const labTests = [
  { text: "Boyutsal olcum ve tolerans kontrolu", icon: Ruler, progress: 95 },
  { text: "Basinc dayanim testi", icon: Gauge, progress: 98 },
  { text: "Sizdimazlik testi", icon: Droplets, progress: 99 },
  { text: "Dusme dayanim testi", icon: ShieldCheck, progress: 92 },
  { text: "Renk ve seffaflik olcumu", icon: Palette, progress: 97 },
  { text: "Yuzey kalite kontrolu", icon: Scan, progress: 96 },
  { text: "Kozmetik uygunluk (migrasyon) testleri", icon: Apple, progress: 100 },
  { text: "UV dayanim testi", icon: Sun, progress: 94 },
];

interface KaliteClientProps {
  content?: Record<string, DbContentSection>;
  settings?: Record<string, string>;
  locale: Locale;
  dict: Dictionary;
}

export default function KaliteClient({ content, locale, dict }: KaliteClientProps) {
  const q = dict.quality;
  const nav = dict.nav;

  /* Helper: read from DB content with dict fallback */
  const t = (sectionKey: string, field: string, fallback: string): string => {
    const section = content?.[sectionKey];
    if (section) {
      const val = getLocalizedFieldSync(section, field, locale);
      if (val) return val;
    }
    return fallback;
  };

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

        {/* Shield visual in background */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-[0.04]">
          <Shield size={400} strokeWidth={0.5} className="text-white" />
        </div>
        <div className="absolute -left-20 bottom-0 opacity-[0.03]">
          <Award size={300} strokeWidth={0.5} className="text-white" />
        </div>

        {/* Gradient orbs */}
        <div className="absolute -left-20 -top-20 h-72 w-72 animate-pulse rounded-full bg-[#F59E0B]/10 blur-3xl" />
        <div
          className="absolute -bottom-16 right-10 h-64 w-64 rounded-full bg-[#0f2240]/30 blur-3xl"
          style={{ animation: "pulse 4s ease-in-out infinite 1s" }}
        />

        <div className="relative mx-auto max-w-7xl px-4 lg:px-6">
          <AnimateOnScroll animation="fade-up">
            <nav className="mb-6 flex items-center gap-1.5 text-sm text-white/60">
              <Link href="/" className="transition-colors hover:text-white">{nav.home}</Link>
              <ChevronRight size={14} />
              <span className="text-white">{t("quality_hero", "title", q.heroTitle)}</span>
            </nav>
            <h1 className="mb-4 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
              {t("quality_hero", "title", q.heroTitle)}
            </h1>
            <div className="mt-4 mb-6 h-1 w-20 rounded-full bg-[#F59E0B]" />
            <p className="max-w-2xl text-lg text-white/70">
              {t("quality_hero", "subtitle", q.heroSubtitle)}
            </p>
          </AnimateOnScroll>
        </div>
      </div>

      {/* Section divider */}
      <div className="h-1 bg-gradient-to-r from-transparent via-[#F59E0B]/30 to-transparent" />

      {/* Sertifikalar */}
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-6 lg:py-24">
        <AnimateOnScroll animation="fade-up">
          <div className="mb-14 text-center">
            <span className="mb-3 inline-block text-sm font-bold uppercase tracking-widest text-[#F59E0B]">
              {t("quality_certs", "title", q.certsOverline)}
            </span>
            <h2 className="mb-4 text-3xl font-extrabold text-[#0A1628] dark:text-white sm:text-4xl">
              {t("quality_certs", "subtitle", q.certsTitle)}
            </h2>
            <p className="mx-auto max-w-2xl text-neutral-500 dark:text-neutral-400">
              {t("quality_certs", "content", q.certsSubtitle)}
            </p>
          </div>
        </AnimateOnScroll>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {certificates.map((cert, i) => (
            <AnimateOnScroll key={cert.name} animation="fade-up" delay={i * 80}>
              <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#0A1628]/5 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#F59E0B]/20 hover:shadow-xl dark:border-white/10 dark:bg-white/5">
                {/* Ribbon/seal visual */}
                <div className="absolute -right-4 -top-4 h-20 w-20 rotate-12 opacity-[0.06]">
                  <Award size={80} className="text-[#0A1628]" />
                </div>

                {/* Checkmark overlay on hover */}
                <div className="absolute right-4 top-4 scale-0 transition-transform duration-300 group-hover:scale-100">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F59E0B]/10">
                    <CheckCircle2 size={18} className="text-[#F59E0B]" />
                  </div>
                </div>

                <div className={`mb-5 flex h-14 w-14 items-center justify-center rounded-xl ${cert.color} transition-transform duration-300 group-hover:scale-110`}>
                  <cert.icon size={26} />
                </div>
                <div className="mb-2 flex items-center gap-2">
                  <h3 className="text-lg font-bold text-[#0A1628] dark:text-white">{cert.name}</h3>
                </div>
                <p className="mb-1 text-sm font-semibold text-neutral-700 dark:text-neutral-300">{cert.title}</p>
                <p className="mb-5 flex-1 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
                  {cert.description}
                </p>
                <a
                  href={cert.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0A1628] transition-colors hover:text-[#F59E0B] dark:text-white dark:hover:text-[#F59E0B]"
                >
                  <Download size={14} />
                  {q.downloadCert}
                </a>

                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-[#0A1628] to-[#F59E0B] transition-all duration-500 group-hover:w-full" />
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>

      {/* Section divider */}
      <div className="mx-auto max-w-5xl px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-[#F59E0B]/20 to-transparent" />
      </div>

      {/* Kalite Kontrol Sureci - Visual timeline */}
      <div className="bg-white py-16 dark:bg-[#0A1628]/80 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <AnimateOnScroll animation="fade-up">
            <div className="mb-14 text-center">
              <span className="mb-3 inline-block text-sm font-bold uppercase tracking-widest text-[#F59E0B]">
                {t("quality_process", "title", q.processOverline)}
              </span>
              <h2 className="mb-4 text-3xl font-extrabold text-[#0A1628] dark:text-white sm:text-4xl">
                {t("quality_process", "subtitle", q.processTitle)}
              </h2>
              <p className="mx-auto max-w-2xl text-neutral-500 dark:text-neutral-400">
                {t("quality_process", "content", q.processSubtitle)}
              </p>
            </div>
          </AnimateOnScroll>

          {/* Desktop: horizontal timeline */}
          <div className="hidden lg:block">
            <div className="relative">
              {/* Horizontal connecting line */}
              <div className="absolute left-[12.5%] right-[12.5%] top-8 h-0.5 bg-gradient-to-r from-[#0A1628]/10 via-[#F59E0B]/30 to-[#0A1628]/10" />

              <div className="grid grid-cols-4 gap-6">
                {qualitySteps.map((step, i) => (
                  <AnimateOnScroll key={step.step} animation="fade-up" delay={i * 120}>
                    <div className="group relative flex flex-col items-center text-center">
                      {/* Step circle */}
                      <div className="relative z-10 mb-6 flex h-16 w-16 items-center justify-center rounded-full border-[3px] border-[#0A1628]/15 bg-white shadow-sm transition-all duration-300 group-hover:border-[#F59E0B] group-hover:shadow-md dark:bg-[#0A1628]">
                        <span className="text-xl font-black text-[#0A1628] transition-colors group-hover:text-[#F59E0B] dark:text-white">
                          {step.step}
                        </span>
                      </div>

                      {/* Arrow between steps */}
                      {i < qualitySteps.length - 1 && (
                        <div className="absolute left-[calc(50%+40px)] top-[26px] text-[#F59E0B]/40">
                          <ArrowRight size={20} />
                        </div>
                      )}

                      <div className="rounded-2xl border border-[#0A1628]/5 bg-[#FAFAF7] p-6 transition-all duration-300 group-hover:-translate-y-1 group-hover:border-[#F59E0B]/20 group-hover:shadow-lg dark:border-white/10 dark:bg-white/5">
                        <h3 className="mb-2 font-bold text-[#0A1628] dark:text-white">{step.title}</h3>
                        <p className="text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">{step.description}</p>
                      </div>
                    </div>
                  </AnimateOnScroll>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile/Tablet: vertical timeline */}
          <div className="lg:hidden">
            <div className="relative ml-4 border-l-2 border-[#F59E0B]/30 pl-8">
              {qualitySteps.map((step, i) => (
                <AnimateOnScroll key={step.step} animation="fade-right" delay={i * 100}>
                  <div className="relative mb-8 last:mb-0">
                    {/* Dot on the line */}
                    <div className="absolute -left-[41px] top-1 flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-[#F59E0B]/30 bg-white dark:bg-[#0A1628]">
                      <span className="text-sm font-black text-[#0A1628] dark:text-white">{step.step}</span>
                    </div>

                    <div className="rounded-2xl border border-[#0A1628]/5 bg-[#FAFAF7] p-6 dark:border-white/10 dark:bg-white/5">
                      <h3 className="mb-2 font-bold text-[#0A1628] dark:text-white">{step.title}</h3>
                      <p className="text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">{step.description}</p>
                    </div>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Section divider */}
      <div className="mx-auto max-w-5xl px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-[#F59E0B]/20 to-transparent" />
      </div>

      {/* Laboratuvar Testleri */}
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-6 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <AnimateOnScroll animation="fade-right">
            <div>
              <span className="mb-3 inline-block text-sm font-bold uppercase tracking-widest text-[#F59E0B]">
                {t("quality_lab", "title", q.labOverline)}
              </span>
              <h2 className="mb-6 text-2xl font-extrabold text-[#0A1628] dark:text-white sm:text-3xl">
                {t("quality_lab", "subtitle", q.labTitle)}
              </h2>
              <p className="mb-8 leading-relaxed text-neutral-600 dark:text-neutral-400">
                {t("quality_lab", "content", q.labDesc)}
              </p>
              <Link
                href="/teklif-al"
                className="inline-flex items-center gap-2 rounded-xl bg-[#F59E0B] px-6 py-3.5 font-bold text-[#0A1628] shadow-lg shadow-[#F59E0B]/20 transition-all hover:-translate-y-0.5 hover:bg-[#F59E0B]/90 hover:shadow-xl"
              >
                <FlaskConical size={18} />
                {q.labCta}
              </Link>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll animation="fade-left">
            <div className="rounded-2xl border border-[#0A1628]/5 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
              <h3 className="mb-5 font-bold text-[#0A1628] dark:text-white">{q.labTestsTitle}</h3>
              <ul className="space-y-4">
                {labTests.map((test) => (
                  <li key={test.text} className="group">
                    <div className="mb-1.5 flex items-start gap-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#F59E0B]/10 text-[#F59E0B] transition-colors group-hover:bg-[#F59E0B]/20">
                        <test.icon size={14} />
                      </div>
                      <span className="flex-1 text-sm text-neutral-700 dark:text-neutral-300">{test.text}</span>
                      <span className="text-xs font-bold text-[#0A1628] dark:text-[#F59E0B]">{test.progress}%</span>
                    </div>
                    {/* Progress bar */}
                    <div className="ml-10 h-1.5 overflow-hidden rounded-full bg-[#0A1628]/5 dark:bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#0A1628] to-[#F59E0B] transition-all duration-1000"
                        style={{ width: `${test.progress}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
