# Kısmet Plastik — Google Play Store (TWA) Rehberi

Bu rehber, Kısmet Plastik PWA'yı Google Play Store'a yüklemek için adım adım talimatlar içerir.

---

## Ön Gereksinimler

1. **Node.js 18+** (zaten yüklü)
2. **Google Play Console hesabı** (25$ tek seferlik kayıt)
3. **Bubblewrap CLI** (zaten yüklü: `npm i -g @bubblewrap/cli`)
4. **Site canlı olmalı**: `https://kismetplastik.vercel.app` erişilebilir

---

## Adım 1: TWA Projesini Oluşturma

Terminal'de bu klasöre (`twa/`) gelin ve çalıştırın:

```bash
cd twa
bubblewrap init --manifest https://kismetplastik.vercel.app/manifest.json
```

Bubblewrap şu soruları soracak:
- **JDK yüklensin mi?** → `Y` (Evet, JDK 17 otomatik indirilir)
- **Android SDK yüklensin mi?** → `Y` (Evet, otomatik indirilir)
- **Package ID**: `com.kismetplastik.app` (varsayılan kabul)
- **Signing key oluşturulsun mu?** → `Y`
  - Key alias: `kismetplastik`
  - Key password: (güçlü bir şifre girin ve NOT ALIN)
  - Keystore password: (aynı şifre veya farklı)
  - Adınız, şehir, ülke gibi bilgileri girin

> **ÖNEMLİ:** Keystore dosyasını ve şifreleri güvenli bir yerde saklayın!
> Kaybederseniz Google Play'deki uygulamayı güncelleyemezsiniz.

---

## Adım 2: SHA256 Fingerprint Alma

Keystore oluşturulduktan sonra fingerprint'i alın:

```bash
keytool -list -v -keystore android.keystore -alias kismetplastik
```

`SHA256:` ile başlayan satırı kopyalayın. Formatı şöyle olacak:
```
AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99
```

---

## Adım 3: Digital Asset Links Güncelleme

`public/.well-known/assetlinks.json` dosyasındaki `BURAYA_SHA256_FINGERPRINT_YAZILACAK` yerine
Adım 2'deki SHA256 fingerprint'i yapıştırın:

```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.kismetplastik.app",
      "sha256_cert_fingerprints": [
        "AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99"
      ]
    }
  }
]
```

Sonra siteyi tekrar deploy edin:
```bash
cd .. && vercel --prod
```

---

## Adım 4: APK/AAB Build

```bash
cd twa
bubblewrap build
```

Bu komut şunları oluşturur:
- `app-release-bundle.aab` — Google Play'e yüklenecek dosya
- `app-release-signed.apk` — Test için doğrudan yüklenebilir APK

---

## Adım 5: APK'yı Test Etme

APK'yı Android cihazınıza aktarıp test edin:
1. Telefona `app-release-signed.apk` dosyasını transfer edin
2. Bilinmeyen kaynaklardan yüklemeye izin verin
3. Uygulamayı açın ve PWA'nın doğru çalıştığını doğrulayın
4. Adres çubuğu GÖRMEMEK için `assetlinks.json`'ın canlıda erişilebilir olduğundan emin olun

---

## Adım 6: Google Play Console'a Yükleme

1. [Google Play Console](https://play.google.com/console) → Yeni uygulama oluştur
2. Uygulama bilgilerini doldurun:
   - **Uygulama adı**: Kısmet Plastik
   - **Varsayılan dil**: Türkçe
   - **Uygulama türü**: Uygulama
   - **Ücretsiz/Ücretli**: Ücretsiz
3. Store listesi:
   - **Kısa açıklama**: 1969'dan bu yana kozmetik ambalaj üretimi
   - **Tam açıklama**: Kısmet Plastik, kozmetik sektörüne özel PET şişe, kapak, sprey ve özel üretim ambalaj çözümleri sunar. B2B portalımız üzerinden ürünleri inceleyin, teklif alın ve siparişlerinizi takip edin.
   - **Uygulama simgesi**: 512x512 PNG (`public/images/icon-512.png`)
   - **Öne çıkan görsel**: 1024x500 PNG banner
   - **Ekran görüntüleri**: En az 2 adet (telefon + tablet)
4. Sürüm yönetimi:
   - Dahili test → AAB dosyasını yükleyin
   - Test başarılıysa → Üretim'e yükseltin
5. İçerik derecelendirme: Anketi doldurun
6. Hedef kitle: 18+ (B2B uygulama)
7. Veri güvenliği formunu doldurun

---

## Play Store Gereksinimleri Kontrol Listesi

- [ ] Gizlilik politikası URL'si (KVKK sayfası kullanılabilir)
- [ ] 512x512 uygulama simgesi
- [ ] 1024x500 öne çıkan görsel (banner)
- [ ] En az 2 telefon ekran görüntüsü (1080x1920)
- [ ] En az 1 tablet ekran görüntüsü (opsiyonel ama önerilen)
- [ ] İçerik derecelendirme anketi
- [ ] Veri güvenliği formu
- [ ] Hedef kitle ve içerik beyanı

---

## Güncelleme Süreci

Uygulama güncellemesi için:

1. `twa-manifest.json` içinde `appVersionCode` ve `appVersionName` değerlerini artırın
2. `bubblewrap build` komutunu tekrar çalıştırın
3. Yeni AAB dosyasını Google Play Console'a yükleyin

> **Not:** TWA uygulamasında web içeriği otomatik güncellenir (sitenizi güncellediğinizde
> uygulama da güncellenir). AAB güncellemesi sadece native yapı değişiklikleri için gereklidir.

---

## Sorun Giderme

### Adres çubuğu görünüyor
- `assetlinks.json` doğru SHA256 fingerprint'i içermiyor
- Doğrulama: `https://kismetplastik.vercel.app/.well-known/assetlinks.json`
- Google'ın doğrulama aracı: https://developers.google.com/digital-asset-links/tools/generator

### Build hatası
- JDK versiyonunu kontrol edin: `java -version` (17+ olmalı)
- `bubblewrap doctor` komutuyla kontrol edin

### Keystore kaybı
- Google Play App Signing kullanıyorsanız upload key ile devam edebilirsiniz
- Kullanmıyorsanız uygulama güncellenemez, yeni package ID ile yeniden yüklemeniz gerekir

---

*Son güncelleme: 2026-02-27*
