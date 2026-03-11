import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, requireSupabase } from "@/lib/supabase-admin";
import { checkAuth } from "@/lib/auth";
import { sanitizeSearchInput } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";

const PAGE_SIZE = 12;

export async function GET(request: NextRequest) {
  const authError = checkAuth(request);
  if (authError) return authError;

  const sbError = requireSupabase();
  if (sbError) return sbError;

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const search = sanitizeSearchInput(searchParams.get("search") ?? "");
  const category = searchParams.get("category") ?? "";
  const status = searchParams.get("status") ?? "";

  try {
    const supabase = getSupabaseAdmin();

    let query = supabase
      .from("blog_posts")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    if (search) {
      query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`);
    }

    if (category) {
      query = query.eq("category", category);
    }

    if (status === "draft" || status === "published") {
      query = query.eq("status", status);
    }

    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      console.error("[Admin Blog GET]", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    const total = count ?? 0;
    const totalPages = Math.ceil(total / PAGE_SIZE);

    return NextResponse.json({
      success: true,
      data: { posts: data ?? [] },
      pagination: { page, pageSize: PAGE_SIZE, total, totalPages },
    });
  } catch (err) {
    console.error("[Admin Blog GET]", err);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authError = checkAuth(request);
  if (authError) return authError;

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { ok: allowed } = rateLimit(`admin:blog:${ip}`, { limit: 60, windowMs: 60_000 });
  if (!allowed) {
    return NextResponse.json({ success: false, error: "Çok fazla istek" }, { status: 429 });
  }

  const sbError = requireSupabase();
  if (sbError) return sbError;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Geçersiz JSON" }, { status: 400 });
  }

  const { title, slug, excerpt, content, category, tags, image_url, featured, status, date, read_time } = body as {
    title?: string;
    slug?: string;
    excerpt?: string;
    content?: string | string[];
    category?: string;
    tags?: string | string[];
    image_url?: string;
    featured?: boolean;
    status?: string;
    date?: string;
    read_time?: string;
  };

  if (!title?.trim()) {
    return NextResponse.json({ success: false, error: "Başlık zorunludur" }, { status: 400 });
  }
  if (!slug?.trim()) {
    return NextResponse.json({ success: false, error: "Slug zorunludur" }, { status: 400 });
  }

  const contentArray =
    typeof content === "string"
      ? content.split("\n\n").filter(Boolean)
      : Array.isArray(content)
      ? content
      : [];

  const tagsArray =
    typeof tags === "string"
      ? tags.split(",").map((t) => t.trim()).filter(Boolean)
      : Array.isArray(tags)
      ? tags
      : [];

  const postStatus = status === "published" ? "published" : "draft";

  try {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("blog_posts")
      .insert({
        slug: slug.trim(),
        title: title.trim(),
        excerpt: (excerpt ?? "").trim(),
        content: contentArray,
        image_url: image_url ?? null,
        category: (category ?? "Bilgi").trim(),
        tags: tagsArray,
        date: (date as string) || new Date().toISOString().split("T")[0],
        read_time: (read_time ?? "5 dk").trim(),
        status: postStatus,
        featured: featured ?? false,
      })
      .select()
      .single();

    if (error) {
      console.error("[Admin Blog POST]", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err) {
    console.error("[Admin Blog POST]", err);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}
