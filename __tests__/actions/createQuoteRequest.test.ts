import { describe, it, expect, vi, beforeEach } from "vitest"

const mockGetUser = vi.fn()
const mockFrom = vi.fn()

vi.mock("@/lib/supabase-server", () => ({
  createSupabaseServerClient: vi.fn(async () => ({
    from: mockFrom,
    auth: {
      getUser: mockGetUser,
    },
  })),
}))

const { createQuoteRequest } = await import("@/app/actions/quotes")

const VALID_UUID = "550e8400-e29b-41d4-a716-446655440000"

const validQuoteInput = {
  companyName: "Test Firma A.Ş.",
  contactName: "Ali Yılmaz",
  email: "ali@testfirma.com",
  phone: "+905551234567",
  message: "100ml PET şişe teklif istiyorum",
  items: [
    {
      productId: VALID_UUID,
      productName: "PET Şişe 100ml",
      quantity: 5000,
      notes: "Şeffaf renk",
    },
  ],
}

beforeEach(() => {
  vi.clearAllMocks()

  // Default: not logged in (quotes can be created without auth)
  mockGetUser.mockResolvedValue({
    data: { user: null },
    error: null,
  })

  mockFrom.mockImplementation((table: string) => {
    if (table === "quote_requests") {
      return {
        insert: () => ({
          select: () => ({
            single: () =>
              Promise.resolve({
                data: { id: "quote-1" },
                error: null,
              }),
          }),
        }),
      }
    }
    if (table === "quote_items") {
      return {
        insert: () => Promise.resolve({ error: null }),
      }
    }
    return { insert: () => Promise.resolve({ error: null }) }
  })
})

describe("createQuoteRequest", () => {
  it("başarılı teklif talebi oluşturur", async () => {
    const result = await createQuoteRequest(validQuoteInput)

    expect(result).toEqual({
      success: true,
      quoteId: "quote-1",
    })
  })

  it("giriş yapmış kullanıcı ile de çalışır", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: "user-123" } },
      error: null,
    })

    const result = await createQuoteRequest(validQuoteInput)

    expect(result).toEqual({
      success: true,
      quoteId: "quote-1",
    })
  })

  it("firma adı eksik olduğunda validation hatası döner", async () => {
    const result = await createQuoteRequest({
      ...validQuoteInput,
      companyName: "",
    })

    expect(result).toEqual({
      success: false,
      error: expect.stringContaining("Firma adı"),
    })
  })

  it("geçersiz email ile validation hatası döner", async () => {
    const result = await createQuoteRequest({
      ...validQuoteInput,
      email: "invalid-email",
    })

    expect(result).toEqual({
      success: false,
      error: expect.any(String),
    })
  })

  it("boş items array ile validation hatası döner", async () => {
    const result = await createQuoteRequest({
      ...validQuoteInput,
      items: [],
    })

    expect(result).toEqual({
      success: false,
      error: expect.stringContaining("En az bir ürün"),
    })
  })

  it("iletişim kişisi eksik olduğunda hata döner", async () => {
    const result = await createQuoteRequest({
      ...validQuoteInput,
      contactName: "",
    })

    expect(result).toEqual({
      success: false,
      error: expect.stringContaining("İletişim kişisi"),
    })
  })

  it("Supabase hatası durumunda hata döner", async () => {
    mockFrom.mockImplementation((table: string) => {
      if (table === "quote_requests") {
        return {
          insert: () => ({
            select: () => ({
              single: () =>
                Promise.resolve({
                  data: null,
                  error: { message: "DB error" },
                }),
            }),
          }),
        }
      }
      return { insert: () => Promise.resolve({ error: null }) }
    })

    const result = await createQuoteRequest(validQuoteInput)

    expect(result).toEqual({
      success: false,
      error: "Teklif talebi oluşturulamadı.",
    })
  })
})
