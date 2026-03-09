import { NextRequest, NextResponse } from "next/server";
import { checkAuth } from "@/lib/auth";
import { getSupabase } from "@/lib/supabase";
import { createDiaOrder } from "@/lib/dia-services";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  const authError = checkAuth(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    const supabase = getSupabase();

    // Fetch order with items
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("id", id)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { success: false, error: "Siparis bulunamadi" },
        { status: 404 }
      );
    }

    if (order.status !== "pending") {
      return NextResponse.json(
        { success: false, error: `Siparis durumu '${order.status}' — sadece 'pending' siparisler onaylanabilir` },
        { status: 400 }
      );
    }

    // Get dealer's DIA cari mapping
    const { data: mapping } = await supabase
      .from("dealer_cari_mappings")
      .select("dia_cari_kodu")
      .eq("profile_id", order.profile_id)
      .single();

    let diaResult: unknown = null;

    if (mapping) {
      // Push to DIA
      try {
        const kalemler = (order.order_items ?? []).map(
          (item: { product_name: string; quantity: number; unit_price: number; notes?: string }) => ({
            stokKodu: item.notes ?? item.product_name, // notes field stores stock code when available
            stokAdi: item.product_name,
            miktar: item.quantity,
            birimFiyat: item.unit_price,
            kdvOrani: 20,
          })
        );

        diaResult = await createDiaOrder({
          cariKodu: mapping.dia_cari_kodu,
          aciklama: `Web Portal - ${order.order_number}`,
          kalemler,
        });
      } catch (diaErr) {
        console.error("[DIA Order Push Error]", diaErr);
        // Continue with local approval even if DIA fails
      }
    }

    // Update local order status
    const { error: updateError } = await supabase
      .from("orders")
      .update({
        status: "confirmed",
        admin_notes: `Onayland: ${new Date().toISOString()}${diaResult ? " — DIA'ya gonderildi" : " — DIA eslestirmesi yok"}`,
      })
      .eq("id", id);

    if (updateError) {
      return NextResponse.json(
        { success: false, error: updateError.message },
        { status: 500 }
      );
    }

    // Add status history
    await supabase.from("order_status_history").insert({
      order_id: id,
      old_status: "pending",
      new_status: "confirmed",
      note: diaResult
        ? "Admin tarafindan onaylandi ve DIA'ya gonderildi"
        : "Admin tarafindan onaylandi",
    });

    return NextResponse.json({
      success: true,
      data: {
        orderId: id,
        diaResult,
        pushedToDia: Boolean(mapping && diaResult),
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Bilinmeyen hata";
    console.error("[Order Approve POST]", err);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
