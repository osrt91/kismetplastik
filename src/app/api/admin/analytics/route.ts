import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { checkAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const authError = checkAuth(request);
  if (authError) return authError;

  try {
    const supabase = getSupabaseAdmin();

    // Compute month boundaries
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999).toISOString();

    // This month counts — parallel
    const [
      ordersThisMonth,
      quotesThisMonth,
      dealersThisMonth,
      messagesThisMonth,
    ] = await Promise.all([
      supabase
        .from("orders")
        .select("id", { count: "exact", head: true })
        .gte("created_at", monthStart)
        .lte("created_at", monthEnd),
      supabase
        .from("quote_requests")
        .select("id", { count: "exact", head: true })
        .gte("created_at", monthStart)
        .lte("created_at", monthEnd),
      supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .eq("role", "dealer")
        .gte("created_at", monthStart)
        .lte("created_at", monthEnd),
      supabase
        .from("contact_messages")
        .select("id", { count: "exact", head: true })
        .gte("created_at", monthStart)
        .lte("created_at", monthEnd),
    ]);

    // Daily orders for last 7 days
    const dailyOrders: { date: string; count: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString();
      const dayEnd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999).toISOString();
      const { count } = await supabase
        .from("orders")
        .select("id", { count: "exact", head: true })
        .gte("created_at", dayStart)
        .lte("created_at", dayEnd);
      dailyOrders.push({
        date: `${d.getDate().toString().padStart(2, "0")}.${(d.getMonth() + 1).toString().padStart(2, "0")}`,
        count: count ?? 0,
      });
    }

    // Top 5 products by order_items count
    const { data: topProductsRaw } = await supabase
      .from("order_items")
      .select("product_name, product_id")
      .order("created_at", { ascending: false })
      .limit(500);

    // Aggregate product counts manually (no group by in Supabase JS client)
    const productCountMap: Record<string, { name: string; count: number }> = {};
    for (const item of topProductsRaw ?? []) {
      const key = item.product_id ?? item.product_name;
      if (!productCountMap[key]) {
        productCountMap[key] = { name: item.product_name, count: 0 };
      }
      productCountMap[key].count++;
    }
    const topProducts = Object.values(productCountMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Recent catalog downloads (last 10)
    const { data: catalogDownloads } = await supabase
      .from("catalog_downloads")
      .select("id, company_name, contact_name, email, created_at")
      .order("created_at", { ascending: false })
      .limit(10);

    return NextResponse.json({
      success: true,
      data: {
        thisMonth: {
          orders: ordersThisMonth.count ?? 0,
          quotes: quotesThisMonth.count ?? 0,
          dealers: dealersThisMonth.count ?? 0,
          messages: messagesThisMonth.count ?? 0,
        },
        dailyOrders,
        topProducts,
        catalogDownloads: catalogDownloads ?? [],
      },
    });
  } catch (err) {
    console.error("[Admin Analytics GET]", err);
    return NextResponse.json(
      { success: false, error: "Sunucu hatası" },
      { status: 500 }
    );
  }
}
