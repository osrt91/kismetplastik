import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, requireSupabase } from "@/lib/supabase-admin";
import { checkAuth } from "@/lib/auth";

const DIA_SETTING_KEYS = [
  "dia_api_url",
  "dia_username",
  "dia_password",
  "dia_api_key",
  "dia_firma_kodu",
  "dia_donem_kodu",
] as const;

function maskPassword(value: string): string {
  if (value.length <= 4) return "****";
  return "*".repeat(value.length - 4) + value.slice(-4);
}

export async function GET(request: NextRequest) {
  const authError = checkAuth(request);
  if (authError) return authError;

  const sbError = requireSupabase();
  if (sbError) return sbError;

  try {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .like("key", "dia_%")
      .order("key", { ascending: true });

    if (error) {
      console.error("[DIA Settings GET]", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    // Build settings object, masking the password
    const settings: Record<string, string> = {};
    for (const row of data ?? []) {
      if (row.key === "dia_password" || row.key === "dia_api_key") {
        settings[row.key] = row.value ? maskPassword(row.value) : "";
      } else {
        settings[row.key] = row.value ?? "";
      }
    }

    return NextResponse.json({ success: true, data: { settings } });
  } catch (err) {
    console.error("[DIA Settings GET]", err);
    return NextResponse.json(
      { success: false, error: "Sunucu hatası" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const authError = checkAuth(request);
  if (authError) return authError;

  const sbError = requireSupabase();
  if (sbError) return sbError;

  let body: Record<string, string>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Geçersiz JSON" },
      { status: 400 }
    );
  }

  // Validate that only known DIA keys are provided
  const validKeys = new Set<string>(DIA_SETTING_KEYS);
  const providedKeys = Object.keys(body).filter((k) => validKeys.has(k));

  if (providedKeys.length === 0) {
    return NextResponse.json(
      { success: false, error: "Geçerli DIA ayar anahtarı bulunamadı" },
      { status: 400 }
    );
  }

  try {
    const supabase = getSupabaseAdmin();
    const errors: string[] = [];
    const updated: string[] = [];

    for (const key of providedKeys) {
      const value = body[key] ?? "";

      const { error } = await supabase
        .from("site_settings")
        .upsert(
          {
            key,
            value,
            group: "dia",
            updated_at: new Date().toISOString(),
          },
          { onConflict: "key" }
        )
        .select()
        .single();

      if (error) {
        console.error(`[DIA Settings PUT] key=${key}`, error);
        errors.push(`${key}: ${error.message}`);
      } else {
        updated.push(key);
      }
    }

    if (errors.length > 0 && updated.length === 0) {
      return NextResponse.json(
        { success: false, error: errors.join("; ") },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `${updated.length} ayar güncellendi`,
      data: { updated },
      ...(errors.length > 0 ? { warning: errors.join("; ") } : {}),
    });
  } catch (err) {
    console.error("[DIA Settings PUT]", err);
    return NextResponse.json(
      { success: false, error: "Sunucu hatası" },
      { status: 500 }
    );
  }
}
