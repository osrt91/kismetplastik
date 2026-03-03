import type { Metadata } from "next";
import { blogPosts } from "@/data/blog";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import BlogDetailClient from "@/components/pages/BlogDetailClient";

const BASE_URL = "https://www.kismetplastik.com";

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
  const url = `${BASE_URL}/${locale}/blog/${slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: post.date,
      url,
      siteName: "Kısmet Plastik",
      locale: locale === "tr" ? "tr_TR" : "en_US",
      images: [
        {
          url: "/images/og-image.png",
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/og-image.png"],
    },
    alternates: {
      canonical: url,
      languages: {
        tr: `${BASE_URL}/tr/blog/${slug}`,
        en: `${BASE_URL}/en/blog/${slug}`,
        "x-default": `${BASE_URL}/tr/blog/${slug}`,
      },
    },
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  const isTr = locale === "tr";
  const url = `${BASE_URL}/${locale}/blog/${slug}`;

  return (
    <>
      {post && (
        <>
          <ArticleJsonLd
            title={post.title}
            description={post.excerpt}
            url={url}
            datePublished={post.date}
          />
          <BreadcrumbJsonLd
            items={[
              { name: isTr ? "Ana Sayfa" : "Home", url: `${BASE_URL}/${locale}` },
              { name: "Blog", url: `${BASE_URL}/${locale}/blog` },
              { name: post.title, url },
            ]}
          />
        </>
      )}
      <BlogDetailClient />
    </>
  );
}
