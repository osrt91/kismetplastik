import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { checkAuth } from "@/lib/auth";
import type { PreOrderStatus } from "@/types/database";

const VALID_STATUSES: PreOrderStatus[] = [
  "pending",
  "confirmed",
  "production",
  "ready",
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

  try {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("pre_orders")
      .select("*, profiles(full_name, email, company_name)")
      .eq("id", id)
      .single();

    if (error) {
      console.error("[Admin PreOrders GET id]", error);
      return NextResponse.json(
        { success: false, error: "Ön sipariş bulunamadı" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("[Admin PreOrders GET id]", err);
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

  const { status, admin_notes } = body as {
    status?: string;
    admin_notes?: string;
  };

  const updatePayload: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (status !== undefined) {
    if (!VALID_STATUSES.includes(status as PreOrderStatus)) {
      return NextResponse.json(
        { success: false, error: "Geçersiz durum değeri" },
        { status: 400 }
      );
    }
    updatePayload.status = status as PreOrderStatus;
  }

  if (admin_notes !== undefined) {
    updatePayload.admin_notes = admin_notes;
  }

  try {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("pre_orders")
      .update(updatePayload)
      .eq("id", id)
      .select("*, profiles(full_name, email, company_name)")
      .single();

    if (error) {
      console.error("[Admin PreOrders PUT]", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("[Admin PreOrders PUT]", err);
    return NextResponse.json(
      { success: false, error: "Sunucu hatası" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkAuth(request);
  if (authError) return authError;

  const { id } = await params;

  try {
    const supabase = getSupabaseAdmin();

    const { error } = await supabase
      .from("pre_orders")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("[Admin PreOrders DELETE]", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Admin PreOrders DELETE]", err);
    return NextResponse.json(
      { success: false, error: "Sunucu hatası" },
      { status: 500 }
    );
  }
}
