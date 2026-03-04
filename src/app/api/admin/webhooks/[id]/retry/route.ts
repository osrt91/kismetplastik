import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { checkAuth } from "@/lib/auth";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkAuth(request);
  if (authError) return authError;

  const { id } = await params;

  try {
    const supabase = getSupabaseAdmin();

    // Fetch the current event to verify it exists and get retry_count
    const { data: existing, error: fetchError } = await supabase
      .from("webhook_events")
      .select("id, status, retry_count")
      .eq("id", id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json(
        { success: false, error: "Webhook olayı bulunamadı" },
        { status: 404 }
      );
    }

    if (existing.status !== "failed") {
      return NextResponse.json(
        {
          success: false,
          error: "Yalnızca hatalı (failed) olaylar yeniden denenebilir",
        },
        { status: 400 }
      );
    }

    // Reset status to pending and increment retry_count
    const { data, error } = await supabase
      .from("webhook_events")
      .update({
        status: "pending",
        retry_count: existing.retry_count + 1,
        processed_at: null,
        error_message: null,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[Admin Webhooks Retry POST]", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Webhook olayı yeniden deneme kuyruğuna alındı",
      data,
    });
  } catch (err) {
    console.error("[Admin Webhooks Retry POST]", err);
    return NextResponse.json(
      { success: false, error: "Sunucu hatası" },
      { status: 500 }
    );
  }
}
