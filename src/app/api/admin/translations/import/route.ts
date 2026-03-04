import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { checkAuth } from "@/lib/auth";

const SUPPORTED_LOCALES = ["tr", "en", "de", "fr", "es", "it", "pt", "ru", "ar", "ja", "zh"];

function isValidTranslationObject(obj: unknown): obj is Record<string, unknown> {
  return typeof obj === "object" && obj !== null && !Array.isArray(obj);
}

export async function POST(request: NextRequest) {
  const authError = checkAuth(request);
  if (authError) return authError;

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ success: false, error: "Form verisi okunamadı" }, { status: 400 });
  }

  const locale = formData.get("locale") as string | null;
  const file = formData.get("file") as File | null;

  if (!locale || !SUPPORTED_LOCALES.includes(locale)) {
    return NextResponse.json({ success: false, error: "Geçersiz dil kodu" }, { status: 400 });
  }

  if (!file) {
    return NextResponse.json({ success: false, error: "Dosya gereklidir" }, { status: 400 });
  }

  if (!file.name.endsWith(".json") && file.type !== "application/json") {
    return NextResponse.json({ success: false, error: "Sadece JSON dosyaları kabul edilir" }, { status: 400 });
  }

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ success: false, error: "Dosya boyutu 5MB'ı aşamaz" }, { status: 400 });
  }

  const rawText = await file.text();
  let parsed: unknown;
  try {
    parsed = JSON.parse(rawText);
  } catch {
    return NextResponse.json({ success: false, error: "Geçersiz JSON formatı" }, { status: 400 });
  }

  if (!isValidTranslationObject(parsed)) {
    return NextResponse.json({ success: false, error: "JSON dosyası bir nesne olmalıdır" }, { status: 400 });
  }

  try {
    const filePath = path.join(process.cwd(), "src", "locales", `${locale}.json`);
    const json = JSON.stringify(parsed, null, 2);
    await writeFile(filePath, json, "utf-8");
    return NextResponse.json({ success: true, message: "Dil dosyası başarıyla içe aktarıldı" });
  } catch (err) {
    console.error(`[Translations Import POST] locale=${locale}`, err);
    return NextResponse.json({ success: false, error: "Dosya kaydedilemedi" }, { status: 500 });
  }
}
