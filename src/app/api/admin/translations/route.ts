import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { checkAuth } from "@/lib/auth";

const SUPPORTED_LOCALES = ["tr", "en", "ar", "ru", "fr", "de", "es", "zh", "ja", "ko", "pt"];

function getLocalePath(locale: string): string {
  return path.join(process.cwd(), "src", "locales", `${locale}.json`);
}

export async function GET(request: NextRequest) {
  const authError = checkAuth(request);
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale") ?? "tr";

  if (!SUPPORTED_LOCALES.includes(locale)) {
    return NextResponse.json({ success: false, error: "Geçersiz dil kodu" }, { status: 400 });
  }

  try {
    const filePath = getLocalePath(locale);
    const raw = await readFile(filePath, "utf-8");
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    return NextResponse.json({ success: true, data: parsed });
  } catch (err) {
    console.error(`[Translations GET] locale=${locale}`, err);
    return NextResponse.json({ success: false, error: "Dil dosyası okunamadı" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const authError = checkAuth(request);
  if (authError) return authError;

  let body: { locale?: string; translations?: Record<string, unknown> };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Geçersiz JSON" }, { status: 400 });
  }

  const { locale, translations } = body;

  if (!locale || !SUPPORTED_LOCALES.includes(locale)) {
    return NextResponse.json({ success: false, error: "Geçersiz dil kodu" }, { status: 400 });
  }

  if (!translations || typeof translations !== "object" || Array.isArray(translations)) {
    return NextResponse.json({ success: false, error: "Geçersiz çeviri verisi" }, { status: 400 });
  }

  try {
    const filePath = getLocalePath(locale);
    const json = JSON.stringify(translations, null, 2);
    await writeFile(filePath, json, "utf-8");
    return NextResponse.json({ success: true, message: "Çeviriler kaydedildi" });
  } catch (err) {
    console.error(`[Translations PUT] locale=${locale}`, err);
    return NextResponse.json({ success: false, error: "Dosya yazılamadı" }, { status: 500 });
  }
}
