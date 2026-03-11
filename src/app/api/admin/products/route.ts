import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, requireSupabase } from "@/lib/supabase-admin";
import { checkAuth, sanitizeSearchInput } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  const authError = checkAuth(request);
  if (authError) return authError;

  const sbError = requireSupabase();
  if (sbError) return sbError;

  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(100, parseInt(searchParams.get("limit") ?? "20", 10));
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sort") ?? "created_at";
    const sortDir = searchParams.get("dir") === "asc";

    const supabase = getSupabaseAdmin();

    // Count query
    let countQuery = supabase.from("products").select("id", { count: "exact", head: true });
    if (category && category !== "all") countQuery = countQuery.eq("category_slug", category);
    if (search) {
      const safe = sanitizeSearchInput(search);
      countQuery = countQuery.or(`name.ilike.%${safe}%,slug.ilike.%${safe}%`);
    }
    const { count, error: countError } = await countQuery;
    if (countError) console.error("[Admin Products GET count]", countError);

    // Data query
    const allowedSorts = ["name", "created_at", "category_slug", "updated_at"];
    const orderCol = allowedSorts.includes(sortBy) ? sortBy : "created_at";

    let query = supabase
      .from("products")
      .select("*")
      .order(orderCol, { ascending: sortDir })
      .range((page - 1) * limit, page * limit - 1);

    if (category && category !== "all") query = query.eq("category_slug", category);
    if (search) {
      const safe = sanitizeSearchInput(search);
      query = query.or(`name.ilike.%${safe}%,slug.ilike.%${safe}%`);
    }

    const { data, error } = await query;
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });

    const { data: cats } = await supabase.from("categories").select("*").order("name");

    return NextResponse.json({
      success: true,
      data: { products: data ?? [], categories: cats ?? [] },
      pagination: { page, limit, total: count ?? 0 },
    });
  } catch (e) {
    console.error("[Admin Products GET]", e);
    return NextResponse.json(
      { success: false, error: "Sunucu hatası" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const authError = checkAuth(request);
  if (authError) return authError;

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { ok: allowed } = rateLimit(`admin:products:${ip}`, { limit: 60, windowMs: 60_000 });
  if (!allowed) {
    return NextResponse.json({ success: false, error: "Çok fazla istek" }, { status: 429 });
  }

  const sbError = requireSupabase();
  if (sbError) return sbError;

  try {
    const body = await request.json();

    if (!body.name || !body.slug || !body.category_slug) {
      return NextResponse.json(
        { success: false, error: "name, slug ve category_slug zorunludur" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("products")
      .insert({
        slug: body.slug,
        name: body.name,
        category_slug: body.category_slug,
        description: body.description ?? "",
        short_description: body.short_description ?? "",
        image_url: body.image_url ?? null,
        volume: body.volume ?? null,
        weight: body.weight ?? null,
        neck_diameter: body.neck_diameter ?? null,
        height: body.height ?? null,
        diameter: body.diameter ?? null,
        material: body.material ?? "PET",
        colors: body.colors ?? [],
        color_codes: body.color_codes ?? null,
        model: body.model ?? null,
        shape: body.shape ?? null,
        surface_type: body.surface_type ?? null,
        compatible_caps: body.compatible_caps ?? null,
        min_order: body.min_order ?? 10000,
        in_stock: body.in_stock ?? true,
        featured: body.featured ?? false,
        specs: body.specs ?? [],
      })
      .select()
      .single();

    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (e) {
    console.error("[Admin Products POST]", e);
    return NextResponse.json(
      { success: false, error: "Sunucu hatası" },
      { status: 500 }
    );
  }
}
