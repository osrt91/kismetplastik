"use client";

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
import { useLocale } from "@/contexts/LocaleContext";

const certificates = [
  {
    name: "ISO 9001:2015",
    title: "Kalite Yönetim Sistemi",
    description:
      "Ürün ve hizmetlerin müşteri beklentilerini karşılamasını sağlayan uluslararası kalite yönetim standardı.",
    icon: Shield,
    color: "bg-primary-50 text-primary-700",
    file: "/sertifikalar/ISO-9001.pdf",
  },
  {
    name: "ISO 14001:2015",
    title: "Çevre Yönetim Sistemi",
    description:
      "Çevresel performansın sürekli iyileştirilmesini sağlayan yönetim sistemi standardı.",
    icon: Leaf,
    color: "bg-success/10 text-success",
    file: "/sertifikalar/ISO-14001.pdf",
  },
  {
    name: "ISO 45001:2018",
    title: "İş Sağlığı ve Güvenliği",
    description:
      "Çalışanların sağlık ve güvenliğini korumaya yönelik sistematik yaklaşım standardı.",
    icon: BadgeCheck,
    color: "bg-accent-100 text-accent-600",
    file: "/sertifikalar/ISO-45001.pdf",
  },
  {
    name: "ISO 10002:2018",
    title: "Müşteri Memnuniyeti",
    description:
      "Müşteri şikayetlerinin etkin yönetimi ve memnuniyetin sürekli artırılması standardı.",
    icon: FileCheck,
    color: "bg-purple-50 text-purple-600",
    file: "/sertifikalar/ISO-10002.pdf",
  },
  {
    name: "ISO/IEC 27001",
    title: "Bilgi Güvenliği Yönetimi",
    description:
      "Bilgi varlıklarının korunması ve bilgi güvenliği risklerinin yönetilmesi standardı.",
    icon: Microscope,
    color: "bg-primary-50 text-primary-700",
    file: "/sertifikalar/ISO-IEC-27001.pdf",
  },
  {
    name: "CE İşareti",
    title: "Avrupa Uygunluk Belgesi",
    description:
      "Ürünlerin Avrupa Birliği sağlık, güvenlik ve çevre standartlarına uygunluğunu gösteren belge.",
    icon: Award,
    color: "bg-destructive/10 text-destructive",
    file: "/sertifikalar/CE.pdf",
  },
];

const qualitySteps = [
  {
    step: "01",
    title: "Hammadde Kontrolü",
    description: "Tedarikçilerden gelen tüm hammaddeler laboratuvar testlerinden geçirilir.",
  },
  {
    step: "02",
    title: "Üretim Süreç Kontrolü",
    description: "Her üretim aşamasında kalite parametreleri sürekli izlenir ve kayıt altına alınır.",
  },
  {
    step: "03",
    title: "Ürün Testleri",
    description: "Bitmiş ürünler basınç, sızdırmazlık, boyut ve görsel testlerden geçirilir.",
  },
  {
    step: "04",
    title: "Son Kontrol & Sevkiyat",
    description: "Paketleme öncesi son kalite kontrolü yapılır ve uygun koşullarda sevk edilir.",
  },
];

const labTests = [
  { text: "Boyutsal ölçüm ve tolerans kontrolü", icon: Ruler, progress: 95 },
  { text: "Basınç dayanım testi", icon: Gauge, progress: 98 },
  { text: "Sızdırmazlık testi", icon: Droplets, progress: 99 },
  { text: "Düşme dayanım testi", icon: ShieldCheck, progress: 92 },
  { text: "Renk ve şeffaflık ölçümü", icon: Palette, progress: 97 },
  { text: "Yüzey kalite kontrolü", icon: Scan, progress: 96 },
  { text: "Kozmetik uygunluk (migrasyon) testleri", icon: Apple, progress: 100 },
  { text: "UV dayanım testi", icon: Sun, progress: 94 },
];

