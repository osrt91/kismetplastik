import { z } from "zod";

// Turkish character support for name fields
const turkishNameRegex = /^[a-zA-ZğüşöçıĞÜŞÖÇİ\s]+$/;

const emailSchema = z.string().email("Geçerli bir e-posta adresi giriniz.");
const phoneSchema = z.string().min(7, "Geçerli bir telefon numarası giriniz.").max(20);

// --- Contact Form ---
export const contactSchema = z.object({
  name: z.string().min(1, "Ad Soyad alanı zorunludur.").regex(turkishNameRegex, "Ad Soyad geçersiz karakter içeriyor."),
  email: emailSchema,
  phone: z.string().optional(),
  company: z.string().optional(),
  subject: z.string().min(1, "Konu seçimi zorunludur."),
  message: z.string().min(10, "Mesaj en az 10 karakter olmalıdır."),
});

// --- Quote Form (via /api/quote) ---
export const quoteFormSchema = z.object({
  name: z.string().min(1, "Ad Soyad alanı zorunludur.").regex(turkishNameRegex, "Ad Soyad geçersiz karakter içeriyor."),
  email: emailSchema,
  phone: phoneSchema,
  company: z.string().min(1, "Firma adı zorunludur."),
  address: z.string().optional(),
  category: z.string().min(1, "Ürün kategorisi seçimi zorunludur."),
  productInterest: z.string().optional(),
  quantity: z.string().optional(),
  deliveryDate: z.string().optional(),
  message: z.string().optional(),
});

// --- Auth Login ---
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Şifre gereklidir."),
});

// --- Auth Register ---
export const registerSchema = z.object({
  email: emailSchema,
  password: z.string().min(8, "Şifre en az 8 karakter olmalıdır."),
  full_name: z.string().min(1, "Ad soyad zorunludur.").regex(turkishNameRegex, "Ad soyad geçersiz karakter içeriyor."),
  phone: z.string().optional(),
  company_name: z.string().min(1, "Firma adı zorunludur."),
  tax_number: z.string().optional(),
  tax_office: z.string().optional(),
  company_address: z.string().optional(),
  city: z.string().optional(),
  district: z.string().optional(),
});

// --- Admin Auth ---
export const adminAuthSchema = z.object({
  password: z.string().min(1, "Şifre gereklidir."),
});

// --- Order Create ---
const orderItemSchema = z.object({
  product_id: z.string().optional(),
  product_name: z.string().min(1, "Ürün adı zorunludur."),
  quantity: z.number().int().min(1, "Miktar en az 1 olmalıdır."),
  unit_price: z.number().min(0, "Birim fiyat geçersiz."),
  notes: z.string().optional(),
});

export const orderCreateSchema = z.object({
  profile_id: z.string().min(1, "Giriş yapmanız gerekiyor."),
  items: z.array(orderItemSchema).min(1, "En az bir ürün gerekli."),
  shipping_address: z.string().optional(),
  billing_address: z.string().optional(),
  payment_method: z.string().optional(),
  notes: z.string().optional(),
});

// --- Order Update ---
export const orderUpdateSchema = z.object({
  status: z.enum(["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"]).optional(),
  tracking_number: z.string().optional(),
  admin_notes: z.string().optional(),
  payment_status: z.enum(["pending", "paid", "refunded"]).optional(),
});

// --- Gallery Upload (metadata only, file handled separately) ---
export const galleryUploadSchema = z.object({
  category: z.enum(["uretim", "urunler", "etkinlikler"], { message: "Geçersiz kategori." }),
  title_tr: z.string().min(1, "Başlık (TR) gerekli."),
  title_en: z.string().optional(),
  description_tr: z.string().optional(),
  description_en: z.string().optional(),
  display_order: z.coerce.number().int().optional().default(0),
});

// --- Gallery Update ---
export const galleryUpdateSchema = z.object({
  title_tr: z.string().optional(),
  title_en: z.string().optional(),
  description_tr: z.string().optional(),
  description_en: z.string().optional(),
  category: z.enum(["uretim", "urunler", "etkinlikler"]).optional(),
  display_order: z.number().int().optional(),
  is_active: z.boolean().optional(),
});

