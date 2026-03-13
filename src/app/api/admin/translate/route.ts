import { NextRequest, NextResponse } from "next/server";
import { checkAuth } from "@/lib/auth";
import { getSupabaseAdmin, requireSupabase } from "@/lib/supabase-admin";
import { translateTexts, TARGET_LOCALES } from "@/lib/translate";

export async function POST(request: NextRequest) {
  const authError = checkAuth(request);
  if (authError) return authError;
  const sbError = requireSupabase();
  if (sbError) return sbError;

  let body: {
    source_table: string;
    source_id: string;
    fields: Array<{ field_name: string; text_tr: string; text_en: string }>;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Geçersiz JSON" },
      { status: 400 }
    );
  }

  const { source_table, source_id, fields } = body;

  if (
    !source_table ||
    !source_id ||
    !Array.isArray(fields) ||
    fields.length === 0
  ) {
    return NextResponse.json(
      {
        success: false,
        error: "source_table, source_id ve fields zorunludur",
      },
      { status: 400 }
    );
  }

  try {
    const supabase = getSupabaseAdmin();
    let translatedCount = 0;

    for (const targetLocale of TARGET_LOCALES) {
      // Collect texts to translate (use TR as source)
      const textsToTranslate = fields.map((f) => f.text_tr || "");
      const translated = await translateTexts(
        textsToTranslate,
        targetLocale,
        "tr"
      );

      for (let i = 0; i < fields.length; i++) {
        const translatedText = translated[i];
        if (!translatedText || !translatedText.trim()) continue;

        // Check if manual translation exists — don't overwrite
        const { data: existing } = await supabase
          .from("translations")
          .select("is_manual")
          .eq("source_table", source_table)
          .eq("source_id", source_id)
          .eq("field_name", fields[i].field_name)
          .eq("locale", targetLocale)
          .single();

        if (existing?.is_manual) continue;

        // Upsert translation
        const { error } = await supabase.from("translations").upsert(
          {
            source_table,
            source_id,
            field_name: fields[i].field_name,
            locale: targetLocale,
            translated_text: translatedText,
            is_manual: false,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "source_table,source_id,field_name,locale" }
        );

        if (!error) translatedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      translated_count: translatedCount,
    });
  } catch (err) {
    console.error("[Admin Translate POST]", err);
    return NextResponse.json(
      { success: false, error: "Çeviri hatası" },
      { status: 500 }
    );
  }
}
