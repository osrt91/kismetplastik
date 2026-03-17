"use client";

import { useParams } from "next/navigation";
import Link from "@/components/ui/LocaleLink";
import { useLocale } from "@/contexts/LocaleContext";
import {
  ChevronRight,
  Calendar,
  Clock,
  ArrowLeft,
  ArrowRight,
  Share2,
  BookOpen,
} from "lucide-react";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { blogPosts } from "@/data/blog";

const ALLOWED_TAGS = new Set([
  "p", "h2", "h3", "h4", "strong", "em", "u", "s", "a", "img",
  "ul", "ol", "li", "blockquote", "code", "pre", "hr", "br",
]);

function sanitizeHtml(html: string): string {
  // Remove script/style tags and their contents
  let clean = html.replace(/<(script|style|iframe|object|embed|form)[^>]*>[\s\S]*?<\/\1>/gi, "");
  // Remove event handlers (on*)
  clean = clean.replace(/\s+on\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]*)/gi, "");
  // Remove javascript: URLs
  clean = clean.replace(/href\s*=\s*["']javascript:[^"']*["']/gi, 'href="#"');
  // Remove tags not in allowlist (keep their content)
  clean = clean.replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*\/?>/g, (match, tagName) => {
    const tag = tagName.toLowerCase();
    if (ALLOWED_TAGS.has(tag)) return match;
    return "";
  });
  return clean;
}

