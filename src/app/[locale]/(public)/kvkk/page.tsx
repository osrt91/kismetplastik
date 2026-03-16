import { getPageContent, getLocalizedFieldSync } from "@/lib/content";

export default async function KVKKPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const content = await getPageContent("kvkk");
  const hero = content?.kvkk_hero;
  const body = content?.kvkk_content;

  const title = hero ? getLocalizedFieldSync(hero, "title", locale) : "";
  const bodyText = body ? getLocalizedFieldSync(body, "content", locale) : "";

  return (
    <div className="mx-auto max-w-4xl px-4 py-20 lg:px-6">
      <h1 className="font-display mb-8 text-3xl font-bold text-foreground">
        {title ||
          (locale === "tr" ? "KVKK Aydınlatma Metni" : "Privacy Policy")}
      </h1>
      {bodyText && (
        <div className="prose prose-neutral dark:prose-invert max-w-none whitespace-pre-wrap text-muted-foreground">
          {bodyText}
        </div>
      )}
    </div>
  );
}
