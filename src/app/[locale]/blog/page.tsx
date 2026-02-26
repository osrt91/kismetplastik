"use client";

import { useState } from "react";
import Link from "@/components/ui/LocaleLink";
import {
  ChevronRight,
  Calendar,
  Clock,
  ArrowRight,
  Tag,
  BookOpen,
  Sparkles,
} from "lucide-react";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  featured?: boolean;
}

const blogPosts: BlogPost[] = [
  {
    slug: "pet-sise-uretim-sureci",
    title: "PET Şişe Üretim Süreci: Hammaddeden Ürüne",
    excerpt:
      "PET şişelerin üretim aşamalarını, kullanılan teknolojileri ve kalite kontrol süreçlerini detaylı olarak inceliyoruz.",
    category: "Üretim",
    date: "2026-02-15",
    readTime: "8 dk",
    featured: true,
  },
  {
    slug: "kozmetik-ambalaj-trendleri-2026",
    title: "2026 Yılında Kozmetik Ambalaj Trendleri",
    excerpt:
      "Sürdürülebilirlik, akıllı ambalaj ve minimalist tasarım gibi öne çıkan kozmetik ambalaj trendlerini keşfedin.",
    category: "Sektör",
    date: "2026-02-10",
    readTime: "6 dk",
    featured: true,
  },
  {
    slug: "pet-malzeme-avantajlari",
    title: "PET Malzemenin Avantajları Nelerdir?",
    excerpt:
      "PET'in hafifliği, şeffaflığı, geri dönüşülebilirliği ve kozmetik ambalaj açısından sunduğu avantajlar.",
    category: "Bilgi",
    date: "2026-02-05",
    readTime: "5 dk",
  },
  {
    slug: "iso-sertifika-onemi",
    title: "Kozmetik Ambalajda ISO Sertifikalarının Önemi",
    excerpt:
      "ISO 9001, ISO 14001 ve FSSC 22000 sertifikalarının ambalaj sektöründeki önemi ve müşterilere sağladığı güvence.",
    category: "Kalite",
    date: "2026-01-28",
    readTime: "7 dk",
  },
  {
    slug: "dogru-sise-secimi",
    title: "İşletmeniz İçin Doğru Şişe Nasıl Seçilir?",
    excerpt:
      "Ürününüze uygun şişe seçerken dikkat etmeniz gereken hacim, ağız çapı, malzeme ve tasarım kriterleri.",
    category: "Rehber",
    date: "2026-01-20",
    readTime: "6 dk",
  },
  {
    slug: "surdurulebilir-ambalaj",
    title: "Sürdürülebilir Ambalaj: Çevreye Duyarlı Üretim",
    excerpt:
      "Geri dönüştürülebilir malzemeler, karbon ayak izi azaltma ve çevre dostu üretim süreçlerimiz hakkında.",
    category: "Sürdürülebilirlik",
    date: "2026-01-12",
    readTime: "5 dk",
  },
];

const allCategories = [...new Set(blogPosts.map((p) => p.category))];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const categoryStyles: Record<
  string,
  { gradient: string; stripe: string; badge: string; icon: string }
> = {
  Üretim: {
    gradient: "from-primary-200 via-primary-100 to-primary-50",
    stripe: "bg-primary-500",
    badge: "bg-primary-100 text-primary-700",
    icon: "text-primary-300",
  },
  Sektör: {
    gradient: "from-purple-200 via-purple-100 to-purple-50",
    stripe: "bg-purple-500",
    badge: "bg-purple-100 text-purple-700",
    icon: "text-purple-300",
  },
  Bilgi: {
    gradient: "from-success/30 via-success/20 to-success/10",
    stripe: "bg-success",
    badge: "bg-success/20 text-success",
    icon: "text-success",
  },
  Kalite: {
    gradient: "from-accent-300 via-accent-100 to-accent-100",
    stripe: "bg-accent-500",
    badge: "bg-accent-100 text-accent-600",
    icon: "text-accent-400",
  },
  Rehber: {
    gradient: "from-primary-200 via-primary-100 to-primary-50",
    stripe: "bg-primary-500",
    badge: "bg-primary-100 text-primary-700",
    icon: "text-primary-300",
  },
  Sürdürülebilirlik: {
    gradient: "from-lime-200 via-lime-100 to-lime-50",
    stripe: "bg-lime-600",
    badge: "bg-lime-100 text-lime-700",
    icon: "text-lime-400",
  },
};

const defaultCatStyle = {
  gradient: "from-primary-100 to-primary-50",
  stripe: "bg-primary-500",
  badge: "bg-accent-100 text-accent-600",
  icon: "text-primary-300",
};

function getCatStyle(category: string) {
  return categoryStyles[category] || defaultCatStyle;
}

