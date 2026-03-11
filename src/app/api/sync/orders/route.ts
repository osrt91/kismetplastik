import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, requireSupabase } from "@/lib/supabase-admin";
import { checkAuth } from "@/lib/auth";
import { createDiaOrder } from "@/lib/dia-services";
import type { DbOrder, DbOrderItem } from "@/types/database";

export async function POST(request: NextRequest) {
  const authError = checkAuth(request);
  if (authError) return authError;

  const sbError = requireSupabase();
  if (sbError) return sbError;

  let body: { order_id?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Geçersiz JSON" },
      { status: 400 }
    );
  }

  if (!body.order_id || typeof body.order_id !== "string") {
    return NextResponse.json(
      { success: false, error: "order_id zorunludur" },
      { status: 400 }
    );
  }

  const supabase = getSupabaseAdmin();

  try {
    // Fetch order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", body.order_id)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { success: false, error: "Sipariş bulunamadı" },
        { status: 404 }
      );
    }

    const typedOrder = order as DbOrder;

    const { data: items, error: itemsError } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", body.order_id);

    if (itemsError) {
      console.error("[Sync Orders] Items fetch error:", itemsError);
      return NextResponse.json(
        { success: false, error: "Sipariş kalemleri alınamadı" },
        { status: 500 }
      );
    }

    const typedItems = (items ?? []) as DbOrderItem[];

    // Build DIA order data from site order
    const diaResult = await createDiaOrder({
      cariKodu: typedOrder.profile_id,
      aciklama: `Site Sipariş: ${typedOrder.order_number}`,
      kalemler: typedItems.map((item) => ({
        stokKodu: item.product_id ?? "",
        stokAdi: item.product_name,
        miktar: item.quantity,
        birimFiyat: item.unit_price,
        kdvOrani: 20,
      })),
    });

    // Update order admin_notes with DIA order reference
    const existingNotes = typedOrder.admin_notes ?? "";
    const diaOrderNo = String(diaResult ?? "unknown");
    const updatedNotes = existingNotes
      ? `${existingNotes}\n[DIA] Sipariş No: ${diaOrderNo}`
      : `[DIA] Sipariş No: ${diaOrderNo}`;

    await supabase
      .from("orders")
      .update({
        admin_notes: updatedNotes,
        updated_at: new Date().toISOString(),
      })
      .eq("id", body.order_id);

    // Log to webhook_events
    await supabase.from("webhook_events").insert({
      event_type: "dia_order_sync",
      payload: {
        order_id: body.order_id,
        order_number: typedOrder.order_number,
        dia_order_no: diaOrderNo,
        triggered_by: "webhook",
      },
      status: "success",
      retry_count: 0,
      processed_at: new Date().toISOString(),
      error_message: null,
    });

    return NextResponse.json({
      success: true,
      message: "Sipariş DIA'ya aktarıldı",
      data: {
        order_id: body.order_id,
        dia_order_no: diaOrderNo,
      },
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Bilinmeyen hata";
    console.error("[Sync Orders POST]", err);

    try {
      await supabase.from("webhook_events").insert({
        event_type: "dia_order_sync",
        payload: {
          order_id: body.order_id,
          error: message,
          triggered_by: "webhook",
        },
        status: "failed",
        retry_count: 0,
        processed_at: new Date().toISOString(),
        error_message: message,
      });
    } catch (logErr) {
      console.error("[Sync Orders] Log error:", logErr);
    }

    return NextResponse.json(
      { success: false, error: `DIA sipariş aktarım hatası: ${message}` },
      { status: 500 }
    );
  }
}
