import { getPageContent, getLocalizedFieldSync } from "@/lib/content";
import {
  ChevronRight,
  Sparkles,
  Pill,
  Droplet,
  Utensils,
  Factory,
  FlaskConical,
} from "lucide-react";
import Link from "@/components/ui/LocaleLink";

const sectorIcons = [Sparkles, Pill, Droplet, Utensils, Factory, FlaskConical];

const defaultSectors = {
  tr: [
    {
      title: "Kozmetik & Kişisel Bakım",
      desc: "Parfüm, losyon, krem, şampuan ve cilt bakım ürünleri için özel tasarım şişeler ve kapaklar.",
    },
    {
      title: "Eczacılık & Sağlık",
      desc: "İlaç, takviye gıda ve medikal ürünler için GMP uyumlu ambalaj çözümleri.",
    },
    {
      title: "Temizlik & Deterjan",
      desc: "Ev ve endüstriyel temizlik ürünleri için dayanıklı ve ergonomik ambalajlar.",
    },
    {
      title: "Gıda & İçecek",
      desc: "Gıda temaslı ambalajlar için ISO 22000 sertifikalı üretim hattı.",
    },
    {
      title: "Endüstriyel Kimya",
      desc: "Kimyasal ürünler için yüksek dayanım ve sızdırmazlık özellikli ambalajlar.",
    },
    {
      title: "Araştırma & Laboratuvar",
      desc: "Laboratuvar ve araştırma amaçlı özel üretim şişe ve kapak çözümleri.",
    },
  ],
  en: [
    {
      title: "Cosmetics & Personal Care",
      desc: "Custom-designed bottles and caps for perfume, lotion, cream, shampoo, and skincare products.",
    },
    {
      title: "Pharmaceutical & Health",
      desc: "GMP-compliant packaging solutions for medicine, supplements, and medical products.",
    },
    {
      title: "Cleaning & Detergent",
      desc: "Durable and ergonomic packaging for household and industrial cleaning products.",
    },
    {
      title: "Food & Beverage",
      desc: "ISO 22000 certified production line for food-contact packaging.",
    },
    {
      title: "Industrial Chemistry",
      desc: "High-durability, leak-proof packaging for chemical products.",
    },
    {
      title: "Research & Laboratory",
      desc: "Custom-manufactured bottles and cap solutions for laboratory and research purposes.",
    },
  ],
};

export default async function SektorlerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const content = await getPageContent("sectors");
  const isTr = locale === "tr";
  const sectors = isTr ? defaultSectors.tr : defaultSectors.en;

  const hero = content?.sectors_hero;

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
        <div className="absolute -left-20 -top-20 h-72 w-72 animate-pulse rounded-full bg-[#F59E0B]/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 lg:px-6">
          <nav className="mb-6 flex items-center gap-1.5 text-sm text-white/60">
            <Link href="/" className="transition-colors hover:text-white">
              {isTr ? "Ana Sayfa" : "Home"}
            </Link>
            <ChevronRight size={14} />
            <span className="text-white">
              {hero ? getLocalizedFieldSync(hero, "title", locale) : (isTr ? "Sektörler" : "Sectors")}
            </span>
          </nav>
          <h1 className="mb-4 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
            {hero ? getLocalizedFieldSync(hero, "title", locale) : (isTr ? "Hizmet Verdiğimiz Sektörler" : "Industries We Serve")}
          </h1>
          <div className="mt-4 mb-6 h-1 w-20 rounded-full bg-[#F59E0B]" />
          <p className="max-w-2xl text-lg text-white/70">
            {hero
              ? getLocalizedFieldSync(hero, "subtitle", locale)
              : (isTr
                ? "Farklı sektörlerin ambalaj ihtiyaçlarını karşılayan geniş ürün yelpazemiz."
                : "Our wide product range meeting the packaging needs of various industries.")}
          </p>
        </div>
      </div>

      {/* Sector Grid */}
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-6 lg:py-24">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sectors.map((sector, i) => {
            const Icon = sectorIcons[i] ?? Factory;
            const sectionKey = `sectors_sector_${i + 1}`;
            const dbSection = content?.[sectionKey];

            const title = dbSection
              ? getLocalizedFieldSync(dbSection, "title", locale) || sector.title
              : sector.title;
            const desc = dbSection
              ? getLocalizedFieldSync(dbSection, "content", locale) || sector.desc
              : sector.desc;

            return (
              <div
                key={sector.title}
                className={`group relative overflow-hidden rounded-2xl border p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                  i % 2 === 0
                    ? "border-[#0A1628]/5 bg-white dark:border-white/10 dark:bg-white/5 hover:border-[#F59E0B]/20"
                    : "border-[#F59E0B]/10 bg-[#F59E0B]/[0.02] dark:border-[#F59E0B]/15 dark:bg-[#F59E0B]/5 hover:border-[#F59E0B]/25"
                }`}
              >
                {/* Background number */}
                <span className="pointer-events-none absolute -right-2 -top-4 select-none text-[100px] font-black leading-none text-[#0A1628]/[0.03] dark:text-white/[0.03]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div
                  className={`mb-4 flex h-14 w-14 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 ${
                    i % 2 === 0
                      ? "bg-[#0A1628]/5 text-[#0A1628] dark:bg-white/10 dark:text-white"
                      : "bg-[#F59E0B]/10 text-[#F59E0B]"
                  }`}
                >
                  <Icon size={26} />
                </div>
                <h3 className="mb-2 text-lg font-bold text-[#0A1628] dark:text-white">{title}</h3>
                <p className="text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">{desc}</p>

                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-[#0A1628] to-[#F59E0B] transition-all duration-500 group-hover:w-full" />
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-[#0A1628] py-16 lg:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center lg:px-6">
          <h2 className="mb-4 text-2xl font-extrabold text-white sm:text-3xl">
            {isTr ? "Sektörünüze Özel Çözümler" : "Solutions Tailored to Your Industry"}
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-white/60">
            {isTr
              ? "Sektörünüzün özel ihtiyaçlarına uygun ambalaj çözümleri için bizimle iletişime geçin."
              : "Contact us for packaging solutions tailored to your industry's specific needs."}
          </p>
          <Link
            href="/teklif-al"
            className="inline-flex items-center gap-2 rounded-xl bg-[#F59E0B] px-8 py-4 font-bold text-[#0A1628] shadow-lg shadow-[#F59E0B]/20 transition-all hover:bg-[#F59E0B]/90 hover:-translate-y-0.5 hover:shadow-xl"
          >
            {isTr ? "Teklif Alın" : "Get a Quote"}
          </Link>
        </div>
      </div>
    </section>
  );
}
