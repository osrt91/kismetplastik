import { getPageContent, getLocalizedFieldSync } from "@/lib/content";
import { Target, Eye, ChevronRight, Lightbulb, Heart } from "lucide-react";
import Link from "@/components/ui/LocaleLink";

export default async function VizyonMisyonPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const content = await getPageContent("vision");
  const isTr = locale === "tr";

  const hero = content?.vision_hero;
  const vision = content?.vision_vision;
  const mission = content?.vision_mission;
  const values = content?.vision_values;

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
              {hero ? getLocalizedFieldSync(hero, "title", locale) : (isTr ? "Vizyon & Misyon" : "Vision & Mission")}
            </span>
          </nav>
          <h1 className="mb-4 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
            {hero ? getLocalizedFieldSync(hero, "title", locale) : (isTr ? "Vizyon & Misyon" : "Vision & Mission")}
          </h1>
          <div className="mt-4 mb-6 h-1 w-20 rounded-full bg-[#F59E0B]" />
          <p className="max-w-2xl text-lg text-white/70">
            {hero
              ? getLocalizedFieldSync(hero, "subtitle", locale)
              : (isTr
                ? "Ambalaj sektorunde liderlik hedefimiz ve topluma karsi sorumlulugumuz."
                : "Our leadership goal in the packaging industry and our responsibility to society.")}
          </p>
        </div>
      </div>

      {/* Vision & Mission Cards */}
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-6 lg:py-24">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Vision */}
          <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#F59E0B]/10 dark:border-[#F59E0B]/20 bg-white dark:bg-white/5 p-8 pt-10 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-[#F59E0B] to-[#d97706]" />
            <span className="pointer-events-none absolute -right-2 -top-4 select-none text-[120px] font-black leading-none text-[#F59E0B]/[0.04]">
              01
            </span>
            <div className="relative">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[#F59E0B]/10 text-[#F59E0B]">
                <Eye size={26} />
              </div>
              <h2 className="mb-4 text-2xl font-extrabold text-[#0A1628] dark:text-white">
                {vision ? getLocalizedFieldSync(vision, "title", locale) : (isTr ? "Vizyonumuz" : "Our Vision")}
              </h2>
              <p className="text-lg leading-relaxed text-neutral-600 dark:text-neutral-300">
                {vision ? getLocalizedFieldSync(vision, "content", locale) : (isTr
                  ? "Kozmetik ambalaj sektorunde uluslararasi standartlarda uretim yapan, surdurulebilir ve yenilikci cozumler sunan lider bir marka olmak."
                  : "To be a leading brand in the cosmetic packaging industry, producing at international standards and offering sustainable, innovative solutions.")}
              </p>
            </div>
          </div>

          {/* Mission */}
          <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#0A1628]/5 dark:border-white/10 bg-white dark:bg-white/5 p-8 pt-10 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-[#0A1628] to-[#0f2240]" />
            <span className="pointer-events-none absolute -right-2 -top-4 select-none text-[120px] font-black leading-none text-[#0A1628]/[0.03] dark:text-white/[0.03]">
              02
            </span>
            <div className="relative">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[#0A1628]/5 text-[#0A1628] dark:bg-white/10 dark:text-white">
                <Target size={26} />
              </div>
              <h2 className="mb-4 text-2xl font-extrabold text-[#0A1628] dark:text-white">
                {mission ? getLocalizedFieldSync(mission, "title", locale) : (isTr ? "Misyonumuz" : "Our Mission")}
              </h2>
              <p className="text-lg leading-relaxed text-neutral-600 dark:text-neutral-300">
                {mission ? getLocalizedFieldSync(mission, "content", locale) : (isTr
                  ? "Musterilerimize en yuksek kalitede ambalaj cozumleri sunmak, surdurulebilir uretim pratikleri ile cevreye duyarli bir yaklasim benimsemek ve calisanlarimizin gelisimine yatirim yapmak."
                  : "To provide our customers with the highest quality packaging solutions, adopt an environmentally conscious approach with sustainable production practices, and invest in the development of our employees.")}
              </p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mt-16 lg:mt-24">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-block text-sm font-bold uppercase tracking-widest text-[#F59E0B]">
              {values ? getLocalizedFieldSync(values, "title", locale) : (isTr ? "Degerlerimiz" : "Our Values")}
            </span>
            <h2 className="text-2xl font-extrabold text-[#0A1628] dark:text-white sm:text-3xl">
              {values ? getLocalizedFieldSync(values, "subtitle", locale) : (isTr ? "Bize Rehberlik Eden Ilkeler" : "Principles That Guide Us")}
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Lightbulb,
                title: isTr ? "Yenilikcilik" : "Innovation",
                desc: isTr
                  ? "Surekli arastirma ve gelistirme ile sektorun ihtiyaclarina yenilikci cozumler uretiyoruz."
                  : "We produce innovative solutions to industry needs through continuous research and development.",
              },
              {
                icon: Heart,
                title: isTr ? "Musteri Odaklilik" : "Customer Focus",
                desc: isTr
                  ? "Musterilerimizin ihtiyaclarini onceliklendirerek uzun vadeli is ortakliklari kuruyoruz."
                  : "We build long-term business partnerships by prioritizing our customers' needs.",
              },
              {
                icon: Target,
                title: isTr ? "Mukemmellik" : "Excellence",
                desc: isTr
                  ? "Her asamada en yuksek kalite standartlarini hedefleyerek surdurulebilir buyume sagliyoruz."
                  : "We achieve sustainable growth by targeting the highest quality standards at every stage.",
              },
            ].map((item, i) => (
              <div
                key={item.title}
                className={`rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                  i % 2 === 0
                    ? "border-[#0A1628]/5 bg-white dark:border-white/10 dark:bg-white/5"
                    : "border-[#F59E0B]/10 bg-[#F59E0B]/[0.03] dark:border-[#F59E0B]/15 dark:bg-[#F59E0B]/5"
                }`}
              >
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${
                    i % 2 === 0
                      ? "bg-[#0A1628]/5 text-[#0A1628] dark:bg-white/10 dark:text-white"
                      : "bg-[#F59E0B]/10 text-[#F59E0B]"
                  }`}
                >
                  <item.icon size={24} />
                </div>
                <h3 className="mb-2 font-bold text-[#0A1628] dark:text-white">{item.title}</h3>
                <p className="text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
