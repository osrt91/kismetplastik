#!/usr/bin/env bash
# =============================================================================
# Kismet Plastik — Unified App Build Script
# Builds Android (TWA via Bubblewrap) and provides iOS (Capacitor) instructions
# =============================================================================

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Directories
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
TWA_DIR="$SCRIPT_DIR"
OUTPUT_DIR="$SCRIPT_DIR/output"

# App info
APP_NAME="Kısmet Plastik"
PACKAGE_ID="com.kismetplastik.app"
SITE_URL="https://www.kismetplastik.com"

# =============================================================================
# Helper Functions
# =============================================================================

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[OK]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }
log_section() { echo -e "\n${CYAN}━━━ $1 ━━━${NC}\n"; }

check_command() {
  if command -v "$1" &> /dev/null; then
    log_success "$1 bulundu: $(command -v "$1")"
    return 0
  else
    log_error "$1 bulunamadı"
    return 1
  fi
}

# =============================================================================
# Prerequisite Checks
# =============================================================================

check_prerequisites() {
  log_section "On Gereksinim Kontrolu"

  local errors=0

  # Node.js
  if check_command node; then
    local node_version
    node_version=$(node -v | sed 's/v//' | cut -d. -f1)
    if [ "$node_version" -lt 18 ]; then
      log_error "Node.js 18+ gerekli (mevcut: $(node -v))"
      ((errors++))
    fi
  else
    ((errors++))
  fi

  # npm
  check_command npm || ((errors++))

  # Java (Android)
  if check_command java; then
    local java_version
    java_version=$(java -version 2>&1 | head -1 | cut -d'"' -f2 | cut -d'.' -f1)
    if [ "$java_version" -lt 17 ]; then
      log_warn "Java 17+ onerilir (mevcut: $java_version). Bubblewrap otomatik indirebilir."
    fi
  else
    log_warn "Java bulunamadi. Bubblewrap otomatik JDK indirebilir."
  fi

  # Bubblewrap
  if ! check_command bubblewrap; then
    log_warn "Bubblewrap bulunamadi. Yuklemek icin: npm i -g @bubblewrap/cli"
  fi

  # Xcode (macOS only)
  if [[ "$OSTYPE" == "darwin"* ]]; then
    if check_command xcodebuild; then
      log_success "Xcode bulundu: $(xcodebuild -version | head -1)"
    else
      log_warn "Xcode bulunamadi. iOS build icin Xcode 15+ gerekli."
    fi

    # CocoaPods
    check_command pod || log_warn "CocoaPods bulunamadi. Yuklemek icin: sudo gem install cocoapods"

    # Capacitor
    if npx cap --version &> /dev/null 2>&1; then
      log_success "Capacitor CLI bulundu"
    else
      log_warn "Capacitor CLI bulunamadi. Yuklemek icin: npm install @capacitor/cli"
    fi
  else
    log_info "macOS degil — iOS build atlaniyor (yalnizca macOS'ta mumkun)"
  fi

  if [ $errors -gt 0 ]; then
    log_error "$errors kritik gereksinim eksik. Devam edilemiyor."
    exit 1
  fi

  log_success "Temel gereksinimler tamam"
}

# =============================================================================
# Site Connectivity Check
# =============================================================================

check_site() {
  log_section "Site Erisim Kontrolu"

  if command -v curl &> /dev/null; then
    local http_code
    http_code=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL/test/tr" --max-time 10 || echo "000")

    if [ "$http_code" = "200" ]; then
      log_success "Site erisilebilir: $SITE_URL ($http_code)"
    else
      log_warn "Site yanit verdi ama HTTP $http_code dondu (200 bekleniyor)"
    fi

    # Manifest check
    http_code=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL/test/manifest.json" --max-time 10 || echo "000")
    if [ "$http_code" = "200" ]; then
      log_success "PWA manifest erisilebilir"
    else
      log_warn "PWA manifest erisilemiyor ($http_code). Store build icin manifest gerekli."
    fi

    # Asset Links check
    http_code=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL/.well-known/assetlinks.json" --max-time 10 || echo "000")
    if [ "$http_code" = "200" ]; then
      log_success "Digital Asset Links erisilebilir"
    else
      log_warn "assetlinks.json erisilemiyor ($http_code). Android TWA icin gerekli."
    fi
  else
    log_warn "curl bulunamadi — site kontrolu atlandi"
  fi
}

