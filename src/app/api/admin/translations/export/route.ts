import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { checkAuth } from "@/lib/auth";

const SUPPORTED_LOCALES = ["tr", "en", "de", "fr", "es", "it", "pt", "ru", "ar", "ja", "zh"];

export async function GET(request: NextRequest) {
  const authError = checkAuth(request);
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale") ?? "tr";

  if (!SUPPORTED_LOCALES.includes(locale)) {
    return NextResponse.json({ success: false, error: "Geçersiz dil kodu" }, { status: 400 });
  }

  try {
    const filePath = path.join(process.cwd(), "src", "locales", `${locale}.json`);
    const raw = await readFile(filePath, "utf-8");

    return new NextResponse(raw, {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename="${locale}.json"`,
      },
    });
  } catch (err) {
    console.error(`[Translations Export GET] locale=${locale}`, err);
    return NextResponse.json({ success: false, error: "Dil dosyası indirilemedi" }, { status: 500 });
  }
}
