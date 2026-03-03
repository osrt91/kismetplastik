import { test, expect } from "@playwright/test"

test.describe("Sipariş ve Auth Koruması", () => {
  test("auth olmadan bayi-panel'e erişim engellenir", async ({ page }) => {
    await page.goto("/tr/bayi-panel")

    // Middleware redirect bekle — bayi-girisi'ne yönlendirmeli veya login sayfası göstermeli
    await page.waitForURL(/bayi-girisi|login|auth/, { timeout: 10_000 }).catch(() => {
      // Bazı durumlarda sayfa yüklenir ama içerik korumalı olabilir
    })

    // Ya bayi-girisi'ne redirect olur ya da sayfa korumalı içerik gösterir
    const url = page.url()
    const hasLoginForm = await page.getByPlaceholder("bayi@firma.com").isVisible().catch(() => false)
    const isRedirected = url.includes("bayi-girisi") || url.includes("login")

    expect(isRedirected || hasLoginForm).toBeTruthy()
  })

  test("teklif al sayfası erişilebilir", async ({ page }) => {
    await page.goto("/tr/teklif-al")
    await expect(page.locator("body")).toBeVisible()
  })
})
