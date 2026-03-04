import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { checkAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const authError = checkAuth(request);
  if (authError) return authError;

  try {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("career_listings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[Admin Careers GET]", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: data ?? [] });
  } catch (err) {
    console.error("[Admin Careers GET]", err);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authError = checkAuth(request);
  if (authError) return authError;

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

  if (!title_tr?.trim()) {
    return NextResponse.json({ success: false, error: "Türkçe başlık zorunludur" }, { status: 400 });
  }
  if (!department?.trim()) {
    return NextResponse.json({ success: false, error: "Departman zorunludur" }, { status: 400 });
  }

  const reqTr = Array.isArray(requirements_tr) ? requirements_tr.filter(Boolean) : [];
  const reqEn = Array.isArray(requirements_en) ? requirements_en.filter(Boolean) : [];

  try {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("career_listings")
      .insert({
        title_tr: title_tr.trim(),
        title_en: (title_en ?? "").trim(),
        description_tr: (description_tr ?? "").trim(),
        description_en: (description_en ?? "").trim(),
        department: department.trim(),
        location: (location ?? "").trim(),
        type: (type ?? "").trim(),
        requirements_tr: reqTr,
        requirements_en: reqEn,
        is_active: is_active ?? true,
      })
      .select()
      .single();

    if (error) {
      console.error("[Admin Careers POST]", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err) {
    console.error("[Admin Careers POST]", err);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}
