import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { checkAuth } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { orderCreateSchema, getZodErrorMessage } from "@/lib/validations";

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

    const raw = await request.json();
    const parsed = orderCreateSchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: getZodErrorMessage(parsed.error) }, { status: 400 });
    }

    const body = parsed.data;
    const supabase = getSupabase();

    let subtotal = 0;
    const orderItems = body.items.map((item) => {
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
        profile_id: body.profile_id,
        order_number: "",
        status: "pending",
        shipping_address: body.shipping_address || null,
        billing_address: body.billing_address || null,
        subtotal,
        tax_amount: taxAmount,
        shipping_cost: 0,
        total_amount: totalAmount,
        payment_method: body.payment_method || "havale",
        payment_status: "pending",
        notes: body.notes || null,
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
