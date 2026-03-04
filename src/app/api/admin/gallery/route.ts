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

  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  const supabase = getSupabaseAdmin();
  let query = supabase
    .from("gallery_images")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (category && ["uretim", "urunler", "etkinlikler"].includes(category)) {
    query = query.eq("category", category);
  }

  const { data, error } = await query;
  if (error) {
    console.error("[Admin Gallery GET]", error);
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

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const category = formData.get("category") as string;
  const titleTr = formData.get("title_tr") as string;
  const titleEn = formData.get("title_en") as string;
  const descTr = (formData.get("description_tr") as string) || null;
  const descEn = (formData.get("description_en") as string) || null;
  const displayOrder = parseInt(formData.get("display_order") as string) || 0;

  if (!file) {
    return NextResponse.json({ success: false, error: "Dosya gerekli." }, { status: 400 });
  }

  if (!["uretim", "urunler", "etkinlikler"].includes(category)) {
    return NextResponse.json({ success: false, error: "Geçersiz kategori." }, { status: 400 });
  }

  if (!titleTr?.trim()) {
    return NextResponse.json({ success: false, error: "Başlık (TR) gerekli." }, { status: 400 });
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json(
      { success: false, error: "Sadece JPEG, PNG, WebP desteklenir." },
      { status: 400 }
    );
  }

  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json(
      { success: false, error: "Dosya boyutu 10MB'ı aşamaz." },
      { status: 400 }
    );
  }

  const supabase = getSupabaseAdmin();
  const ext = file.name.split(".").pop() || "jpg";
  const storagePath = `${category}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await supabase.storage
    .from("gallery")
    .upload(storagePath, buffer, { contentType: file.type, upsert: false });

  if (uploadError) {
    console.error("[Admin Gallery Upload]", uploadError);
    return NextResponse.json({ success: false, error: "Dosya yüklenemedi." }, { status: 500 });
  }

  const { data: urlData } = supabase.storage.from("gallery").getPublicUrl(storagePath);
  const imageUrl = urlData.publicUrl;

  const { data, error: insertError } = await supabase
    .from("gallery_images")
    .insert({
      category,
      title_tr: titleTr.trim(),
      title_en: titleEn?.trim() || titleTr.trim(),
      description_tr: descTr?.trim() || null,
      description_en: descEn?.trim() || null,
      image_url: imageUrl,
      storage_path: storagePath,
      display_order: displayOrder,
      is_active: true,
    })
    .select()
    .single();

  if (insertError) {
    console.error("[Admin Gallery Insert]", insertError);
    await supabase.storage.from("gallery").remove([storagePath]);
    return NextResponse.json(
      { success: false, error: "Veritabanı kaydı oluşturulamadı." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, data }, { status: 201 });
}
