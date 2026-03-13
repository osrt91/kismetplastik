import Timeline from "@/components/ui/Timeline";
import { getMilestones, getPageContent, getLocalizedFieldSync } from "@/lib/content";
import TarihceHero from "./TarihceHero";

export default async function TarihcePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [milestones, content] = await Promise.all([
    getMilestones(),
    getPageContent("history"),
  ]);

  const timelineSection = content?.history_timeline;
  const sectionLabel = timelineSection
    ? getLocalizedFieldSync(timelineSection, "subtitle", locale)
    : "";
  const sectionTitle = timelineSection
    ? getLocalizedFieldSync(timelineSection, "title", locale)
    : "";
  const sectionDesc = timelineSection
    ? getLocalizedFieldSync(timelineSection, "content", locale)
    : "";

  return (
    <section className="bg-white dark:bg-neutral-900">
      {/* Hero */}
      <TarihceHero />

      {/* Timeline */}
      <div className="mx-auto max-w-5xl px-4 py-16 lg:px-6 lg:py-24">
        <div className="mb-12 text-center">
          <span className="mb-3 inline-block text-sm font-bold uppercase tracking-widest text-accent-500">
            {sectionLabel || (locale === "en" ? "Our Story" : "Hikayemiz")}
          </span>
          <h2 className="text-2xl font-extrabold text-primary-900 dark:text-white sm:text-3xl">
            {sectionTitle ||
              (locale === "en"
                ? "Milestones That Shape Us"
                : "Bizi Şekillendiren Kilometre Taşları")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-neutral-600 dark:text-neutral-300">
            {sectionDesc ||
              (locale === "en"
                ? "From a small workshop to a global brand, discover the key moments in our journey spanning over half a century."
                : "Küçük bir atölyeden global bir markaya, yarım asrı aşkın yolculuğumuzun önemli anlarını keşfedin.")}
          </p>
        </div>

        <Timeline milestones={milestones} locale={locale} />
      </div>
    </section>
  );
}
