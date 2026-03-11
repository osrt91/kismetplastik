import { NextRequest, NextResponse } from "next/server";
import { requireSupabase } from "@/lib/supabase-admin";
import { checkAuth } from "@/lib/auth";
import { getDiaClient, isDiaConfigured } from "@/lib/dia-client";
import { getStockList } from "@/lib/dia-services";

export async function POST(request: NextRequest) {
  const authError = checkAuth(request);
  if (authError) return authError;

  const sbError = requireSupabase();
  if (sbError) return sbError;

  try {
    // Check if DIA is configured before attempting connection
    if (!isDiaConfigured()) {
      return NextResponse.json(
        {
          success: false,
          error: "DIA ERP yapılandırılmamış. Gerekli ortam değişkenlerini kontrol edin: DIA_API_URL, DIA_USERNAME, DIA_PASSWORD, DIA_API_KEY, DIA_FIRMA_KODU, DIA_DONEM_KODU",
        },
        { status: 400 }
      );
    }

    // Verify client can be created (env vars set)
    const client = getDiaClient();

    // Try to fetch a small stock list — this triggers login + API call
    const stockResult = await getStockList({ limit: 1 });

    // Also check credit balance
    let creditInfo: unknown = null;
    try {
      creditInfo = await client.checkCredit();
    } catch {
      // Credit check is optional, don't fail the test
    }

    return NextResponse.json({
      success: true,
      message: "Bağlantı başarılı",
      data: {
        stockCount: stockResult.total_count ?? stockResult.records.length,
        creditInfo,
      },
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Bilinmeyen bağlantı hatası";
    console.error("[DIA Test POST]", err);
    return NextResponse.json(
      {
        success: false,
        error: `DIA bağlantı hatası: ${message}`,
      },
      { status: 502 }
    );
  }
}
