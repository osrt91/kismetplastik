import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { getProductPricesForCatalog } from "@/lib/dia-services";
import { cached, cacheKey, TTL } from "@/lib/dia-cache";

export async function GET(request: NextRequest) {
  try {
    const supabase = await supabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Yetkisiz" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") ?? "1", 10);
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "50", 10), 100);
    const search = searchParams.get("search") ?? "";

    const catalog = await cached(
      cacheKey.priceCatalog(page, limit) + (search ? `:${search}` : ""),
      TTL.PRICE_CATALOG,
      () => getProductPricesForCatalog({
        page,
        limit,
        filter: search ? `stokkartkodu like '%${search}%' or aciklama like '%${search}%'` : undefined,
      })
    );

    return NextResponse.json({ success: true, data: catalog });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Bilinmeyen hata";
    console.error("[Dealer Catalog GET]", err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
