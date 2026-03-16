import { getPageContent, getLocalizedFieldSync } from "@/lib/content";
import {
  ChevronRight,
  Leaf,
  Recycle,
  Droplets,
  Sun,
  TreePine,
  ArrowRight,
  Globe,
} from "lucide-react";
import Link from "@/components/ui/LocaleLink";

const defaultPillars = {
  tr: [
    {
      icon: Recycle,
      title: "Geri Donusum",
      desc: "Uretim atiklari %100 geri donusturulerek hammadde olarak yeniden kullanilmaktadir.",
      stat: "%100",
      statLabel: "Atik Geri Donusum",
    },
    {
      icon: Droplets,
      title: "Su Yonetimi",
      desc: "Kapali devre sogutma sistemi ile su tuketimi minimuma indirilmistir.",
      stat: "%40",
      statLabel: "Su Tasarrufu",
    },
    {
      icon: Sun,
      title: "Enerji Verimliligi",
      desc: "Enerji verimli makineler ve LED aydinlatma ile karbon ayak izimizi azaltiyoruz.",
      stat: "%30",
      statLabel: "Enerji Tasarrufu",
    },
    {
      icon: TreePine,
      title: "Karbon Azaltimi",
      desc: "Surdurulebilir uretim pratikleri ile sera gazi emisyonlarimizi surekli azaltiyoruz.",
      stat: "ISO 14001",
      statLabel: "Cevre Sertifikasi",
    },
  ],
  en: [
    {
      icon: Recycle,
      title: "Recycling",
      desc: "100% of production waste is recycled and reused as raw material.",
      stat: "100%",
      statLabel: "Waste Recycling",
    },
    {
      icon: Droplets,
      title: "Water Management",
      desc: "Water consumption is minimized with a closed-loop cooling system.",
      stat: "40%",
      statLabel: "Water Savings",
    },
    {
      icon: Sun,
      title: "Energy Efficiency",
      desc: "We reduce our carbon footprint with energy-efficient machines and LED lighting.",
      stat: "30%",
      statLabel: "Energy Savings",
    },
    {
      icon: TreePine,
      title: "Carbon Reduction",
      desc: "We continuously reduce our greenhouse gas emissions with sustainable production practices.",
      stat: "ISO 14001",
      statLabel: "Environmental Cert.",
    },
  ],
};