# =============================================================================
# Generate Missing Icons
# =============================================================================

generate_icons() {
  log_section "Simge Kontrolu"

  local icons_dir="$PROJECT_DIR/public/images"
  local source_icon="$icons_dir/icon-512.png"
  local missing=0

  # Required icon sizes for full PWA + store coverage
  local sizes=(48 72 96 128 144 192 256 384 512 1024)

  for size in "${sizes[@]}"; do
    if [ ! -f "$icons_dir/icon-${size}.png" ]; then
      log_warn "Eksik simge: icon-${size}.png"
      ((missing++))
    else
      log_success "icon-${size}.png mevcut"
    fi
  done

  # Maskable icons
  for size in 192 512; do
    if [ ! -f "$icons_dir/icon-maskable-${size}.png" ]; then
      log_warn "Eksik maskable simge: icon-maskable-${size}.png"
      ((missing++))
    else
      log_success "icon-maskable-${size}.png mevcut"
    fi
  done

  if [ $missing -gt 0 ]; then
    log_warn "$missing simge eksik."

    if command -v convert &> /dev/null; then
      log_info "ImageMagick bulundu — eksik simgeler olusturuluyor..."

      for size in "${sizes[@]}"; do
        if [ ! -f "$icons_dir/icon-${size}.png" ]; then
          convert "$source_icon" -resize "${size}x${size}" "$icons_dir/icon-${size}.png"
          log_success "Olusturuldu: icon-${size}.png"
        fi
      done

      log_success "Tum simgeler olusturuldu"
    else
      log_warn "ImageMagick yuklu degil. Simgeleri manuel olusturun veya:"
      log_info "  brew install imagemagick  (macOS)"
      log_info "  apt install imagemagick   (Ubuntu)"
      log_info "  choco install imagemagick (Windows)"
      log_info ""
      log_info "Veya online: https://www.pwabuilder.com/imageGenerator"
    fi
  else
    log_success "Tum simgeler mevcut"
  fi
}

# =============================================================================
# Create Screenshots Directory
# =============================================================================

setup_screenshots() {
  log_section "Ekran Goruntuleri Dizini"

  local screenshots_dir="$PROJECT_DIR/public/images/screenshots"

  if [ ! -d "$screenshots_dir" ]; then
    mkdir -p "$screenshots_dir"
    log_success "Olusturuldu: $screenshots_dir"
    log_info "Asagidaki ekran goruntulerini bu dizine ekleyin:"
  else
    log_success "Screenshots dizini mevcut"
  fi

  echo ""
  echo "  Gerekli ekran goruntuleri:"
  echo "  ─────────────────────────────────────────────────"
  echo "  Android (Google Play):"
  echo "    screenshot-mobile-home.png      (1080x1920)"
  echo "    screenshot-mobile-products.png  (1080x1920)"
  echo "    screenshot-mobile-portal.png    (1080x1920)"
  echo "    screenshot-desktop-home.png     (1920x1080)"
  echo "    screenshot-desktop-products.png (1920x1080)"
  echo ""
  echo "  iOS (App Store):"
  echo "    screenshot-ios-67-home.png      (1290x2796 — iPhone 6.7\")"
  echo "    screenshot-ios-67-products.png  (1290x2796)"
  echo "    screenshot-ios-67-portal.png    (1290x2796)"
  echo "    screenshot-ios-65-home.png      (1242x2688 — iPhone 6.5\")"
  echo "    screenshot-ios-65-products.png  (1242x2688)"
  echo "    screenshot-ios-55-home.png      (1242x2208 — iPhone 5.5\")"
  echo "    screenshot-ios-55-products.png  (1242x2208)"
  echo "  ─────────────────────────────────────────────────"
}

