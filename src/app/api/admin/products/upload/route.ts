import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, requireSupabase } from "@/lib/supabase-admin";
import { checkAuth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const authError = checkAuth(request);
  if (authError) return authError;

  const sbError = requireSupabase();
  if (sbError) return sbError;

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ success: false, error: "Dosya bulunamadı" }, { status: 400 });
  }

  const maxSize = 5 * 1024 * 1024; // 5 MB
  if (file.size > maxSize) {
    return NextResponse.json(
      { success: false, error: "Dosya boyutu 5 MB'ı geçemez" },
      { status: 413 }
    );
  }

  const allowed = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];
  if (!allowed.includes(file.type)) {
    return NextResponse.json(
      { success: false, error: "Sadece JPEG, PNG, WebP, AVIF veya GIF yüklenebilir" },
      { status: 415 }
    );
  }

  // Derive extension from validated MIME type, not user-supplied filename
  const MIME_TO_EXT: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/avif": "avif",
    "image/gif": "gif",
  };
  const ext = MIME_TO_EXT[file.type] || "jpg";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const supabase = getSupabaseAdmin();
  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  const { error } = await supabase.storage
    .from("products")
    .upload(path, buffer, { contentType: file.type, upsert: false });

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  const { data: publicData } = supabase.storage.from("products").getPublicUrl(path);

  return NextResponse.json({
    success: true,
    data: { url: publicData.publicUrl, path },
  });
}
