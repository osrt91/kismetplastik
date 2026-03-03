import { NextRequest, NextResponse } from "next/server";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { checkAuth } from "@/lib/auth";

/**
 * GET /api/admin/blog
 *
 * Lists all blog posts ordered by date descending.
 * Returns an empty array when Supabase is not configured.
 *
 * @returns {{ posts: BlogPost[], source: "static" | "supabase" }}
 * @auth Admin cookie required
 */
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

/**
 * POST /api/admin/blog
 *
 * Creates a new blog post. Content can be a string (split by double newlines) or an array.
 * Requires Supabase to be configured.
 *
 * @body {{ slug: string, title: string, excerpt?: string, content: string | string[], category?: string, date?: string, readTime?: string, featured?: boolean }}
 * @returns {{ post: BlogPost }}
 * @auth Admin cookie required
 */
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
