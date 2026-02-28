import { NextRequest, NextResponse } from "next/server";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { checkAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const authError = checkAuth(request);
  if (authError) return authError;

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ posts: [], source: "static" });
  }

  const { data, error } = await getSupabase()
    .from("blog_posts")
    .select("*")
    .order("date", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ posts: data, source: "supabase" });
}

export async function POST(request: NextRequest) {
  const authError = checkAuth(request);
  if (authError) return authError;

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase yapılandırılmamış" },
      { status: 503 }
    );
  }

  const body = await request.json();

  const contentArray = typeof body.content === "string"
    ? body.content.split("\n\n").filter(Boolean)
    : body.content || [];

  const { data, error } = await getSupabase()
    .from("blog_posts")
    .insert({
      slug: body.slug,
      title: body.title,
      excerpt: body.excerpt || "",
      content: contentArray,
      category: body.category || "Bilgi",
      date: body.date || new Date().toISOString().split("T")[0],
      read_time: body.readTime || "5 dk",
      featured: body.featured ?? false,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ post: data }, { status: 201 });
}
