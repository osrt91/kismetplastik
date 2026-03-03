import { test, expect } from "@playwright/test"

test.describe("Ürün Katalogu", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/tr/urunler")
  })

  test("ürün grid'i yüklenir ve ürünler görünür", async ({ page }) => {
    // ProductCard'lar yüklenene kadar bekle
    await expect(page.locator("a").filter({ hasText: /PET|Plastik|Kapak|Şişe/ }).first()).toBeVisible({
      timeout: 10_000,
    })
  })

  test("arama yapınca sonuçlar filtrelenir", async ({ page }) => {
    const searchInput = page.getByPlaceholder(/ara/i)
    await searchInput.fill("PET")
    // Filtered results should contain PET
    await expect(page.locator("h3").filter({ hasText: /PET/ }).first()).toBeVisible()
  })

  test("ürün detay sayfasına tıklayarak gidilir", async ({ page }) => {
    // İlk ürün linkine tıkla
    const firstProduct = page.locator("a[href*='/urunler/']").first()
    await firstProduct.click()

    // URL /urunler/ altında bir sayfaya yönlendirilmeli
    await expect(page).toHaveURL(/\/urunler\//)
  })
})
