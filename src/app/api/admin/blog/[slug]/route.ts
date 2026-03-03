import { NextRequest, NextResponse } from "next/server";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { checkAuth } from "@/lib/auth";

/**
 * GET /api/admin/blog/[slug]
 *
 * Retrieves a single blog post by its slug. Requires Supabase to be configured.
 *
 * @returns {{ post: BlogPost }}
 * @auth Admin cookie required
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const authError = checkAuth(request);
  if (authError) return authError;

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase yapılandırılmamış" }, { status: 503 });
  }

  const { slug } = await params;
  const { data, error } = await getSupabase()
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json({ post: data });
}

/**
 * PUT /api/admin/blog/[slug]
 *
 * Updates an existing blog post by its slug. Content can be a string or an array.
 * Requires Supabase to be configured.
 *
 * @body {{ title: string, excerpt: string, content: string | string[], category: string, readTime: string, featured: boolean }}
 * @returns {{ post: BlogPost }}
 * @auth Admin cookie required
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const authError = checkAuth(request);
  if (authError) return authError;

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase yapılandırılmamış" }, { status: 503 });
  }

  const { slug } = await params;
  const body = await request.json();

  const contentArray = typeof body.content === "string"
    ? body.content.split("\n\n").filter(Boolean)
    : body.content || [];

  const { data, error } = await getSupabase()
    .from("blog_posts")
    .update({
      title: body.title,
      excerpt: body.excerpt,
      content: contentArray,
      category: body.category,
      read_time: body.readTime,
      featured: body.featured,
    })
    .eq("slug", slug)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ post: data });
}

/**
 * DELETE /api/admin/blog/[slug]
 *
 * Deletes a blog post by its slug. Requires Supabase to be configured.
 *
 * @returns {{ success: boolean }}
 * @auth Admin cookie required
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const authError = checkAuth(request);
  if (authError) return authError;

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase yapılandırılmamış" }, { status: 503 });
  }

  const { slug } = await params;
  const { error } = await getSupabase().from("blog_posts").delete().eq("slug", slug);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
