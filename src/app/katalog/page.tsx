"use client";

import Link from "next/link";
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
import { useLocale } from "@/contexts/LocaleContext";

const catalogs = [
  {
    title: "Genel Ürün Kataloğu 2026",
    description: "Tüm PET şişe, kavanoz, kapak ve preform ürünlerimizi içeren kapsamlı katalog.",
    pages: "48 sayfa",
    size: "12 MB",
    icon: BookOpen,
    color: "bg-primary-50 text-primary-700",
  },
  {
    title: "PET Şişe Kataloğu",
    description: "Farklı hacim ve tasarımlardaki tüm PET şişe ürünlerimizin teknik detayları.",
    pages: "24 sayfa",
    size: "8 MB",
    icon: Package,
    color: "bg-blue-50 text-blue-600",
  },
  {
    title: "Kavanoz & Kapak Kataloğu",
    description: "Geniş ağızlı kavanozlar ve tüm kapak çeşitlerimizin detaylı tanıtımı.",
    pages: "16 sayfa",
    size: "6 MB",
    icon: Package,
    color: "bg-amber-50 text-amber-600",
  },
  {
    title: "Teknik Şartname Dokümanı",
    description: "Ürün boyutları, ağırlıklar, malzeme özellikleri ve uyumluluk bilgileri.",
    pages: "32 sayfa",
    size: "4 MB",
    icon: FileText,
    color: "bg-green-50 text-green-600",
  },
];

export default function KatalogPage() {
  const { dict } = useLocale();
  const cat = dict.catalog;
  const nav = dict.nav;

  return (
    <section className="bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary-900 via-primary-700 to-primary-900 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <AnimateOnScroll animation="fade-up">
            <nav className="mb-6 flex items-center gap-1.5 text-sm text-white/60">
              <Link href="/" className="hover:text-white">{nav.home}</Link>
              <ChevronRight size={14} />
              <span className="text-white">{cat.heroTitle}</span>
            </nav>
            <h1 className="mb-3 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
              {cat.heroTitle}
            </h1>
            <p className="max-w-2xl text-lg text-white/70">
              {cat.heroSubtitle}
            </p>
          </AnimateOnScroll>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-12 lg:px-6 lg:py-20">
        {/* Kataloglar */}
        <div className="grid gap-6 sm:grid-cols-2">
          {catalogs.map((c, i) => (
            <AnimateOnScroll key={c.title} animation="fade-up" delay={i * 80}>
              <div className="group flex h-full flex-col rounded-2xl border border-neutral-200 bg-white p-6 transition-all hover:-translate-y-1 hover:border-primary-100 hover:shadow-xl">
                <div className="mb-5 flex items-start justify-between">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${c.color}`}>
                    <c.icon size={26} />
                  </div>
                  <div className="text-right text-xs text-neutral-400">
                    <p>{c.pages}</p>
                    <p>PDF &middot; {c.size}</p>
                  </div>
                </div>
                <h3 className="mb-2 text-lg font-bold text-primary-900">{c.title}</h3>
                <p className="mb-6 flex-1 text-sm leading-relaxed text-neutral-500">
                  {c.description}
                </p>
                <button
                  onClick={() =>
                    alert("Katalog indirme özelliği yakında aktif olacaktır. Lütfen bizimle iletişime geçin.")
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-primary-900 px-5 py-3 text-sm font-semibold text-primary-900 transition-all hover:bg-primary-900 hover:text-white"
                >
                  <Download size={18} />
                  {cat.downloadButton}
                </button>
              </div>
            </AnimateOnScroll>
          ))}
        </div>

        {/* Basılı Katalog Talebi */}
        <AnimateOnScroll animation="fade-up">
          <div className="mt-16 rounded-2xl bg-gradient-to-br from-primary-900 to-primary-700 p-8 text-center lg:p-12">
            <BookOpen size={40} className="mx-auto mb-4 text-accent-400" />
            <h3 className="mb-3 text-xl font-bold text-white">
              {cat.printedTitle}
            </h3>
            <p className="mb-6 text-white/70">
              {cat.printedDesc}
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/iletisim"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent-500 px-6 py-3.5 font-bold text-primary-900 transition-all hover:bg-accent-400"
              >
                <Mail size={18} />
                {cat.requestCatalog}
              </Link>
              <a
                href="tel:+902121234567"
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