function parseReadTime(rt: string): number {
  return parseInt(rt) || 0;
}

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState<string>("Tümü");

  const filtered =
    activeCategory === "Tümü"
      ? blogPosts
      : blogPosts.filter((p) => p.category === activeCategory);

  const featured = filtered.filter((p) => p.featured);
  const rest = filtered.filter((p) => !p.featured);

  return (
    <section className="bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary-900 via-primary-700 to-primary-900 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <AnimateOnScroll animation="fade-up">
            <nav className="mb-6 flex items-center gap-1.5 text-sm text-white/60">
              <Link href="/" className="hover:text-white">
                Ana Sayfa
              </Link>
              <ChevronRight size={14} />
              <span className="text-white">Blog</span>
            </nav>
            <h1 className="mb-3 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
              Blog &amp; Haberler
            </h1>
            <p className="max-w-2xl text-lg text-white/70">
              Kozmetik ambalaj sektöründen haberler, rehberler ve bilgilendirici
              içerikler.
            </p>
          </AnimateOnScroll>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6 lg:py-20">
        {/* Kategori Filtreleri */}
        <AnimateOnScroll animation="fade-up">
          <div className="mb-10 flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory("Tümü")}
              className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${
                activeCategory === "Tümü"
                  ? "bg-primary-900 text-white shadow-md"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              Tümü
            </button>
            {allCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${
                  activeCategory === cat
                    ? "bg-primary-900 text-white shadow-md"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </AnimateOnScroll>

        {/* Öne Çıkan Yazılar */}
        {featured.length > 0 && (
          <div className="mb-12 grid gap-6 lg:grid-cols-2">
            {featured.map((post, i) => {
              const style = getCatStyle(post.category);
              const readPercent = Math.min(
                (parseReadTime(post.readTime) / 10) * 100,
                100
              );
              return (
                <AnimateOnScroll
                  key={post.slug}
                  animation="fade-up"
                  delay={i * 100}
                >
                  <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-100 bg-white transition-all hover:-translate-y-1 hover:shadow-xl">
                    <div className={`h-1 ${style.stripe}`} />

                    <div className="absolute left-0 top-1 z-10">
                      <div className="flex items-center gap-1 rounded-r-full bg-accent-500 px-3 py-1 text-xs font-bold text-white shadow-md">
                        <Sparkles size={12} />
                        Öne Çıkan
                      </div>
                    </div>

                    <div
                      className={`relative flex h-48 items-center justify-center bg-gradient-to-br ${style.gradient}`}
                    >
                      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
                      <BookOpen size={40} className={style.icon} />
                    </div>

                    <div className="flex flex-1 flex-col p-6">
                      <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-neutral-500">
                        <span
                          className={`rounded-full px-2.5 py-1 font-semibold ${style.badge}`}
                        >
                          {post.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {formatDate(post.date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {post.readTime}
                        </span>
                      </div>
                      <h2 className="mb-2 text-xl font-bold text-primary-900 transition-colors group-hover:text-primary-700">
                        {post.title}
                      </h2>
                      <p className="mb-4 flex-1 text-sm leading-relaxed text-neutral-500">
                        {post.excerpt}
                      </p>

                      <div className="mb-4">
                        <div className="h-1 w-full rounded-full bg-neutral-100">
                          <div
                            className={`h-1 rounded-full ${style.stripe} opacity-60 transition-all duration-500`}
                            style={{ width: `${readPercent}%` }}
                          />
                        </div>
                        <span className="mt-1 block text-[10px] text-neutral-400">
                          Okuma süresi tahmini
                        </span>
                      </div>

                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary-700 transition-colors group-hover:text-accent-600">
                        Devamını Oku
                        <ArrowRight
                          size={14}
                          className="transition-transform group-hover:translate-x-1"
                        />
                      </span>
                    </div>
                  </article>
                </AnimateOnScroll>
              );
            })}
          </div>
        )}

        {/* Diğer Yazılar */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {rest.map((post, i) => {
            const style = getCatStyle(post.category);
            const readPercent = Math.min(
              (parseReadTime(post.readTime) / 10) * 100,
              100
            );
            return (
              <AnimateOnScroll
                key={post.slug}
                animation="fade-up"
                delay={i * 80}
              >
                <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-100 bg-white transition-all hover:-translate-y-1 hover:shadow-lg">
                  <div className={`h-1 ${style.stripe}`} />

                  <div
                    className={`relative flex h-28 items-center justify-center bg-gradient-to-br ${style.gradient}`}
                  >
                    <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)", backgroundSize: "16px 16px" }} />
                    <BookOpen size={28} className={style.icon} />
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <div className="mb-3 flex items-center gap-2 text-xs text-neutral-500">
                      <Tag size={12} className="text-accent-500" />
                      <span
                        className={`rounded-full px-2 py-0.5 font-semibold ${style.badge}`}
                      >
                        {post.category}
                      </span>
                    </div>
                    <h3 className="mb-2 font-bold text-primary-900 transition-colors group-hover:text-primary-700">
                      {post.title}
                    </h3>
                    <p className="mb-4 flex-1 text-sm leading-relaxed text-neutral-500">
                      {post.excerpt}
                    </p>

                    <div className="mb-3">
                      <div className="h-1 w-full rounded-full bg-neutral-100">
                        <div
                          className={`h-1 rounded-full ${style.stripe} opacity-60 transition-all duration-500`}
                          style={{ width: `${readPercent}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-neutral-400">
                      <span>{formatDate(post.date)}</span>
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </article>
              </AnimateOnScroll>
            );
          })}

          {/* Placeholder card */}
          <AnimateOnScroll animation="fade-up" delay={rest.length * 80}>
            <div className="flex h-full min-h-[260px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-200 bg-neutral-50/50 p-8 text-center transition-all hover:border-primary-300 hover:bg-primary-50/30">
              <div className="mb-3 animate-pulse">
                <Sparkles size={32} className="text-primary-300" />
              </div>
              <p className="text-sm font-semibold text-neutral-400">
                Daha fazla yazı yakında...
              </p>
              <p className="mt-1 text-xs text-neutral-300">
                Yeni içerikler hazırlanıyor
              </p>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
