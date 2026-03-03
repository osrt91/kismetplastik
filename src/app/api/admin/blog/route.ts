import { NextRequest, NextResponse } from "next/server";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { checkAuth } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { blogPostSchema, getZodErrorMessage } from "@/lib/validations";

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

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { ok: allowed } = rateLimit(`admin-blog:${ip}`, { limit: 30, windowMs: 60_000 });
  if (!allowed) {
    return NextResponse.json({ error: "Çok fazla istek." }, { status: 429 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase yapılandırılmamış" },
      { status: 503 }
    );
  }

  const raw = await request.json();
  const parsed = blogPostSchema.safeParse(raw);

  if (!parsed.success) {
    return NextResponse.json({ error: getZodErrorMessage(parsed.error) }, { status: 400 });
  }

  const body = parsed.data;

  const contentArray = typeof body.content === "string"
    ? body.content.split("\n\n").filter(Boolean)
    : body.content || [];

  const { data, error } = await getSupabase()
    .from("blog_posts")
    .insert({
      slug: body.slug,
      title: body.title,
      excerpt: body.excerpt,
      content: contentArray,
      category: body.category,
      date: body.date || new Date().toISOString().split("T")[0],
      read_time: body.readTime,
      featured: body.featured,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ post: data }, { status: 201 });
}
