import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { checkAuth, sanitizeSearchInput } from "@/lib/auth";
import type { OrderStatus } from "@/types/database";

const PAGE_SIZE = 20;

const VALID_STATUSES: OrderStatus[] = [
  "pending",
  "confirmed",
  "production",
  "shipping",
  "delivered",
  "cancelled",
];

export async function GET(request: NextRequest) {
  const authError = checkAuth(request);
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.min(
    100,
    parseInt(searchParams.get("limit") ?? String(PAGE_SIZE), 10)
  );
  const statusParam = searchParams.get("status") ?? "";
  const search = sanitizeSearchInput(searchParams.get("search") ?? "");
  const dateFrom = searchParams.get("date_from") ?? "";
  const dateTo = searchParams.get("date_to") ?? "";

  try {
    const supabase = getSupabaseAdmin();

    let query = supabase
      .from("orders")
      .select("*, profiles(full_name, email, company_name)", { count: "exact" })
      .order("created_at", { ascending: false });

    if (statusParam && VALID_STATUSES.includes(statusParam as OrderStatus)) {
      query = query.eq("status", statusParam as OrderStatus);
    }

    if (search) {
      query = query.ilike("order_number", `%${search}%`);
    }

    if (dateFrom) {
      query = query.gte("created_at", `${dateFrom}T00:00:00.000Z`);
    }

    if (dateTo) {
      query = query.lte("created_at", `${dateTo}T23:59:59.999Z`);
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      console.error("[Admin Orders GET]", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    const total = count ?? 0;
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: { orders: data ?? [] },
      pagination: { page, pageSize: limit, total, totalPages },
    });
  } catch (err) {
    console.error("[Admin Orders GET]", err);
    return NextResponse.json(
      { success: false, error: "Sunucu hatası" },
      { status: 500 }
    );
  }
}
