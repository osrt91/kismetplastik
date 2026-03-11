import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, requireSupabase } from "@/lib/supabase-admin";
import { checkAuth } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import type { DbSiteSetting } from "@/types/database";

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
      .order("group", { ascending: true })
      .order("key", { ascending: true });

    if (error) {
      console.error("[Admin Settings GET]", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    // Group settings by "group" field
    const grouped = (data ?? []).reduce<Record<string, DbSiteSetting[]>>((acc, setting) => {
      const group = setting.group ?? "general";
      if (!acc[group]) acc[group] = [];
      acc[group].push(setting);
      return acc;
    }, {});

    return NextResponse.json({ success: true, data: { settings: data ?? [], grouped } });
  } catch (err) {
    console.error("[Admin Settings GET]", err);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const authError = checkAuth(request);
  if (authError) return authError;

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { ok: allowed } = rateLimit(`admin:settings:${ip}`, { limit: 60, windowMs: 60_000 });
  if (!allowed) {
    return NextResponse.json({ success: false, error: "Çok fazla istek" }, { status: 429 });
  }

  const sbError = requireSupabase();
  if (sbError) return sbError;

  let body: { settings?: { key: string; value: string; group?: string }[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Geçersiz JSON" }, { status: 400 });
  }

  if (!Array.isArray(body.settings) || body.settings.length === 0) {
    return NextResponse.json({ success: false, error: "Geçersiz ayar verisi" }, { status: 400 });
  }

  try {
    const supabase = getSupabaseAdmin();
    const errors: string[] = [];
    const updated: DbSiteSetting[] = [];

    for (const item of body.settings) {
      if (!item.key?.trim()) continue;

      const { data, error } = await supabase
        .from("site_settings")
        .upsert(
          {
            key: item.key.trim(),
            value: item.value ?? "",
            group: item.group ?? "general",
            updated_at: new Date().toISOString(),
          },
          { onConflict: "key" }
        )
        .select()
        .single();

      if (error) {
        console.error(`[Admin Settings PUT] key=${item.key}`, error);
        errors.push(`${item.key}: ${error.message}`);
      } else if (data) {
        updated.push(data as DbSiteSetting);
      }
    }

    if (errors.length > 0 && updated.length === 0) {
      return NextResponse.json({ success: false, error: errors.join("; ") }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: { updated },
      ...(errors.length > 0 ? { warning: errors.join("; ") } : {}),
    });
  } catch (err) {
    console.error("[Admin Settings PUT]", err);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}
