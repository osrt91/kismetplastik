import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { checkAuth } from "@/lib/auth";
import type { OrderStatus } from "@/types/database";

const VALID_STATUSES: OrderStatus[] = [
  "pending",
  "confirmed",
  "production",
  "shipping",
  "delivered",
  "cancelled",
];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkAuth(request);
  if (authError) return authError;

  const { id } = await params;
  const supabase = getSupabaseAdmin();

  try {
    const { data, error } = await supabase
      .from("orders")
      .select(
        "*, order_items(*), profiles(full_name, email, phone, company_name), order_status_history(*)"
      )
      .eq("id", id)
      .order("created_at", { ascending: true, referencedTable: "order_status_history" })
      .single();

    if (error) {
      console.error("[Admin Orders GET/:id]", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("[Admin Orders GET/:id]", err);
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

  const supabase = getSupabaseAdmin();

  // Fetch the current order to detect status change
  const { data: currentOrder, error: fetchError } = await supabase
    .from("orders")
    .select("id, status")
    .eq("id", id)
    .single();

  if (fetchError || !currentOrder) {
    return NextResponse.json(
      { success: false, error: "Sipariş bulunamadı" },
      { status: 404 }
    );
  }

  const updatePayload: Record<string, unknown> = {};

  // Only allow specific fields to be updated
  if (
    "status" in body &&
    typeof body.status === "string" &&
    VALID_STATUSES.includes(body.status as OrderStatus)
  ) {
    updatePayload.status = body.status;
  }

  if ("tracking_number" in body) {
    const tn = body.tracking_number;
    updatePayload.tracking_number =
      typeof tn === "string" && tn.trim() ? tn.trim() : null;
  }

  if ("admin_notes" in body) {
    const an = body.admin_notes;
    updatePayload.admin_notes =
      typeof an === "string" && an.trim() ? an.trim() : null;
  }

  if (Object.keys(updatePayload).length === 0) {
    return NextResponse.json(
      { success: false, error: "Güncellenecek alan bulunamadı" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("orders")
    .update(updatePayload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("[Admin Orders PUT]", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }

  // Insert status history record if status changed
  if (
    updatePayload.status &&
    updatePayload.status !== currentOrder.status
  ) {
    const note = (body.status_note as string) ?? null;
    await supabase.from("order_status_history").insert({
      order_id: id,
      old_status: currentOrder.status as OrderStatus,
      new_status: updatePayload.status as OrderStatus,
      note: note,
    });
  }

  return NextResponse.json({ success: true, data });
}
