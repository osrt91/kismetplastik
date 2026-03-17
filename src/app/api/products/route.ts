import { NextRequest, NextResponse } from "next/server";
import { getSupabaseSafe } from "@/lib/supabase";
import { sanitizeSearchInput } from "@/lib/auth";
import { products as staticProducts, categories as staticCategories } from "@/data/products";

/**
 * Public products API — no auth required.
 * Returns products & categories from Supabase, falling back to static data.
 *
 * Query params:
 *   ?search=  — filter by name/slug
 *   ?category= — filter by category slug
 *   ?featured=true — only featured products
 *   ?ids=id1,id2 — specific product IDs
 *   ?limit=  — max results (default 100)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const idsParam = searchParams.get("ids");
    const limit = Math.min(200, parseInt(searchParams.get("limit") ?? "100", 10));

    const supabase = getSupabaseSafe();

    // Try Supabase first
    if (supabase) {
      let query = supabase.from("products").select("*").limit(limit);

      if (search) {
        const safe = sanitizeSearchInput(search);
        if (safe) query = query.or(`name.ilike.%${safe}%,slug.ilike.%${safe}%`);
      }
      if (category && category !== "all") {
        query = query.eq("category_slug", category);
      }
      if (featured === "true") {
        query = query.eq("featured", true);
      }
      if (idsParam) {
        const ids = idsParam.split(",").map((s) => s.trim()).filter(Boolean);
        if (ids.length > 0) query = query.in("id", ids);
      }

      query = query.order("name", { ascending: true });

      const { data: dbProducts, error } = await query;

      if (!error && dbProducts) {
        const { data: dbCategories } = await supabase
          .from("categories")
          .select("*")
          .order("name");

        return NextResponse.json({
          success: true,
          data: {
            products: dbProducts,
            categories: dbCategories ?? [],
          },
        }, {
          headers: {
            "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
          },
        });
      }
    }

    // Fallback to static data
    let filteredProducts = [...staticProducts];

    if (search) {
      const q = search.toLowerCase();
      filteredProducts = filteredProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.slug.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q)
      );
    }
    if (category && category !== "all") {
      filteredProducts = filteredProducts.filter((p) => p.category === category);
    }
    if (featured === "true") {
      filteredProducts = filteredProducts.filter((p) => p.featured);
    }
    if (idsParam) {
      const ids = new Set(idsParam.split(",").map((s) => s.trim()));
      filteredProducts = filteredProducts.filter((p) => ids.has(p.id));
    }

    return NextResponse.json({
      success: true,
      data: {
        products: filteredProducts.slice(0, limit),
        categories: staticCategories,
      },
    }, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (e) {
    console.error("[Products GET]", e);
    return NextResponse.json(
      { success: false, error: "Sunucu hatasi" },
      { status: 500 }
    );
  }
}
