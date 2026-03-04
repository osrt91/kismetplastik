import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { checkAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const authError = checkAuth(request);
  if (authError) return authError;

  try {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("references")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      console.error("[References GET]", error);
      return NextResponse.json(
        { success: false, error: "Referanslar yüklenemedi." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: data ?? [] });
  } catch {
    return NextResponse.json(
      { success: false, error: "Bir hata oluştu." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const authError = checkAuth(request);
  if (authError) return authError;

  try {
    const formData = await request.formData();
    const name = (formData.get("name") as string)?.trim();
    const website = (formData.get("website") as string)?.trim() || null;
    const sectorTr = (formData.get("sector_tr") as string)?.trim();
    const sectorEn = (formData.get("sector_en") as string)?.trim();
    const displayOrder = parseInt(formData.get("display_order") as string) || 0;
    const logoFile = formData.get("logo") as File | null;

    if (!name) {
      return NextResponse.json(
        { success: false, error: "Referans adı zorunludur." },
        { status: 400 }
      );
    }

    if (!sectorTr?.trim()) {
      return NextResponse.json(
        { success: false, error: "Sektör (TR) zorunludur." },
        { status: 400 }
      );
    }

    if (!sectorEn?.trim()) {
      return NextResponse.json(
        { success: false, error: "Sektör (EN) zorunludur." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    let logoUrl = "";
    let storagePath: string | null = null;

    if (logoFile && logoFile.size > 0) {
      const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml", "image/gif"];
      if (!allowedTypes.includes(logoFile.type)) {
        return NextResponse.json(
          { success: false, error: "Sadece JPEG, PNG, WebP, SVG ve GIF desteklenir." },
          { status: 400 }
        );
      }

      if (logoFile.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { success: false, error: "Logo dosyası 5MB'ı aşamaz." },
          { status: 400 }
        );
      }

      const ext = logoFile.name.split(".").pop() || "png";
      storagePath = `logos/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const buffer = Buffer.from(await logoFile.arrayBuffer());

      const { error: uploadError } = await supabase.storage
        .from("references")
        .upload(storagePath, buffer, { contentType: logoFile.type, upsert: false });

      if (uploadError) {
        console.error("[References Logo Upload]", uploadError);
        return NextResponse.json(
          { success: false, error: "Logo yüklenemedi." },
          { status: 500 }
        );
      }

      logoUrl = supabase.storage.from("references").getPublicUrl(storagePath).data.publicUrl;
    }

    const { data, error: insertError } = await supabase
      .from("references")
      .insert({
        name,
        logo_url: logoUrl,
        storage_path: storagePath,
        website,
        sector_tr: sectorTr,
        sector_en: sectorEn,
        is_active: true,
        display_order: displayOrder,
      })
      .select()
      .single();

    if (insertError) {
      console.error("[References INSERT]", insertError);
      if (storagePath) {
        await supabase.storage.from("references").remove([storagePath]);
      }
      return NextResponse.json(
        { success: false, error: "Referans kaydedilemedi." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err) {
    console.error("[References POST]", err);
    return NextResponse.json(
      { success: false, error: "Bir hata oluştu." },
      { status: 500 }
    );
  }
}
