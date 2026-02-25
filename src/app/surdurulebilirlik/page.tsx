"use client";

import Link from "next/link";
import {
  ChevronRight,
  Leaf,
  Recycle,
  Zap,
  Factory,
  TreePine,
  Droplets,
  ArrowRight,
  CheckCircle2,
  RefreshCcw,
} from "lucide-react";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { useLocale } from "@/contexts/LocaleContext";

const pillars = [
  {
    icon: Recycle,
    title: "Geri Dönüştürülebilir Malzeme Kullanımı",
    description:
      "Üretimimizin temelini oluşturan PET, %100 geri dönüştürülebilir bir hammaddedir. Kısmet Plastik olarak kozmetik ambalajlarımızda yalnızca geri dönüşüme uygun malzemeler kullanarak doğal kaynakların korunmasına katkı sağlıyoruz.",
    color: "bg-green-50 text-green-600",
    accent: "from-green-400 to-emerald-500",
  },
  {
    icon: Zap,
    title: "Enerji Verimliliği",
    description:
      "Tesisimizde LED aydınlatma sistemleri, yüksek verimli servo motorlu enjeksiyon makineleri ve ısı geri kazanım üniteleri ile enerji tüketimimizi sürekli optimize ediyoruz.",
    color: "bg-amber-50 text-amber-600",
    accent: "from-amber-400 to-yellow-500",
  },
  {
    icon: Droplets,
    title: "Atık Azaltma ve Yönetimi",
    description:
      "Üretim sürecinde oluşan PET artıklarını tesisimizde yeniden granüle ederek üretime kazandırıyoruz. Sıfır atık hedefiyle çalışan entegre atık yönetim sistemimiz sürekli geliştirilmektedir.",
    color: "bg-blue-50 text-blue-600",
    accent: "from-blue-400 to-cyan-500",
  },
  {
    icon: Factory,
    title: "Karbon Ayak İzi Azaltma",
    description:
      "Üretim hatlarımızdaki enerji verimliliği iyileştirmeleri, lojistik optimizasyonu ve yeşil tedarik zinciri uygulamalarıyla karbon salınımımızı yıldan yıla azaltmayı hedefliyoruz.",
    color: "bg-purple-50 text-purple-600",
    accent: "from-purple-400 to-violet-500",
  },
];

const stats = [
  {
    value: "%100",
    label: "Geri Dönüştürülebilir PET",
    detail: "Tüm ürünlerimiz geri dönüşüme uygundur",
  },
  {
    value: "%30",
    label: "Enerji Tasarrufu",
    detail: "LED aydınlatma ve verimli makineler sayesinde",
  },
  {
    value: "0",
    label: "Atık Hedefi",
    detail: "Sıfır atık politikasıyla üretim yapıyoruz",
  },
  {
    value: "ISO 14001",
    label: "Çevre Sertifikası",
    detail: "Uluslararası çevre yönetim standardı",
  },
];

const circularSteps = [
  { step: "01", title: "Hammadde Temini", text: "Virgin veya geri dönüştürülmüş PET granül" },
  { step: "02", title: "Üretim", text: "Enerji verimli makinelerle kozmetik ambalaj üretimi" },
  { step: "03", title: "Kullanım", text: "Kozmetik markalarında son tüketici kullanımı" },
  { step: "04", title: "Toplama", text: "Tüketici sonrası ambalaj toplama ve ayrıştırma" },
  { step: "05", title: "Geri Dönüşüm", text: "PET'in yeniden granüle edilerek hammaddeye dönüşümü" },
];

