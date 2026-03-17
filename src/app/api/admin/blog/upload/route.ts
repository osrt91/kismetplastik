import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, requireSupabase } from "@/lib/supabase-admin";
import { checkAuth } from "@/lib/auth";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

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

  if (!file) {
    return NextResponse.json({ success: false, error: "Dosya gerekli" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { success: false, error: "Sadece JPEG, PNG, WebP ve GIF desteklenir" },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { success: false, error: "Dosya boyutu 5MB'ı aşamaz" },
      { status: 400 }
    );
  }

  try {
    const supabase = getSupabaseAdmin();

    // Derive extension from validated MIME type, not user-supplied filename
    const MIME_TO_EXT: Record<string, string> = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
      "image/gif": "gif",
    };
    const ext = MIME_TO_EXT[file.type] || "jpg";
    const storagePath = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from("blog")
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("[Blog Upload]", uploadError);
      return NextResponse.json({ success: false, error: "Dosya yüklenemedi" }, { status: 500 });
    }

    const { data: urlData } = supabase.storage.from("blog").getPublicUrl(storagePath);

    return NextResponse.json({
      success: true,
      data: { url: urlData.publicUrl, path: storagePath },
    });
  } catch (err) {
    console.error("[Blog Upload]", err);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}
