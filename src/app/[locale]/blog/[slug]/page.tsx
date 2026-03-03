import type { Metadata } from "next";
import { blogPosts } from "@/data/blog";
import BlogDetailClient from "@/components/pages/BlogDetailClient";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

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
  const url = `https://www.kismetplastik.com/${locale}/blog/${slug}`;

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
        tr: `https://www.kismetplastik.com/tr/blog/${slug}`,
        en: `https://www.kismetplastik.com/en/blog/${slug}`,
      },
    },
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  const isTr = locale === "tr";

  return (
    <>
      {post && (
        <>
          <BreadcrumbJsonLd
            items={[
              { name: isTr ? "Ana Sayfa" : "Home", url: `https://www.kismetplastik.com/${locale}` },
              { name: "Blog", url: `https://www.kismetplastik.com/${locale}/blog` },
              { name: post.title, url: `https://www.kismetplastik.com/${locale}/blog/${slug}` },
            ]}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Article",
                headline: post.title,
                description: post.excerpt,
                datePublished: post.date,
                author: {
                  "@type": "Organization",
                  name: "Kısmet Plastik",
                },
                publisher: {
                  "@type": "Organization",
                  name: "Kısmet Plastik",
                  logo: {
                    "@type": "ImageObject",
                    url: "https://www.kismetplastik.com/images/logo.jpg",
                  },
                },
                mainEntityOfPage: {
                  "@type": "WebPage",
                  "@id": `https://www.kismetplastik.com/${locale}/blog/${slug}`,
                },
              }),
            }}
          />
        </>
      )}
      <BlogDetailClient />
    </>
  );
}