export default function BlogDetailClient() {
  const { locale, dict } = useLocale();
  const params = useParams();
  const slug = params.slug as string;
  const post = blogPosts.find((p) => p.slug === slug);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString(locale === "en" ? "en-US" : "tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  if (!post) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center bg-[#FAFAF7] dark:bg-[#0A1628]">
        <div className="text-center">
          <h1 className="mb-3 text-2xl font-extrabold text-[#0A1628] dark:text-white">
            {dict.blog.postNotFound}
          </h1>
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm font-bold text-accent-600 transition-colors hover:text-accent-500 dark:text-accent-400">
            <ArrowLeft size={14} />
            {dict.blog.backToBlog}
          </Link>
        </div>
      </section>
    );
  }

  const relatedPosts = blogPosts
    .filter((p) => p.category === post.category && p.slug !== slug)
    .concat(blogPosts.filter((p) => p.category !== post.category && p.slug !== slug))
    .slice(0, 3);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: { "@type": "Organization", name: "Kısmet Plastik" },
    publisher: {
      "@type": "Organization",
      name: "Kısmet Plastik",
      logo: { "@type": "ImageObject", url: "https://www.kismetplastik.com/images/logo.jpg" },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.kismetplastik.com/${locale}/blog/${post.slug}`,
    },
  };

  return (
    <section className="bg-[#FAFAF7] dark:bg-[#0A1628]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {/* Hero */}
      <div className="relative overflow-hidden bg-[#0A1628] py-20 lg:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A1628] via-primary-900 to-[#0A1628]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, #F59E0B 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        <div className="relative mx-auto max-w-4xl px-4 lg:px-6">
          <AnimateOnScroll animation="fade-up">
            <nav className="mb-8 flex items-center gap-2 text-sm text-white/50">
              <Link href="/" className="transition-colors hover:text-accent-400">{dict.nav.home}</Link>
              <ChevronRight size={14} />
              <Link href="/blog" className="transition-colors hover:text-accent-400">{dict.nav.blog}</Link>
              <ChevronRight size={14} />
              <span className="font-medium text-white/80 line-clamp-1">{post.title}</span>
            </nav>
            <div className="mb-5 flex flex-wrap items-center gap-3 text-sm">
              <span className="rounded-full bg-accent-500 px-3.5 py-1.5 text-xs font-bold text-[#0A1628]">
                {post.category}
              </span>
              <span className="flex items-center gap-1.5 text-white/50">
                <Calendar size={14} />
                {formatDate(post.date)}
              </span>
              <span className="flex items-center gap-1.5 text-white/50">
                <Clock size={14} />
                {post.readTime}
              </span>
            </div>
            <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
              {post.title}
            </h1>
          </AnimateOnScroll>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 py-12 lg:px-6 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_300px]">
          <AnimateOnScroll animation="fade-up">
            <article>
              <Link
                href="/blog"
                className="group mb-10 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-[#0A1628] shadow-sm transition-all duration-200 hover:-translate-x-1 hover:shadow-md dark:bg-neutral-800 dark:text-white"
              >
                <ArrowLeft size={14} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
                {dict.blog.backToBlog}
              </Link>

              {/* Excerpt / Lead paragraph */}
              <p className="mb-8 border-l-4 border-accent-500 pl-5 text-lg font-medium leading-relaxed text-[#0A1628]/80 dark:text-white/80 lg:text-xl">
                {post.excerpt}
              </p>

              {/* Content paragraphs */}
              {post.content_html ? (
                <div
                  className="prose prose-lg max-w-none text-neutral-600 prose-headings:text-[#0A1628] prose-p:leading-[1.85] prose-a:text-amber-600 prose-a:underline prose-blockquote:border-amber-500 prose-blockquote:text-neutral-500 prose-strong:text-[#0A1628] prose-code:bg-neutral-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-amber-700 prose-img:rounded-lg prose-li:leading-[1.85] dark:text-neutral-300 dark:prose-headings:text-white dark:prose-strong:text-white dark:prose-a:text-amber-400 dark:prose-blockquote:text-neutral-400 dark:prose-code:bg-neutral-800 dark:prose-code:text-amber-300"
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHtml(post.content_html),
                  }}
                />
              ) : (
                <div className="space-y-6">
                  {post.content.map((paragraph, i) => (
                    <p key={i} className="text-base leading-[1.85] text-neutral-600 dark:text-neutral-300 lg:text-lg lg:leading-[1.85]">
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}

              {/* Share / CTA section */}
              <div className="mt-12 flex flex-col gap-4 border-t border-neutral-200 pt-8 dark:border-neutral-700 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-neutral-400 dark:text-neutral-500">Paylaş:</span>
                  <button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({ title: post.title, url: window.location.href });
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                      }
                    }}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#0A1628]/5 text-[#0A1628] transition-all duration-200 hover:bg-accent-500 hover:text-[#0A1628] dark:bg-white/10 dark:text-white dark:hover:bg-accent-500 dark:hover:text-[#0A1628]"
                    aria-label="Paylaş"
                  >
                    <Share2 size={16} />
                  </button>
                </div>
                <Link
                  href="/teklif-al"
                  className="group inline-flex items-center gap-2 rounded-full bg-accent-500 px-6 py-2.5 text-sm font-bold text-[#0A1628] shadow-lg shadow-accent-500/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent-400 hover:shadow-xl hover:shadow-accent-500/30"
                >
                  {dict.nav.quote}
                  <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </div>
            </article>
          </AnimateOnScroll>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-6">
              {/* Related posts */}
              <div className="overflow-hidden rounded-2xl border border-neutral-200/60 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-800/80">
                <div className="border-b border-neutral-100 px-6 py-4 dark:border-neutral-700">
                  <h3 className="flex items-center gap-2 font-extrabold text-[#0A1628] dark:text-white">
                    <BookOpen size={18} className="text-accent-500" />
                    {dict.blog.relatedPosts}
                  </h3>
                </div>
                <ul className="divide-y divide-neutral-100 dark:divide-neutral-700">
                  {relatedPosts.map((rp) => (
                    <li key={rp.slug}>
                      <Link
                        href={`/blog/${rp.slug}`}
                        className="group/rp block px-6 py-4 transition-colors hover:bg-accent-50/50 dark:hover:bg-accent-500/5"
                      >
                        <span className="block text-sm font-semibold text-[#0A1628] transition-colors group-hover/rp:text-accent-600 dark:text-white dark:group-hover/rp:text-accent-400">
                          {rp.title}
                        </span>
                        <span className="mt-1.5 flex items-center gap-2 text-xs text-neutral-400 dark:text-neutral-500">
                          <span className="rounded-full bg-accent-500/10 px-2 py-0.5 font-semibold text-accent-600 dark:text-accent-400">
                            {rp.category}
                          </span>
                          <span>{rp.readTime}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA card */}
              <Link
                href="/teklif-al"
                className="group block overflow-hidden rounded-2xl bg-gradient-to-br from-accent-500 to-accent-400 p-6 text-center shadow-lg shadow-accent-500/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-accent-500/30"
              >
                <p className="text-lg font-extrabold text-[#0A1628]">
                  {dict.nav.quote}
                </p>
                <p className="mt-1 text-sm font-medium text-[#0A1628]/60">
                  Hemen teklif alın
                </p>
                <ArrowRight size={20} className="mx-auto mt-3 text-[#0A1628]/40 transition-transform duration-300 group-hover:translate-x-2" />
              </Link>
            </div>
          </aside>
        </div>

        {/* Mobile related posts */}
        <div className="mt-16 lg:hidden">
          <h3 className="mb-6 flex items-center gap-2 text-lg font-extrabold text-[#0A1628] dark:text-white">
            <BookOpen size={20} className="text-accent-500" />
            {dict.blog.relatedPosts}
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {relatedPosts.slice(0, 2).map((rp) => (
              <Link
                key={rp.slug}
                href={`/blog/${rp.slug}`}
                className="group block rounded-xl border border-neutral-200/60 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg dark:border-neutral-700 dark:bg-neutral-800/80"
              >
                <span className="mb-2 inline-block rounded-full bg-accent-500/15 px-2.5 py-0.5 text-xs font-bold text-accent-600 dark:text-accent-400">
                  {rp.category}
                </span>
                <h4 className="text-sm font-bold text-[#0A1628] transition-colors group-hover:text-accent-600 dark:text-white dark:group-hover:text-accent-400">
                  {rp.title}
                </h4>
                <span className="mt-2 flex items-center gap-1 text-xs font-bold text-accent-600 dark:text-accent-400">
                  Oku <ArrowRight size={12} className="transition-transform duration-200 group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
