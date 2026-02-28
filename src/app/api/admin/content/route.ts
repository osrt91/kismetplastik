import { NextRequest, NextResponse } from "next/server";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { checkAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const authError = checkAuth(request);
  if (authError) return authError;

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ content: [], source: "static" });
  }

  const { data, error } = await getSupabase()
    .from("site_content")
    .select("*");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ content: data, source: "supabase" });
}

export async function PATCH(request: NextRequest) {
  const authError = checkAuth(request);
  if (authError) return authError;

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase yapılandırılmamış" },
      { status: 503 }
    );
  }

  const body = await request.json();

  if (!body.page_key || !body.content) {
    return NextResponse.json(
      { error: "page_key ve content alanları zorunludur" },
      { status: 400 }
    );
  }

  const { data, error } = await getSupabase()
    .from("site_content")
    .upsert(
      { page_key: body.page_key, content: body.content, updated_at: new Date().toISOString() },
      { onConflict: "page_key" }
    )
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ content: data });
}
