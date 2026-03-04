import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { checkAuth } from "@/lib/auth";
import type { TradeShowStatus } from "@/types/database";

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
      .from("trade_shows")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: "Fuar bulunamadı" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("[Admin TradeShows GET id]", err);
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

  const allowed: (keyof Record<string, unknown>)[] = [
    "name_tr",
    "name_en",
    "description_tr",
    "description_en",
    "location_tr",
    "location_en",
    "start_date",
    "end_date",
    "booth",
    "website",
    "status",
    "is_active",
  ];

  const updatePayload: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  for (const key of allowed) {
    if (key in body) {
      updatePayload[key] = body[key];
    }
  }

  // If dates are being changed but status is not explicitly set, auto-compute
  const start = (updatePayload.start_date ?? body.start_date) as string | undefined;
  const end = (updatePayload.end_date ?? body.end_date) as string | undefined;
  if ((updatePayload.start_date || updatePayload.end_date) && !("status" in body) && start && end) {
    updatePayload.status = resolveStatus(start, end);
  } else if ("status" in body) {
    const validStatuses: TradeShowStatus[] = ["upcoming", "active", "past"];
    const s = body.status as string;
    if (validStatuses.includes(s as TradeShowStatus)) {
      updatePayload.status = s as TradeShowStatus;
    }
  }

  try {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("trade_shows")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[Admin TradeShows PUT]", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("[Admin TradeShows PUT]", err);
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

    const { error } = await supabase.from("trade_shows").delete().eq("id", id);

    if (error) {
      console.error("[Admin TradeShows DELETE]", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Admin TradeShows DELETE]", err);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}

function resolveStatus(start_date: string, end_date: string): TradeShowStatus {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(start_date);
  const end = new Date(end_date);

  if (end < today) return "past";
  if (start > today) return "upcoming";
  return "active";
}
