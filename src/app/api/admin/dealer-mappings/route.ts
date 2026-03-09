import { NextRequest, NextResponse } from "next/server";
import { checkAuth } from "@/lib/auth";
import { getSupabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const authError = checkAuth(request);
  if (authError) return authError;

  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("dealer_cari_mappings")
      .select("*, profiles(email, full_name, company_name, phone)")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: data ?? [] });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Bilinmeyen hata";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authError = checkAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { profile_id, dia_cari_kodu, dia_cari_unvan, price_type, can_direct_order } = body;

    if (!profile_id || !dia_cari_kodu) {
      return NextResponse.json(
        { success: false, error: "profile_id ve dia_cari_kodu zorunlu" },
        { status: 400 }
      );
    }

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("dealer_cari_mappings")
      .insert({
        profile_id,
        dia_cari_kodu,
        dia_cari_unvan: dia_cari_unvan ?? null,
        price_type: price_type ?? "standard",
        can_direct_order: can_direct_order ?? false,
        is_approved: true,
      })
      .select("*, profiles(email, full_name, company_name, phone)")
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Bilinmeyen hata";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const authError = checkAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "id zorunlu" }, { status: 400 });
    }

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("dealer_cari_mappings")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select("*, profiles(email, full_name, company_name, phone)")
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Bilinmeyen hata";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const authError = checkAuth(request);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "id zorunlu" }, { status: 400 });
    }

    const supabase = getSupabase();
    const { error } = await supabase
      .from("dealer_cari_mappings")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Bilinmeyen hata";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
