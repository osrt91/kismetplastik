import { getGlossaryTerms, getPageContent } from "@/lib/content";
import GlossaryClient from "@/components/pages/GlossaryClient";

export default async function AmbalajSozluguPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  const [terms, content] = await Promise.all([
    getGlossaryTerms(),
    getPageContent("glossary"),
  ]);
  return <GlossaryClient terms={terms} content={content} />;
}
