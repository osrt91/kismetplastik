import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { checkAuth } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkAuth(request);
  if (authError) return authError;

  const { id } = await params;

  try {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("content_sections")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: "Bölüm bulunamadı" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("[Admin Content Sections GET id]", err);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkAuth(request);
  if (authError) return authError;

  const { id } = await params;

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
    title_tr?: string | null;
    title_en?: string | null;
    subtitle_tr?: string | null;
    subtitle_en?: string | null;
    content_tr?: string | null;
    content_en?: string | null;
    cta_text_tr?: string | null;
    cta_text_en?: string | null;
    cta_url?: string | null;
    image_url?: string | null;
    display_order?: number;
    is_active?: boolean;
    metadata?: Record<string, unknown> | null;
  };

  const updatePayload: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (section_key !== undefined) updatePayload.section_key = section_key.trim();
  if (title_tr !== undefined) updatePayload.title_tr = title_tr;
  if (title_en !== undefined) updatePayload.title_en = title_en;
  if (subtitle_tr !== undefined) updatePayload.subtitle_tr = subtitle_tr;
  if (subtitle_en !== undefined) updatePayload.subtitle_en = subtitle_en;
  if (content_tr !== undefined) updatePayload.content_tr = content_tr;
  if (content_en !== undefined) updatePayload.content_en = content_en;
  if (cta_text_tr !== undefined) updatePayload.cta_text_tr = cta_text_tr;
  if (cta_text_en !== undefined) updatePayload.cta_text_en = cta_text_en;
  if (cta_url !== undefined) updatePayload.cta_url = cta_url;
  if (image_url !== undefined) updatePayload.image_url = image_url;
  if (display_order !== undefined) updatePayload.display_order = display_order;
  if (is_active !== undefined) updatePayload.is_active = is_active;
  if (metadata !== undefined) updatePayload.metadata = metadata;

  try {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("content_sections")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[Admin Content Sections PUT]", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("[Admin Content Sections PUT]", err);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkAuth(request);
  if (authError) return authError;

  const { id } = await params;

  try {
    const supabase = getSupabaseAdmin();

    const { error } = await supabase
      .from("content_sections")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("[Admin Content Sections DELETE]", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Admin Content Sections DELETE]", err);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}
