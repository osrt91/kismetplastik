import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { checkAuth } from "@/lib/auth";
import type { QuoteStatus } from "@/types/database";

const VALID_STATUSES: QuoteStatus[] = [
  "pending",
  "reviewing",
  "quoted",
  "accepted",
  "rejected",
];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkAuth(request);
  if (authError) return authError;

  const { id } = await params;

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("quote_requests")
      .select("*, quote_items(*)")
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: "Teklif bulunamadı" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("[Admin Quotes GET id]", err);
    return NextResponse.json(
      { success: false, error: "Sunucu hatası" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkAuth(request);
  if (authError) return authError;

  const { id } = await params;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Geçersiz JSON" },
      { status: 400 }
    );
  }

  const { status, admin_notes, response_message, total_amount, valid_until } =
    body as {
      status?: string;
      admin_notes?: string | null;
      response_message?: string | null;
      total_amount?: number | null;
      valid_until?: string | null;
    };

  const updatePayload: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (
    status !== undefined &&
    VALID_STATUSES.includes(status as QuoteStatus)
  ) {
    updatePayload.status = status;
  }
  if (admin_notes !== undefined) updatePayload.admin_notes = admin_notes;
  if (response_message !== undefined)
    updatePayload.response_message = response_message;
  if (total_amount !== undefined) updatePayload.total_amount = total_amount;
  if (valid_until !== undefined) updatePayload.valid_until = valid_until;

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("quote_requests")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[Admin Quotes PUT]", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("[Admin Quotes PUT]", err);
    return NextResponse.json(
      { success: false, error: "Sunucu hatası" },
      { status: 500 }
    );
  }
}
