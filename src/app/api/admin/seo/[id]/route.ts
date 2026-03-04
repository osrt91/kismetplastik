import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabase-admin";
import { checkAuth } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkAuth(request);
  if (authError) return authError;

  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json(
      { success: false, error: "Supabase admin yapılandırılmamış." },
      { status: 503 }
    );
  }

  const { id } = await params;
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("seo_settings")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { success: false, error: "SEO ayarı bulunamadı." },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkAuth(request);
  if (authError) return authError;

  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json(
      { success: false, error: "Supabase admin yapılandırılmamış." },
      { status: 503 }
    );
  }

  const { id } = await params;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Geçersiz JSON." }, { status: 400 });
  }

  const updates: Record<string, unknown> = {};

  if (body.meta_title_tr !== undefined) updates.meta_title_tr = body.meta_title_tr || null;
  if (body.meta_title_en !== undefined) updates.meta_title_en = body.meta_title_en || null;
  if (body.meta_description_tr !== undefined) updates.meta_description_tr = body.meta_description_tr || null;
  if (body.meta_description_en !== undefined) updates.meta_description_en = body.meta_description_en || null;
  if (body.og_image !== undefined) updates.og_image = body.og_image || null;
  if (body.canonical_url !== undefined) updates.canonical_url = body.canonical_url || null;
  if (body.no_index !== undefined) updates.no_index = Boolean(body.no_index);
  if (body.json_ld !== undefined) updates.json_ld = body.json_ld ?? null;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { success: false, error: "Güncellenecek alan yok." },
      { status: 400 }
    );
  }

  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("seo_settings")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("[Admin SEO PUT]", error);
    return NextResponse.json({ success: false, error: "Güncelleme başarısız." }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkAuth(request);
  if (authError) return authError;

  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json(
      { success: false, error: "Supabase admin yapılandırılmamış." },
      { status: 503 }
    );
  }

  const { id } = await params;
  const supabase = getSupabaseAdmin();

  const { error } = await supabase
    .from("seo_settings")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("[Admin SEO DELETE]", error);
    return NextResponse.json({ success: false, error: "Silme işlemi başarısız." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
