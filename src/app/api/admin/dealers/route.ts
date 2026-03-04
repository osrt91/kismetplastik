import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabase-admin";
import { checkAuth, sanitizeSearchInput } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const authError = checkAuth(request);
  if (authError) return authError;

  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json(
      { success: false, error: "Supabase Admin yapılandırılmamış." },
      { status: 503 }
    );
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");
  const role = searchParams.get("role");
  const approved = searchParams.get("approved");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
  const offset = (page - 1) * limit;

  try {
    const supabase = getSupabaseAdmin();

    let query = supabase
      .from("profiles")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (role && role !== "all") {
      query = query.eq("role", role);
    }

    if (approved !== null && approved !== "" && approved !== "all") {
      query = query.eq("is_approved", approved === "true");
    }

    if (search) {
      const safe = sanitizeSearchInput(search);
      query = query.or(
        `full_name.ilike.%${safe}%,email.ilike.%${safe}%,company_name.ilike.%${safe}%`
      );
    }

    const { data, count, error } = await query;

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Bir hata oluştu.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
