import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { checkAuth } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkAuth(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("references")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { success: false, error: "Referans bulunamadı." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json(
      { success: false, error: "Bir hata oluştu." },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkAuth(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    const supabase = getSupabaseAdmin();

    // Fetch existing record first
    const { data: existing, error: fetchError } = await supabase
      .from("references")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json(
        { success: false, error: "Referans bulunamadı." },
        { status: 404 }
      );
    }

    const contentType = request.headers.get("content-type") ?? "";
    const isFormData = contentType.includes("multipart/form-data");

    const updates: Record<string, unknown> = {};
    let newStoragePath: string | null = null;
    let oldStoragePathToDelete: string | null = null;

    if (isFormData) {
      const formData = await request.formData();

      const name = (formData.get("name") as string)?.trim();
      const website = formData.get("website") as string | null;
      const sectorTr = (formData.get("sector_tr") as string)?.trim();
      const sectorEn = (formData.get("sector_en") as string)?.trim();
      const displayOrder = formData.get("display_order");
      const isActive = formData.get("is_active");
      const logoFile = formData.get("logo") as File | null;

      if (name) updates.name = name;
      if (website !== null) updates.website = website?.trim() || null;
      if (sectorTr) updates.sector_tr = sectorTr;
      if (sectorEn) updates.sector_en = sectorEn;
      if (displayOrder !== null) updates.display_order = parseInt(displayOrder as string) || 0;
      if (isActive !== null) updates.is_active = isActive === "true" || isActive === "1";

      if (logoFile && logoFile.size > 0) {
        const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml", "image/gif"];
        if (!allowedTypes.includes(logoFile.type)) {
          return NextResponse.json(
            { success: false, error: "Sadece JPEG, PNG, WebP, SVG ve GIF desteklenir." },
            { status: 400 }
          );
        }

        if (logoFile.size > 5 * 1024 * 1024) {
          return NextResponse.json(
            { success: false, error: "Logo dosyası 5MB'ı aşamaz." },
            { status: 400 }
          );
        }

        const ext = logoFile.name.split(".").pop() || "png";
        newStoragePath = `logos/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const buffer = Buffer.from(await logoFile.arrayBuffer());

        const { error: uploadError } = await supabase.storage
          .from("references")
          .upload(newStoragePath, buffer, { contentType: logoFile.type, upsert: false });

        if (uploadError) {
          console.error("[References Logo Upload PUT]", uploadError);
          return NextResponse.json(
            { success: false, error: "Logo yüklenemedi." },
            { status: 500 }
          );
        }

        updates.logo_url = supabase.storage
          .from("references")
          .getPublicUrl(newStoragePath).data.publicUrl;
        updates.storage_path = newStoragePath;

        // Schedule old logo for deletion if it exists
        if (existing.storage_path) {
          oldStoragePathToDelete = existing.storage_path;
        }
      }
    } else {
      // JSON body
      const body = await request.json();
      const allowed = ["name", "website", "sector_tr", "sector_en", "is_active", "display_order"];
      for (const key of allowed) {
        if (key in body) updates[key] = body[key];
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { success: false, error: "Güncellenecek alan yok." },
        { status: 400 }
      );
    }

    const { data, error: updateError } = await supabase
      .from("references")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      console.error("[References PUT]", updateError);
      // Rollback: remove newly uploaded logo if DB update failed
      if (newStoragePath) {
        await supabase.storage.from("references").remove([newStoragePath]);
      }
      return NextResponse.json(
        { success: false, error: "Güncelleme başarısız." },
        { status: 500 }
      );
    }

    // Clean up old logo after successful DB update
    if (oldStoragePathToDelete) {
      try {
        await supabase.storage.from("references").remove([oldStoragePathToDelete]);
      } catch {
        // Non-fatal — old logo cleanup failure does not block response
      }
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("[References PUT]", err);
    return NextResponse.json(
      { success: false, error: "Bir hata oluştu." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkAuth(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    const supabase = getSupabaseAdmin();

    // Fetch record to get storage_path before deletion
    const { data: existing, error: fetchError } = await supabase
      .from("references")
      .select("storage_path")
      .eq("id", id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json(
        { success: false, error: "Referans bulunamadı." },
        { status: 404 }
      );
    }

    const { error: deleteError } = await supabase
      .from("references")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("[References DELETE]", deleteError);
      return NextResponse.json(
        { success: false, error: "Silme işlemi başarısız." },
        { status: 500 }
      );
    }

    // Remove logo from storage (best-effort)
    if (existing.storage_path) {
      try {
        await supabase.storage.from("references").remove([existing.storage_path]);
      } catch {
        // Non-fatal
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "Bir hata oluştu." },
      { status: 500 }
    );
  }
}
