import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { checkAuth } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { supabaseServer } from "@/lib/supabase/server";

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

    // Verify session and extract profile_id from authenticated user
    const authClient = await supabaseServer();
    const { data: { user }, error: authError } = await authClient.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ success: false, error: "Giriş yapmanız gerekiyor." }, { status: 401 });
    }
    const profile_id = user.id;

    const body = await request.json();
    const { items, shipping_address, billing_address, payment_method, notes } = body;
    if (!items?.length) {
      return NextResponse.json({ success: false, error: "En az bir ürün gerekli." }, { status: 400 });
    }

    const supabase = getSupabase();

    // Validate each item's price and quantity bounds
    for (const item of items) {
      if (typeof item.unit_price !== "number" || item.unit_price <= 0 || item.unit_price > 100_000) {
        return NextResponse.json(
          { success: false, error: "Geçersiz birim fiyat. Fiyat 0 ile 100.000 arasında olmalıdır." },
          { status: 400 }
        );
      }
      if (typeof item.quantity !== "number" || !Number.isInteger(item.quantity) || item.quantity <= 0 || item.quantity > 1_000_000) {
        return NextResponse.json(
          { success: false, error: "Geçersiz miktar. Miktar 1 ile 1.000.000 arasında bir tam sayı olmalıdır." },
          { status: 400 }
        );
      }
      if (!item.product_name || typeof item.product_name !== "string") {
        return NextResponse.json(
          { success: false, error: "Ürün adı gereklidir." },
          { status: 400 }
        );
      }
    }

    // Verify product existence for items with product_id
    const productIds = items
      .filter((item: { product_id?: string }) => item.product_id)
      .map((item: { product_id: string }) => item.product_id);

    if (productIds.length > 0) {
      const { data: existingProducts, error: productError } = await supabase
        .from("products")
        .select("id")
        .in("id", productIds);

      if (productError) {
        return NextResponse.json(
          { success: false, error: "Ürün doğrulama hatası." },
          { status: 500 }
        );
      }

      const existingIds = new Set((existingProducts || []).map((p: { id: string }) => p.id));
      const missingIds = productIds.filter((id: string) => !existingIds.has(id));
      if (missingIds.length > 0) {
        return NextResponse.json(
          { success: false, error: `Geçersiz ürün ID: ${missingIds.join(", ")}` },
          { status: 400 }
        );
      }
    }

    // Recalculate all prices server-side — never trust client totals
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
