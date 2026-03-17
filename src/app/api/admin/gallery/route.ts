import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, isSupabaseAdminConfigured, requireSupabase } from "@/lib/supabase-admin";
import { checkAuth } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { isR2Configured, uploadToR2, deleteFromR2 } from "@/lib/r2";

export async function GET(request: NextRequest) {
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

  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20")));
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const supabase = getSupabaseAdmin();

  // Count query
  let countQuery = supabase
    .from("gallery_images")
    .select("*", { count: "exact", head: true });

  if (category && ["uretim", "urunler", "etkinlikler"].includes(category)) {
    countQuery = countQuery.eq("category", category);
  }

  const { count } = await countQuery;

  // Data query with pagination
  let query = supabase
    .from("gallery_images")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (category && ["uretim", "urunler", "etkinlikler"].includes(category)) {
    query = query.eq("category", category);
  }

  const { data, error } = await query;
  if (error) {
    console.error("[Admin Gallery GET]", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    data,
    pagination: {
      page,
      limit,
      total: count ?? 0,
      totalPages: Math.max(1, Math.ceil((count ?? 0) / limit)),
    },
  });
}

export async function POST(request: NextRequest) {
  const authError = checkAuth(request);
  if (authError) return authError;

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { ok: allowed } = rateLimit(`admin:gallery:${ip}`, { limit: 60, windowMs: 60_000 });
  if (!allowed) {
    return NextResponse.json({ success: false, error: "Çok fazla istek" }, { status: 429 });
  }

  const sbError = requireSupabase();
  if (sbError) return sbError;

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

  let imageUrl: string;
  const usedR2 = isR2Configured();

  if (usedR2) {
    try {
      imageUrl = await uploadToR2("gallery", storagePath, buffer, file.type);
    } catch (r2Err) {
      console.error("[Admin Gallery R2 Upload]", r2Err);
      return NextResponse.json({ success: false, error: "Dosya yüklenemedi." }, { status: 500 });
    }
  } else {
    const { error: uploadError } = await supabase.storage
      .from("gallery")
      .upload(storagePath, buffer, { contentType: file.type, upsert: false });

    if (uploadError) {
      console.error("[Admin Gallery Upload]", uploadError);
      return NextResponse.json({ success: false, error: "Dosya yüklenemedi." }, { status: 500 });
    }

    const { data: urlData } = supabase.storage.from("gallery").getPublicUrl(storagePath);
    imageUrl = urlData.publicUrl;
  }

  // The R2 key is "gallery/{storagePath}" — store it so DELETE can find it
  const r2Key = usedR2 ? `gallery/${storagePath}` : storagePath;

  const { data, error: insertError } = await supabase
    .from("gallery_images")
    .insert({
      category,
      title_tr: titleTr.trim(),
      title_en: titleEn?.trim() || titleTr.trim(),
      description_tr: descTr?.trim() || null,
      description_en: descEn?.trim() || null,
      image_url: imageUrl,
      storage_path: r2Key,
      display_order: displayOrder,
      is_active: true,
    })
    .select()
    .single();

  if (insertError) {
    console.error("[Admin Gallery Insert]", insertError);
    // Rollback: remove the uploaded file
    if (usedR2) {
      try { await deleteFromR2(r2Key); } catch { /* best-effort */ }
    } else {
      await supabase.storage.from("gallery").remove([storagePath]);
    }
    return NextResponse.json(
      { success: false, error: "Veritabanı kaydı oluşturulamadı." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, data }, { status: 201 });
}
