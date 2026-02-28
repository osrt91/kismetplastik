import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { checkAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const authError = checkAuth(request);
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  const supabase = getSupabase();
  let query = supabase
    .from("profiles")
    .select("*")
    .eq("role", "dealer")
    .order("created_at", { ascending: false });

  if (status === "pending") {
    query = query.eq("is_approved", false);
  } else if (status === "approved") {
    query = query.eq("is_approved", true);
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ dealers: data });
}

export async function PATCH(request: NextRequest) {
  const authError = checkAuth(request);
  if (authError) return authError;

  const body = await request.json();
  const { id, is_approved } = body;

  if (!id || typeof is_approved !== "boolean") {
    return NextResponse.json(
      { error: "id ve is_approved alanları gereklidir." },
      { status: 400 }
    );
  }

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("profiles")
    .update({ is_approved })
    .eq("id", id)
    .eq("role", "dealer")
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ dealer: data });
}

export async function DELETE(request: NextRequest) {
  const authError = checkAuth(request);
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "id gereklidir." }, { status: 400 });
  }

  const supabase = getSupabase();
  const { error } = await supabase
    .from("profiles")
    .delete()
    .eq("id", id)
    .eq("role", "dealer");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
