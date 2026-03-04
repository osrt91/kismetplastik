import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { checkAuth } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkAuth(request);
  if (authError) return authError;

  const { id } = await params;
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 404 });
  return NextResponse.json({ success: true, data });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkAuth(request);
  if (authError) return authError;

  const { id } = await params;
  const body = await request.json();
  const supabase = getSupabaseAdmin();

  const updatePayload: Record<string, unknown> = {};
  const allowed = [
    "slug", "name", "category_slug", "description", "short_description",
    "image_url", "volume", "weight", "neck_diameter", "height", "diameter",
    "material", "colors", "color_codes", "model", "shape", "surface_type",
    "compatible_caps", "min_order", "in_stock", "featured", "specs",
  ];
  for (const key of allowed) {
    if (key in body) updatePayload[key] = body[key];
  }

  const { data, error } = await supabase
    .from("products")
    .update(updatePayload)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, data });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkAuth(request);
  if (authError) return authError;

  const { id } = await params;
  const supabase = getSupabaseAdmin();

  // Fetch existing product to get image_url / storage_path before deleting
  const { data: product } = await supabase
    .from("products")
    .select("image_url")
    .eq("id", id)
    .single();

  // Delete the DB row
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });

  // Best-effort: remove image from storage if it was uploaded to our bucket
  if (product?.image_url) {
    try {
      // Extract storage path from public URL
      // URL pattern: .../storage/v1/object/public/products/<path>
      const marker = "/object/public/products/";
      const idx = product.image_url.indexOf(marker);
      if (idx !== -1) {
        const storagePath = product.image_url.slice(idx + marker.length);
        await supabase.storage.from("products").remove([storagePath]);
      }
    } catch {
      // Non-fatal — image cleanup failure does not block response
    }
  }

  return NextResponse.json({ success: true });
}
