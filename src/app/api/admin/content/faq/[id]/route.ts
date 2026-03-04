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
      .from("faq_items")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: "SSS öğesi bulunamadı" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("[Admin FAQ GET id]", err);
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
    category?: string | null;
    display_order?: number;
    is_active?: boolean;
  };

  const updatePayload: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (question_tr !== undefined) updatePayload.question_tr = question_tr.trim();
  if (question_en !== undefined) updatePayload.question_en = question_en.trim();
  if (answer_tr !== undefined) updatePayload.answer_tr = answer_tr.trim();
  if (answer_en !== undefined) updatePayload.answer_en = answer_en.trim();
  if (category !== undefined) updatePayload.category = category;
  if (display_order !== undefined) updatePayload.display_order = display_order;
  if (is_active !== undefined) updatePayload.is_active = is_active;

  try {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("faq_items")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[Admin FAQ PUT]", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("[Admin FAQ PUT]", err);
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
      .from("faq_items")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("[Admin FAQ DELETE]", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Admin FAQ DELETE]", err);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}
