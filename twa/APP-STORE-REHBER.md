# Kısmet Plastik — Apple App Store (iOS) Rehberi

Bu rehber, Kısmet Plastik PWA'yı iOS uygulamaya dönüştürüp Apple App Store'a yüklemeyi adım adım anlatır.

**Yöntem:** Capacitor (Ionic tarafından geliştirilen, modern ve aktif olarak bakımı yapılan bir web-to-native bridge)

> **Not:** Apple, saf PWA wrapper'ları (sadece WKWebView gösteren uygulamalar) reddedebilir.
> Uygulamanın native özellikler (push notification, haptics, splash screen vb.) sunması
> App Review'dan geçme şansını artırır.

---

## Ön Gereksinimler

1. **macOS** (Xcode yalnızca macOS'ta çalışır)
2. **Xcode 15+** (`xcode-select --install` ile CLI tools da yüklenmeli)
3. **Node.js 18+**
4. **CocoaPods** (`sudo gem install cocoapods`)
5. **Apple Developer Program** (yıllık 99$, https://developer.apple.com/programs/)
6. **Site canlı olmalı**: `https://www.kismetplastik.com` erişilebilir

---

## Adım 1: Capacitor Kurulumu

Proje kök dizininde (`kismetplastik/`) terminalden:

```bash
# Capacitor core ve CLI kurulumu
npm install @capacitor/core @capacitor/cli

# Capacitor'ı projede başlat (config zaten twa/capacitor.config.ts'de var)
npx cap init "Kısmet Plastik" "com.kismetplastik.app" --web-dir out

# iOS platform ekleme
npm install @capacitor/ios
npx cap add ios

# Opsiyonel faydalı pluginler
npm install @capacitor/splash-screen @capacitor/status-bar @capacitor/keyboard
npm install @capacitor/push-notifications  # App Review'da artı puan
npm install @capacitor/haptics              # Native his
npm install @capacitor/share                # Paylaşım sheet
```

> **Not:** `capacitor.config.ts` dosyası `twa/` dizininde hazır.
> Proje kök dizinine kopyalayın: `cp twa/capacitor.config.ts ./capacitor.config.ts`

---

## Adım 2: iOS Projesini Yapılandırma

```bash
# Next.js build (static export gerekli)
# next.config.ts'e output: "export" eklemek gerekiyor (sadece iOS build için)
npm run build

# iOS projesini senkronize et
npx cap sync ios
```

### Xcode'da Proje Ayarları

```bash
# Xcode'da iOS projesini aç
npx cap open ios
```

Xcode'da şu ayarları yapın:

1. **Signing & Capabilities:**
   - Team: Apple Developer hesabınızı seçin
   - Bundle Identifier: `com.kismetplastik.app`
   - Automatically manage signing: ON

2. **General:**
   - Display Name: `Kısmet Plastik`
   - Version: `1.0.0`
   - Build: `1`
   - Deployment Target: `iOS 15.0` (minimum)
   - Device Orientation: Portrait (primary), Landscape opsiyonel

3. **Info.plist ayarları** (Xcode > Info tab):
   ```xml
   <!-- URL Scheme -->
   <key>CFBundleURLTypes</key>
   <array>
     <dict>
       <key>CFBundleURLSchemes</key>
       <array>
         <string>kismetplastik</string>
       </array>
     </dict>
   </array>

   <!-- Camera/Photo kullanmıyorsanız kaldırın -->
   <!-- NSCameraUsageDescription kaldırılmalı -->

   <!-- App Transport Security — HTTPS kullandığımız için sorun yok -->
   <key>NSAppTransportSecurity</key>
   <dict>
     <key>NSAllowsArbitraryLoads</key>
     <false/>
   </dict>
   ```

---

## Adım 3: WKWebView Yapılandırması

Capacitor zaten WKWebView kullanır. Ek yapılandırma `capacitor.config.ts`'de yapılmıştır:

- **server.url**: Canlı siteyi yükler (`https://www.kismetplastik.com/test/tr`)
- **allowNavigation**: İzin verilen domainler tanımlı
- **limitsNavigationsToAppBoundDomains**: Güvenlik için aktif

### Offline Desteği (Opsiyonel ama Önerilir)

Service worker PWA'da zaten çalışıyor. Capacitor bunu native tarafta da destekler.
Ancak App Review'da offline davranışı test edilir. `sw.js` halihazırda offline
fallback sağlıyor — ek bir şey yapmanıza gerek yok.

---

## Adım 4: Uygulama Simgeleri ve Splash Screen

### Simge Gereksinimleri (AppIcon.appiconset)

Apple App Store için tüm boyutlarda simge gerekir. Kaynak dosya **1024x1024 PNG** olmalı:

| Boyut | Kullanım |
|-------|---------|
| 1024x1024 | App Store listesi |
| 180x180 | iPhone (@3x) |
| 120x120 | iPhone (@2x) |
| 167x167 | iPad Pro (@2x) |
| 152x152 | iPad (@2x) |
| 76x76 | iPad (@1x) |
| 40x40 | Spotlight (@1x) |
| 80x80 | Spotlight (@2x) |
| 120x120 | Spotlight (@3x) |
| 60x60 | Notification (@2x) |
| 40x40 | Notification (@3x) |
| 29x29 | Settings (@1x) |
| 58x58 | Settings (@2x) |
| 87x87 | Settings (@3x) |
| 20x20 | Notification (@1x) |

**Otomatik oluşturma:** `public/images/icon-1024.png` dosyanız varsa:
```bash
# Simgeleri otomatik oluşturmak için @nickmessing/capacitor-icon-gen veya benzer araç
npx capacitor-assets generate --iconBackgroundColor '#FAFAF7' --splashBackgroundColor '#FAFAF7'
```

Veya `twa/generate-icons.sh` script'ini çalıştırın (ImageMagick gerektirir).

### Splash Screen (LaunchScreen.storyboard)

Capacitor varsayılan bir splash screen oluşturur. Özelleştirmek için:

1. Xcode'da `App/Assets.xcassets/Splash.imageset` klasörünü açın
2. Splash görselini ekleyin (2732x2732 PNG önerilir, ortada logo)
3. `capacitor.config.ts`'deki SplashScreen ayarları backgroundColor'ı `#FAFAF7` (cream) olarak ayarlar

---

## Adım 5: Native Özellikler Ekleme (App Review İçin Önemli)

Apple, saf web wrapper'ları reddedebilir. Şu native özellikleri eklemek geçiş şansını artırır:

### Push Notifications (Önerilir)

```typescript
// src/lib/push-notifications-ios.ts (örnek)
import { PushNotifications } from '@capacitor/push-notifications';

export async function registerPushNotifications() {
  const permission = await PushNotifications.requestPermissions();
  if (permission.receive === 'granted') {
    await PushNotifications.register();
  }

  PushNotifications.addListener('registration', (token) => {
    // Token'ı Supabase'e kaydet — sipariş bildirimleri için
    console.log('Push token:', token.value);
  });
}
```

### Haptic Feedback

```typescript
import { Haptics, ImpactStyle } from '@capacitor/haptics';

// Sipariş onayı, buton tıklaması gibi yerlerde
await Haptics.impact({ style: ImpactStyle.Medium });
```

### Share API

```typescript
import { Share } from '@capacitor/share';

// Ürün paylaşma butonu
await Share.share({
  title: 'Kısmet Plastik - PET Şişe',
  text: 'Bu ürüne göz atın',
  url: 'https://www.kismetplastik.com/test/tr/urunler/pet-siseler/urun-adi',
  dialogTitle: 'Ürünü Paylaş',
});
```

---

## Adım 6: Build ve Test

### Simulator'da Test

```bash
# Sync changes
npx cap sync ios

# Xcode'da aç ve Simulator'da çalıştır
npx cap open ios
# Xcode'da: Product > Run (Cmd+R)
```

### Fiziksel Cihazda Test

1. iPhone'u Mac'e USB ile bağlayın
2. Xcode'da cihazı seçin
3. Developer Mode'u cihazda aktif edin (Settings > Privacy & Security > Developer Mode)
4. Product > Run

### TestFlight ile Beta Test

1. Xcode'da: Product > Archive
2. Organizer > Distribute App > TestFlight Internal Testing
3. App Store Connect'te test kullanıcılarını ekleyin
4. TestFlight uygulamasından test edin

---

## Adım 7: App Store'a Gönderme

### App Store Connect Hazırlığı

[App Store Connect](https://appstoreconnect.apple.com) > My Apps > (+) New App:

1. **Platform**: iOS
2. **Name**: Kısmet Plastik
3. **Primary Language**: Turkish
4. **Bundle ID**: com.kismetplastik.app
5. **SKU**: kismetplastik-b2b

### Store Listesi Bilgileri

| Alan | Değer |
|------|-------|
| Uygulama Adı | Kısmet Plastik |
| Altyazı | B2B Kozmetik Ambalaj Platformu |
| Açıklama | Kısmet Plastik, 1969'dan bu yana kozmetik sektörüne özel plastik ve PET ambalaj üretimi yapmaktadır. B2B portalımız üzerinden PET şişe, kapak, sprey ve özel üretim kozmetik ambalaj ürünlerimizi inceleyin, teklif alın ve siparişlerinizi takip edin. |
| Anahtar Kelimeler | kozmetik,ambalaj,pet,şişe,plastik,b2b,kapak,sprey,pompa |
| Destek URL | https://www.kismetplastik.com/test/tr/iletisim |
| Pazarlama URL | https://www.kismetplastik.com |
| Gizlilik Politikası URL | https://www.kismetplastik.com/test/tr/kvkk |
| Kategori | Business |
| İkincil Kategori | Shopping |
| Yaş Derecelendirmesi | 4+ (şiddet/cinsel içerik yok) |

### Ekran Görüntüsü Gereksinimleri

Apple Store'a en az 3 farklı cihaz boyutu için ekran görüntüsü gerekir:

| Cihaz | Boyut (piksel) | Zorunlu |
|-------|---------------|---------|
| iPhone 6.7" (15 Pro Max) | 1290x2796 | Evet |
| iPhone 6.5" (11 Pro Max) | 1242x2688 | Evet |
| iPhone 5.5" (8 Plus) | 1242x2208 | Evet |
| iPad Pro 12.9" (6. nesil) | 2048x2732 | Eğer iPad destekliyorsa |
| iPad Pro 12.9" (2. nesil) | 2048x2732 | Eğer iPad destekliyorsa |

**Her boyut için 3-10 ekran görüntüsü** yüklenebilir. Önerilen:

1. Ana sayfa (hero section)
2. Ürün listesi
3. Ürün detay
4. B2B portal dashboard
5. Teklif formu

**Ekran görüntüsü oluşturma araçları:**
- Xcode Simulator'da: Cmd+S (screenshot)
- Figma/Sketch template ile telefon mockup'ı
- [AppLaunchpad](https://theapplaunchpad.com) veya [Shots.so](https://shots.so)

### Gizlilik Detayları (App Privacy)

App Store Connect > App Privacy bölümünde beyan edin:

| Veri Türü | Toplanan | Kullanıcıya Bağlı | Takip |
|-----------|----------|-------------------|-------|
| İletişim Bilgileri (E-posta) | Evet | Evet | Hayır |
| İsim | Evet | Evet | Hayır |
| Telefon | Evet | Evet | Hayır |
| Kullanım Verileri (Analytics) | Evet | Hayır | Hayır |

> Not: Google Analytics kullanıyorsanız bunu da beyan etmeniz gerekir.

---

## Adım 8: App Review Notları

App Review'a gönderirken **Review Notes** alanına şunları yazın:

```
Bu uygulama B2B (işletmeden işletmeye) bir kozmetik ambalaj platformudur.

Test Hesabı (Bayi Girişi):
E-posta: [test hesabı e-postası]
Şifre: [test hesabı şifresi]

Uygulamanın ana özellikleri:
1. 500+ kozmetik ambalaj ürünü katalogu (PET şişe, kapak, sprey, pompa)
2. B2B bayi portalı — sipariş ve teklif yönetimi
3. Canlı stok bilgisi (DIA ERP entegrasyonu)
4. Push bildirimler (sipariş durum güncellemeleri)
5. 11 dil desteği

Web sitesi: https://www.kismetplastik.com
```

### Sık Ret Nedenleri ve Çözümleri

| Ret Nedeni | Çözüm |
|-----------|-------|
| **4.2 — Minimum Functionality** | Native özellikler ekleyin (push, haptics, share). Sadece web wrapper yetmez. |
| **2.1 — App Completeness** | Demo/test hesabı sağlayın. Tüm sayfalar çalışmalı. |
| **5.1.1 — Data Collection** | Gizlilik politikası URL'si sağlayın (KVKK sayfası). |
| **2.3 — Accurate Metadata** | Ekran görüntüleri gerçek uygulama görüntüsü olmalı, mockup değil. |
| **4.0 — Design** | iOS tasarım kılavuzlarına uyun (safe area, back gesture). |
| **Guideline 4.2 — Commercial viability** | B2B olduğunu ve bayi giriş sistemi olduğunu review note'ta açıklayın. |

---

## Alternatif: PWABuilder

Eğer Capacitor ile sorun yaşarsanız, [PWABuilder](https://www.pwabuilder.com) alternatif olarak kullanılabilir:

1. https://www.pwabuilder.com adresine gidin
2. `https://www.kismetplastik.com` URL'sini girin
3. PWA skorunu kontrol edin
4. "Package for stores" > iOS seçin
5. İndirilen Xcode projesini açın ve imzalayın

**Dezavantajı:** PWABuilder'ın iOS çıktısı daha basittir ve native plugin desteği yoktur.
App Review'dan geçme şansı Capacitor'a göre daha düşüktür.

---

## Güncelleme Süreci

TWA gibi, web içeriği otomatik güncellenir (site güncellendiğinde uygulama da güncellenir).
Native değişiklikler (simge, splash, plugin) için:

1. Değişiklikleri yapın
2. `npx cap sync ios`
3. Xcode'da Archive > App Store Connect'e yükleyin
4. App Store Connect'te yeni sürüm oluşturun

---

## Kontrol Listesi

### Build Öncesi
- [ ] Apple Developer Program üyeliği aktif (99$/yıl)
- [ ] macOS + Xcode 15+ yüklü
- [ ] CocoaPods yüklü
- [ ] Capacitor ve pluginler yüklü
- [ ] `capacitor.config.ts` proje kök dizinine kopyalandı
- [ ] 1024x1024 PNG uygulama simgesi hazır
- [ ] Splash screen görseli hazır (2732x2732)

### Store Gönderi Öncesi
- [ ] TestFlight'ta en az 1 kişiyle test edildi
- [ ] iPhone ve iPad'de (eğer destekleniyorsa) test edildi
- [ ] Offline davranış test edildi
- [ ] Push notification test edildi
- [ ] Tüm ekran görüntüleri hazır (6.7", 6.5", 5.5")
- [ ] Gizlilik politikası URL'si aktif
- [ ] App Privacy beyanları dolduruldu
- [ ] Review Notes yazıldı (test hesabı dahil)
- [ ] Age Rating anketi dolduruldu

### App Review Sonrası
- [ ] TestFlight beta süresi bitmeden production'a geçildi
- [ ] App Store listesi Türkçe ve İngilizce olarak dolduruldu
- [ ] Destek URL'si çalışıyor
- [ ] Marketing URL çalışıyor

---

*Son güncelleme: 2026-03-17*
