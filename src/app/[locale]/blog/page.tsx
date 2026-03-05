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
import { blogPosts } from "@/data/blog";

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
    gradient: "from-primary-900/10 via-primary-900/5 to-transparent",
    stripe: "bg-primary-900",
    badge: "bg-accent-500/15 text-accent-600 dark:bg-accent-500/25 dark:text-accent-400",
    icon: "text-primary-900/20 dark:text-primary-100/20",
  },
  Sektör: {
    gradient: "from-primary-900/15 via-primary-900/8 to-transparent",
    stripe: "bg-primary-900",
    badge: "bg-accent-500/15 text-accent-600 dark:bg-accent-500/25 dark:text-accent-400",
    icon: "text-primary-900/20 dark:text-primary-100/20",
  },
  Bilgi: {
    gradient: "from-accent-500/15 via-accent-500/8 to-transparent",
    stripe: "bg-accent-500",
    badge: "bg-accent-500/15 text-accent-600 dark:bg-accent-500/25 dark:text-accent-400",
    icon: "text-accent-500/30",
  },
  Kalite: {
    gradient: "from-accent-400/15 via-accent-300/8 to-transparent",
    stripe: "bg-accent-500",
    badge: "bg-accent-500/15 text-accent-600 dark:bg-accent-500/25 dark:text-accent-400",
    icon: "text-accent-500/30",
  },
  Rehber: {
    gradient: "from-primary-900/10 via-primary-900/5 to-transparent",
    stripe: "bg-primary-900",
    badge: "bg-accent-500/15 text-accent-600 dark:bg-accent-500/25 dark:text-accent-400",
    icon: "text-primary-900/20 dark:text-primary-100/20",
  },
  Sürdürülebilirlik: {
    gradient: "from-emerald-500/15 via-emerald-500/8 to-transparent",
    stripe: "bg-emerald-600",
    badge: "bg-emerald-500/15 text-emerald-700 dark:bg-emerald-500/25 dark:text-emerald-400",
    icon: "text-emerald-500/30",
  },
};

