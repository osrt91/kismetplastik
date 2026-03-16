import { getFaqItems, getPageContent } from "@/lib/content";
import SSSClient from "@/components/pages/SSSClient";

export default async function SSSPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  const [faqItems, content] = await Promise.all([
    getFaqItems(),
    getPageContent("faq"),
  ]);
  return <SSSClient faqItems={faqItems} content={content} />;
}
