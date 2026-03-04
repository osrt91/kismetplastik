import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { checkAuth, sanitizeSearchInput } from "@/lib/auth";

const PAGE_SIZE = 15;

export async function GET(request: NextRequest) {
  const authError = checkAuth(request);
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const search = sanitizeSearchInput(searchParams.get("search") ?? "");
  const status = searchParams.get("status") ?? "";

  try {
    const supabase = getSupabaseAdmin();

    let query = supabase
      .from("sample_requests")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    if (search) {
      query = query.or(
        `company_name.ilike.%${search}%,contact_name.ilike.%${search}%`
      );
    }

    const validStatuses = ["pending", "reviewing", "approved", "shipped", "rejected"];
    if (status && validStatuses.includes(status)) {
      query = query.eq("status", status);
    }

    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      console.error("[Admin Samples GET]", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    const total = count ?? 0;
    const totalPages = Math.ceil(total / PAGE_SIZE);

    return NextResponse.json({
      success: true,
      data: { samples: data ?? [] },
      pagination: { page, pageSize: PAGE_SIZE, total, totalPages },
    });
  } catch (err) {
    console.error("[Admin Samples GET]", err);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}
