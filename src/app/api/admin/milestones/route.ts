import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabase-admin";
import { checkAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const authError = checkAuth(request);
  if (authError) return authError;

  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json(
      { success: false, error: "Supabase admin yapılandırılmamış." },
      { status: 503 }
    );
  }

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("milestones")
      .select("*")
      .order("year", { ascending: true })
      .order("display_order", { ascending: true });

    if (error) {
      console.error("[Admin Milestones GET]", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: data ?? [] });
  } catch (err) {
    console.error("[Admin Milestones GET]", err);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authError = checkAuth(request);
  if (authError) return authError;

  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json(
      { success: false, error: "Supabase admin yapılandırılmamış." },
      { status: 503 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Geçersiz JSON" }, { status: 400 });
  }

  const { year, title_tr, title_en, description_tr, description_en, icon, display_order } = body as {
    year?: number;
    title_tr?: string;
    title_en?: string;
    description_tr?: string;
    description_en?: string;
    icon?: string;
    display_order?: number;
  };

  if (!year || isNaN(Number(year))) {
    return NextResponse.json({ success: false, error: "Geçerli bir yıl giriniz" }, { status: 400 });
  }
  if (!title_tr?.trim()) {
    return NextResponse.json({ success: false, error: "Başlık (TR) zorunludur" }, { status: 400 });
  }
  if (!title_en?.trim()) {
    return NextResponse.json({ success: false, error: "Başlık (EN) zorunludur" }, { status: 400 });
  }
  if (!description_tr?.trim()) {
    return NextResponse.json({ success: false, error: "Açıklama (TR) zorunludur" }, { status: 400 });
  }
  if (!description_en?.trim()) {
    return NextResponse.json({ success: false, error: "Açıklama (EN) zorunludur" }, { status: 400 });
  }

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("milestones")
      .insert({
        year: Number(year),
        title_tr: title_tr.trim(),
        title_en: title_en.trim(),
        description_tr: description_tr.trim(),
        description_en: description_en.trim(),
        icon: icon?.trim() || null,
        display_order: Number(display_order ?? 0),
      })
      .select()
      .single();

    if (error) {
      console.error("[Admin Milestones POST]", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err) {
    console.error("[Admin Milestones POST]", err);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}