// --- Quote Request (B2B portal via /api/quotes) ---
const quoteItemSchema = z.object({
  product_id: z.string().optional(),
  product_name: z.string().min(1, "Ürün adı zorunludur."),
  quantity: z.number().int().min(1, "Miktar en az 1 olmalıdır."),
  notes: z.string().optional(),
});

export const quoteRequestSchema = z.object({
  company_name: z.string().min(1, "Firma adı zorunludur."),
  contact_name: z.string().min(1, "Ad Soyad zorunludur.").regex(turkishNameRegex, "Ad Soyad geçersiz karakter içeriyor."),
  email: emailSchema,
  phone: phoneSchema,
  message: z.string().optional(),
  items: z.array(quoteItemSchema).min(1, "En az bir ürün seçilmelidir."),
});

// --- Chat ---
const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().max(2000, "Mesaj 2000 karakteri aşamaz."),
});

export const chatSchema = z.object({
  messages: z.array(chatMessageSchema).min(1).max(10, "Çok fazla mesaj."),
  locale: z.enum(["tr", "en"]).optional(),
});

// --- Admin Product (matches DB column names used in admin/products routes) ---
export const productSchema = z.object({
  slug: z.string().min(1, "Slug zorunludur."),
  name: z.string().min(1, "Ürün adı zorunludur."),
  category: z.string().min(1, "Kategori zorunludur."),
  description: z.string().optional().default(""),
  shortDescription: z.string().optional().default(""),
  volume: z.string().optional().nullable(),
  weight: z.string().optional().nullable(),
  neckDiameter: z.string().optional().nullable(),
  height: z.string().optional().nullable(),
  diameter: z.string().optional().nullable(),
  material: z.string().optional().default("PET"),
  colors: z.array(z.string()).optional().default([]),
  model: z.string().optional().nullable(),
  shape: z.string().optional().nullable(),
  minOrder: z.number().int().min(0).optional().default(10000),
  inStock: z.boolean().optional().default(true),
  featured: z.boolean().optional().default(false),
  specs: z.array(z.object({ label: z.string(), value: z.string() })).optional().default([]),
});

// --- Admin Blog Post (matches DB column names used in admin/blog routes) ---
export const blogPostSchema = z.object({
  slug: z.string().min(1, "Slug zorunludur."),
  title: z.string().min(1, "Başlık zorunludur."),
  excerpt: z.string().optional().default(""),
  content: z.union([z.string(), z.array(z.string())]),
  category: z.string().optional().default("Bilgi"),
  date: z.string().optional(),
  readTime: z.string().optional().default("5 dk"),
  featured: z.boolean().optional().default(false),
});

// --- File upload validation ---
const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "model/gltf-binary",
] as const;

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Magic byte signatures for file type verification
const FILE_SIGNATURES: Record<string, number[][]> = {
  "image/jpeg": [[0xFF, 0xD8, 0xFF]],
  "image/png": [[0x89, 0x50, 0x4E, 0x47]],
  "image/webp": [[0x52, 0x49, 0x46, 0x46]], // RIFF
  "image/svg+xml": [[0x3C, 0x73, 0x76, 0x67], [0x3C, 0x3F, 0x78, 0x6D]], // <svg or <?xm
  "model/gltf-binary": [[0x67, 0x6C, 0x54, 0x46]], // glTF
};

export function validateFileType(mimeType: string): boolean {
  return (ALLOWED_FILE_TYPES as readonly string[]).includes(mimeType);
}

export function validateFileSize(size: number): boolean {
  return size <= MAX_FILE_SIZE;
}

export function validateFileMagicBytes(buffer: Buffer, claimedType: string): boolean {
  const signatures = FILE_SIGNATURES[claimedType];
  if (!signatures) return false;

  return signatures.some((sig) =>
    sig.every((byte, i) => buffer[i] === byte)
  );
}

// Helper to get first Zod error message
export function getZodErrorMessage(error: z.ZodError): string {
  return error.issues[0]?.message || "Geçersiz veri.";
}
