import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { getInvoiceListByCari, separateInvoicesByType } from "@/lib/dia-services";
import { cached, cacheKey, TTL } from "@/lib/dia-cache";

export async function GET(request: NextRequest) {
  try {
    const supabase = await supabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Yetkisiz" }, { status: 401 });
    }

    const { data: mapping } = await supabase
      .from("dealer_cari_mappings")
      .select("dia_cari_kodu")
      .eq("profile_id", user.id)
      .single();

    if (!mapping) {
      return NextResponse.json({ success: false, error: "DIA cari tanimli degil" }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") ?? "1", 10);
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "50", 10), 100);

    const invoices = await cached(
      cacheKey.invoiceList(mapping.dia_cari_kodu, page),
      TTL.INVOICE_LIST,
      () => getInvoiceListByCari(mapping.dia_cari_kodu, { page, limit })
    );
    const { egr, ers } = separateInvoicesByType(invoices.records);

    const egrTotal = egr.reduce((sum, inv) => sum + (parseFloat(inv.kalantutar_taksit) || 0), 0);
    const ersTotal = ers.reduce((sum, inv) => sum + (parseFloat(inv.kalantutar_taksit) || 0), 0);

    return NextResponse.json({
      success: true,
      data: {
        egr: { records: egr, total: egrTotal },
        ers: { records: ers, total: ersTotal },
        grandTotal: egrTotal + ersTotal,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Bilinmeyen hata";
    console.error("[Dealer Invoices GET]", err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
