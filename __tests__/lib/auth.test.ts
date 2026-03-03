import { describe, it, expect, vi, beforeEach } from "vitest"
import { NextRequest } from "next/server"

// Mock env before import
beforeEach(() => {
  vi.stubEnv("ADMIN_SECRET", "super-secret-admin-token-32chars!!")
})

// Dynamic import to respect env mocks
const { timingSafeCompare, checkAuth, sanitizeSearchInput } = await import(
  "@/lib/auth"
)

describe("timingSafeCompare", () => {
  it("eşit string'ler için true döner", () => {
    expect(timingSafeCompare("hello", "hello")).toBe(true)
  })

  it("farklı string'ler için false döner", () => {
    expect(timingSafeCompare("hello", "world")).toBe(false)
  })

  it("farklı uzunluktaki string'ler için false döner", () => {
    expect(timingSafeCompare("short", "longer-string")).toBe(false)
  })

  it("boş string'ler için true döner", () => {
    expect(timingSafeCompare("", "")).toBe(true)
  })

  it("tek karakter farkında false döner", () => {
    expect(timingSafeCompare("abcdef", "abcdeg")).toBe(false)
  })
})

describe("checkAuth", () => {
  it("geçerli token ile null döner (yetkili)", () => {
    const req = new NextRequest("http://localhost/api/test", {
      headers: {
        cookie: "admin-token=super-secret-admin-token-32chars!!",
      },
    })
    const result = checkAuth(req)
    expect(result).toBeNull()
  })

  it("geçersiz token ile 401 döner", () => {
    const req = new NextRequest("http://localhost/api/test", {
      headers: {
        cookie: "admin-token=wrong-token-value-here-32chars!!",
      },
    })
    const result = checkAuth(req)
    expect(result).not.toBeNull()
    expect(result!.status).toBe(401)
  })

  it("token yokken 401 döner", () => {
    const req = new NextRequest("http://localhost/api/test")
    const result = checkAuth(req)
    expect(result).not.toBeNull()
    expect(result!.status).toBe(401)
  })

  it("ADMIN_SECRET tanımlı değilken 401 döner", () => {
    vi.stubEnv("ADMIN_SECRET", "")
    const req = new NextRequest("http://localhost/api/test", {
      headers: {
        cookie: "admin-token=some-token",
      },
    })
    const result = checkAuth(req)
    expect(result).not.toBeNull()
    expect(result!.status).toBe(401)
  })
})

describe("sanitizeSearchInput", () => {
  it("SQL injection karakterlerini temizler", () => {
    expect(sanitizeSearchInput("test%_\\'\"()")).toBe("test")
  })

  it("normal metni değiştirmez", () => {
    expect(sanitizeSearchInput("pet şişe 500ml")).toBe("pet şişe 500ml")
  })

  it("boş string döner", () => {
    expect(sanitizeSearchInput("")).toBe("")
  })

  it("sadece özel karakterlerden oluşan input'u boşaltır", () => {
    expect(sanitizeSearchInput("%_'\"()")).toBe("")
  })

  it("karışık içerikte sadece güvenli kısmı bırakır", () => {
    expect(sanitizeSearchInput("SELECT * FROM users")).toBe("SELECT * FROM users")
  })
})
