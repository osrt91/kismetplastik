import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, requireSupabase } from "@/lib/supabase-admin";
import { checkAuth } from "@/lib/auth";
import { isR2Configured, uploadToR2 } from "@/lib/r2";

// SVG excluded: can contain embedded JavaScript (XSS vector)
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const BUCKET = "settings";

export async function POST(request: NextRequest) {
  const authError = checkAuth(request);
  if (authError) return authError;

  const sbError = requireSupabase();
  if (sbError) return sbError;

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ success: false, error: "Form verisi okunamadı" }, { status: 400 });
  }

  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ success: false, error: "Dosya gereklidir" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { success: false, error: "Sadece JPEG, PNG ve WebP desteklenmektedir" },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { success: false, error: "Dosya boyutu 5 MB sınırını aşamaz" },
      { status: 400 }
    );
  }

  // Derive extension from validated MIME type, not user-supplied filename
  const MIME_TO_EXT: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
  };
  const ext = MIME_TO_EXT[file.type] || "jpg";
  const storagePath = `logos/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  try {
    const buffer = Buffer.from(await file.arrayBuffer());

    let url: string;
    let returnPath: string;

    if (isR2Configured()) {
      // storagePath is "logos/xxx.ext" — upload under "settings" folder
      url = await uploadToR2(BUCKET, storagePath, buffer, file.type);
      returnPath = `${BUCKET}/${storagePath}`;
    } else {
      const supabase = getSupabaseAdmin();
      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(storagePath, buffer, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        console.error("[Settings Upload]", uploadError);
        return NextResponse.json({ success: false, error: "Dosya yüklenemedi" }, { status: 500 });
      }

      const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
      url = urlData.publicUrl;
      returnPath = storagePath;
    }

    return NextResponse.json({
      success: true,
      data: {
        url,
        path: returnPath,
      },
    });
  } catch (err) {
    console.error("[Settings Upload]", err);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}