# =============================================================================
# Build Android AAB (TWA via Bubblewrap)
# =============================================================================

build_android() {
  log_section "Android Build (TWA / Bubblewrap)"

  # Check bubblewrap
  if ! command -v bubblewrap &> /dev/null; then
    log_error "Bubblewrap CLI bulunamadi."
    log_info "Yuklemek icin: npm i -g @bubblewrap/cli"
    return 1
  fi

  cd "$TWA_DIR"

  # Check if project is initialized
  if [ ! -d "app" ] && [ ! -f "build.gradle" ]; then
    log_info "TWA projesi henuz olusturulmamis. Baslatiliyor..."
    bubblewrap init --manifest "$SITE_URL/test/manifest.json"
    log_success "TWA projesi olusturuldu"
  fi

  # Build
  log_info "AAB ve APK olusturuluyor..."
  bubblewrap build

  # Move outputs
  mkdir -p "$OUTPUT_DIR/android"

  if [ -f "app-release-bundle.aab" ]; then
    cp app-release-bundle.aab "$OUTPUT_DIR/android/"
    log_success "AAB olusturuldu: $OUTPUT_DIR/android/app-release-bundle.aab"
  fi

  if [ -f "app-release-signed.apk" ]; then
    cp app-release-signed.apk "$OUTPUT_DIR/android/"
    log_success "APK olusturuldu: $OUTPUT_DIR/android/app-release-signed.apk"
  fi

  # SHA256 fingerprint reminder
  if [ -f "android.keystore" ]; then
    echo ""
    log_warn "ONEMLI: SHA256 fingerprint'i assetlinks.json'a eklemeyi unutmayin!"
    log_info "Fingerprint almak icin:"
    echo "  keytool -list -v -keystore $TWA_DIR/android.keystore -alias kismetplastik"
    echo ""
  fi

  log_success "Android build tamamlandi"
}

# =============================================================================
# iOS Build Instructions (Capacitor)
# =============================================================================

build_ios() {
  log_section "iOS Build (Capacitor)"

  if [[ "$OSTYPE" != "darwin"* ]]; then
    log_warn "iOS build yalnizca macOS'ta mumkundur."
    log_info "macOS bilgisayarinizda asagidaki adimlari izleyin:"
    echo ""
    echo "  1. Proje klasorune gidin:"
    echo "     cd $PROJECT_DIR"
    echo ""
    echo "  2. Capacitor bagimliliklarini yukleyin:"
    echo "     npm install @capacitor/core @capacitor/cli @capacitor/ios"
    echo "     npm install @capacitor/splash-screen @capacitor/status-bar"
    echo "     npm install @capacitor/keyboard @capacitor/push-notifications"
    echo "     npm install @capacitor/haptics @capacitor/share"
    echo ""
    echo "  3. Capacitor config'i kopyalayin:"
    echo "     cp twa/capacitor.config.ts ./capacitor.config.ts"
    echo ""
    echo "  4. iOS platformunu ekleyin:"
    echo "     npx cap add ios"
    echo ""
    echo "  5. Sync ve build:"
    echo "     npx cap sync ios"
    echo "     npx cap open ios"
    echo ""
    echo "  6. Xcode'da Archive > Distribute > App Store Connect"
    echo ""
    echo "  Detayli rehber: twa/APP-STORE-REHBER.md"
    return 0
  fi

  cd "$PROJECT_DIR"

  # Check Capacitor installation
  if [ ! -f "node_modules/@capacitor/cli/package.json" ]; then
    log_info "Capacitor yuklenemiyor. Yuklemek icin:"
    log_info "  npm install @capacitor/core @capacitor/cli @capacitor/ios"
    return 1
  fi

  # Copy config if not present
  if [ ! -f "capacitor.config.ts" ]; then
    cp "$TWA_DIR/capacitor.config.ts" "$PROJECT_DIR/capacitor.config.ts"
    log_success "capacitor.config.ts kopyalandi"
  fi

  # Check if iOS platform exists
  if [ ! -d "ios" ]; then
    log_info "iOS platformu ekleniyor..."
    npx cap add ios
    log_success "iOS platformu eklendi"
  fi

  # Sync
  log_info "iOS projesi senkronize ediliyor..."
  npx cap sync ios
  log_success "iOS projesi senkronize edildi"

  # Open Xcode
  log_info "Xcode aciliyor..."
  npx cap open ios

  echo ""
  log_info "Xcode'da:"
  echo "  1. Signing > Team secinizi yapin (Apple Developer hesabi)"
  echo "  2. Product > Archive"
  echo "  3. Distribute App > App Store Connect"
  echo ""

  log_success "iOS build hazirligi tamamlandi"
}

