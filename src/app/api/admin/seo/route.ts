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

  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("seo_settings")
    .select("*")
    .order("page_path", { ascending: true });

  if (error) {
    console.error("[Admin SEO GET]", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
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
    return NextResponse.json({ success: false, error: "Geçersiz JSON." }, { status: 400 });
  }

  const pagePath = body.page_path;
  if (!pagePath || typeof pagePath !== "string" || !pagePath.trim()) {
    return NextResponse.json(
      { success: false, error: "page_path gerekli." },
      { status: 400 }
    );
  }

  const payload: Record<string, unknown> = {
    page_path: pagePath.trim(),
  };

  if (body.meta_title_tr !== undefined) payload.meta_title_tr = body.meta_title_tr || null;
  if (body.meta_title_en !== undefined) payload.meta_title_en = body.meta_title_en || null;
  if (body.meta_description_tr !== undefined) payload.meta_description_tr = body.meta_description_tr || null;
  if (body.meta_description_en !== undefined) payload.meta_description_en = body.meta_description_en || null;
  if (body.og_image !== undefined) payload.og_image = body.og_image || null;
  if (body.canonical_url !== undefined) payload.canonical_url = body.canonical_url || null;
  if (body.no_index !== undefined) payload.no_index = Boolean(body.no_index);
  if (body.json_ld !== undefined) payload.json_ld = body.json_ld ?? null;

  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("seo_settings")
    .upsert(payload, { onConflict: "page_path" })
    .select()
    .single();

  if (error) {
    console.error("[Admin SEO POST]", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data }, { status: 201 });
}
