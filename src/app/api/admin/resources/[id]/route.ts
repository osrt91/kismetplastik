import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { checkAuth } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkAuth(request);
  if (authError) return authError;

  const { id } = await params;

  try {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("resources")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: "Kaynak bulunamadı" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("[Admin Resources GET id]", err);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkAuth(request);
  if (authError) return authError;

  const { id } = await params;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Geçersiz JSON" }, { status: 400 });
  }

  const updatePayload: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  const allowedFields = [
    "title_tr",
    "title_en",
    "description_tr",
    "description_en",
    "category_tr",
    "category_en",
    "page_count",
    "is_active",
    "display_order",
    "cover_image",
  ];

  for (const field of allowedFields) {
    if (field in body) {
      updatePayload[field] = body[field];
    }
  }

  // Validate required fields if provided
  if ("title_tr" in body && !String(body.title_tr ?? "").trim()) {
    return NextResponse.json({ success: false, error: "Başlık (TR) boş bırakılamaz" }, { status: 400 });
  }

  if (Object.keys(updatePayload).length === 1) {
    // Only updated_at was set — nothing to update
    return NextResponse.json({ success: false, error: "Güncellenecek alan bulunamadı" }, { status: 400 });
  }

  try {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("resources")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[Admin Resources PUT]", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("[Admin Resources PUT]", err);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkAuth(request);
  if (authError) return authError;

  const { id } = await params;

  try {
    const supabase = getSupabaseAdmin();

    // Fetch the resource first to get the storage_path
    const { data: resource, error: fetchError } = await supabase
      .from("resources")
      .select("storage_path")
      .eq("id", id)
      .single();

    if (fetchError || !resource) {
      return NextResponse.json({ success: false, error: "Kaynak bulunamadı" }, { status: 404 });
    }

    // Delete the database row
    const { error: deleteError } = await supabase
      .from("resources")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("[Admin Resources DELETE]", deleteError);
      return NextResponse.json({ success: false, error: deleteError.message }, { status: 500 });
    }

    // Remove file from storage (best-effort; non-fatal)
    if (resource.storage_path) {
      try {
        await supabase.storage.from("resources").remove([resource.storage_path]);
      } catch (storageErr) {
        console.warn("[Admin Resources DELETE] Storage cleanup failed:", storageErr);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Admin Resources DELETE]", err);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}
