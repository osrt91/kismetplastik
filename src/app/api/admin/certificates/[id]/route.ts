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
      .from("certificates")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: "Sertifika bulunamadı" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("[Admin Certificates GET id]", err);
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

  if (body.name_tr !== undefined) updatePayload.name_tr = String(body.name_tr).trim();
  if (body.name_en !== undefined) updatePayload.name_en = String(body.name_en).trim();
  if (body.description_tr !== undefined) updatePayload.description_tr = String(body.description_tr).trim();
  if (body.description_en !== undefined) updatePayload.description_en = String(body.description_en).trim();
  if (body.icon !== undefined) updatePayload.icon = String(body.icon).trim();
  if (body.pdf_url !== undefined) updatePayload.pdf_url = body.pdf_url;
  if (body.storage_path !== undefined) updatePayload.storage_path = body.storage_path;
  if (body.issuer !== undefined) updatePayload.issuer = String(body.issuer).trim();
  if (body.valid_until !== undefined) updatePayload.valid_until = String(body.valid_until).trim();
  if (body.is_active !== undefined) updatePayload.is_active = Boolean(body.is_active);
  if (body.display_order !== undefined) updatePayload.display_order = Number(body.display_order);

  try {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("certificates")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[Admin Certificates PUT]", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("[Admin Certificates PUT]", err);
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

    const { data: cert, error: fetchError } = await supabase
      .from("certificates")
      .select("storage_path")
      .eq("id", id)
      .single();

    if (fetchError || !cert) {
      return NextResponse.json({ success: false, error: "Sertifika bulunamadı" }, { status: 404 });
    }

    if (cert.storage_path) {
      await supabase.storage.from("certificates").remove([cert.storage_path]);
    }

    const { error: deleteError } = await supabase
      .from("certificates")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("[Admin Certificates DELETE]", deleteError);
      return NextResponse.json({ success: false, error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Admin Certificates DELETE]", err);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}
