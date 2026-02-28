import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";

const DEFAULT_URL = "https://kismetplastik.vercel.app";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url") || DEFAULT_URL;

  try {
    const svg = await QRCode.toString(url, {
      type: "svg",
      margin: 2,
      width: 300,
      color: { dark: "#002060", light: "#ffffff" },
    });

    return new NextResponse(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=86400, immutable",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "QR kod oluşturulamadı." },
      { status: 500 }
    );
  }
}