export default async function SurdurulebilirlikPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const content = await getPageContent("sustainability");
  const isTr = locale === "tr";
  const pillars = isTr ? defaultPillars.tr : defaultPillars.en;

  const hero = content?.sustainability_hero;
  const intro = content?.sustainability_intro;

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
          <Leaf size={400} strokeWidth={0.5} className="text-white" />
        </div>
        <div className="absolute -left-20 -top-20 h-72 w-72 animate-pulse rounded-full bg-green-500/10 blur-3xl" />
        <div
          className="absolute -bottom-16 right-10 h-64 w-64 rounded-full bg-[#0f2240]/30 blur-3xl"
          style={{ animation: "pulse 4s ease-in-out infinite 1s" }}
        />

        <div className="relative mx-auto max-w-7xl px-4 lg:px-6">
          <nav className="mb-6 flex items-center gap-1.5 text-sm text-white/60">
            <Link href="/" className="transition-colors hover:text-white">
              {isTr ? "Ana Sayfa" : "Home"}
            </Link>
            <ChevronRight size={14} />
            <span className="text-white">
              {hero ? getLocalizedFieldSync(hero, "title", locale) : (isTr ? "Surdurulebilirlik" : "Sustainability")}
            </span>
          </nav>
          <h1 className="mb-4 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
            {hero ? getLocalizedFieldSync(hero, "title", locale) : (isTr ? "Surdurulebilirlik" : "Sustainability")}
          </h1>
          <div className="mt-4 mb-6 h-1 w-20 rounded-full bg-green-500" />
          <p className="max-w-2xl text-lg text-white/70">
            {hero
              ? getLocalizedFieldSync(hero, "subtitle", locale)
              : (isTr
                ? "Cevre dostu uretim anlayisimiz ile gelecek nesillere yasanabilir bir dunya birakiyoruz."
                : "We leave a livable world for future generations with our environmentally friendly production approach.")}
          </p>
        </div>
      </div>

      {/* Introduction */}
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-6 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <span className="mb-3 inline-block text-sm font-bold uppercase tracking-widest text-green-600 dark:text-green-400">
            {intro ? getLocalizedFieldSync(intro, "title", locale) : (isTr ? "Cevre Sorumlulugu" : "Environmental Responsibility")}
          </span>
          <h2 className="mb-6 text-2xl font-extrabold text-[#0A1628] dark:text-white sm:text-3xl">
            {intro ? getLocalizedFieldSync(intro, "subtitle", locale) : (isTr ? "Yesil Uretim, Temiz Gelecek" : "Green Production, Clean Future")}
          </h2>
          <p className="text-lg leading-relaxed text-neutral-600 dark:text-neutral-300">
            {intro
              ? getLocalizedFieldSync(intro, "content", locale)
              : (isTr
                ? "Kismet Plastik olarak surdurulebilirlik stratejimizi uretimin her asamasina entegre ediyoruz. Hammadde seciminden paketlemeye, enerji yonetiminden atik azaltmaya kadar tum sureclerimizde cevre dostu uygulamalari benimsiyoruz."
                : "At Kismet Plastik, we integrate our sustainability strategy into every stage of production. From raw material selection to packaging, from energy management to waste reduction, we adopt environmentally friendly practices in all our processes.")}
          </p>
        </div>
      </div>

      {/* Pillars */}
      <div className="bg-white py-16 dark:bg-[#0A1628]/80 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-extrabold text-[#0A1628] dark:text-white sm:text-3xl">
              {isTr ? "Surdurulebilirlik Stratejimiz" : "Our Sustainability Strategy"}
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((pillar, i) => {
              const sectionKey = `sustainability_pillar_${i + 1}`;
              const dbSection = content?.[sectionKey];

              const title = dbSection
                ? getLocalizedFieldSync(dbSection, "title", locale) || pillar.title
                : pillar.title;
              const desc = dbSection
                ? getLocalizedFieldSync(dbSection, "content", locale) || pillar.desc
                : pillar.desc;

              return (
                <div
                  key={pillar.title}
                  className="group relative overflow-hidden rounded-2xl border border-[#0A1628]/5 bg-[#FAFAF7] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-white/5"
                >
                  {/* Stat badge */}
                  <div className="absolute right-4 top-4 rounded-lg bg-green-500/10 px-3 py-1 text-sm font-bold text-green-600 dark:text-green-400">
                    {pillar.stat}
                  </div>

                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-green-500/10 text-green-600 transition-transform duration-300 group-hover:scale-110 dark:text-green-400">
                    <pillar.icon size={26} />
                  </div>
                  <h3 className="mb-2 font-bold text-[#0A1628] dark:text-white">{title}</h3>
                  <p className="mb-3 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">{desc}</p>
                  <p className="text-xs font-semibold text-neutral-400">{pillar.statLabel}</p>

                  {/* Bottom accent line */}
                  <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-green-500 to-[#F59E0B] transition-all duration-500 group-hover:w-full" />
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
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/20">
              <Globe size={32} className="text-green-400" />
            </div>
            <h2 className="mb-4 text-2xl font-extrabold text-white sm:text-3xl">
              {isTr ? "Birlikte Surdurulebilir Bir Gelecek" : "A Sustainable Future Together"}
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-white/60">
              {isTr
                ? "Surdurulebilir ambalaj cozumlerimiz hakkinda daha fazla bilgi almak icin bizimle iletisime gecin."
                : "Contact us to learn more about our sustainable packaging solutions."}
            </p>
            <Link
              href="/iletisim"
              className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-8 py-4 font-bold text-white shadow-lg shadow-green-500/20 transition-all hover:bg-green-600 hover:-translate-y-0.5 hover:shadow-xl"
            >
              {isTr ? "Iletisime Gecin" : "Contact Us"}
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
