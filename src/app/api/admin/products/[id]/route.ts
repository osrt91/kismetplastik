import { NextRequest, NextResponse } from "next/server";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { checkAuth } from "@/lib/auth";
import { products } from "@/data/products";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkAuth(request);
  if (authError) return authError;

  const { id } = await params;

  if (!isSupabaseConfigured()) {
    const product = products.find((p) => p.id === id);
    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ product, source: "static" });
  }

  const { data, error } = await getSupabase()
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json({ product: data, source: "supabase" });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkAuth(request);
  if (authError) return authError;

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase yapılandırılmamış" },
      { status: 503 }
    );
  }

  const { id } = await params;
  const body = await request.json();

  const { data, error } = await getSupabase()
    .from("products")
    .update({
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
      specs: body.specs || [],
    })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ product: data });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkAuth(request);
  if (authError) return authError;

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase yapılandırılmamış" },
      { status: 503 }
    );
  }

  const { id } = await params;
  const { error } = await getSupabase().from("products").delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
