import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { resources } from "@/data/resources";

interface DownloadRequest {
  name: string;
  email: string;
  company?: string;
  resourceId: string;
}

function validate(data: DownloadRequest): string | null {
  if (!data.name?.trim()) return "Ad Soyad alanı zorunludur.";
  if (data.name.trim().length < 2) return "Ad Soyad en az 2 karakter olmalıdır.";
  if (!data.email?.trim()) return "E-posta alanı zorunludur.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return "Geçerli bir e-posta adresi giriniz.";
  if (!data.resourceId?.trim()) return "Kaynak seçimi zorunludur.";

  const resource = resources.find((r) => r.id === data.resourceId);
  if (!resource) return "Geçersiz kaynak seçimi.";

  return null;
}

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const { ok: allowed } = rateLimit(`resource-download:${ip}`, {
      limit: 5,
      windowMs: 60_000,
    });

    if (!allowed) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Çok fazla istek gönderdiniz. Lütfen biraz bekleyip tekrar deneyin.",
        },
        { status: 429 }
      );
    }

    const body = (await request.json()) as DownloadRequest;
    const error = validate(body);

    if (error) {
      return NextResponse.json({ success: false, error }, { status: 400 });
    }

    const resource = resources.find((r) => r.id === body.resourceId)!;

    // Log lead to console (Supabase insert as future enhancement)
    console.log("[Resource Download] Lead captured:", {
      name: body.name.trim(),
      email: body.email.trim(),
      company: body.company?.trim() || null,
      resourceId: body.resourceId,
      resourceTitle: resource.title,
      ip,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "İndirme bağlantınız hazır.",
      downloadUrl: resource.fileUrl,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Bir hata oluştu. Lütfen tekrar deneyin." },
      { status: 500 }
    );
  }
}