# =============================================================================
# Summary
# =============================================================================

print_summary() {
  log_section "Ozet"

  echo "  $APP_NAME ($PACKAGE_ID)"
  echo "  ──────────────────────────────────────────"
  echo ""

  # Android status
  if [ -f "$OUTPUT_DIR/android/app-release-bundle.aab" ]; then
    local aab_size
    aab_size=$(du -h "$OUTPUT_DIR/android/app-release-bundle.aab" | cut -f1)
    echo "  Android (Google Play):  HAZIR ($aab_size)"
    echo "    AAB: $OUTPUT_DIR/android/app-release-bundle.aab"
    echo "    APK: $OUTPUT_DIR/android/app-release-signed.apk"
  else
    echo "  Android (Google Play):  BUILD GEREKLI"
    echo "    Komut: $0 --android"
  fi

  echo ""

  # iOS status
  if [ -d "$PROJECT_DIR/ios" ]; then
    echo "  iOS (App Store):       XCODE HAZIR"
    echo "    Proje: $PROJECT_DIR/ios/"
  else
    echo "  iOS (App Store):       KURULUM GEREKLI"
    echo "    Rehber: $TWA_DIR/APP-STORE-REHBER.md"
  fi

  echo ""
  echo "  ──────────────────────────────────────────"
  echo ""
  echo "  Rehberler:"
  echo "    Android: $TWA_DIR/PLAY-STORE-REHBER.md"
  echo "    iOS:     $TWA_DIR/APP-STORE-REHBER.md"
  echo ""
}

# =============================================================================
# Main
# =============================================================================

main() {
  echo ""
  echo "  ╔═══════════════════════════════════════════╗"
  echo "  ║   Kismet Plastik — App Build Script       ║"
  echo "  ║   Android (TWA) + iOS (Capacitor)         ║"
  echo "  ╚═══════════════════════════════════════════╝"
  echo ""

  local build_android_flag=false
  local build_ios_flag=false
  local check_only=false

  # Parse arguments
  case "${1:-all}" in
    --android|-a)
      build_android_flag=true
      ;;
    --ios|-i)
      build_ios_flag=true
      ;;
    --check|-c)
      check_only=true
      ;;
    --help|-h)
      echo "Kullanim: $0 [--android|--ios|--check|--help]"
      echo ""
      echo "  --android, -a   Sadece Android (TWA) build"
      echo "  --ios, -i       Sadece iOS (Capacitor) build"
      echo "  --check, -c     Sadece gereksinim kontrolu"
      echo "  --help, -h      Bu yardim mesaji"
      echo "  (arguman yok)   Tum kontroller + her iki platform build"
      exit 0
      ;;
    all|"")
      build_android_flag=true
      build_ios_flag=true
      ;;
    *)
      log_error "Bilinmeyen arguman: $1"
      echo "Kullanim: $0 [--android|--ios|--check|--help]"
      exit 1
      ;;
  esac

  # Always run checks
  check_prerequisites
  check_site
  generate_icons
  setup_screenshots

  if [ "$check_only" = true ]; then
    log_success "Kontrol tamamlandi."
    exit 0
  fi

  # Build platforms
  if [ "$build_android_flag" = true ]; then
    build_android || log_error "Android build basarisiz"
  fi

  if [ "$build_ios_flag" = true ]; then
    build_ios || log_error "iOS build basarisiz"
  fi

  print_summary
}

main "$@"
