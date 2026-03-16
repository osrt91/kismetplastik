import type { Metadata } from "next";
import { blogPosts } from "@/data/blog";
import BlogDetailClient from "@/components/pages/BlogDetailClient";

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
      languages: Object.fromEntries([
        ...["tr", "en", "ar", "ru", "fr", "de", "es", "zh", "ja", "ko", "pt"].map(
          (l) => [l, `https://www.kismetplastik.com/${l}/blog/${slug}`]
        ),
        ["x-default", `https://www.kismetplastik.com/tr/blog/${slug}`],
      ]),
    },
  };
}

export default function BlogDetailPage() {
  return <BlogDetailClient />;
}
