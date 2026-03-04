import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { checkAuth, sanitizeSearchInput } from "@/lib/auth";
import type { PreOrderStatus } from "@/types/database";

const PAGE_SIZE = 20;

const VALID_STATUSES: PreOrderStatus[] = [
  "pending",
  "confirmed",
  "production",
  "ready",
  "delivered",
  "cancelled",
];

export async function GET(request: NextRequest) {
  const authError = checkAuth(request);
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const search = sanitizeSearchInput(searchParams.get("search") ?? "");
  const statusParam = searchParams.get("status") ?? "";

  try {
    const supabase = getSupabaseAdmin();

    let query = supabase
      .from("pre_orders")
      .select("*, profiles(full_name, email, company_name)", { count: "exact" })
      .order("created_at", { ascending: false });

    if (search) {
      query = query.ilike("product_name", `%${search}%`);
    }

    if (statusParam && VALID_STATUSES.includes(statusParam as PreOrderStatus)) {
      query = query.eq("status", statusParam as PreOrderStatus);
    }

    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      console.error("[Admin PreOrders GET]", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    const total = count ?? 0;
    const totalPages = Math.ceil(total / PAGE_SIZE);

    return NextResponse.json({
      success: true,
      data: { preorders: data ?? [] },
      pagination: { page, pageSize: PAGE_SIZE, total, totalPages },
    });
  } catch (err) {
    console.error("[Admin PreOrders GET]", err);
    return NextResponse.json(
      { success: false, error: "Sunucu hatası" },
      { status: 500 }
    );
  }
}
