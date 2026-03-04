import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { checkAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const authError = checkAuth(request);
  if (authError) return authError;

  try {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("content_sections")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      console.error("[Admin Content Sections GET]", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: data ?? [] });
  } catch (err) {
    console.error("[Admin Content Sections GET]", err);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authError = checkAuth(request);
  if (authError) return authError;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Geçersiz JSON" }, { status: 400 });
  }

  const {
    section_key,
    title_tr,
    title_en,
    subtitle_tr,
    subtitle_en,
    content_tr,
    content_en,
    cta_text_tr,
    cta_text_en,
    cta_url,
    image_url,
    display_order,
    is_active,
    metadata,
  } = body as {
    section_key?: string;
    title_tr?: string;
    title_en?: string;
    subtitle_tr?: string;
    subtitle_en?: string;
    content_tr?: string;
    content_en?: string;
    cta_text_tr?: string;
    cta_text_en?: string;
    cta_url?: string;
    image_url?: string;
    display_order?: number;
    is_active?: boolean;
    metadata?: Record<string, unknown>;
  };

  if (!section_key?.trim()) {
    return NextResponse.json({ success: false, error: "section_key zorunludur" }, { status: 400 });
  }

  try {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("content_sections")
      .insert({
        section_key: section_key.trim(),
        title_tr: title_tr ?? null,
        title_en: title_en ?? null,
        subtitle_tr: subtitle_tr ?? null,
        subtitle_en: subtitle_en ?? null,
        content_tr: content_tr ?? null,
        content_en: content_en ?? null,
        cta_text_tr: cta_text_tr ?? null,
        cta_text_en: cta_text_en ?? null,
        cta_url: cta_url ?? null,
        image_url: image_url ?? null,
        display_order: display_order ?? 0,
        is_active: is_active ?? true,
        metadata: metadata ?? null,
      })
      .select()
      .single();

    if (error) {
      console.error("[Admin Content Sections POST]", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err) {
    console.error("[Admin Content Sections POST]", err);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}
