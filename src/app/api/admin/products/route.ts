import { NextRequest, NextResponse } from "next/server";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { checkAuth, sanitizeSearchInput } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { products, categories } from "@/data/products";
import { productSchema, getZodErrorMessage } from "@/lib/validations";

export async function GET(request: NextRequest) {
  const authError = checkAuth(request);
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search");

  if (!isSupabaseConfigured()) {
    let filtered = [...products];
    if (category && category !== "all") {
      filtered = filtered.filter((p) => p.category === category);
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (p) => p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q)
      );
    }
    return NextResponse.json({
      products: filtered,
      categories,
      source: "static",
    });
  }

  const supabase = getSupabase();
  let query = supabase.from("products").select("*").order("created_at", { ascending: false });
  if (category && category !== "all") query = query.eq("category_slug", category);
  if (search) {
    const safe = sanitizeSearchInput(search);
    query = query.or(`name.ilike.%${safe}%,slug.ilike.%${safe}%`);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: cats } = await getSupabase().from("categories").select("*").order("name");

  return NextResponse.json({ products: data, categories: cats, source: "supabase" });
}

export async function POST(request: NextRequest) {
  const authError = checkAuth(request);
  if (authError) return authError;

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { ok: allowed } = rateLimit(`admin-products:${ip}`, { limit: 30, windowMs: 60_000 });
  if (!allowed) {
    return NextResponse.json({ error: "Çok fazla istek." }, { status: 429 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase yapılandırılmamış. .env.local dosyasına NEXT_PUBLIC_SUPABASE_URL ve NEXT_PUBLIC_SUPABASE_ANON_KEY ekleyin." },
      { status: 503 }
    );
  }

  const raw = await request.json();
  const parsed = productSchema.safeParse(raw);

  if (!parsed.success) {
    return NextResponse.json({ error: getZodErrorMessage(parsed.error) }, { status: 400 });
  }

  const body = parsed.data;

  const { data, error } = await getSupabase()
    .from("products")
    .insert({
      slug: body.slug,
      name: body.name,
      category_slug: body.category,
      description: body.description,
      short_description: body.shortDescription,
      volume: body.volume || null,
      weight: body.weight || null,
      neck_diameter: body.neckDiameter || null,
      height: body.height || null,
      diameter: body.diameter || null,
      material: body.material,
      colors: body.colors,
      model: body.model || null,
      shape: body.shape || null,
      min_order: body.minOrder,
      in_stock: body.inStock,
      featured: body.featured,
      specs: body.specs,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ product: data }, { status: 201 });
}