export default function SurdurulebilirlikPage() {
  const { dict } = useLocale();
  const nav = dict.nav;

  return (
    <section className="bg-white">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-emerald-900 py-20 lg:py-28">
        <div className="absolute inset-0 opacity-[0.03]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="pointer-events-none absolute -right-16 top-1/2 -translate-y-1/2 opacity-[0.04]">
          <Leaf size={420} strokeWidth={0.5} className="text-white" />
        </div>
        <div className="pointer-events-none absolute -bottom-10 -left-10 opacity-[0.03]">
          <TreePine size={300} strokeWidth={0.5} className="text-white" />
        </div>

        <div className="absolute -left-20 -top-20 h-72 w-72 animate-pulse rounded-full bg-emerald-500/10 blur-3xl" />
        <div
          className="absolute -bottom-16 right-10 h-64 w-64 rounded-full bg-green-400/10 blur-3xl"
          style={{ animation: "pulse 4s ease-in-out infinite 1s" }}
        />

        <div className="relative mx-auto max-w-7xl px-4 lg:px-6">
          <AnimateOnScroll animation="fade-up">
            <nav className="mb-6 flex items-center gap-1.5 text-sm text-white/60">
              <Link href="/" className="transition-colors hover:text-white">{nav.home}</Link>
              <ChevronRight size={14} />
              <span className="text-white">Sürdürülebilirlik</span>
            </nav>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20">
                <Leaf size={26} className="text-emerald-400" />
              </div>
              <h1 className="text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
                Sürdürülebilirlik
              </h1>
            </div>
            <p className="max-w-2xl text-lg text-white/70">
              1969&apos;dan bu yana kozmetik ambalaj üretiminde çevreye duyarlı yaklaşımımızla,
              gelecek nesillere yaşanabilir bir dünya bırakmayı hedefliyoruz.
            </p>
          </AnimateOnScroll>
        </div>
      </div>

      <div className="h-1 bg-gradient-to-r from-transparent via-emerald-300 to-transparent" />

      {/* Approach */}
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-6 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <AnimateOnScroll animation="fade-right">
            <div>
              <span className="mb-3 inline-block text-sm font-bold uppercase tracking-widest text-emerald-600">
                Yaklaşımımız
              </span>
              <h2 className="mb-6 text-2xl font-extrabold text-primary-900 sm:text-3xl">
                Çevreye Duyarlı Üretim Anlayışımız
              </h2>
              <p className="mb-4 leading-relaxed text-neutral-600">
                Kısmet Plastik olarak yarım asrı aşkın süredir kozmetik sektörüne hizmet verirken,
                üretimin doğayla uyum içinde olması gerektiğine inanıyoruz. PET ambalajlarımız
                %100 geri dönüştürülebilir yapısıyla çevresel sürdürülebilirliğin temelini oluşturuyor.
              </p>
              <p className="mb-6 leading-relaxed text-neutral-600">
                Hammadde seçiminden üretim süreçlerine, enerji yönetiminden atık politikalarına kadar
                her aşamada çevresel etkimizi en aza indirmeyi amaçlıyoruz. ISO 14001 Çevre Yönetim
                Sistemi sertifikamız, bu taahhüdümüzün uluslararası geçerliliğini kanıtlamaktadır.
              </p>
              <ul className="space-y-3">
                {[
                  "PET, cam ve alüminyuma kıyasla daha düşük karbon ayak izine sahiptir",
                  "Hafif yapısı sayesinde nakliye kaynaklı emisyonları azaltır",
                  "Sonsuz kez geri dönüştürülebilir bir termoplastik malzemedir",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-neutral-600">
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll animation="fade-left">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-100 to-green-50">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <Recycle size={100} className="text-emerald-300" />
                  <div className="absolute -right-4 -top-4 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg">
                    <Leaf size={22} className="text-emerald-500" />
                  </div>
                </div>
              </div>
              <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-white/90 p-4 backdrop-blur-sm">
                <p className="text-center text-sm font-semibold text-primary-900">
                  %100 Geri Dönüştürülebilir PET Kozmetik Ambalaj
                </p>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />
      </div>

      {/* Pillars */}
      <div className="bg-neutral-50 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <AnimateOnScroll animation="fade-up">
            <div className="mb-14 text-center">
              <span className="mb-3 inline-block text-sm font-bold uppercase tracking-widest text-emerald-600">
                Temel İlkelerimiz
              </span>
              <h2 className="mb-4 text-3xl font-extrabold text-primary-900 sm:text-4xl">
                Sürdürülebilirlik Stratejimizin Dört Temel Direği
              </h2>
              <p className="mx-auto max-w-2xl text-neutral-500">
                Kozmetik ambalaj sektöründe çevresel sorumluluğumuzu dört ana eksende yürütüyoruz.
              </p>
            </div>
          </AnimateOnScroll>

          <div className="grid gap-6 sm:grid-cols-2">
            {pillars.map((pillar, i) => (
              <AnimateOnScroll key={pillar.title} animation="fade-up" delay={i * 100}>
                <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-100 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-100 hover:shadow-xl">
                  <div className="absolute -right-4 -top-4 h-20 w-20 rotate-12 opacity-[0.06]">
                    <pillar.icon size={80} className="text-primary-900" />
                  </div>

                  <div className={`mb-5 flex h-14 w-14 items-center justify-center rounded-xl ${pillar.color} transition-transform duration-300 group-hover:scale-110`}>
                    <pillar.icon size={26} />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-primary-900">{pillar.title}</h3>
                  <p className="flex-1 text-sm leading-relaxed text-neutral-500">
                    {pillar.description}
                  </p>

                  <div className={`absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r ${pillar.accent} transition-all duration-500 group-hover:w-full`} />
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-primary-900 to-primary-900 py-16 lg:py-24">
        <div className="absolute inset-0 opacity-[0.03]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
              backgroundSize: "32px 32px",
            }}
          />
        </div>

        <div className="pointer-events-none absolute -left-16 top-1/2 -translate-y-1/2 opacity-[0.03]">
          <TreePine size={350} strokeWidth={0.5} className="text-white" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 lg:px-6">
          <AnimateOnScroll animation="fade-up">
            <div className="mb-14 text-center">
              <span className="mb-3 inline-block text-sm font-bold uppercase tracking-widest text-emerald-400">
                Çevresel Performansımız
              </span>
              <h2 className="mb-4 text-3xl font-extrabold text-white sm:text-4xl">
                Rakamlarla Sürdürülebilirlik
              </h2>
              <p className="mx-auto max-w-2xl text-white/60">
                Çevre dostu üretim anlayışımızın somut sonuçları.
              </p>
            </div>
          </AnimateOnScroll>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
            {stats.map((stat, i) => (
              <AnimateOnScroll key={stat.label} animation="fade-up" delay={i * 100}>
                <div className="group rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm transition-all duration-300 hover:border-emerald-400/30 hover:bg-white/10">
                  <p className="mb-1 text-3xl font-black text-emerald-400 transition-transform duration-300 group-hover:scale-110 sm:text-4xl">
                    {stat.value}
                  </p>
                  <p className="mb-2 font-semibold text-white">{stat.label}</p>
                  <p className="text-xs leading-relaxed text-white/50">{stat.detail}</p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </div>

      {/* Circular Economy */}
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-6 lg:py-24">
        <AnimateOnScroll animation="fade-up">
          <div className="mb-14 text-center">
            <span className="mb-3 inline-block text-sm font-bold uppercase tracking-widest text-emerald-600">
              Döngüsel Ekonomi
            </span>
            <h2 className="mb-4 text-3xl font-extrabold text-primary-900 sm:text-4xl">
              PET Kozmetik Ambalajın Döngüsel Yolculuğu
            </h2>
            <p className="mx-auto max-w-2xl text-neutral-500">
              Kısmet Plastik olarak ürettiğimiz her PET kozmetik ambalaj, doğrusal &quot;üret-kullan-at&quot;
              modelinin yerine döngüsel bir yaşam döngüsüne sahiptir.
            </p>
          </div>
        </AnimateOnScroll>

        <div className="relative">
          {/* Desktop circular connector */}
          <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-emerald-200 via-green-300 to-emerald-200 lg:block" />

          <div className="space-y-6 lg:space-y-0">
            {circularSteps.map((item, i) => {
              const isEven = i % 2 === 0;
              return (
                <AnimateOnScroll
                  key={item.step}
                  animation={isEven ? "fade-right" : "fade-left"}
                  delay={i * 100}
                >
                  <div className="relative lg:flex lg:min-h-[140px] lg:items-center">
                    <div
                      className={`w-full lg:w-[calc(50%-40px)] ${
                        isEven ? "lg:mr-auto" : "lg:ml-auto lg:order-2"
                      }`}
                    >
                      <div className="group flex h-full flex-col rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm transition-all hover:border-emerald-200 hover:shadow-lg">
                        <div className="mb-3 flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 transition-colors group-hover:bg-emerald-500 group-hover:text-white">
                            <RefreshCcw size={20} />
                          </div>
                          <h3 className="font-bold text-primary-900">{item.title}</h3>
                        </div>
                        <p className="text-sm leading-relaxed text-neutral-500">{item.text}</p>
                      </div>
                    </div>

                    {/* Center circle */}
                    <div className="absolute left-1/2 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 lg:flex">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full border-[3px] border-emerald-500 bg-white shadow-md">
                        <span className="text-sm font-extrabold text-primary-900">{item.step}</span>
                      </div>
                    </div>

                    {/* Mobile step badge */}
                    <div className="absolute -left-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-emerald-500 bg-white text-xs font-extrabold text-primary-900 shadow lg:hidden">
                      {i + 1}
                    </div>

                    {i < circularSteps.length - 1 && (
                      <div className="flex justify-center py-1 lg:hidden">
                        <ArrowRight size={20} className="rotate-90 text-emerald-400" />
                      </div>
                    )}
                  </div>
                </AnimateOnScroll>
              );
            })}
          </div>

          {/* Circular loop indicator */}
          <AnimateOnScroll animation="fade-up" delay={600}>
            <div className="mt-8 flex justify-center">
              <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-5 py-2.5">
                <RefreshCcw size={16} className="text-emerald-600" />
                <span className="text-sm font-semibold text-emerald-700">
                  Döngü yeniden başlar — PET sonsuz kez geri dönüştürülebilir
                </span>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-br from-emerald-900 via-primary-900 to-primary-900 py-16 lg:py-20">
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
          <AnimateOnScroll animation="fade-up">
            <div className="relative">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20">
                <Leaf size={32} className="text-emerald-400" />
              </div>
              <h2 className="mb-4 text-2xl font-extrabold text-white sm:text-3xl">
                Sürdürülebilir Ambalaj Çözümleri İçin
              </h2>
              <p className="mx-auto mb-8 max-w-xl text-white/60">
                Kozmetik markanız için çevre dostu, geri dönüştürülebilir PET ambalaj çözümlerimizi keşfedin.
                Sürdürülebilirlik hedeflerinize uygun projeler için bizimle iletişime geçin.
              </p>
              <Link
                href="/teklif-al"
                className="inline-flex items-center gap-2.5 rounded-xl bg-emerald-500 px-8 py-4 font-bold text-white shadow-lg shadow-emerald-500/20 transition-all hover:-translate-y-0.5 hover:bg-emerald-400 hover:shadow-xl"
              >
                <Leaf size={18} />
                Teklif Al
                <ArrowRight size={16} />
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
