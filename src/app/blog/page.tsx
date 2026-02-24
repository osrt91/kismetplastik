"use client";

import Link from "next/link";
import {
  ChevronRight,
  Calendar,
  Clock,
  ArrowRight,
  Tag,
  BookOpen,
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
    slug: "gida-ambalaj-trendleri-2026",
    title: "2026 Yılında Gıda Ambalaj Trendleri",
    excerpt:
      "Sürdürülebilirlik, akıllı ambalaj ve minimalist tasarım gibi öne çıkan gıda ambalaj trendlerini keşfedin.",
    category: "Sektör",
    date: "2026-02-10",
    readTime: "6 dk",
    featured: true,
  },
  {
    slug: "pet-malzeme-avantajlari",
    title: "PET Malzemenin Avantajları Nelerdir?",
    excerpt:
      "PET'in hafifliği, şeffaflığı, geri dönüşülebilirliği ve gıda güvenliği açısından sunduğu avantajlar.",
    category: "Bilgi",
    date: "2026-02-05",
    readTime: "5 dk",
  },
  {
    slug: "iso-sertifika-onemi",
    title: "Plastik Ambalajda ISO Sertifikalarının Önemi",
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

export default function BlogPage() {
  const featured = blogPosts.filter((p) => p.featured);
  const rest = blogPosts.filter((p) => !p.featured);

  return (
    <section className="bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary-900 via-primary-700 to-primary-900 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <AnimateOnScroll animation="fade-up">
            <nav className="mb-6 flex items-center gap-1.5 text-sm text-white/60">
              <Link href="/" className="hover:text-white">Ana Sayfa</Link>
              <ChevronRight size={14} />
              <span className="text-white">Blog</span>
            </nav>
            <h1 className="mb-3 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
              Blog & Haberler
            </h1>
            <p className="max-w-2xl text-lg text-white/70">
              Plastik ambalaj sektöründen haberler, rehberler ve bilgilendirici içerikler.
            </p>
          </AnimateOnScroll>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6 lg:py-20">
        {/* Kategori Filtreleri */}
        <AnimateOnScroll animation="fade-up">
          <div className="mb-10 flex flex-wrap gap-2">
            <span className="rounded-xl bg-primary-900 px-5 py-2.5 text-sm font-semibold text-white">
              Tümü
            </span>
            {allCategories.map((cat) => (
              <span
                key={cat}
                className="cursor-pointer rounded-xl bg-neutral-100 px-5 py-2.5 text-sm font-semibold text-neutral-600 transition-all hover:bg-neutral-200"
              >
                {cat}
              </span>
            ))}
          </div>
        </AnimateOnScroll>

        {/* Öne Çıkan Yazılar */}
        {featured.length > 0 && (
          <div className="mb-12 grid gap-6 lg:grid-cols-2">
            {featured.map((post, i) => (
              <AnimateOnScroll key={post.slug} animation="fade-up" delay={i * 100}>
                <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-100 bg-white transition-all hover:-translate-y-1 hover:shadow-xl">
                  <div className="flex h-48 items-center justify-center bg-gradient-to-br from-primary-100 to-primary-50">
                    <BookOpen size={40} className="text-primary-300" />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="mb-3 flex items-center gap-3 text-xs text-neutral-500">
                      <span className="rounded-full bg-accent-100 px-2.5 py-1 font-semibold text-accent-600">
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
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary-700 transition-colors group-hover:text-accent-600">
                      Devamını Oku
                      <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </article>
              </AnimateOnScroll>
            ))}
          </div>
        )}

        {/* Diğer Yazılar */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {rest.map((post, i) => (
            <AnimateOnScroll key={post.slug} animation="fade-up" delay={i * 80}>
              <article className="group flex h-full flex-col rounded-2xl border border-neutral-100 bg-white p-5 transition-all hover:-translate-y-1 hover:shadow-lg">
                <div className="mb-3 flex items-center gap-2 text-xs text-neutral-500">
                  <Tag size={12} className="text-accent-500" />
                  <span className="font-semibold">{post.category}</span>
                </div>
                <h3 className="mb-2 font-bold text-primary-900 transition-colors group-hover:text-primary-700">
                  {post.title}
                </h3>
                <p className="mb-4 flex-1 text-sm leading-relaxed text-neutral-500">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-xs text-neutral-400">
                  <span>{formatDate(post.date)}</span>
                  <span>{post.readTime}</span>
                </div>
              </article>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
