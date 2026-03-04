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
      .from("career_listings")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: "İlan bulunamadı" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("[Admin Careers GET id]", err);
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

  const {
    title_tr,
    title_en,
    description_tr,
    description_en,
    department,
    location,
    type,
    requirements_tr,
    requirements_en,
    is_active,
  } = body as {
    title_tr?: string;
    title_en?: string;
    description_tr?: string;
    description_en?: string;
    department?: string;
    location?: string;
    type?: string;
    requirements_tr?: string[];
    requirements_en?: string[];
    is_active?: boolean;
  };

  const updatePayload: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (title_tr !== undefined) updatePayload.title_tr = title_tr.trim();
  if (title_en !== undefined) updatePayload.title_en = title_en.trim();
  if (description_tr !== undefined) updatePayload.description_tr = description_tr.trim();
  if (description_en !== undefined) updatePayload.description_en = description_en.trim();
  if (department !== undefined) updatePayload.department = department.trim();
  if (location !== undefined) updatePayload.location = location.trim();
  if (type !== undefined) updatePayload.type = type.trim();
  if (requirements_tr !== undefined)
    updatePayload.requirements_tr = Array.isArray(requirements_tr)
      ? requirements_tr.filter(Boolean)
      : [];
  if (requirements_en !== undefined)
    updatePayload.requirements_en = Array.isArray(requirements_en)
      ? requirements_en.filter(Boolean)
      : [];
  if (is_active !== undefined) updatePayload.is_active = is_active;

  try {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("career_listings")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[Admin Careers PUT]", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("[Admin Careers PUT]", err);
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

    const { error } = await supabase
      .from("career_listings")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("[Admin Careers DELETE]", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Admin Careers DELETE]", err);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}
