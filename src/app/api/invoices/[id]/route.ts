import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await supabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Yetkilendirme gerekli." },
        { status: 401 }
      );
    }

    const { id } = await params;

    const { data: invoice, error } = await supabase
      .from("invoices")
      .select("*")
      .eq("id", id)
      .eq("profile_id", user.id)
      .single();

    if (error || !invoice) {
      return NextResponse.json(
        { success: false, error: "Fatura bulunamadı." },
        { status: 404 }
      );
    }

    // Fetch related order and order items
    const { data: order } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("id", invoice.order_id)
      .single();

    return NextResponse.json({
      success: true,
      data: {
        ...invoice,
        order: order || null,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Bir hata oluştu." },
      { status: 500 }
    );
  }
}
