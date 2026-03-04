import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { checkAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const authError = checkAuth(request);
  if (authError) return authError;

  try {
    const supabase = getSupabaseAdmin();

    // Run all count queries in parallel
    const [
      ordersTotal,
      ordersPending,
      quotesTotal,
      quotesPending,
      messagesUnread,
      dealersActive,
      dealersPending,
      productsTotal,
      blogTotal,
    ] = await Promise.all([
      supabase
        .from("orders")
        .select("id", { count: "exact", head: true }),
      supabase
        .from("orders")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending"),
      supabase
        .from("quote_requests")
        .select("id", { count: "exact", head: true }),
      supabase
        .from("quote_requests")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending"),
      supabase
        .from("contact_messages")
        .select("id", { count: "exact", head: true })
        .eq("status", "unread"),
      supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .eq("role", "dealer")
        .eq("is_approved", true)
        .eq("is_active", true),
      supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .eq("role", "dealer")
        .eq("is_approved", false),
      supabase
        .from("products")
        .select("id", { count: "exact", head: true }),
      supabase
        .from("blog_posts")
        .select("id", { count: "exact", head: true }),
    ]);

    // Recent activity: last 5 orders
    const { data: recentOrders } = await supabase
      .from("orders")
      .select("id, order_number, status, total_amount, created_at, profiles(full_name, company_name)")
      .order("created_at", { ascending: false })
      .limit(5);

    // Recent activity: last 5 quotes
    const { data: recentQuotes } = await supabase
      .from("quote_requests")
      .select("id, company_name, contact_name, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5);

    // Recent activity: last 5 messages
    const { data: recentMessages } = await supabase
      .from("contact_messages")
      .select("id, name, subject, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5);

    // Merge and sort activity feed by date descending
    const orderActivities = (recentOrders ?? []).map((o) => ({
      id: o.id,
      type: "order" as const,
      title: `Sipariş #${o.order_number}`,
      subtitle: (o.profiles as { full_name?: string; company_name?: string } | null)?.company_name
        ?? (o.profiles as { full_name?: string; company_name?: string } | null)?.full_name
        ?? "Bilinmeyen",
      status: o.status,
      amount: o.total_amount,
      date: o.created_at,
      href: `/admin/orders/${o.id}`,
    }));

    const quoteActivities = (recentQuotes ?? []).map((q) => ({
      id: q.id,
      type: "quote" as const,
      title: `Teklif Talebi`,
      subtitle: q.company_name ?? q.contact_name,
      status: q.status,
      amount: null,
      date: q.created_at,
      href: `/admin/quotes/${q.id}`,
    }));

    const messageActivities = (recentMessages ?? []).map((m) => ({
      id: m.id,
      type: "message" as const,
      title: m.subject,
      subtitle: m.name,
      status: m.status,
      amount: null,
      date: m.created_at,
      href: `/admin/messages/${m.id}`,
    }));

    const recentActivity = [...orderActivities, ...quoteActivities, ...messageActivities]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          ordersTotal: ordersTotal.count ?? 0,
          ordersPending: ordersPending.count ?? 0,
          quotesTotal: quotesTotal.count ?? 0,
          quotesPending: quotesPending.count ?? 0,
          messagesUnread: messagesUnread.count ?? 0,
          dealersActive: dealersActive.count ?? 0,
          dealersPending: dealersPending.count ?? 0,
          productsTotal: productsTotal.count ?? 0,
          blogTotal: blogTotal.count ?? 0,
        },
        recentActivity,
      },
    });
  } catch (err) {
    console.error("[Admin Dashboard GET]", err);
    return NextResponse.json(
      { success: false, error: "Sunucu hatası" },
      { status: 500 }
    );
  }
}
