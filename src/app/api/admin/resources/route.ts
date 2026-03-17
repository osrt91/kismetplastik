import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, requireSupabase } from "@/lib/supabase-admin";
import { checkAuth } from "@/lib/auth";
import { isR2Configured, uploadToR2, deleteFromR2 } from "@/lib/r2";

const PAGE_SIZE = 20;

export async function GET(request: NextRequest) {
  const authError = checkAuth(request);
  if (authError) return authError;

  const sbError = requireSupabase();
  if (sbError) return sbError;

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.min(100, parseInt(searchParams.get("limit") ?? String(PAGE_SIZE), 10));

  try {
    const supabase = getSupabaseAdmin();

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from("resources")
      .select("*", { count: "exact" })
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      console.error("[Admin Resources GET]", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    const total = count ?? 0;
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: { resources: data ?? [] },
      pagination: { page, pageSize: limit, total, totalPages },
    });
  } catch (err) {
    console.error("[Admin Resources GET]", err);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authError = checkAuth(request);
  if (authError) return authError;

  const sbError = requireSupabase();
  if (sbError) return sbError;

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ success: false, error: "Geçersiz form verisi" }, { status: 400 });
  }

  const file = formData.get("file") as File | null;
  const title_tr = (formData.get("title_tr") as string)?.trim();
  const title_en = (formData.get("title_en") as string)?.trim();
  const description_tr = (formData.get("description_tr") as string)?.trim() ?? "";
  const description_en = (formData.get("description_en") as string)?.trim() ?? "";
  const category_tr = (formData.get("category_tr") as string)?.trim() ?? "";
  const category_en = (formData.get("category_en") as string)?.trim() ?? "";
  const page_count = parseInt(formData.get("page_count") as string ?? "0", 10) || 0;
  const display_order = parseInt(formData.get("display_order") as string ?? "0", 10) || 0;
  const is_active = (formData.get("is_active") as string) !== "false";

  if (!title_tr) {
    return NextResponse.json({ success: false, error: "Başlık (TR) zorunludur" }, { status: 400 });
  }

  if (!file) {
    return NextResponse.json({ success: false, error: "Dosya zorunludur" }, { status: 400 });
  }

  const allowedTypes = ["application/pdf", "application/zip", "application/octet-stream"];
  const isAllowed =
    allowedTypes.includes(file.type) ||
    file.name.endsWith(".pdf") ||
    file.name.endsWith(".zip");

  if (!isAllowed) {
    return NextResponse.json(
      { success: false, error: "Sadece PDF ve ZIP dosyaları desteklenir" },
      { status: 400 }
    );
  }

  const MAX_SIZE = 50 * 1024 * 1024; // 50 MB
  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { success: false, error: "Dosya boyutu 50MB'ı aşamaz" },
      { status: 400 }
    );
  }

  try {
    const supabase = getSupabaseAdmin();

    const ext = file.name.split(".").pop() ?? "pdf";
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    let fileUrl: string;
    let storagePath: string;
    const usedR2 = isR2Configured();

    if (usedR2) {
      try {
        fileUrl = await uploadToR2("resources", fileName, buffer, file.type || "application/pdf");
        storagePath = `resources/${fileName}`;
      } catch (r2Err) {
        console.error("[Admin Resources R2 Upload]", r2Err);
        return NextResponse.json({ success: false, error: "Dosya yüklenemedi" }, { status: 500 });
      }
    } else {
      storagePath = fileName;
      const { error: uploadError } = await supabase.storage
        .from("resources")
        .upload(storagePath, buffer, {
          contentType: file.type || "application/pdf",
          upsert: false,
        });

      if (uploadError) {
        console.error("[Admin Resources Upload]", uploadError);
        return NextResponse.json({ success: false, error: "Dosya yüklenemedi" }, { status: 500 });
      }

      const { data: urlData } = supabase.storage.from("resources").getPublicUrl(storagePath);
      fileUrl = urlData.publicUrl;
    }

    const { data, error: insertError } = await supabase
      .from("resources")
      .insert({
        title_tr,
        title_en: title_en || title_tr,
        description_tr,
        description_en: description_en || description_tr,
        category_tr,
        category_en: category_en || category_tr,
        file_url: fileUrl,
        storage_path: storagePath,
        cover_image: null,
        page_count,
        is_active,
        display_order,
        download_count: 0,
      })
      .select()
      .single();

    if (insertError) {
      console.error("[Admin Resources Insert]", insertError);
      // Rollback storage upload
      if (usedR2) {
        try { await deleteFromR2(storagePath); } catch { /* best-effort */ }
      } else {
        await supabase.storage.from("resources").remove([storagePath]);
      }
      return NextResponse.json({ success: false, error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err) {
    console.error("[Admin Resources POST]", err);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}