const defaultCatStyle = {
  gradient: "from-primary-900/10 to-transparent",
  stripe: "bg-accent-500",
  badge: "bg-accent-500/15 text-accent-600 dark:bg-accent-500/25 dark:text-accent-400",
  icon: "text-primary-900/20 dark:text-primary-100/20",
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
    <section className="bg-[#FAFAF7] dark:bg-[#0A1628]">
      {/* Hero */}
      <div className="relative overflow-hidden bg-[#0A1628] py-20 lg:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A1628] via-primary-900 to-[#0A1628]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, #F59E0B 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        <div className="relative mx-auto max-w-7xl px-4 lg:px-6">
          <AnimateOnScroll animation="fade-up">
            <nav className="mb-8 flex items-center gap-2 text-sm text-white/50">
              <Link href="/" className="transition-colors hover:text-accent-400">
                Ana Sayfa
              </Link>
              <ChevronRight size={14} />
              <span className="font-medium text-accent-400">Blog</span>
            </nav>
            <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Blog &amp; <span className="text-accent-400">Haberler</span>
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-white/60">
              Kozmetik ambalaj sektöründen haberler, rehberler ve bilgilendirici
              içerikler.
            </p>
          </AnimateOnScroll>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6 lg:py-20">
        {/* Kategori Filtreleri */}
        <AnimateOnScroll animation="fade-up">
          <div className="mb-12 flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory("Tümü")}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${
                activeCategory === "Tümü"
                  ? "bg-accent-500 text-[#0A1628] shadow-lg shadow-accent-500/25"
                  : "bg-white text-neutral-600 shadow-sm hover:bg-accent-50 hover:text-accent-600 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
              }`}
            >
              Tümü
            </button>
            {allCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${
                  activeCategory === cat
                    ? "bg-accent-500 text-[#0A1628] shadow-lg shadow-accent-500/25"
                    : "bg-white text-neutral-600 shadow-sm hover:bg-accent-50 hover:text-accent-600 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </AnimateOnScroll>

        {/* Öne Çıkan Yazılar - Featured hero cards */}
        {featured.length > 0 && (
          <div className="mb-16 grid gap-8 lg:grid-cols-2">
            {featured.map((post, i) => {
              const style = getCatStyle(post.category);
              return (
                <AnimateOnScroll
                  key={post.slug}
                  animation="fade-up"
                  delay={i * 100}
                >
                  <Link href={`/blog/${post.slug}`} className="block h-full">
                    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200/60 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-accent-500/10 dark:border-neutral-700 dark:bg-neutral-800/80">
                      {/* Featured badge */}
                      <div className="absolute left-4 top-4 z-10">
                        <div className="flex items-center gap-1.5 rounded-full bg-accent-500 px-3.5 py-1.5 text-xs font-bold text-[#0A1628] shadow-lg shadow-accent-500/30">
                          <Sparkles size={12} />
                          Öne Çıkan
                        </div>
                      </div>

                      {/* Gradient visual area with overlay */}
                      <div className={`relative flex h-56 items-center justify-center bg-gradient-to-br ${style.gradient} overflow-hidden`}>
                        <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent dark:from-neutral-800/80" />
                        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
                        <BookOpen size={48} className={`${style.icon} transition-transform duration-500 group-hover:scale-110`} />
                      </div>

                      <div className="flex flex-1 flex-col p-6 lg:p-8">
                        <div className="mb-4 flex flex-wrap items-center gap-3 text-xs">
                          <span className={`rounded-full px-3 py-1 font-bold ${style.badge}`}>
                            {post.category}
                          </span>
                          <span className="flex items-center gap-1 text-neutral-400 dark:text-neutral-500">
                            <Calendar size={12} />
                            {formatDate(post.date)}
                          </span>
                          <span className="flex items-center gap-1 text-neutral-400 dark:text-neutral-500">
                            <Clock size={12} />
                            {post.readTime}
                          </span>
                        </div>
                        <h2 className="mb-3 text-xl font-extrabold leading-tight text-[#0A1628] transition-colors duration-200 group-hover:text-accent-600 dark:text-white dark:group-hover:text-accent-400 lg:text-2xl">
                          {post.title}
                        </h2>
                        <p className="mb-6 flex-1 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
                          {post.excerpt}
                        </p>

                        <span className="inline-flex items-center gap-2 text-sm font-bold text-accent-600 transition-colors group-hover:text-accent-500 dark:text-accent-400">
                          Devamını Oku
                          <ArrowRight
                            size={16}
                            className="transition-transform duration-300 group-hover:translate-x-2"
                          />
                        </span>
                      </div>
                    </article>
                  </Link>
                </AnimateOnScroll>
              );
            })}
          </div>
        )}

        {/* Section divider */}
        {featured.length > 0 && rest.length > 0 && (
          <div className="mb-12 flex items-center gap-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-neutral-200 to-transparent dark:via-neutral-700" />
            <span className="text-sm font-semibold tracking-wide text-neutral-400 uppercase">Tüm Yazılar</span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-neutral-200 to-transparent dark:via-neutral-700" />
          </div>
        )}

        {/* Diğer Yazılar - Regular grid cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((post, i) => {
            const style = getCatStyle(post.category);
            return (
              <AnimateOnScroll
                key={post.slug}
                animation="fade-up"
                delay={i * 80}
              >
                <Link href={`/blog/${post.slug}`} className="block h-full">
                  <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200/60 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-accent-500/8 dark:border-neutral-700 dark:bg-neutral-800/80">
                    {/* Gradient visual area */}
                    <div className={`relative flex h-36 items-center justify-center bg-gradient-to-br ${style.gradient} overflow-hidden`}>
                      <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-transparent dark:from-neutral-800/60" />
                      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)", backgroundSize: "18px 18px" }} />
                      <BookOpen size={32} className={`${style.icon} transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`} />
                    </div>

                    <div className="flex flex-1 flex-col p-5 lg:p-6">
                      {/* Category pill + metadata */}
                      <div className="mb-3 flex items-center gap-2.5 text-xs">
                        <span className={`rounded-full px-2.5 py-1 font-bold ${style.badge}`}>
                          {post.category}
                        </span>
                        <span className="text-neutral-400 dark:text-neutral-500">
                          {formatDate(post.date)}
                        </span>
                      </div>

                      <h3 className="mb-2 text-base font-bold leading-snug text-[#0A1628] transition-colors duration-200 group-hover:text-accent-600 dark:text-white dark:group-hover:text-accent-400 lg:text-lg">
                        {post.title}
                      </h3>
                      <p className="mb-5 flex-1 text-sm leading-relaxed text-neutral-500 line-clamp-3 dark:text-neutral-400">
                        {post.excerpt}
                      </p>

                      {/* Footer: read time + read more */}
                      <div className="flex items-center justify-between border-t border-neutral-100 pt-4 dark:border-neutral-700">
                        <span className="flex items-center gap-1.5 text-xs text-neutral-400 dark:text-neutral-500">
                          <Clock size={12} />
                          {post.readTime}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-accent-600 transition-colors group-hover:text-accent-500 dark:text-accent-400">
                          Devamını Oku
                          <ArrowRight
                            size={12}
                            className="transition-transform duration-300 group-hover:translate-x-1.5"
                          />
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              </AnimateOnScroll>
            );
          })}

          {/* Placeholder card */}
          <AnimateOnScroll animation="fade-up" delay={rest.length * 80}>
            <div className="flex h-full min-h-[320px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-200 bg-white/50 p-8 text-center transition-all duration-300 hover:border-accent-400 hover:bg-accent-50/30 dark:border-neutral-700 dark:bg-neutral-800/30 dark:hover:border-accent-500/50 dark:hover:bg-accent-500/5">
              <div className="mb-4">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-accent-500/10">
                  <Sparkles size={28} className="text-accent-500 animate-pulse" />
                </div>
              </div>
              <p className="text-sm font-bold text-neutral-500 dark:text-neutral-400">
                Daha fazla yazı yakında...
              </p>
              <p className="mt-1.5 text-xs text-neutral-400 dark:text-neutral-500">
                Yeni içerikler hazırlanıyor
              </p>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
