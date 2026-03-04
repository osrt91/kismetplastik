import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { checkAuth } from "@/lib/auth";

const PAGE_SIZE = 20;

export async function GET(request: NextRequest) {
  const authError = checkAuth(request);
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.min(100, parseInt(searchParams.get("limit") ?? String(PAGE_SIZE), 10));
  const resourceId = searchParams.get("resource_id") ?? "";

  try {
    const supabase = getSupabaseAdmin();

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from("catalog_downloads")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (resourceId) {
      query = query.eq("resource_id", resourceId);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error("[Admin Resources Downloads GET]", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    const total = count ?? 0;
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: { downloads: data ?? [] },
      pagination: { page, pageSize: limit, total, totalPages },
    });
  } catch (err) {
    console.error("[Admin Resources Downloads GET]", err);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}
