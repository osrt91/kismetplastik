const GOOGLE_TRANSLATE_API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY;
const TARGET_LOCALES = ["ar", "ru", "fr", "de", "es", "zh", "ja", "ko", "pt"];

export async function translateTexts(
  texts: string[],
  targetLocale: string,
  sourceLocale: string = "tr"
): Promise<string[]> {
  if (!GOOGLE_TRANSLATE_API_KEY) {
    console.warn("GOOGLE_TRANSLATE_API_KEY not set, skipping translation");
    return texts;
  }

  // Filter empty strings - don't send them to API
  const nonEmpty = texts.filter((t) => t.trim());
  if (nonEmpty.length === 0) return texts;

  const url = `https://translation.googleapis.com/language/v2?key=${GOOGLE_TRANSLATE_API_KEY}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      q: nonEmpty,
      source: sourceLocale,
      target: targetLocale,
      format: "text",
    }),
  });

  if (!response.ok) {
    console.error(
      `[Translate] API error: ${response.status} ${response.statusText}`
    );
    return texts;
  }

  const result = await response.json();
  const translations =
    result.data?.translations?.map(
      (t: { translatedText: string }) => t.translatedText
    ) ?? [];

  // Reconstruct full array, keeping empty strings in their original positions
  let idx = 0;
  return texts.map((t) => {
    if (!t.trim()) return t;
    return translations[idx++] ?? t;
  });
}

export { TARGET_LOCALES };
