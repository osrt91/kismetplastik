import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, isSupabaseAdminConfigured, requireSupabase } from "@/lib/supabase-admin";
import { checkAuth } from "@/lib/auth";
import { isR2Configured, deleteFromR2 } from "@/lib/r2";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkAuth(request);
  if (authError) return authError;

  const sbError = requireSupabase();
  if (sbError) return sbError;

  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json(
      { success: false, error: "Supabase admin yapılandırılmamış." },
      { status: 503 }
    );
  }

  const { id } = await params;
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("gallery_images")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ success: false, error: "Görsel bulunamadı." }, { status: 404 });
  }

  return NextResponse.json({ success: true, data });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkAuth(request);
  if (authError) return authError;

  const sbError = requireSupabase();
  if (sbError) return sbError;

  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json(
      { success: false, error: "Supabase admin yapılandırılmamış." },
      { status: 503 }
    );
  }

  const { id } = await params;
  const body = await request.json();

  const updates: Record<string, unknown> = {};
  if (body.title_tr !== undefined) updates.title_tr = body.title_tr;
  if (body.title_en !== undefined) updates.title_en = body.title_en;
  if (body.description_tr !== undefined) updates.description_tr = body.description_tr;
  if (body.description_en !== undefined) updates.description_en = body.description_en;
  if (body.category !== undefined) updates.category = body.category;
  if (body.display_order !== undefined) updates.display_order = body.display_order;
  if (body.is_active !== undefined) updates.is_active = body.is_active;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { success: false, error: "Güncellenecek alan yok." },
      { status: 400 }
    );
  }

  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("gallery_images")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("[Admin Gallery PUT]", error);
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

  const sbError = requireSupabase();
  if (sbError) return sbError;

  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json(
      { success: false, error: "Supabase admin yapılandırılmamış." },
      { status: 503 }
    );
  }

  const { id } = await params;
  const supabase = getSupabaseAdmin();

  const { data: image, error: fetchError } = await supabase
    .from("gallery_images")
    .select("storage_path")
    .eq("id", id)
    .single();

  if (fetchError || !image) {
    return NextResponse.json({ success: false, error: "Görsel bulunamadı." }, { status: 404 });
  }

  // Remove file from storage — R2 keys start with "gallery/", Supabase keys don't
  if (isR2Configured() && image.storage_path.startsWith("gallery/")) {
    try { await deleteFromR2(image.storage_path); } catch { /* best-effort */ }
  } else {
    await supabase.storage.from("gallery").remove([image.storage_path]);
  }

  const { error: deleteError } = await supabase
    .from("gallery_images")
    .delete()
    .eq("id", id);

  if (deleteError) {
    console.error("[Admin Gallery DELETE]", deleteError);
    return NextResponse.json({ success: false, error: "Silme işlemi başarısız." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
