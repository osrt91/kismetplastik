import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { checkAuth } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { galleryUploadSchema, getZodErrorMessage, validateFileType, validateFileSize, validateFileMagicBytes } from "@/lib/validations";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    let query = supabase
      .from("gallery_images")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (category && ["uretim", "urunler", "etkinlikler"].includes(category)) {
      query = query.eq("category", category);
    }

    const { data, error } = await query;

    if (error) {
      console.error("[Gallery GET]", error);
      return NextResponse.json({ success: false, error: "Galeri yüklenemedi." }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ success: false, error: "Bir hata oluştu." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const { ok: allowed } = rateLimit(`gallery-upload:${ip}`, { limit: 20, windowMs: 60_000 });
    if (!allowed) {
      return NextResponse.json({ success: false, error: "Çok fazla istek." }, { status: 429 });
    }

    const authError = checkAuth(request);
    if (authError) return authError;

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: "Dosya gerekli." }, { status: 400 });
    }

    // Validate metadata with Zod
    const metadataResult = galleryUploadSchema.safeParse({
      category: formData.get("category"),
      title_tr: formData.get("title_tr"),
      title_en: formData.get("title_en") || undefined,
      description_tr: formData.get("description_tr") || undefined,
      description_en: formData.get("description_en") || undefined,
      display_order: formData.get("display_order") ? parseInt(formData.get("display_order") as string) : 0,
    });

    if (!metadataResult.success) {
      return NextResponse.json({ success: false, error: getZodErrorMessage(metadataResult.error) }, { status: 400 });
    }

    const metadata = metadataResult.data;

    // Validate file type (MIME)
    if (!validateFileType(file.type)) {
      return NextResponse.json({ success: false, error: "Desteklenmeyen dosya formatı. JPEG, PNG, WebP, SVG veya GLTF kullanın." }, { status: 400 });
    }

    // Validate file size
    if (!validateFileSize(file.size)) {
      return NextResponse.json({ success: false, error: "Dosya boyutu 10MB'ı aşamaz." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Validate magic bytes to prevent MIME spoofing
    if (!validateFileMagicBytes(buffer, file.type)) {
      return NextResponse.json({ success: false, error: "Dosya içeriği belirtilen formatla uyuşmuyor." }, { status: 400 });
    }

    const supabase = await createSupabaseServerClient();
    const ext = file.name.split(".").pop() || "jpg";
    const storagePath = `${metadata.category}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("gallery")
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("[Gallery Upload]", uploadError);
      return NextResponse.json({ success: false, error: "Dosya yüklenemedi." }, { status: 500 });
    }

    const { data: urlData } = supabase.storage.from("gallery").getPublicUrl(storagePath);
    const imageUrl = urlData.publicUrl;

    const { data, error: insertError } = await supabase
      .from("gallery_images")
      .insert({
        category: metadata.category,
        title_tr: metadata.title_tr.trim(),
        title_en: (metadata.title_en?.trim() || metadata.title_tr.trim()),
        description_tr: metadata.description_tr?.trim() || null,
        description_en: metadata.description_en?.trim() || null,
        image_url: imageUrl,
        storage_path: storagePath,
        display_order: metadata.display_order,
      })
      .select()
      .single();

    if (insertError) {
      console.error("[Gallery Insert]", insertError);
      await supabase.storage.from("gallery").remove([storagePath]);
      return NextResponse.json({ success: false, error: "Veritabanı kaydı oluşturulamadı." }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("[Gallery POST]", err);
    return NextResponse.json({ success: false, error: "Bir hata oluştu." }, { status: 500 });
  }
}
