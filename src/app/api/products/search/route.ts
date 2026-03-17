import { NextRequest, NextResponse } from "next/server";
import { getSupabaseSafe } from "@/lib/supabase";
import { sanitizeSearchInput } from "@/lib/auth";
import { products as staticProducts, categories as staticCategories } from "@/data/products";

/**
 * Lightweight search API for autocomplete — no auth required.
 * Returns minimal product/category data matching a query.
 *
 * Query params:
 *   ?q= — search term (min 1 char)
 *   ?limit= — max results (default 8)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rawQuery = searchParams.get("q");
    const limit = Math.min(20, parseInt(searchParams.get("limit") ?? "8", 10));

    if (!rawQuery || rawQuery.trim().length < 1) {
      return NextResponse.json({ success: true, data: { products: [], categories: [] } });
    }

    const q = rawQuery.trim().toLowerCase();
    const supabase = getSupabaseSafe();

    if (supabase) {
      const safe = sanitizeSearchInput(rawQuery);
      if (safe) {
        const { data: dbProducts } = await supabase
          .from("products")
          .select("id, slug, name, category_slug, short_description")
          .or(`name.ilike.%${safe}%,slug.ilike.%${safe}%,id.ilike.%${safe}%`)
          .limit(limit);

        const { data: dbCategories } = await supabase
          .from("categories")
          .select("slug, name, description")
          .or(`name.ilike.%${safe}%,description.ilike.%${safe}%`)
          .limit(4);

        if (dbProducts) {
          return NextResponse.json({
            success: true,
            data: {
              products: dbProducts,
              categories: dbCategories ?? [],
            },
          }, {
            headers: {
              "Cache-Control": "public, s-maxage=30, stale-while-revalidate=120",
            },
          });
        }
      }
    }

    // Fallback to static data
    const matchedCategories = staticCategories.filter(
      (cat) =>
        cat.name.toLowerCase().includes(q) ||
        cat.description.toLowerCase().includes(q)
    ).slice(0, 4);

    const matchedProducts = staticProducts
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.slug.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      )
      .slice(0, limit)
      .map((p) => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        category_slug: p.category,
        short_description: p.shortDescription,
      }));

    return NextResponse.json({
      success: true,
      data: {
        products: matchedProducts,
        categories: matchedCategories,
      },
    }, {
      headers: {
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=120",
      },
    });
  } catch (e) {
    console.error("[Products Search GET]", e);
    return NextResponse.json(
      { success: false, error: "Sunucu hatasi" },
      { status: 500 }
    );
  }
}
