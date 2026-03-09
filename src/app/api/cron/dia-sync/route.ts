import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, requireSupabase } from "@/lib/supabase-admin";
import { checkAuth } from "@/lib/auth";
import { syncStockToSupabase, syncCariToSupabase } from "@/lib/dia-services";

type SyncType = "stock" | "cari" | "all";

const VALID_SYNC_TYPES: SyncType[] = ["stock", "cari", "all"];

function verifyCronAuth(request: NextRequest): boolean {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) return false;

  const authHeader = request.headers.get("authorization");
  if (!authHeader) return false;

  // Support "Bearer <secret>" format
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : authHeader;

  return token === cronSecret;
}

export async function POST(request: NextRequest) {
  // Allow either cron secret OR admin auth
  const isCronAuthed = verifyCronAuth(request);
  if (!isCronAuthed) {
    const authError = checkAuth(request);
    if (authError) return authError;
  }

  const sbError = requireSupabase();
  if (sbError) return sbError;

  const { searchParams } = new URL(request.url);
  const syncType = (searchParams.get("type") ?? "all") as SyncType;

  if (!VALID_SYNC_TYPES.includes(syncType)) {
    return NextResponse.json(
      {
        success: false,
        error: `Geçersiz sync tipi: ${syncType}. Geçerli tipler: ${VALID_SYNC_TYPES.join(", ")}`,
      },
      { status: 400 }
    );
  }

  const supabase = getSupabaseAdmin();
  const results: Record<string, { synced: number; errors: string[]; duration: number }> = {};

  try {
    // Stock sync
    if (syncType === "stock" || syncType === "all") {
      const startTime = Date.now();
      try {
        const stockResult = await syncStockToSupabase();
        const duration = Date.now() - startTime;
        results.stock = {
          synced: stockResult.synced,
          errors: stockResult.errors,
          duration,
        };

        await supabase.from("webhook_events").insert({
          event_type: "dia_stock_sync",
          payload: {
            synced: stockResult.synced,
            errors: stockResult.errors,
            duration,
            triggered_by: "cron",
          },
          status: stockResult.errors.length === 0 ? "success" : "failed",
          retry_count: 0,
          processed_at: new Date().toISOString(),
          error_message:
            stockResult.errors.length > 0
              ? stockResult.errors.join("; ")
              : null,
        });
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Bilinmeyen hata";
        const duration = Date.now() - startTime;
        results.stock = { synced: 0, errors: [message], duration };

        await supabase.from("webhook_events").insert({
          event_type: "dia_stock_sync",
          payload: { triggered_by: "cron", error: message },
          status: "failed",
          retry_count: 0,
          processed_at: new Date().toISOString(),
          error_message: message,
        });
      }
    }

    // Cari sync
    if (syncType === "cari" || syncType === "all") {
      const startTime = Date.now();
      try {
        const cariResult = await syncCariToSupabase();
        const duration = Date.now() - startTime;
        results.cari = {
          synced: cariResult.synced,
          errors: cariResult.errors,
          duration,
        };

        await supabase.from("webhook_events").insert({
          event_type: "dia_cari_sync",
          payload: {
            synced: cariResult.synced,
            errors: cariResult.errors,
            duration,
            triggered_by: "cron",
          },
          status: cariResult.errors.length === 0 ? "success" : "failed",
          retry_count: 0,
          processed_at: new Date().toISOString(),
          error_message:
            cariResult.errors.length > 0
              ? cariResult.errors.join("; ")
              : null,
        });
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Bilinmeyen hata";
        const duration = Date.now() - startTime;
        results.cari = { synced: 0, errors: [message], duration };

        await supabase.from("webhook_events").insert({
          event_type: "dia_cari_sync",
          payload: { triggered_by: "cron", error: message },
          status: "failed",
          retry_count: 0,
          processed_at: new Date().toISOString(),
          error_message: message,
        });
      }
    }

    // Determine overall success
    const allErrors = Object.values(results).flatMap((r) => r.errors);
    const totalSynced = Object.values(results).reduce(
      (sum, r) => sum + r.synced,
      0
    );

    return NextResponse.json({
      success: allErrors.length === 0,
      message:
        allErrors.length === 0
          ? `Cron senkronizasyonu tamamlandı: ${totalSynced} kayıt`
          : `Senkronizasyon tamamlandı, ${allErrors.length} hata oluştu`,
      data: results,
    });
  } catch (err) {
    console.error("[Cron DIA Sync POST]", err);
    return NextResponse.json(
      { success: false, error: "Sunucu hatası" },
      { status: 500 }
    );
  }
}
