import { NextResponse } from "next/server";
import { getSupabaseSafe } from "@/lib/supabase";
import { categories as staticCategories } from "@/data/products";

/**
 * Public categories API — no auth required.
 * Returns category list from Supabase, falling back to static data.
 */
export async function GET() {
  try {
    const supabase = getSupabaseSafe();

    if (supabase) {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (!error && data) {
        return NextResponse.json({
          success: true,
          data: data,
        }, {
          headers: {
            "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
          },
        });
      }
    }

    // Fallback to static data
    return NextResponse.json({
      success: true,
      data: staticCategories,
    }, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (e) {
    console.error("[Categories GET]", e);
    return NextResponse.json(
      { success: false, error: "Sunucu hatasi" },
      { status: 500 }
    );
  }
}
