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
} from "lucide-react";
import Link from "next/link";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { useLocale } from "@/contexts/LocaleContext";

const certificates = [
  {
    name: "ISO 9001:2015",
    title: "Kalite Yönetim Sistemi",
    description:
      "Ürün ve hizmetlerin müşteri beklentilerini karşılamasını sağlayan uluslararası kalite yönetim standardı.",
    icon: Shield,
    color: "bg-blue-50 text-blue-600",
    file: "/sertifikalar/ISO-9001.pdf",
  },
  {
    name: "ISO 14001:2015",
    title: "Çevre Yönetim Sistemi",
    description:
      "Çevresel performansın sürekli iyileştirilmesini sağlayan yönetim sistemi standardı.",
    icon: Leaf,
    color: "bg-green-50 text-green-600",
    file: "/sertifikalar/ISO-14001.pdf",
  },
  {
    name: "ISO 45001:2018",
    title: "İş Sağlığı ve Güvenliği",
    description:
      "Çalışanların sağlık ve güvenliğini korumaya yönelik sistematik yaklaşım standardı.",
    icon: BadgeCheck,
    color: "bg-amber-50 text-amber-600",
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
    color: "bg-indigo-50 text-indigo-600",
    file: "/sertifikalar/ISO-IEC-27001.pdf",
  },
  {
    name: "CE İşareti",
    title: "Avrupa Uygunluk Belgesi",
    description:
      "Ürünlerin Avrupa Birliği sağlık, güvenlik ve çevre standartlarına uygunluğunu gösteren belge.",
    icon: Award,
    color: "bg-red-50 text-red-600",
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
  "Boyutsal ölçüm ve tolerans kontrolü",
  "Basınç dayanım testi",
  "Sızdırmazlık testi",
  "Düşme dayanım testi",
  "Renk ve şeffaflık ölçümü",
  "Yüzey kalite kontrolü",
  "Gıdaya uygunluk (migrasyon) testleri",
  "UV dayanım testi",
];

export default function KalitePage() {
  const { dict } = useLocale();
  const q = dict.quality;
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
              <div className="group flex h-full flex-col rounded-2xl border border-neutral-100 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary-100 hover:shadow-xl">
                <div className={`mb-5 flex h-14 w-14 items-center justify-center rounded-xl ${cert.color}`}>
                  <cert.icon size={26} />
                </div>
                <div className="mb-2 flex items-center gap-2">
                  <h3 className="text-lg font-bold text-primary-900">{cert.name}</h3>
                  <CheckCircle2 size={18} className="text-green-500" />
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
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>

      {/* Kalite Kontrol Süreci */}
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

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {qualitySteps.map((step, i) => (
              <AnimateOnScroll key={step.step} animation="fade-up" delay={i * 100}>
                <div className="relative rounded-2xl border border-neutral-100 bg-white p-6">
                  <span className="mb-4 block text-4xl font-black text-primary-100">
                    {step.step}
                  </span>
                  <h3 className="mb-2 font-bold text-primary-900">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-neutral-500">{step.description}</p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
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
                className="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-6 py-3.5 font-bold text-primary-900 shadow-lg transition-all hover:bg-accent-400 hover:-translate-y-0.5"
              >
                <FlaskConical size={18} />
                {q.labCta}
              </Link>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll animation="fade-left">
            <div className="rounded-2xl border border-neutral-100 bg-white p-6">
              <h3 className="mb-4 font-bold text-primary-900">{q.labTestsTitle}</h3>
              <ul className="space-y-3">
                {labTests.map((test) => (
                  <li key={test} className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-green-500" />
                    <span className="text-sm text-neutral-600">{test}</span>
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
