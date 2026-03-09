import { NextRequest, NextResponse } from "next/server";
import { checkAuth } from "@/lib/auth";
import { getSupabase } from "@/lib/supabase";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const authError = checkAuth(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    const body = await request.json();
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from("product_compatibility")
      .update(body)
      .eq("id", id)
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

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const authError = checkAuth(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    const supabase = getSupabase();

    const { error } = await supabase
      .from("product_compatibility")
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
