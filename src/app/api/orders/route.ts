import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { checkAuth } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";

/**
 * GET /api/orders
 *
 * Lists orders with pagination. Requires admin authentication.
 * Includes related order items and profile information.
 *
 * @query {{ status?: string, profile_id?: string, page?: number, limit?: number }}
 * @returns {{ success: boolean, data: Order[], pagination: { page: number, limit: number, total: number, totalPages: number } }}
 */
export async function GET(request: NextRequest) {
  const authError = checkAuth(request);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const profileId = searchParams.get("profile_id");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50);
    const offset = (page - 1) * limit;

    const supabase = getSupabase();

    let query = supabase
      .from("orders")
      .select("*, order_items(*), profiles(full_name, company_name, email)", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) query = query.eq("status", status);
    if (profileId) query = query.eq("profile_id", profileId);

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
  } catch {
    return NextResponse.json(
      { success: false, error: "Bir hata oluştu." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/orders
 *
 * Creates a new order with line items. Calculates subtotal, tax (20%), and total.
 * Records initial status in order history.
 *
 * @body {{ profile_id: string, items: { product_id?: string, product_name: string, quantity: number, unit_price: number, notes?: string }[], shipping_address?: string, billing_address?: string, payment_method?: string, notes?: string }}
 * @returns {{ success: boolean, data?: { id: string, order_number: string }, message?: string, error?: string }}
 * @rateLimit 5 requests per 1 minute per IP
 */
export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const { ok: allowed } = rateLimit(`orders:${ip}`, { limit: 5, windowMs: 60_000 });
    if (!allowed) {
      return NextResponse.json(
        { success: false, error: "Çok fazla istek." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { profile_id, items, shipping_address, billing_address, payment_method, notes } = body;

    if (!profile_id) {
      return NextResponse.json({ success: false, error: "Giriş yapmanız gerekiyor." }, { status: 401 });
    }
    if (!items?.length) {
      return NextResponse.json({ success: false, error: "En az bir ürün gerekli." }, { status: 400 });
    }

    const supabase = getSupabase();

    let subtotal = 0;
    const orderItems = items.map((item: { product_name: string; quantity: number; unit_price: number; notes?: string; product_id?: string }) => {
      const total = item.quantity * item.unit_price;
      subtotal += total;
      return {
        product_id: item.product_id || null,
        product_name: item.product_name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: total,
        notes: item.notes || null,
      };
    });

    const taxAmount = subtotal * 0.20;
    const totalAmount = subtotal + taxAmount;

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        profile_id,
        order_number: "",
        status: "pending",
        shipping_address: shipping_address || null,
        billing_address: billing_address || null,
        subtotal,
        tax_amount: taxAmount,
        shipping_cost: 0,
        total_amount: totalAmount,
        payment_method: payment_method || "havale",
        payment_status: "pending",
        notes: notes || null,
      })
      .select("id, order_number")
      .single();

    if (orderError || !order) {
      console.error("[Orders API] Insert failed:", orderError);
      return NextResponse.json(
        { success: false, error: "Sipariş oluşturulamadı." },
        { status: 500 }
      );
    }

    const itemsWithOrderId = orderItems.map((item: Record<string, unknown>) => ({
      ...item,
      order_id: order.id,
    }));

    await supabase.from("order_items").insert(itemsWithOrderId);

    await supabase.from("order_status_history").insert({
      order_id: order.id,
      new_status: "pending",
      note: "Sipariş oluşturuldu",
    });

    return NextResponse.json({
      success: true,
      data: { id: order.id, order_number: order.order_number },
      message: "Siparişiniz başarıyla oluşturuldu.",
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Bir hata oluştu." },
      { status: 500 }
    );
  }
}
