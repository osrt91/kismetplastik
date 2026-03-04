import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { checkAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const authError = checkAuth(request);
  if (authError) return authError;

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("certificates")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      console.error("[Admin Certificates GET]", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: data ?? [] });
  } catch (err) {
    console.error("[Admin Certificates GET]", err);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authError = checkAuth(request);
  if (authError) return authError;

  try {
    const formData = await request.formData();

    const name_tr = (formData.get("name_tr") as string)?.trim();
    const name_en = (formData.get("name_en") as string)?.trim();
    const description_tr = (formData.get("description_tr") as string)?.trim() ?? "";
    const description_en = (formData.get("description_en") as string)?.trim() ?? "";
    const icon = (formData.get("icon") as string)?.trim() ?? "Shield";
    const issuer = (formData.get("issuer") as string)?.trim() ?? "";
    const valid_until = (formData.get("valid_until") as string)?.trim() ?? "";
    const display_order = parseInt((formData.get("display_order") as string) ?? "0", 10) || 0;
    const is_active = formData.get("is_active") !== "false";
    const pdf_url_direct = (formData.get("pdf_url") as string)?.trim() ?? "";
    const file = formData.get("file") as File | null;

    if (!name_tr) {
      return NextResponse.json({ success: false, error: "name_tr zorunludur" }, { status: 400 });
    }
    if (!name_en) {
      return NextResponse.json({ success: false, error: "name_en zorunludur" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    let pdf_url = pdf_url_direct;
    let storage_path: string | null = null;

    if (file && file.size > 0) {
      const allowedTypes = ["application/pdf"];
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json({ success: false, error: "Sadece PDF dosyası yüklenebilir." }, { status: 400 });
      }

      if (file.size > 20 * 1024 * 1024) {
        return NextResponse.json({ success: false, error: "Dosya boyutu 20MB'ı aşamaz." }, { status: 400 });
      }

      const ext = "pdf";
      storage_path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const buffer = Buffer.from(await file.arrayBuffer());

      const { error: uploadError } = await supabase.storage
        .from("certificates")
        .upload(storage_path, buffer, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        console.error("[Admin Certificates Upload]", uploadError);
        return NextResponse.json({ success: false, error: "PDF yüklenemedi." }, { status: 500 });
      }

      const { data: urlData } = supabase.storage.from("certificates").getPublicUrl(storage_path);
      pdf_url = urlData.publicUrl;
    }

    const { data, error } = await supabase
      .from("certificates")
      .insert({
        name_tr,
        name_en,
        description_tr,
        description_en,
        icon,
        pdf_url,
        storage_path,
        issuer,
        valid_until,
        display_order,
        is_active,
      })
      .select()
      .single();

    if (error) {
      console.error("[Admin Certificates POST]", error);
      if (storage_path) {
        await supabase.storage.from("certificates").remove([storage_path]);
      }
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err) {
    console.error("[Admin Certificates POST]", err);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}
