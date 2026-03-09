import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { getOrderListByCari, createDiaOrder } from "@/lib/dia-services";
import { rateLimit } from "@/lib/rate-limit";
import { cached, cacheKey, TTL, invalidateCache } from "@/lib/dia-cache";

export async function GET(request: NextRequest) {
  try {
    const supabase = await supabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Yetkisiz" }, { status: 401 });
    }

    const { data: mapping } = await supabase
      .from("dealer_cari_mappings")
      .select("dia_cari_kodu, can_direct_order")
      .eq("profile_id", user.id)
      .single();

    if (!mapping) {
      // Return Supabase-only orders for unmapped dealers
      const { data: orders } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .eq("profile_id", user.id)
        .order("created_at", { ascending: false });

      return NextResponse.json({ success: true, data: { orders: orders ?? [], source: "local" } });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") ?? "1", 10);
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "20", 10), 50);

    const diaOrders = await cached(
      cacheKey.orderList(mapping.dia_cari_kodu, page),
      TTL.ORDER_LIST,
      () => getOrderListByCari(mapping.dia_cari_kodu, { page, limit })
    );

    return NextResponse.json({
      success: true,
      data: { orders: diaOrders.records, source: "dia", total: diaOrders.total_count },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Bilinmeyen hata";
    console.error("[Dealer Orders GET]", err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const { ok: allowed } = rateLimit(`dealer-order:${ip}`, { limit: 5, windowMs: 60_000 });
    if (!allowed) {
      return NextResponse.json({ success: false, error: "Cok fazla istek" }, { status: 429 });
    }

    const supabase = await supabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Yetkisiz" }, { status: 401 });
    }

    const body = await request.json();
    const { items, aciklama } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, error: "Urun listesi bos" }, { status: 400 });
    }

    const { data: mapping } = await supabase
      .from("dealer_cari_mappings")
      .select("dia_cari_kodu, can_direct_order, is_approved")
      .eq("profile_id", user.id)
      .single();

    if (mapping?.can_direct_order && mapping.is_approved) {
      // Direct DIA order for approved dealers
      const result = await createDiaOrder({
        cariKodu: mapping.dia_cari_kodu,
        aciklama: aciklama ?? "",
        kalemler: items,
      });

      invalidateCache(`order:list:${mapping.dia_cari_kodu}:*`);
      return NextResponse.json({ success: true, data: result, target: "dia" });
    }

    // Pending order in Supabase for new/unapproved dealers
    const { data: profile } = await supabase
      .from("profiles")
      .select("company_name")
      .eq("id", user.id)
      .single();

    const orderNumber = `KP-${Date.now().toString(36).toUpperCase()}`;
    const subtotal = items.reduce((s: number, i: { miktar: number; birimFiyat: number }) =>
      s + i.miktar * i.birimFiyat, 0);
    const taxAmount = subtotal * 0.20;

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        profile_id: user.id,
        order_number: orderNumber,
        status: "pending",
        subtotal,
        tax_amount: taxAmount,
        total_amount: subtotal + taxAmount,
        notes: aciklama ?? "",
        shipping_address: profile?.company_name ?? "",
      })
      .select()
      .single();

    if (orderError) {
      return NextResponse.json({ success: false, error: orderError.message }, { status: 500 });
    }

    // Insert order items
    const orderItems = items.map((item: { stokKodu: string; stokAdi: string; miktar: number; birimFiyat: number }) => ({
      order_id: order.id,
      product_name: item.stokAdi,
      quantity: item.miktar,
      unit_price: item.birimFiyat,
      total_price: item.miktar * item.birimFiyat,
    }));

    await supabase.from("order_items").insert(orderItems);

    return NextResponse.json({
      success: true,
      data: { orderId: order.id, orderNumber },
      target: "pending_approval",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Bilinmeyen hata";
    console.error("[Dealer Orders POST]", err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
