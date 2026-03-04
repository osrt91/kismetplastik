import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabase-admin";
import { checkAuth } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkAuth(request);
  if (authError) return authError;

  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json(
      { success: false, error: "Supabase admin yapılandırılmamış." },
      { status: 503 }
    );
  }

  const { id } = await params;

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("milestones")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: "Kilometre taşı bulunamadı" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("[Admin Milestones GET id]", err);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkAuth(request);
  if (authError) return authError;

  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json(
      { success: false, error: "Supabase admin yapılandırılmamış." },
      { status: 503 }
    );
  }

  const { id } = await params;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Geçersiz JSON" }, { status: 400 });
  }

  const { year, title_tr, title_en, description_tr, description_en, icon, display_order } = body as {
    year?: number;
    title_tr?: string;
    title_en?: string;
    description_tr?: string;
    description_en?: string;
    icon?: string | null;
    display_order?: number;
  };

  const updatePayload: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (year !== undefined) {
    if (isNaN(Number(year))) {
      return NextResponse.json({ success: false, error: "Geçerli bir yıl giriniz" }, { status: 400 });
    }
    updatePayload.year = Number(year);
  }
  if (title_tr !== undefined) {
    if (!title_tr.trim()) {
      return NextResponse.json({ success: false, error: "Başlık (TR) boş olamaz" }, { status: 400 });
    }
    updatePayload.title_tr = title_tr.trim();
  }
  if (title_en !== undefined) {
    if (!title_en.trim()) {
      return NextResponse.json({ success: false, error: "Başlık (EN) boş olamaz" }, { status: 400 });
    }
    updatePayload.title_en = title_en.trim();
  }
  if (description_tr !== undefined) updatePayload.description_tr = description_tr.trim();
  if (description_en !== undefined) updatePayload.description_en = description_en.trim();
  if (icon !== undefined) updatePayload.icon = icon?.trim() || null;
  if (display_order !== undefined) updatePayload.display_order = Number(display_order);

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("milestones")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[Admin Milestones PUT]", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("[Admin Milestones PUT]", err);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkAuth(request);
  if (authError) return authError;

  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json(
      { success: false, error: "Supabase admin yapılandırılmamış." },
      { status: 503 }
    );
  }

  const { id } = await params;

  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase
      .from("milestones")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("[Admin Milestones DELETE]", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Admin Milestones DELETE]", err);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}
