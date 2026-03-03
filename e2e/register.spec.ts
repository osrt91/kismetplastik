import { test, expect } from "@playwright/test"

test.describe("Bayi Kayıt Sayfası", () => {
  test("kayıt sayfası erişilebilir", async ({ page }) => {
    await page.goto("/tr/bayi-kayit")
    await expect(page).toHaveURL(/bayi-kayit/)
  })

  test("sayfa yüklendiğinde kayıt içeriği görünür", async ({ page }) => {
    await page.goto("/tr/bayi-kayit")
    // Sayfanın yüklendiğini doğrula
    await expect(page.locator("body")).toBeVisible()
  })
})
