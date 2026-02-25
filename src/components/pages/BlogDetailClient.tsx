"use client";

import { useParams } from "next/navigation";
import Link from "@/components/ui/LocaleLink";
import { useLocale } from "@/contexts/LocaleContext";
import {
  ChevronRight,
  Calendar,
  Clock,
  ArrowLeft,
  Share2,
  BookOpen,
  Tag,
} from "lucide-react";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { blogPosts } from "@/data/blog";

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
      <section className="flex min-h-[60vh] items-center justify-center bg-neutral-50">
        <div className="text-center">
          <h1 className="mb-2 text-2xl font-bold text-neutral-700">
            {dict.blog.postNotFound}
          </h1>
          <Link href="/blog" className="text-primary-700 hover:underline">
            {dict.blog.backToBlog}
          </Link>
        </div>
      </section>
    );
  }

  const relatedPosts = blogPosts
    .filter((p) => p.slug !== slug)
    .slice(0, 3);

  return (
    <section className="bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary-900 via-primary-700 to-primary-900 py-16 lg:py-20">
        <div className="mx-auto max-w-4xl px-4 lg:px-6">
          <AnimateOnScroll animation="fade-up">
            <nav className="mb-6 flex items-center gap-1.5 text-sm text-white/60">
              <Link href="/" className="hover:text-white">{dict.nav.home}</Link>
              <ChevronRight size={14} />
              <Link href="/blog" className="hover:text-white">{dict.nav.blog}</Link>
              <ChevronRight size={14} />
              <span className="text-white">{post.title}</span>
            </nav>
            <div className="mb-4 flex items-center gap-3 text-sm text-white/60">
              <span className="rounded-full bg-accent-500/20 px-3 py-1 font-semibold text-accent-400">
                {post.category}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                {formatDate(post.date)}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {post.readTime}
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white sm:text-3xl lg:text-4xl">
              {post.title}
            </h1>
          </AnimateOnScroll>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 py-12 lg:px-6 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_280px]">
          <AnimateOnScroll animation="fade-up">
            <article className="prose prose-lg max-w-none">
              <Link
                href="/blog"
                className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-primary-700 no-underline transition-colors hover:text-primary-900"
              >
                <ArrowLeft size={16} />
                {dict.blog.backToBlog}
              </Link>

              <p className="text-lg font-medium text-neutral-700">{post.excerpt}</p>

              {post.content.map((paragraph, i) => (
                <p key={i} className="leading-relaxed text-neutral-600">
                  {paragraph}
                </p>
              ))}
            </article>
          </AnimateOnScroll>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-6">
              <div className="rounded-xl border border-neutral-200 p-5">
                <h3 className="mb-4 flex items-center gap-2 font-bold text-primary-900">
                  <BookOpen size={18} />
                  {dict.blog.relatedPosts}
                </h3>
                <ul className="space-y-3">
                  {relatedPosts.map((rp) => (
                    <li key={rp.slug}>
                      <Link
                        href={`/blog/${rp.slug}`}
                        className="block text-sm text-neutral-600 transition-colors hover:text-primary-700"
                      >
                        <span className="font-medium">{rp.title}</span>
                        <span className="mt-0.5 flex items-center gap-2 text-xs text-neutral-400">
                          <Tag size={10} />
                          {rp.category} &middot; {rp.readTime}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href="/teklif-al"
                className="block rounded-xl bg-accent-500 p-5 text-center font-bold text-primary-900 shadow-lg transition-all hover:bg-accent-400 hover:-translate-y-0.5"
              >
                {dict.nav.quote}
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
