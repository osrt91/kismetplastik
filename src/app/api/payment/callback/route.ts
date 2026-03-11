import { NextRequest, NextResponse } from "next/server";
import { verifyCallback } from "@/lib/halkbank-pos";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const data: Record<string, string> = {};
    formData.forEach((value, key) => {
      data[key] = String(value);
    });

    console.log("[Payment Callback]", JSON.stringify(data, null, 2));

    const result = verifyCallback(data);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://www.kismetplastik.com";

    if (result.success) {
      // TODO: Record payment in database, update invoice status
      console.log("[Payment Success]", result.orderId, result.transactionId);

      return NextResponse.redirect(
        `${baseUrl}/tr/bayi-panel/odeme?status=success&order=${result.orderId}`,
        { status: 303 }
      );
    }

    console.error("[Payment Failed]", result.error);
    return NextResponse.redirect(
      `${baseUrl}/tr/bayi-panel/odeme?status=error&message=${encodeURIComponent(result.error ?? "Ödeme başarısız")}`,
      { status: 303 }
    );
  } catch (err) {
    console.error("[Payment Callback Error]", err);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://www.kismetplastik.com";
    return NextResponse.redirect(
      `${baseUrl}/tr/bayi-panel/odeme?status=error&message=${encodeURIComponent("Beklenmeyen hata")}`,
      { status: 303 }
    );
  }
}
