import Link from "@/components/ui/LocaleLink";
import {
  ChevronRight,
  Download,
  FileText,
  BookOpen,
  Package,
  Phone,
  Mail,
} from "lucide-react";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import CatalogDownloadButton from "@/components/ui/CatalogDownloadButton";
import { getLocalizedFieldSync } from "@/lib/content";
import type { DbContentSection, DbResource } from "@/types/database";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/locales";

interface KatalogClientProps {
  content?: Record<string, DbContentSection>;
  resources?: DbResource[];
  locale: Locale;
  dict: Dictionary;
}

interface CatalogItem {
  title: string;
  description: string;
  pages: string;
  size: string;
  icon: typeof BookOpen;
  color: string;
  accentColor: string;
  fileUrl?: string;
}

const defaultCatalogs: CatalogItem[] = [
  {
    title: "Genel Ürün Kataloğu 2026",
    description:
      "Tüm PET şişe, sprey, kapak ve pompa ürünlerimizi içeren kapsamlı katalog.",
    pages: "48 sayfa",
    size: "12 MB",
    icon: BookOpen,
    color: "bg-primary-50 text-primary-700",
    accentColor: "bg-primary-700",
  },
  {
    title: "PET Şişe Kataloğu",
    description:
      "Farklı hacim ve tasarımlardaki tüm PET şişe ürünlerimizin teknik detayları.",
    pages: "24 sayfa",
    size: "8 MB",
    icon: Package,
    color: "bg-primary-50 text-primary-700",
    accentColor: "bg-primary-500",
  },
  {
    title: "Kapak & Aksesuar Kataloğu",
    description:
      "Vidalı, flip-top, pompa, sprey ve özel tasarım kapak çeşitlerimizin detaylı tanıtımı.",
    pages: "16 sayfa",
    size: "6 MB",
    icon: Package,
    color: "bg-accent-100 text-accent-600",
    accentColor: "bg-accent-500",
  },
  {
    title: "Teknik Şartname Dokümanı",
    description:
      "Ürün boyutları, ağırlıklar, malzeme özellikleri ve uyumluluk bilgileri.",
    pages: "32 sayfa",
    size: "4 MB",
    icon: FileText,
    color: "bg-success/10 text-success",
    accentColor: "bg-success",
  },
];

const iconMap: Record<string, typeof BookOpen> = {
  BookOpen,
  Package,
  FileText,
};

