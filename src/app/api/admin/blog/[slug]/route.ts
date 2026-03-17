import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, requireSupabase } from "@/lib/supabase-admin";
import { checkAuth } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const authError = checkAuth(request);
  if (authError) return authError;

  const sbError = requireSupabase();
  if (sbError) return sbError;

  const { slug } = await params;

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: "Yazı bulunamadı" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("[Admin Blog GET slug]", err);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const authError = checkAuth(request);
  if (authError) return authError;

  const sbError = requireSupabase();
  if (sbError) return sbError;

  const { slug } = await params;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Geçersiz JSON" }, { status: 400 });
  }

  const { title, excerpt, content, content_html, category, tags, image_url, featured, status, date, read_time } = body as {
    title?: string;
    excerpt?: string;
    content?: string | string[];
    content_html?: string;
    category?: string;
    tags?: string | string[];
    image_url?: string | null;
    featured?: boolean;
    status?: string;
    date?: string;
    read_time?: string;
  };

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

  const updatePayload: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (title !== undefined) updatePayload.title = title.trim();
  if (excerpt !== undefined) updatePayload.excerpt = excerpt.trim();
  if (content !== undefined) updatePayload.content = contentArray;
  if (content_html !== undefined) updatePayload.content_html = content_html;
  if (category !== undefined) updatePayload.category = category.trim();
  if (tags !== undefined) updatePayload.tags = tagsArray;
  if (image_url !== undefined) updatePayload.image_url = image_url;
  if (featured !== undefined) updatePayload.featured = featured;
  if (status !== undefined) updatePayload.status = status === "published" ? "published" : "draft";
  if (date !== undefined) updatePayload.date = date;
  if (read_time !== undefined) updatePayload.read_time = read_time.trim();

  try {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("blog_posts")
      .update(updatePayload)
      .eq("slug", slug)
      .select()
      .single();

    if (error) {
      console.error("[Admin Blog PUT]", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("[Admin Blog PUT]", err);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const authError = checkAuth(request);
  if (authError) return authError;

  const sbError = requireSupabase();
  if (sbError) return sbError;

  const { slug } = await params;

  try {
    const supabase = getSupabaseAdmin();

    const { error } = await supabase
      .from("blog_posts")
      .delete()
      .eq("slug", slug);

    if (error) {
      console.error("[Admin Blog DELETE]", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Admin Blog DELETE]", err);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}
