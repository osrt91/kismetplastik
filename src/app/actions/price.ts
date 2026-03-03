"use server"

import { z } from "zod/v4"
import { createSupabaseServerClient } from "@/lib/supabase-server"

const calculatePriceSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().positive("Miktar pozitif bir tam sayı olmalıdır"),
  companyId: z.string().uuid().nullable().optional(),
})

export type PriceResult = {
  success: true
  unitPrice: number
  totalPrice: number
  tierName: string | null
  currency: string
} | {
  success: false
  error: string
}

export async function calculatePrice(
  productId: string,
  quantity: number,
  companyId?: string | null
): Promise<PriceResult> {
  // Validate input
  const parsed = calculatePriceSchema.safeParse({ productId, quantity, companyId })
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  const supabase = await createSupabaseServerClient()

  // Check product exists
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("id, base_price")
    .eq("id", productId)
    .single()

  if (productError || !product) {
    return { success: false, error: "Ürün bulunamadı" }
  }

  // Try company-specific price tier first
  if (companyId) {
    const { data: companyTier } = await supabase
      .from("price_tiers")
      .select("*")
      .eq("product_id", productId)
      .eq("company_id", companyId)
      .lte("min_quantity", quantity)
      .gte("max_quantity", quantity)
      .order("min_quantity", { ascending: false })
      .limit(1)
      .single()

    if (companyTier) {
      return {
        success: true,
        unitPrice: companyTier.unit_price,
        totalPrice: companyTier.unit_price * quantity,
        tierName: `${companyTier.min_quantity}-${companyTier.max_quantity} adet`,
        currency: companyTier.currency || "TRY",
      }
    }
  }

  // Fallback to general price tiers (company_id IS NULL)
  const { data: generalTier } = await supabase
    .from("price_tiers")
    .select("*")
    .eq("product_id", productId)
    .is("company_id", null)
    .lte("min_quantity", quantity)
    .gte("max_quantity", quantity)
    .order("min_quantity", { ascending: false })
    .limit(1)
    .single()

  if (generalTier) {
    return {
      success: true,
      unitPrice: generalTier.unit_price,
      totalPrice: generalTier.unit_price * quantity,
      tierName: `${generalTier.min_quantity}-${generalTier.max_quantity} adet`,
      currency: generalTier.currency || "TRY",
    }
  }

  // Fallback to base_price if no tier matches
  if (product.base_price) {
    return {
      success: true,
      unitPrice: product.base_price,
      totalPrice: product.base_price * quantity,
      tierName: null,
      currency: "TRY",
    }
  }

  return { success: false, error: "Bu ürün için fiyat bilgisi bulunamadı" }
}