export default function KalitePage() {
  const { dict } = useLocale();
  const q = dict.quality;
  const nav = dict.nav;

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

        {/* Shield visual in background */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-[0.04]">
          <Shield size={400} strokeWidth={0.5} className="text-white" />
        </div>
        <div className="absolute -left-20 bottom-0 opacity-[0.03]">
          <Award size={300} strokeWidth={0.5} className="text-white" />
        </div>

        {/* Gradient orbs */}
        <div className="absolute -left-20 -top-20 h-72 w-72 animate-pulse rounded-full bg-accent-500/10 blur-3xl" />
        <div
          className="absolute -bottom-16 right-10 h-64 w-64 rounded-full bg-primary-400/15 blur-3xl"
          style={{ animation: "pulse 4s ease-in-out infinite 1s" }}
        />

        <div className="relative mx-auto max-w-7xl px-4 lg:px-6">
          <AnimateOnScroll animation="fade-up">
            <nav className="mb-6 flex items-center gap-1.5 text-sm text-white/60">
              <Link href="/" className="transition-colors hover:text-white">{nav.home}</Link>
              <ChevronRight size={14} />
              <span className="text-white">{q.heroTitle}</span>
            </nav>
            <h1 className="mb-4 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
              {q.heroTitle}
            </h1>
            <p className="max-w-2xl text-lg text-white/70">
              {q.heroSubtitle}
            </p>
          </AnimateOnScroll>
        </div>
      </div>

      {/* Section divider */}
      <div className="h-1 bg-gradient-to-r from-transparent via-primary-200 to-transparent" />

      {/* Sertifikalar */}
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-6 lg:py-24">
        <AnimateOnScroll animation="fade-up">
          <div className="mb-14 text-center">
            <span className="mb-3 inline-block text-sm font-bold uppercase tracking-widest text-accent-500">
              {q.certsOverline}
            </span>
            <h2 className="mb-4 text-3xl font-extrabold text-primary-900 sm:text-4xl">
              {q.certsTitle}
            </h2>
            <p className="mx-auto max-w-2xl text-neutral-500">
              {q.certsSubtitle}
            </p>
          </div>
        </AnimateOnScroll>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {certificates.map((cert, i) => (
            <AnimateOnScroll key={cert.name} animation="fade-up" delay={i * 80}>
              <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-100 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary-100 hover:shadow-xl">
                {/* Ribbon/seal visual */}
                <div className="absolute -right-4 -top-4 h-20 w-20 rotate-12 opacity-[0.06]">
                  <Award size={80} className="text-primary-900" />
                </div>

                {/* Checkmark overlay on hover */}
                <div className="absolute right-4 top-4 scale-0 transition-transform duration-300 group-hover:scale-100">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/10">
                    <CheckCircle2 size={18} className="text-success" />
                  </div>
                </div>

                <div className={`mb-5 flex h-14 w-14 items-center justify-center rounded-xl ${cert.color} transition-transform duration-300 group-hover:scale-110`}>
                  <cert.icon size={26} />
                </div>
                <div className="mb-2 flex items-center gap-2">
                  <h3 className="text-lg font-bold text-primary-900">{cert.name}</h3>
                </div>
                <p className="mb-1 text-sm font-semibold text-neutral-700">{cert.title}</p>
                <p className="mb-5 flex-1 text-sm leading-relaxed text-neutral-500">
                  {cert.description}
                </p>
                <a
                  href={cert.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700 transition-colors hover:text-accent-600"
                >
                  <Download size={14} />
                  {q.downloadCert}
                </a>

                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-500 group-hover:w-full" />
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>

      {/* Section divider */}
      <div className="mx-auto max-w-5xl px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />
      </div>

      {/* Kalite Kontrol Süreci - Visual timeline */}
      <div className="bg-neutral-50 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <AnimateOnScroll animation="fade-up">
            <div className="mb-14 text-center">
              <span className="mb-3 inline-block text-sm font-bold uppercase tracking-widest text-accent-500">
                {q.processOverline}
              </span>
              <h2 className="mb-4 text-3xl font-extrabold text-primary-900 sm:text-4xl">
                {q.processTitle}
              </h2>
              <p className="mx-auto max-w-2xl text-neutral-500">
                {q.processSubtitle}
              </p>
            </div>
          </AnimateOnScroll>

          {/* Desktop: horizontal timeline */}
          <div className="hidden lg:block">
            <div className="relative">
              {/* Horizontal connecting line */}
              <div className="absolute left-[12.5%] right-[12.5%] top-8 h-0.5 bg-gradient-to-r from-primary-200 via-primary-300 to-primary-200" />

              <div className="grid grid-cols-4 gap-6">
                {qualitySteps.map((step, i) => (
                  <AnimateOnScroll key={step.step} animation="fade-up" delay={i * 120}>
                    <div className="group relative flex flex-col items-center text-center">
                      {/* Step circle */}
                      <div className="relative z-10 mb-6 flex h-16 w-16 items-center justify-center rounded-full border-[3px] border-primary-200 bg-white shadow-sm transition-all duration-300 group-hover:border-accent-500 group-hover:shadow-md">
                        <span className="text-xl font-black text-primary-700 transition-colors group-hover:text-accent-600">
                          {step.step}
                        </span>
                      </div>

                      {/* Arrow between steps */}
                      {i < qualitySteps.length - 1 && (
                        <div className="absolute left-[calc(50%+40px)] top-[26px] text-primary-300">
                          <ArrowRight size={20} />
                        </div>
                      )}

                      <div className="rounded-2xl border border-neutral-100 bg-white p-6 transition-all duration-300 group-hover:border-primary-100 group-hover:shadow-lg">
                        <h3 className="mb-2 font-bold text-primary-900">{step.title}</h3>
                        <p className="text-sm leading-relaxed text-neutral-500">{step.description}</p>
                      </div>
                    </div>
                  </AnimateOnScroll>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile/Tablet: vertical timeline */}
          <div className="lg:hidden">
            <div className="relative ml-4 border-l-2 border-primary-200 pl-8">
              {qualitySteps.map((step, i) => (
                <AnimateOnScroll key={step.step} animation="fade-right" delay={i * 100}>
                  <div className="relative mb-8 last:mb-0">
                    {/* Dot on the line */}
                    <div className="absolute -left-[41px] top-1 flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-primary-200 bg-white">
                      <span className="text-sm font-black text-primary-700">{step.step}</span>
                    </div>

                    <div className="rounded-2xl border border-neutral-100 bg-white p-6">
                      <h3 className="mb-2 font-bold text-primary-900">{step.title}</h3>
                      <p className="text-sm leading-relaxed text-neutral-500">{step.description}</p>
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
        <div className="h-px bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />
      </div>

      {/* Laboratuvar Testleri */}
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-6 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <AnimateOnScroll animation="fade-right">
            <div>
              <span className="mb-3 inline-block text-sm font-bold uppercase tracking-widest text-accent-500">
                {q.labOverline}
              </span>
              <h2 className="mb-6 text-2xl font-extrabold text-primary-900 sm:text-3xl">
                {q.labTitle}
              </h2>
              <p className="mb-8 leading-relaxed text-neutral-600">
                {q.labDesc}
              </p>
              <Link
                href="/teklif-al"
                className="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-6 py-3.5 font-bold text-primary-900 shadow-lg transition-all hover:-translate-y-0.5 hover:bg-accent-400"
              >
                <FlaskConical size={18} />
                {q.labCta}
              </Link>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll animation="fade-left">
            <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
              <h3 className="mb-5 font-bold text-primary-900">{q.labTestsTitle}</h3>
              <ul className="space-y-4">
                {labTests.map((test) => (
                  <li key={test.text} className="group">
                    <div className="mb-1.5 flex items-start gap-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600 transition-colors group-hover:bg-primary-100">
                        <test.icon size={14} />
                      </div>
                      <span className="flex-1 text-sm text-neutral-700">{test.text}</span>
                      <span className="text-xs font-bold text-primary-600">{test.progress}%</span>
                    </div>
                    {/* Progress bar */}
                    <div className="ml-10 h-1.5 overflow-hidden rounded-full bg-neutral-100">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary-400 to-primary-600 transition-all duration-1000"
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
