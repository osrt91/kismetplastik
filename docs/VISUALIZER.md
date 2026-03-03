# 2D/3D Urun Gorsellestirici

Kismet Plastik urun gorsellestirme aracinin teknik dokumantasyonu.

## Genel Bakis

Platform iki gorsellestirme modu sunar:

| Mod | Component | Teknoloji | Kullanim |
|-----|-----------|-----------|---------|
| **3D** | `Product3DViewer` | React Three Fiber + Drei + Three.js | Urun detay sayfalarinda interaktif 3D model |
| **2D** | `ProductViewer` | SVG + Framer Motion | Hafif 2D gorsellemee, renk secimi |

Her iki component de `src/components/ui/` altinda yer alir.

---

## 3D Viewer

**Dosya:** `src/components/ui/Product3DViewer.tsx`
**Tip:** Client Component (`"use client"`)

### Bagimliliklar

```json
{
  "@react-three/fiber": "^9.5.0",
  "@react-three/drei": "^10.7.7",
  "three": "^0.183.1"
}
```

### Props

```typescript
interface Props {
  product: Product;       // Urun verisi (category, colors)
  selectedColor?: string; // Secili renk adi (ornek: "Seffaf", "Mavi")
}
```

### Prosedural Modeller

GLB/GLTF dosyalari yerine, her urun kategorisi icin prosedural 3D geometri kullanilir:

| Model | Fonksiyon | Aciklama |
|-------|-----------|----------|
| **Bottle** | `BottleModel` | Silindirik govde, boyun bolumu, etiket alani. PET/plastik sise icin. |
| **Cap** | `CapModel` | Kapak govde, cevre dis izleri (24 adet), alt halka. |
| **Spray** | `SprayModel` | Sprey baslik, tetik, boru, silindirik govde. |
| **Pump** | `PumpModel` | Pompa baslik, cikis borusu, boyun halkasi, govde. |
| **Funnel** | `FunnelModel` | Konik govde (DoubleSide material), alt boru. |

### Kategori → Model Esleme

```typescript
const categoryTo3DModel: Record<CategorySlug, ModelType> = {
  "pet-siseler":            "bottle",
  "plastik-siseler":        "bottle",
  "kapaklar":               "cap",
  "tipalar":                "cap",
  "parmak-spreyler":        "spray",
  "pompalar":               "pump",
  "tetikli-pusturtuculer":  "spray",
  "huniler":                "funnel",
};
```

### Sahne Yapisi

```
Canvas
  ├── ambientLight (intensity: 0.3)
  ├── directionalLight x2 (ana + dolgu)
  ├── pointLight (mavi ton, yumusak)
  ├── Float (hafif yukari-asagi hareketi)
  │   └── ProductModel (kategori bazli 3D model)
  ├── ContactShadows (zemin golge)
  ├── Environment (preset: "city")
  └── OrbitControls (orbit, zoom, auto-rotate)
```

### Malzeme Ozellikleri

Sise modelleri `meshPhysicalMaterial` kullanir (fiziksel tabanlama):

| Ozellik | Deger | Aciklama |
|---------|-------|----------|
| `roughness` | 0.12 - 0.15 | Yuzey puruzlulugu (dusuk = parlak) |
| `metalness` | 0.05 - 0.1 | Metalik gorunum |
| `clearcoat` | 0.3 - 1.0 | Seffaf kaplama (seffaf renkler icin yuksek) |
| `clearcoatRoughness` | 0.1 | Kaplama puruzlulugu |
| `ior` | 1.5 | Kirilma endeksi (cam/plastik) |
| `thickness` | 0 - 1.0 | Seffaflik kalinligi |
| `opacity` | 0.55 - 0.95 | Seffaflik (seffaf renk: 0.55, opak: 0.95) |
| `transparent` | true/false | Seffaf renk icin `true` |
| `envMapIntensity` | 1.5 | Cevre haritasi yoğunlugu |

Kapak ve sprey modelleri `meshStandardMaterial` kullanir (daha hafif).

### Kontroller

| Kontrol | Deger | Aciklama |
|---------|-------|----------|
| OrbitControls | enablePan: false | Pan devre disi |
| | minPolarAngle: PI/5 | Minimum dikey aci |
| | maxPolarAngle: PI/1.6 | Maksimum dikey aci |
| | minDistance: 3.5 | Minimum zoom mesafesi |
| | maxDistance: 7 | Maksimum zoom mesafesi |
| | autoRotate: true | Otomatik dondurme |
| | autoRotateSpeed: 0.8 | Dondurme hizi |
| | enableDamping: true | Yumusak durdurma |
| Auto-rotation | delta * 0.25 rad/frame | Model kendi etrafinda doner |

