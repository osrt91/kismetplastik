import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, requireSupabase } from "@/lib/supabase-admin";
import { checkAuth, sanitizeSearchInput } from "@/lib/auth";
import type { QuoteStatus } from "@/types/database";

const VALID_STATUSES: QuoteStatus[] = [
  "pending",
  "reviewing",
  "quoted",
  "accepted",
  "rejected",
];

export async function GET(request: NextRequest) {
  const authError = checkAuth(request);
  if (authError) return authError;

  const sbError = requireSupabase();
  if (sbError) return sbError;

  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(100, parseInt(searchParams.get("limit") ?? "20", 10));
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const supabase = getSupabaseAdmin();

    // Count query
    let countQuery = supabase
      .from("quote_requests")
      .select("id", { count: "exact", head: true });

    if (status && VALID_STATUSES.includes(status as QuoteStatus)) {
      countQuery = countQuery.eq("status", status);
    }
    if (search) {
      const safe = sanitizeSearchInput(search);
      countQuery = countQuery.or(
        `company_name.ilike.%${safe}%,contact_name.ilike.%${safe}%`
      );
    }

    const { count, error: countError } = await countQuery;
    if (countError) console.error("[Admin Quotes GET count]", countError);

    // Data query
    let query = supabase
      .from("quote_requests")
      .select(
        "id, company_name, contact_name, email, status, total_amount, created_at"
      )
      .order("created_at", { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (status && VALID_STATUSES.includes(status as QuoteStatus)) {
      query = query.eq("status", status);
    }
    if (search) {
      const safe = sanitizeSearchInput(search);
      query = query.or(
        `company_name.ilike.%${safe}%,contact_name.ilike.%${safe}%`
      );
    }

    const { data, error } = await query;
    if (error) {
      console.error("[Admin Quotes GET]", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data ?? [],
      pagination: { page, limit, total: count ?? 0 },
    });
  } catch (e) {
    console.error("[Admin Quotes GET]", e);
    return NextResponse.json(
      { success: false, error: "Sunucu hatası" },
      { status: 500 }
    );
  }
}
