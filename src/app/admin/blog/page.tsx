"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  Calendar,
  Clock,
  Star,
  Newspaper,
} from "lucide-react";

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
    excerpt: "PET şişelerin üretim aşamalarını, kullanılan teknolojileri ve kalite kontrol süreçlerini detaylı olarak inceliyoruz.",
    category: "Üretim",
    date: "2026-02-15",
    readTime: "8 dk",
    featured: true,
  },
  {
    slug: "kozmetik-ambalaj-trendleri-2026",
    title: "2026 Yılında Kozmetik Ambalaj Trendleri",
    excerpt: "Sürdürülebilirlik, akıllı ambalaj ve minimalist tasarım gibi öne çıkan kozmetik ambalaj trendlerini keşfedin.",
    category: "Sektör",
    date: "2026-02-10",
    readTime: "6 dk",
    featured: true,
  },
  {
    slug: "pet-malzeme-avantajlari",
    title: "PET Malzemenin Avantajları Nelerdir?",
    excerpt: "PET'in hafifliği, şeffaflığı, geri dönüşülebilirliği ve kozmetik ambalaj açısından sunduğu avantajlar.",
    category: "Bilgi",
    date: "2026-02-05",
    readTime: "5 dk",
  },
  {
    slug: "iso-sertifika-onemi",
    title: "Kozmetik Ambalajda ISO Sertifikalarının Önemi",
    excerpt: "ISO 9001, ISO 14001 ve FSSC 22000 sertifikalarının ambalaj sektöründeki önemi.",
    category: "Kalite",
    date: "2026-01-28",
    readTime: "7 dk",
  },
  {
    slug: "surdurulebilir-ambalaj",
    title: "Sürdürülebilir Ambalaj: Geleceğin Standartı",
    excerpt: "Çevreci ambalaj çözümleri ve sürdürülebilirlik yaklaşımımız.",
    category: "Sürdürülebilirlik",
    date: "2026-01-20",
    readTime: "6 dk",
    featured: true,
  },
  {
    slug: "kozmetik-sise-secimi",
    title: "Doğru Kozmetik Şişe Nasıl Seçilir?",
    excerpt: "Ürün türüne, hacme ve pazarlama stratejisine göre doğru ambalaj seçimi rehberi.",
    category: "Rehber",
    date: "2026-01-15",
    readTime: "9 dk",
  },
  {
    slug: "ambalaj-baski-teknikleri",
    title: "Ambalaj Baskı ve Dekorasyon Teknikleri",
    excerpt: "Serigrafi, hot-stamping, etiketleme ve dijital baskı teknikleri hakkında detaylı bilgi.",
    category: "Üretim",
    date: "2026-01-08",
    readTime: "7 dk",
  },
  {
    slug: "b2b-ambalaj-cozumleri",
    title: "B2B Ambalaj Çözümlerinde Kısmet Plastik Farkı",
    excerpt: "Toptan ambalaj alımında dikkat edilmesi gerekenler ve Kısmet Plastik'in B2B avantajları.",
    category: "Kurumsal",
    date: "2026-01-02",
    readTime: "5 dk",
  },
];

export default function AdminBlogPage() {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search) return blogPosts;
    const q = search.toLowerCase();
    return blogPosts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Blog Yazıları</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {blogPosts.length} yazı kayıtlı
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90"
        >
          <Plus size={16} />
          Yeni Yazı
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Yazı başlığı veya kategori ile ara..."
          className="w-full rounded-lg border border-border bg-card py-2.5 pl-9 pr-4 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Blog Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((post) => (
          <div
            key={post.slug}
            className="group flex flex-col rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:border-border hover:shadow-md"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                {post.category}
              </span>
              {post.featured && (
                <Star size={14} className="fill-accent text-accent" />
              )}
            </div>

            <h3 className="mb-2 text-sm font-semibold text-foreground line-clamp-2">
              {post.title}
            </h3>
            <p className="mb-4 flex-1 text-xs text-muted-foreground line-clamp-2">
              {post.excerpt}
            </p>

            <div className="mb-4 flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                {new Date(post.date).toLocaleDateString("tr-TR")}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {post.readTime}
              </span>
            </div>

            <div className="flex items-center gap-2 border-t border-border pt-3">
              <Link
                href={`/admin/blog/${post.slug}`}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted"
              >
                <Edit3 size={12} />
                Düzenle
              </Link>
              <button className="flex items-center justify-center rounded-lg border border-border p-2 text-muted-foreground transition-colors hover:border-destructive/50 hover:bg-destructive/10 hover:text-destructive">
                <Trash2 size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <Newspaper size={40} className="mb-3 opacity-30" />
          <p className="text-sm font-medium">Yazı bulunamadı</p>
        </div>
      )}
    </div>
  );
}