export default function KatalogClient({ content, resources, locale, dict }: KatalogClientProps) {
  const cat = dict.catalog;
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

  /* Convert DB resources to catalog items, falling back to defaults */
  const catalogs: CatalogItem[] =
    resources && resources.length > 0
      ? resources.map((r, i) => ({
          title: locale === "en" ? r.title_en : r.title_tr,
          description: locale === "en" ? r.description_en : r.description_tr,
          pages: r.page_count ? `${r.page_count} sayfa` : "",
          size: "",
          icon: iconMap[defaultCatalogs[i]?.icon?.name ?? ""] || FileText,
          color: defaultCatalogs[i]?.color || "bg-primary-50 text-primary-700",
          accentColor: defaultCatalogs[i]?.accentColor || "bg-primary-700",
          fileUrl: r.file_url,
        }))
      : defaultCatalogs;

  return (
    <section className="bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary-900 via-primary-700 to-primary-900 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <AnimateOnScroll animation="fade-up">
            <nav className="mb-6 flex items-center gap-1.5 text-sm text-white/60">
              <Link href="/" className="transition-colors hover:text-white">
                {nav.home}
              </Link>
              <ChevronRight size={14} />
              <span className="text-white">{cat.heroTitle}</span>
            </nav>
            <h1 className="mb-3 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
              {t("catalog_hero", "title", cat.heroTitle)}
            </h1>
            <p className="max-w-2xl text-lg text-white/70">
              {t("catalog_hero", "subtitle", cat.heroSubtitle)}
            </p>
          </AnimateOnScroll>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-12 lg:px-6 lg:py-20">
        {/* Kataloglar */}
        <div className="grid gap-6 sm:grid-cols-2">
          {catalogs.map((c, i) => (
            <AnimateOnScroll key={c.title} animation="fade-up" delay={i * 80}>
              <div className="group flex h-full flex-col rounded-2xl border border-neutral-200 bg-white transition-all hover:-translate-y-1 hover:border-primary-100 hover:shadow-xl">
                {/* Document Preview */}
                <div className="p-5 pb-2">
                  <div
                    className="relative overflow-hidden rounded-xl bg-gradient-to-b from-neutral-50 to-white ring-1 ring-neutral-100"
                    style={{
                      boxShadow:
                        "0 1px 3px rgba(0,0,0,0.06), 0 8px 0 -4px #fafafa, 0 9px 0 -4px #e5e5e5, 0 16px 0 -8px #f5f5f5, 0 17px 0 -8px #ebebeb",
                    }}
                  >
                    <div className={`h-1.5 w-full ${c.accentColor}`} />

                    <div className="p-4 pt-3">
                      <div className="mb-3 flex items-start justify-between">
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-lg ${c.color}`}
                        >
                          <c.icon size={18} />
                        </div>
                        <span className="rounded-md bg-destructive px-2 py-0.5 text-[10px] font-bold tracking-wider text-white shadow-sm">
                          PDF
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="h-1.5 w-4/5 rounded-full bg-neutral-200/80" />
                        <div className="h-1.5 w-3/5 rounded-full bg-neutral-100" />
                        <div className="h-1.5 w-full rounded-full bg-neutral-100" />
                        <div className="h-1.5 w-2/3 rounded-full bg-neutral-200/60" />
                        <div className="h-1.5 w-4/5 rounded-full bg-neutral-100" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-6 pt-4">
                  <h3 className="mb-1.5 text-lg font-bold text-primary-900">
                    {c.title}
                  </h3>
                  <p className="mb-4 flex-1 text-sm leading-relaxed text-neutral-500">
                    {c.description}
                  </p>

                  {(c.pages || c.size) && (
                    <div className="mb-4 flex items-center gap-2 text-xs text-neutral-400">
                      {c.pages && <span>{c.pages}</span>}
                      {c.pages && c.size && <span>&middot;</span>}
                      {c.size && <span>PDF &middot; {c.size}</span>}
                    </div>
                  )}

                  {c.fileUrl ? (
                    <a
                      href={c.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-primary-900 px-5 py-3 text-sm font-semibold text-primary-900 transition-all hover:bg-primary-900 hover:text-white"
                    >
                      <Download size={18} className="bounce-on-hover" />
                      {cat.downloadButton}
                    </a>
                  ) : (
                    <CatalogDownloadButton label={cat.downloadButton} />
                  )}
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>

        {/* Basılı Katalog Talebi */}
        <AnimateOnScroll animation="fade-up">
          <div className="animated-border-gradient mt-16 rounded-2xl bg-gradient-to-br from-primary-900 to-primary-700 p-8 text-center lg:p-12">
            <BookOpen size={40} className="mx-auto mb-4 text-accent-400" />
            <h3 className="mb-3 text-xl font-bold text-white">
              {cat.printedTitle}
            </h3>
            <p className="mb-6 text-white/70">{cat.printedDesc}</p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/iletisim"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent-500 px-6 py-3.5 font-bold text-primary-900 transition-all hover:-translate-y-0.5 hover:bg-accent-400"
              >
                <Mail size={18} />
                {cat.requestCatalog}
              </Link>
              <a
                href="tel:+902125498703"
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/20 px-6 py-3.5 font-semibold text-white transition-all hover:border-white/40 hover:bg-white/10"
              >
                <Phone size={18} />
                {cat.callUs}
              </a>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
