import { describe, it, expect, vi, beforeEach } from "vitest"

// Mock Supabase server client
const mockSingle = vi.fn()
const mockLimit = vi.fn().mockReturnValue({ single: mockSingle })
const mockOrder = vi.fn().mockReturnValue({ limit: mockLimit })
const mockGte = vi.fn().mockReturnValue({ order: mockOrder })
const mockLte = vi.fn().mockReturnValue({ gte: mockGte })
const mockIs = vi.fn().mockReturnValue({ lte: mockLte })
const mockEq = vi.fn()

// Chainable mock — handle different call patterns
mockEq.mockImplementation(() => ({
  eq: mockEq,
  is: mockIs,
  lte: mockLte,
  single: mockSingle,
}))

const mockSelect = vi.fn().mockReturnValue({ eq: mockEq })
const mockFrom = vi.fn().mockReturnValue({ select: mockSelect })

vi.mock("@/lib/supabase-server", () => ({
  createSupabaseServerClient: vi.fn(async () => ({
    from: mockFrom,
  })),
}))

const { calculatePrice } = await import("@/app/actions/price")

beforeEach(() => {
  vi.clearAllMocks()
  // Reset chain
  mockEq.mockImplementation(() => ({
    eq: mockEq,
    is: mockIs,
    lte: mockLte,
    single: mockSingle,
  }))
  mockSelect.mockReturnValue({ eq: mockEq })
  mockFrom.mockReturnValue({ select: mockSelect })
})

const VALID_PRODUCT_ID = "550e8400-e29b-41d4-a716-446655440000"
const VALID_COMPANY_ID = "660e8400-e29b-41d4-a716-446655440001"

describe("calculatePrice", () => {
  it("genel fiyat tier'ını döner (company_id null)", async () => {
    // Product query
    mockSingle
      .mockResolvedValueOnce({
        data: { id: VALID_PRODUCT_ID, base_price: 5.0 },
        error: null,
      })
      // General tier query
      .mockResolvedValueOnce({
        data: {
          unit_price: 3.5,
          min_quantity: 100,
          max_quantity: 500,
          currency: "TRY",
        },
        error: null,
      })

    const result = await calculatePrice(VALID_PRODUCT_ID, 200)

    expect(result).toEqual({
      success: true,
      unitPrice: 3.5,
      totalPrice: 700,
      tierName: "100-500 adet",
      currency: "TRY",
    })
  })

  it("firma özel fiyat tier'ını öncelikli döner", async () => {
    // Product query
    mockSingle
      .mockResolvedValueOnce({
        data: { id: VALID_PRODUCT_ID, base_price: 5.0 },
        error: null,
      })
      // Company-specific tier
      .mockResolvedValueOnce({
        data: {
          unit_price: 2.8,
          min_quantity: 100,
          max_quantity: 1000,
          currency: "TRY",
        },
        error: null,
      })

    const result = await calculatePrice(VALID_PRODUCT_ID, 200, VALID_COMPANY_ID)

    expect(result).toEqual({
      success: true,
      unitPrice: 2.8,
      totalPrice: 560,
      tierName: "100-1000 adet",
      currency: "TRY",
    })
  })

  it("miktar 0 için validation hatası döner", async () => {
    const result = await calculatePrice(VALID_PRODUCT_ID, 0)

    expect(result).toEqual({
      success: false,
      error: expect.stringContaining("pozitif"),
    })
  })

  it("negatif miktar için validation hatası döner", async () => {
    const result = await calculatePrice(VALID_PRODUCT_ID, -10)

    expect(result).toEqual({
      success: false,
      error: expect.stringContaining("pozitif"),
    })
  })

  it("çok büyük miktarda en yüksek tier uygulanır", async () => {
    // Product query
    mockSingle
      .mockResolvedValueOnce({
        data: { id: VALID_PRODUCT_ID, base_price: 5.0 },
        error: null,
      })
      // General tier for high quantity
      .mockResolvedValueOnce({
        data: {
          unit_price: 1.5,
          min_quantity: 10000,
          max_quantity: 1000000,
          currency: "TRY",
        },
        error: null,
      })

    const result = await calculatePrice(VALID_PRODUCT_ID, 500000)

    expect(result).toEqual({
      success: true,
      unitPrice: 1.5,
      totalPrice: 750000,
      tierName: "10000-1000000 adet",
      currency: "TRY",
    })
  })

  it("ürün bulunamadığında hata döner", async () => {
    mockSingle.mockResolvedValueOnce({
      data: null,
      error: { message: "Not found" },
    })

    const result = await calculatePrice(VALID_PRODUCT_ID, 100)

    expect(result).toEqual({
      success: false,
      error: "Ürün bulunamadı",
    })
  })

  it("tier bulunamadığında base_price'a fallback yapar", async () => {
    // Product query
    mockSingle
      .mockResolvedValueOnce({
        data: { id: VALID_PRODUCT_ID, base_price: 5.0 },
        error: null,
      })
      // No tier found
      .mockResolvedValueOnce({
        data: null,
        error: { message: "No rows" },
      })

    const result = await calculatePrice(VALID_PRODUCT_ID, 50)

    expect(result).toEqual({
      success: true,
      unitPrice: 5.0,
      totalPrice: 250,
      tierName: null,
      currency: "TRY",
    })
  })

  it("geçersiz UUID formatında validation hatası döner", async () => {
    const result = await calculatePrice("not-a-uuid", 100)

    expect(result).toEqual({
      success: false,
      error: expect.any(String),
    })
  })
})
