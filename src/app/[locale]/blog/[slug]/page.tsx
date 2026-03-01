import type { Metadata } from "next";
import { blogPosts } from "@/data/blog";
import BlogDetailClient from "@/components/pages/BlogDetailClient";
import { BlogPostingJsonLd } from "@/components/seo/JsonLd";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return { title: "Yazı bulunamadı | Kısmet Plastik" };
  }

  const title = `${post.title} | Kısmet Plastik Blog`;
  const description = post.excerpt;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: post.date,
      url: `https://www.kismetplastik.com/${locale}/blog/${slug}`,
      siteName: "Kısmet Plastik",
    },
    alternates: {
      canonical: `https://www.kismetplastik.com/${locale}/blog/${slug}`,
      languages: {
        tr: `https://www.kismetplastik.com/tr/blog/${slug}`,
        en: `https://www.kismetplastik.com/en/blog/${slug}`,
      },
    },
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  return (
    <>
      {post && (
        <BlogPostingJsonLd
          title={post.title}
          description={post.excerpt}
          datePublished={post.date}
          slug={slug}
          locale={locale}
        />
      )}
      <BlogDetailClient />
    </>
  );
}
