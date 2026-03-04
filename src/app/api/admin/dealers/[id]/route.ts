import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabase-admin";
import { checkAuth } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkAuth(request);
  if (authError) return authError;

  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json(
      { success: false, error: "Supabase Admin yapılandırılmamış." },
      { status: 503 }
    );
  }

  const { id } = await params;

  try {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 404 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Bir hata oluştu.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkAuth(request);
  if (authError) return authError;

  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json(
      { success: false, error: "Supabase Admin yapılandırılmamış." },
      { status: 503 }
    );
  }

  const { id } = await params;

  try {
    const body = await request.json();

    const allowedFields: Record<string, unknown> = {};
    if (body.role !== undefined) allowedFields.role = body.role;
    if (body.is_approved !== undefined) allowedFields.is_approved = body.is_approved;
    if (body.is_active !== undefined) allowedFields.is_active = body.is_active;
    if (body.notes !== undefined) allowedFields.notes = body.notes;
    if (body.full_name !== undefined) allowedFields.full_name = body.full_name;
    if (body.phone !== undefined) allowedFields.phone = body.phone;
    if (body.company_name !== undefined) allowedFields.company_name = body.company_name;
    if (body.tax_number !== undefined) allowedFields.tax_number = body.tax_number;
    if (body.tax_office !== undefined) allowedFields.tax_office = body.tax_office;
    if (body.company_address !== undefined) allowedFields.company_address = body.company_address;
    if (body.city !== undefined) allowedFields.city = body.city;
    if (body.district !== undefined) allowedFields.district = body.district;

    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("profiles")
      .update(allowedFields)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Bir hata oluştu.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
