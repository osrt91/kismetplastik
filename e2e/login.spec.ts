import { test, expect } from "@playwright/test"

test.describe("Bayi Giriş Sayfası", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/tr/bayi-girisi")
  })

  test("login form elementleri render edilir", async ({ page }) => {
    // Email input
    await expect(page.getByPlaceholder("bayi@firma.com")).toBeVisible()
    // Password input
    await expect(page.getByPlaceholder("••••••••")).toBeVisible()
    // Submit button
    await expect(page.getByText("Giriş Yap")).toBeVisible()
  })

  test("şifremi unuttum linki görünür", async ({ page }) => {
    await expect(page.getByText("Şifremi unuttum")).toBeVisible()
  })

  test("bayilik başvurusu linki görünür", async ({ page }) => {
    await expect(page.getByText("Bayilik başvurusu yapın")).toBeVisible()
  })

  test("yanlış credentials ile login hata gösterir", async ({ page }) => {
    await page.getByPlaceholder("bayi@firma.com").fill("test@test.com")
    await page.getByPlaceholder("••••••••").fill("wrongpassword")
    await page.getByText("Giriş Yap").click()

    // Hata mesajının görünmesini bekle (API'den dönen hata veya bağlantı hatası)
    await expect(
      page.locator("text=/hata|başarısız|Bağlantı/i").first()
    ).toBeVisible({ timeout: 10_000 })
  })
})
