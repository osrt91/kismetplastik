import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { getCariBalance } from "@/lib/dia-services";
import { cached, cacheKey, TTL } from "@/lib/dia-cache";

export async function GET() {
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
      return NextResponse.json({
        success: false,
        error: "DIA cari hesabiniz tanimli degil. Lutfen yoneticiyle iletisime gecin.",
      }, { status: 404 });
    }

    const balance = await cached(
      cacheKey.cariBalance(mapping.dia_cari_kodu),
      TTL.CARI_BALANCE,
      () => getCariBalance(mapping.dia_cari_kodu)
    );

    return NextResponse.json({ success: true, data: balance });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Bilinmeyen hata";
    console.error("[Dealer Balance GET]", err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
