import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabase-admin";
import { checkAuth } from "@/lib/auth";

export async function PUT(request: NextRequest) {
  const authError = checkAuth(request);
  if (authError) return authError;

  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json(
      { success: false, error: "Supabase admin yapılandırılmamış." },
      { status: 503 }
    );
  }

  const body = await request.json();
  const items: { id: string; display_order: number }[] = body.items;

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json(
      { success: false, error: "Geçerli items dizisi gerekli." },
      { status: 400 }
    );
  }

  const supabase = getSupabaseAdmin();
  const errors: string[] = [];

  await Promise.all(
    items.map(async ({ id, display_order }) => {
      const { error } = await supabase
        .from("gallery_images")
        .update({ display_order })
        .eq("id", id);
      if (error) {
        errors.push(`${id}: ${error.message}`);
      }
    })
  );

  if (errors.length > 0) {
    console.error("[Admin Gallery Reorder]", errors);
    return NextResponse.json(
      { success: false, error: "Bazı kayıtlar güncellenemedi.", details: errors },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, message: `${items.length} görsel sırası güncellendi.` });
}
