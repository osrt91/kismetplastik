import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { checkAuth, sanitizeSearchInput } from "@/lib/auth";
import type { ContactMessageStatus } from "@/types/database";

const PAGE_SIZE = 15;

export async function GET(request: NextRequest) {
  const authError = checkAuth(request);
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const search = sanitizeSearchInput(searchParams.get("search") ?? "");
  const status = searchParams.get("status") ?? "";

  try {
    const supabase = getSupabaseAdmin();

    let query = supabase
      .from("contact_messages")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    if (search) {
      query = query.or(
        `name.ilike.%${search}%,email.ilike.%${search}%,subject.ilike.%${search}%`
      );
    }

    const validStatuses: ContactMessageStatus[] = ["unread", "read", "replied"];
    if (validStatuses.includes(status as ContactMessageStatus)) {
      query = query.eq("status", status as ContactMessageStatus);
    }

    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      console.error("[Admin Messages GET]", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    const total = count ?? 0;
    const totalPages = Math.ceil(total / PAGE_SIZE);

    return NextResponse.json({
      success: true,
      data: { messages: data ?? [] },
      pagination: { page, pageSize: PAGE_SIZE, total, totalPages },
    });
  } catch (err) {
    console.error("[Admin Messages GET]", err);
    return NextResponse.json(
      { success: false, error: "Sunucu hatası" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const authError = checkAuth(request);
  if (authError) return authError;

  let body: { ids?: string[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Geçersiz JSON" },
      { status: 400 }
    );
  }

  const ids = body.ids;
  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json(
      { success: false, error: "Silinecek mesaj ID'leri gereklidir" },
      { status: 400 }
    );
  }

  try {
    const supabase = getSupabaseAdmin();

    const { error } = await supabase
      .from("contact_messages")
      .delete()
      .in("id", ids);

    if (error) {
      console.error("[Admin Messages DELETE bulk]", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: `${ids.length} mesaj silindi` });
  } catch (err) {
    console.error("[Admin Messages DELETE bulk]", err);
    return NextResponse.json(
      { success: false, error: "Sunucu hatası" },
      { status: 500 }
    );
  }
}
