#!/usr/bin/env bash
# =============================================================================
# Generate all required app icons from a single 1024x1024 source icon
# Requires: ImageMagick (convert command)
# =============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
ICONS_DIR="$PROJECT_DIR/public/images"

# Source icon (must be at least 1024x1024)
SOURCE_ICON="${1:-$ICONS_DIR/icon-512.png}"
SOURCE_MASKABLE="${2:-$ICONS_DIR/icon-maskable-512.png}"

if [ ! -f "$SOURCE_ICON" ]; then
  echo "ERROR: Source icon not found: $SOURCE_ICON"
  echo "Usage: $0 [source-icon.png] [source-maskable-icon.png]"
  exit 1
fi

if ! command -v convert &> /dev/null; then
  echo "ERROR: ImageMagick is required but not installed."
  echo "Install with:"
  echo "  macOS:   brew install imagemagick"
  echo "  Ubuntu:  sudo apt install imagemagick"
  echo "  Windows: choco install imagemagick"
  exit 1
fi

echo "Generating icons from: $SOURCE_ICON"
echo "Output directory: $ICONS_DIR"
echo ""

# =============================================================================
# PWA + Android icons (any purpose)
# =============================================================================

PWA_SIZES=(48 72 96 128 144 192 256 384 512 1024)

for size in "${PWA_SIZES[@]}"; do
  output="$ICONS_DIR/icon-${size}.png"
  if [ ! -f "$output" ] || [ "$SOURCE_ICON" -nt "$output" ]; then
    convert "$SOURCE_ICON" -resize "${size}x${size}" -quality 100 "$output"
    echo "  Created: icon-${size}.png"
  else
    echo "  Exists:  icon-${size}.png (skipped)"
  fi
done

# =============================================================================
# Maskable icons (with safe zone padding)
# =============================================================================

MASKABLE_SIZES=(192 512)

if [ -f "$SOURCE_MASKABLE" ]; then
  for size in "${MASKABLE_SIZES[@]}"; do
    output="$ICONS_DIR/icon-maskable-${size}.png"
    if [ ! -f "$output" ] || [ "$SOURCE_MASKABLE" -nt "$output" ]; then
      convert "$SOURCE_MASKABLE" -resize "${size}x${size}" -quality 100 "$output"
      echo "  Created: icon-maskable-${size}.png"
    else
      echo "  Exists:  icon-maskable-${size}.png (skipped)"
    fi
  done
else
  echo ""
  echo "  WARN: No maskable source icon found. Creating from regular icon with padding..."
  for size in "${MASKABLE_SIZES[@]}"; do
    output="$ICONS_DIR/icon-maskable-${size}.png"
    # Add 20% padding (safe zone) for maskable icons
    inner_size=$(( size * 80 / 100 ))
    convert "$SOURCE_ICON" \
      -resize "${inner_size}x${inner_size}" \
      -gravity center \
      -background "#FAFAF7" \
      -extent "${size}x${size}" \
      -quality 100 \
      "$output"
    echo "  Created: icon-maskable-${size}.png (with safe zone padding)"
  done
fi

# =============================================================================
# iOS App Store icons (AppIcon.appiconset)
# =============================================================================

echo ""
echo "iOS App Icons:"

IOS_DIR="$ICONS_DIR/ios-icons"
mkdir -p "$IOS_DIR"

# iOS icon sizes: size@scale
declare -A IOS_ICONS=(
  ["20@1x"]=20
  ["20@2x"]=40
  ["20@3x"]=60
  ["29@1x"]=29
  ["29@2x"]=58
  ["29@3x"]=87
  ["40@1x"]=40
  ["40@2x"]=80
  ["40@3x"]=120
  ["60@2x"]=120
  ["60@3x"]=180
  ["76@1x"]=76
  ["76@2x"]=152
  ["83.5@2x"]=167
  ["1024@1x"]=1024
)

for key in "${!IOS_ICONS[@]}"; do
  size=${IOS_ICONS[$key]}
  output="$IOS_DIR/icon-${key}.png"
  convert "$SOURCE_ICON" -resize "${size}x${size}" -quality 100 "$output"
  echo "  Created: ios-icons/icon-${key}.png (${size}x${size})"
done

# =============================================================================
# Android adaptive icon (foreground layer)
# =============================================================================

echo ""
echo "Android Adaptive Icon:"

ANDROID_DIR="$ICONS_DIR/android-icons"
mkdir -p "$ANDROID_DIR"

# Android adaptive icon sizes: mdpi(48), hdpi(72), xhdpi(96), xxhdpi(144), xxxhdpi(192)
declare -A ANDROID_ADAPTIVE=(
  ["mdpi"]=108
  ["hdpi"]=162
  ["xhdpi"]=216
  ["xxhdpi"]=324
  ["xxxhdpi"]=432
)

for density in "${!ANDROID_ADAPTIVE[@]}"; do
  size=${ANDROID_ADAPTIVE[$density]}
  output="$ANDROID_DIR/ic_launcher_foreground_${density}.png"
  # Foreground layer is 108dp with safe zone (66dp visible area)
  inner_size=$(( size * 66 / 108 ))
  convert "$SOURCE_ICON" \
    -resize "${inner_size}x${inner_size}" \
    -gravity center \
    -background none \
    -extent "${size}x${size}" \
    -quality 100 \
    "$output"
  echo "  Created: android-icons/ic_launcher_foreground_${density}.png (${size}x${size})"
done

# =============================================================================
# Feature graphic for Google Play (1024x500)
# =============================================================================

echo ""
echo "Store Graphics:"

STORE_DIR="$ICONS_DIR/store"
mkdir -p "$STORE_DIR"

# Google Play feature graphic (1024x500)
convert -size 1024x500 "xc:#0A1628" \
  "$SOURCE_ICON" -resize 300x300 -gravity center -composite \
  -quality 100 \
  "$STORE_DIR/feature-graphic-1024x500.png" 2>/dev/null && \
  echo "  Created: store/feature-graphic-1024x500.png (1024x500)" || \
  echo "  WARN: Could not create feature graphic (composite failed)"

echo ""
echo "Done! Generated icons in: $ICONS_DIR"
echo ""
echo "Next steps:"
echo "  1. Review generated icons for quality"
echo "  2. For iOS: Copy ios-icons/ contents to Xcode AppIcon.appiconset"
echo "  3. For Android: Bubblewrap uses icon-512.png and icon-maskable-512.png automatically"
echo "  4. For stores: Prepare screenshots in public/images/screenshots/"
