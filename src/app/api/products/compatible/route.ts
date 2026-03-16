import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { sanitizeSearchInput } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rawStockKodu = searchParams.get("stock_kodu");

    if (!rawStockKodu) {
      return NextResponse.json(
        { success: false, error: "stock_kodu parametresi gerekli" },
        { status: 400 }
      );
    }

    const stockKodu = sanitizeSearchInput(rawStockKodu);
    if (!stockKodu) {
      return NextResponse.json(
        { success: false, error: "Geçersiz stok kodu." },
        { status: 400 }
      );
    }

    const supabase = getSupabase();

    const { data: rules, error } = await supabase
      .from("product_compatibility")
      .select("*")
      .or(
        `source_stock_kodu.eq.${stockKodu},compatible_stock_kodu.eq.${stockKodu}`
      )
      .eq("is_active", true)
      .order("compatibility_type", { ascending: true });

    if (error) {
      console.error("[Compatible Products GET]", error);
      return NextResponse.json(
        { success: false, error: "Uyumlu ürünler yüklenemedi." },
        { status: 500 }
      );
    }

    // Normalize: always return the "other" product relative to the queried one
    const compatible = (rules ?? []).map((rule) => {
      const isSource = rule.source_stock_kodu === stockKodu;
      return {
        stock_kodu: isSource
          ? rule.compatible_stock_kodu
          : rule.source_stock_kodu,
        category: isSource
          ? rule.compatible_category
          : rule.source_category,
        compatibility_type: rule.compatibility_type,
        notes: rule.notes,
      };
    });

    return NextResponse.json({ success: true, data: compatible });
  } catch (err) {
    console.error("[Compatible Products GET]", err);
    return NextResponse.json(
      { success: false, error: "Bir hata oluştu." },
      { status: 500 }
    );
  }
}
