import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await supabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Yetkilendirme gerekli." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50);
    const offset = (page - 1) * limit;

    let query = supabase
      .from("invoices")
      .select("*", { count: "exact" })
      .eq("profile_id", user.id)
      .order("issued_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq("status", status);
    }

    if (from) {
      query = query.gte("issued_at", from);
    }

    if (to) {
      query = query.lte("issued_at", to);
    }

    const { data, count, error } = await query;

    if (error) {
      console.error("[Invoices API] List error:", error);
      return NextResponse.json(
        { success: false, error: "Faturalar yüklenemedi." },
        { status: 500 }
      );
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
  } catch {
    return NextResponse.json(
      { success: false, error: "Bir hata oluştu." },
      { status: 500 }
    );
  }
}
