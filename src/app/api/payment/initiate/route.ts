import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { initiatePayment, isHalkbankConfigured } from "@/lib/halkbank-pos";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    // Rate limit
    const ip = request.headers.get("x-forwarded-for") ?? "unknown";
    const { ok } = rateLimit(`payment:${ip}`, { limit: 3, windowMs: 60_000 });
    if (!ok) {
      return NextResponse.json(
        { success: false, error: "Çok fazla istek. Lütfen bekleyin." },
        { status: 429 }
      );
    }

    if (!isHalkbankConfigured()) {
      return NextResponse.json(
        { success: false, error: "Online ödeme sistemi henüz yapılandırılmamış." },
        { status: 503 }
      );
    }

    const supabase = await supabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Yetkisiz" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { invoiceIds, cardHolderName, cardNumber, expireMonth, expireYear, cvv } = body;

    if (
      !invoiceIds ||
      !Array.isArray(invoiceIds) ||
      invoiceIds.length === 0 ||
      !cardHolderName ||
      !cardNumber ||
      !expireMonth ||
      !expireYear ||
      !cvv
    ) {
      return NextResponse.json(
        { success: false, error: "Eksik bilgi" },
        { status: 400 }
      );
    }

    // Server-side amount validation: recalculate from invoice data in DB
    // to prevent client-side tampering with payment amounts
    const { data: invoices, error: invoiceError } = await supabase
      .from("invoices")
      .select("id, total_amount, status")
      .in("id", invoiceIds)
      .eq("profile_id", user.id);

    if (invoiceError || !invoices || invoices.length !== invoiceIds.length) {
      return NextResponse.json(
        { success: false, error: "Fatura(lar) bulunamadı veya erişim yetkiniz yok." },
        { status: 404 }
      );
    }

    // Ensure none of the invoices are already paid
    const alreadyPaid = invoices.filter((inv) => inv.status === "paid");
    if (alreadyPaid.length > 0) {
      return NextResponse.json(
        { success: false, error: "Seçilen faturalardan bazıları zaten ödenmiş." },
        { status: 400 }
      );
    }

    // Calculate server-side total from invoice records
    const serverAmount = invoices.reduce((sum, inv) => sum + (inv.total_amount ?? 0), 0);
    const roundedServerAmount = Math.round(serverAmount * 100) / 100;

    // Reject if client-sent amount doesn't match server-calculated total
    const { amount } = body;
    if (!amount || amount <= 0 || Math.abs(amount - roundedServerAmount) > 0.01) {
      return NextResponse.json(
        { success: false, error: "Tutar, fatura toplamıyla eşleşmiyor." },
        { status: 400 }
      );
    }

    const orderId = `PAY-${Date.now().toString(36).toUpperCase()}`;

    const result = await initiatePayment({
      orderId,
      amount,
      cardHolderName,
      cardNumber,
      expireMonth,
      expireYear,
      cvv,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return new NextResponse(result.htmlForm, {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Bilinmeyen hata";
    console.error("[Payment Initiate POST]", err);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
