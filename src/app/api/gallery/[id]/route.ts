import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminSecret = request.headers.get("x-admin-secret");
    if (!adminSecret || adminSecret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ success: false, error: "Yetkisiz erişim." }, { status: 401 });
    }

    const { id } = await params;
    const supabase = await createSupabaseServerClient();

    const { data: image, error: fetchError } = await supabase
      .from("gallery_images")
      .select("storage_path")
      .eq("id", id)
      .single();

    if (fetchError || !image) {
      return NextResponse.json({ success: false, error: "Görsel bulunamadı." }, { status: 404 });
    }

    await supabase.storage.from("gallery").remove([image.storage_path]);

    const { error: deleteError } = await supabase
      .from("gallery_images")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("[Gallery DELETE]", deleteError);
      return NextResponse.json({ success: false, error: "Silme işlemi başarısız." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: "Bir hata oluştu." }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminSecret = request.headers.get("x-admin-secret");
    if (!adminSecret || adminSecret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ success: false, error: "Yetkisiz erişim." }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const supabase = await createSupabaseServerClient();

    const updates: Record<string, unknown> = {};
    if (body.title_tr !== undefined) updates.title_tr = body.title_tr;
    if (body.title_en !== undefined) updates.title_en = body.title_en;
    if (body.description_tr !== undefined) updates.description_tr = body.description_tr;
    if (body.description_en !== undefined) updates.description_en = body.description_en;
    if (body.category !== undefined) updates.category = body.category;
    if (body.display_order !== undefined) updates.display_order = body.display_order;
    if (body.is_active !== undefined) updates.is_active = body.is_active;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ success: false, error: "Güncellenecek alan yok." }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("gallery_images")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[Gallery PATCH]", error);
      return NextResponse.json({ success: false, error: "Güncelleme başarısız." }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ success: false, error: "Bir hata oluştu." }, { status: 500 });
  }
}
