import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { checkAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const authError = checkAuth(request);
  if (authError) return authError;

  try {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("faq_items")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      console.error("[Admin FAQ GET]", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: data ?? [] });
  } catch (err) {
    console.error("[Admin FAQ GET]", err);
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
    question_tr,
    question_en,
    answer_tr,
    answer_en,
    category,
    display_order,
    is_active,
  } = body as {
    question_tr?: string;
    question_en?: string;
    answer_tr?: string;
    answer_en?: string;
    category?: string;
    display_order?: number;
    is_active?: boolean;
  };

  if (!question_tr?.trim()) {
    return NextResponse.json({ success: false, error: "Türkçe soru zorunludur" }, { status: 400 });
  }
  if (!answer_tr?.trim()) {
    return NextResponse.json({ success: false, error: "Türkçe cevap zorunludur" }, { status: 400 });
  }

  try {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("faq_items")
      .insert({
        question_tr: question_tr.trim(),
        question_en: (question_en ?? "").trim(),
        answer_tr: answer_tr.trim(),
        answer_en: (answer_en ?? "").trim(),
        category: category ?? null,
        display_order: display_order ?? 0,
        is_active: is_active ?? true,
      })
      .select()
      .single();

    if (error) {
      console.error("[Admin FAQ POST]", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err) {
    console.error("[Admin FAQ POST]", err);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}
