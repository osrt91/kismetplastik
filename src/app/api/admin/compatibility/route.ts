import { NextRequest, NextResponse } from "next/server";
import { checkAuth } from "@/lib/auth";
import { getSupabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const authError = checkAuth(request);
  if (authError) return authError;

  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("product_compatibility")
      .select("*")
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
    const {
      source_stock_kodu,
      source_category,
      compatible_stock_kodu,
      compatible_category,
      compatibility_type = "fits",
      notes = null,
    } = body;

    if (!source_stock_kodu || !source_category || !compatible_stock_kodu || !compatible_category) {
      return NextResponse.json(
        { success: false, error: "Tum alanlar zorunludur" },
        { status: 400 }
      );
    }

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("product_compatibility")
      .insert({
        source_stock_kodu,
        source_category,
        compatible_stock_kodu,
        compatible_category,
        compatibility_type,
        notes,
      })
      .select()
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
