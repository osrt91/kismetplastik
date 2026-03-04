import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { checkAuth } from "@/lib/auth";
import type { TradeShowStatus } from "@/types/database";

export async function GET(request: NextRequest) {
  const authError = checkAuth(request);
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") ?? "";

  try {
    const supabase = getSupabaseAdmin();

    let query = supabase
      .from("trade_shows")
      .select("*")
      .order("start_date", { ascending: false });

    const validStatuses: TradeShowStatus[] = ["upcoming", "active", "past"];
    if (status && validStatuses.includes(status as TradeShowStatus)) {
      query = query.eq("status", status as TradeShowStatus);
    }

    const { data, error } = await query;

    if (error) {
      console.error("[Admin TradeShows GET]", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: data ?? [] });
  } catch (err) {
    console.error("[Admin TradeShows GET]", err);
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
    name_tr,
    name_en,
    description_tr,
    description_en,
    location_tr,
    location_en,
    start_date,
    end_date,
    booth,
    website,
    status,
    is_active,
  } = body as {
    name_tr?: string;
    name_en?: string;
    description_tr?: string;
    description_en?: string;
    location_tr?: string;
    location_en?: string;
    start_date?: string;
    end_date?: string;
    booth?: string | null;
    website?: string | null;
    status?: string;
    is_active?: boolean;
  };

  if (!name_tr?.trim()) {
    return NextResponse.json({ success: false, error: "Türkçe ad zorunludur" }, { status: 400 });
  }
  if (!start_date?.trim()) {
    return NextResponse.json({ success: false, error: "Başlangıç tarihi zorunludur" }, { status: 400 });
  }
  if (!end_date?.trim()) {
    return NextResponse.json({ success: false, error: "Bitiş tarihi zorunludur" }, { status: 400 });
  }
  if (!location_tr?.trim()) {
    return NextResponse.json({ success: false, error: "Türkçe konum zorunludur" }, { status: 400 });
  }

  // Compute auto-status if not provided
  const resolvedStatus = resolveStatus(start_date, end_date, status);

  try {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("trade_shows")
      .insert({
        name_tr: name_tr.trim(),
        name_en: (name_en ?? "").trim(),
        description_tr: (description_tr ?? "").trim(),
        description_en: (description_en ?? "").trim(),
        location_tr: location_tr.trim(),
        location_en: (location_en ?? "").trim(),
        start_date: start_date.trim(),
        end_date: end_date.trim(),
        booth: booth?.trim() ?? null,
        website: website?.trim() ?? null,
        status: resolvedStatus,
        is_active: is_active ?? true,
      })
      .select()
      .single();

    if (error) {
      console.error("[Admin TradeShows POST]", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err) {
    console.error("[Admin TradeShows POST]", err);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}

function resolveStatus(
  start_date: string,
  end_date: string,
  explicitStatus?: string
): TradeShowStatus {
  const validStatuses: TradeShowStatus[] = ["upcoming", "active", "past"];
  if (explicitStatus && validStatuses.includes(explicitStatus as TradeShowStatus)) {
    return explicitStatus as TradeShowStatus;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(start_date);
  const end = new Date(end_date);

  if (end < today) return "past";
  if (start > today) return "upcoming";
  return "active";
}
