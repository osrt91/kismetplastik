import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"

// Use dynamic import to get fresh module state
let rateLimit: typeof import("@/lib/rate-limit").rateLimit

beforeEach(async () => {
  vi.useFakeTimers()
  // Re-import to get fresh state for each test
  vi.resetModules()
  const mod = await import("@/lib/rate-limit")
  rateLimit = mod.rateLimit
})

afterEach(() => {
  vi.useRealTimers()
})

describe("rateLimit", () => {
  it("ilk istek başarılı olur ve remaining doğru döner", () => {
    const result = rateLimit("test-key-1", { limit: 5 })
    expect(result.ok).toBe(true)
    expect(result.remaining).toBe(4)
  })

  it("limit aşımında ok: false döner", () => {
    const key = "test-key-2"
    const limit = 3

    // İlk 3 istek başarılı
    for (let i = 0; i < limit; i++) {
      const r = rateLimit(key, { limit })
      expect(r.ok).toBe(true)
    }

    // 4. istek limit aşımı
    const result = rateLimit(key, { limit })
    expect(result.ok).toBe(false)
    expect(result.remaining).toBe(0)
  })

  it("window süresi sonrası sayaç sıfırlanır", () => {
    const key = "test-key-3"
    const windowMs = 10_000

    // Limiti doldur
    for (let i = 0; i < 5; i++) {
      rateLimit(key, { limit: 5, windowMs })
    }
    expect(rateLimit(key, { limit: 5, windowMs }).ok).toBe(false)

    // Window süresini aş
    vi.advanceTimersByTime(windowMs + 1)

    // Yeni pencere — tekrar başarılı
    const result = rateLimit(key, { limit: 5, windowMs })
    expect(result.ok).toBe(true)
    expect(result.remaining).toBe(4)
  })

  it("farklı key'ler bağımsız çalışır", () => {
    const keyA = "user-a"
    const keyB = "user-b"

    // keyA limitini doldur
    for (let i = 0; i < 3; i++) {
      rateLimit(keyA, { limit: 3 })
    }
    expect(rateLimit(keyA, { limit: 3 }).ok).toBe(false)

    // keyB hâlâ müsait
    const result = rateLimit(keyB, { limit: 3 })
    expect(result.ok).toBe(true)
    expect(result.remaining).toBe(2)
  })

  it("varsayılan limit 5, windowMs 60000", () => {
    const key = "default-key"
    for (let i = 0; i < 5; i++) {
      expect(rateLimit(key).ok).toBe(true)
    }
    expect(rateLimit(key).ok).toBe(false)
  })
})