### Fullscreen Modu

Tam ekran butonu (sag ust kose):
- `requestFullscreen()` API'si ile tam ekran gecisi
- `<Maximize2>` / `<Minimize2>` ikonlari (Lucide)
- Tam ekranda canvas yuksekligi `100vh` olur

### Yukleme Durumu

`<Suspense fallback={<LoadingFallback />}>` ile sarilanir. Loading state'de:
- Ortada donen loader ikonu (`Loader2`)
- "3D..." metni

---

## 2D Viewer

**Dosya:** `src/components/ui/ProductViewer.tsx`
**Tip:** Client Component (`"use client"`)

### Props

```typescript
interface Props {
  product: Product;                    // Urun verisi
  onColorChange?: (color: string) => void; // Renk degisim callback'i
}
```

### Ozellikler

1. **SVG Gorsellemee:** `ProductSVG` component'i uzerinden
   - Kategori bazli SVG silhouette (bottle/cap)
   - Secili renge gore fill degisir

2. **Renk Secici:**
   - Urunun `colors` array'indeki renkler gosterilir
   - Secili renk `Check` ikonu ile belirtilir
   - `colorMap` ile renk adi → hex kodu donusumu

3. **Zoom Kontrolu:**
   - `isZoomed` state ile buyutme/kucultme
   - CSS `scale` transform kullanilir

4. **Reset Butonu:**
   - Rengi varsayilana dondurur
   - Zoom'u sifirlar

### Kategori → SVG Esleme

```typescript
const categoryToSvgType: Record<CategorySlug, "bottle" | "cap"> = {
  "pet-siseler":            "bottle",
  "plastik-siseler":        "bottle",
  "kapaklar":               "cap",
  "tipalar":                "cap",
  "parmak-spreyler":        "cap",
  "pompalar":               "cap",
  "tetikli-pusturtuculer":  "cap",
  "huniler":                "cap",
};
```

### Animasyonlar

Framer Motion ile:
- `AnimatePresence` — renk degisim gecisleri
- `motion.div` — SVG alani icin hover ve layout animasyonlari

---

## Renk Sistemi

Renkler `ProductSVG.tsx` icerisindeki `colorMap` objesiyle yonetilir:

```typescript
export const colorMap: Record<string, string> = {
  "Seffaf":       "#e8f4fd",
  "Beyaz":        "#f8f8f8",
  "Mavi":         "#2196f3",
  "Koyu Mavi":    "#1565c0",
  "Yesil":        "#4caf50",
  "Koyu Yesil":   "#2e7d32",
  "Kirmizi":      "#f44336",
  "Siyah":        "#333333",
  "Amber":        "#ff8f00",
  "Pembe":        "#e91e63",
  "Mor":          "#9c27b0",
  "Turkuaz":      "#00bcd4",
  "Gri":          "#9e9e9e",
  "Altin":        "#ffd700",
  "Gumus":        "#c0c0c0",
  "Kahverengi":   "#795548",
};
```

`getThreeColor()` fonksiyonu renk adini hex koduna cevirir. Tanimlanmamis renkler icin varsayilan `#e8f4fd` (seffaf) kullanilir.

---

## Dynamic Import Stratejisi

3D viewer Three.js agir bir kutuphane icerdigi icin (~600KB gzipped), sadece gerektigi sayfalarda yuklenir:

```typescript
// Urun detay sayfasinda
import dynamic from "next/dynamic";

const Product3DViewer = dynamic(
  () => import("@/components/ui/Product3DViewer"),
  { ssr: false }  // Three.js server'da calismaz
);
```

**Neden `ssr: false`?**
- Three.js `window` ve `document` API'lerine bagimlidir
- WebGL context sadece browser'da mevcuttur
- Server-side rendering sirasinda hata olusur

2D Viewer (SVG bazli) icin dynamic import gerekli degildir — lightweight ve SSR uyumludur.

---

## Ilgili Dosyalar

| Dosya | Aciklama |
|-------|----------|
| `src/components/ui/Product3DViewer.tsx` | 3D gorsellestirici (Three.js) |
| `src/components/ui/ProductViewer.tsx` | 2D gorsellestirici (SVG) |
| `src/components/ui/ProductSVG.tsx` | SVG urun cizimi + colorMap |
| `src/types/product.ts` | Product, CategorySlug tipleri |
| `src/app/[locale]/urun-olustur/` | Standalone gorsellestirici sayfasi |

---

## Ilgili Dokumanlar

- [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md) — products tablo yapisi
- [ARCHITECTURE.md](../ARCHITECTURE.md) — Component hiyerarsisi
- [B2B_PORTAL.md](B2B_PORTAL.md) — Portal'da urun gorselleme
