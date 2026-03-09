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
        { success: false, error: "Cok fazla istek. Lutfen bekleyin." },
        { status: 429 }
      );
    }

    if (!isHalkbankConfigured()) {
      return NextResponse.json(
        { success: false, error: "Online odeme sistemi henuz yapilandirilmamis." },
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

    // Calculate total from selected ERS invoices
    // In production this would validate against DIA invoice data
    const { amount } = body;
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, error: "Gecersiz tutar" },
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
