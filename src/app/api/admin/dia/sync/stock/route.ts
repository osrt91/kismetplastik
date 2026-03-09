import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, requireSupabase } from "@/lib/supabase-admin";
import { checkAuth } from "@/lib/auth";
import { syncStockToSupabase } from "@/lib/dia-services";

export async function POST(request: NextRequest) {
  const authError = checkAuth(request);
  if (authError) return authError;

  const sbError = requireSupabase();
  if (sbError) return sbError;

  try {
    const startTime = Date.now();
    const result = await syncStockToSupabase();
    const duration = Date.now() - startTime;

    // Log result to webhook_events
    const supabase = getSupabaseAdmin();
    await supabase.from("webhook_events").insert({
      event_type: "dia_stock_sync",
      payload: {
        synced: result.synced,
        errors: result.errors,
        duration,
        triggered_by: "manual",
      },
      status: result.errors.length === 0 ? "success" : "failed",
      retry_count: 0,
      processed_at: new Date().toISOString(),
      error_message:
        result.errors.length > 0 ? result.errors.join("; ") : null,
    });

    return NextResponse.json({
      success: result.errors.length === 0,
      data: {
        synced: result.synced,
        errors: result.errors,
        duration,
      },
      message:
        result.errors.length === 0
          ? `${result.synced} stok kaydı senkronize edildi`
          : `Senkronizasyon tamamlandı, ${result.errors.length} hata oluştu`,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Bilinmeyen hata";
    console.error("[DIA Stock Sync POST]", err);

    // Log error to webhook_events
    try {
      const supabase = getSupabaseAdmin();
      await supabase.from("webhook_events").insert({
        event_type: "dia_stock_sync",
        payload: { triggered_by: "manual", error: message },
        status: "failed",
        retry_count: 0,
        processed_at: new Date().toISOString(),
        error_message: message,
      });
    } catch (logErr) {
      console.error("[DIA Stock Sync] Log error:", logErr);
    }

    return NextResponse.json(
      { success: false, error: `Stok senkronizasyon hatası: ${message}` },
      { status: 500 }
    );
  }
}
