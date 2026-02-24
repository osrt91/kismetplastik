"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, RotateCcw, ZoomIn, Check } from "lucide-react";
import ProductSVG, { colorMap } from "@/components/ui/ProductSVG";
import type { Product } from "@/types/product";
import type { CategorySlug } from "@/types/product";

interface Props {
  product: Product;
  onColorChange?: (color: string) => void;
}

const categoryToSvgType: Record<CategorySlug, "bottle" | "jar" | "cap" | "preform" | "set"> = {
  "pet-siseler": "bottle",
  "kavanozlar": "jar",
  "kapaklar": "cap",
  "preformlar": "preform",
  "ambalaj-setleri": "set",
  "ozel-uretim": "bottle",
};

export default function ProductViewer({ product, onColorChange }: Props) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || "Şeffaf");
  const [isZoomed, setIsZoomed] = useState(false);

  const svgType = categoryToSvgType[product.category] || "bottle";

  function handleColorSelect(color: string) {
    setSelectedColor(color);
    onColorChange?.(color);
  }

  function handleReset() {
    const defaultColor = product.colors[0] || "Şeffaf";
    setSelectedColor(defaultColor);
    setIsZoomed(false);
    onColorChange?.(defaultColor);
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* SVG Display Area */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/60 border border-slate-200/60">
        {/* Badges */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          {product.featured && (
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-400/90 text-amber-950 shadow-sm backdrop-blur-sm"
            >
              ★ Öne Çıkan
            </motion.span>
          )}
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold shadow-sm backdrop-blur-sm ${
              product.inStock
                ? "bg-emerald-100/90 text-emerald-800"
                : "bg-red-100/90 text-red-800"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                product.inStock ? "bg-emerald-500" : "bg-red-500"
              }`}
            />
            {product.inStock ? "Stokta" : "Stok Dışı"}
          </motion.span>
        </div>

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsZoomed((z) => !z)}
            className="p-2 rounded-xl bg-white/80 backdrop-blur-sm border border-slate-200/60 text-slate-600 hover:text-blue-600 hover:bg-white shadow-sm transition-colors"
            aria-label="Yakınlaştır"
          >
            <ZoomIn size={18} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleReset}
            className="p-2 rounded-xl bg-white/80 backdrop-blur-sm border border-slate-200/60 text-slate-600 hover:text-blue-600 hover:bg-white shadow-sm transition-colors"
            aria-label="Sıfırla"
          >
            <RotateCcw size={18} />
          </motion.button>
        </div>

        {/* Product SVG */}
        <div className="flex items-center justify-center min-h-[320px] md:min-h-[420px] py-12 px-8">
          <motion.div
            animate={{
              scale: isZoomed ? 1.4 : 1,
            }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            whileHover={{ scale: isZoomed ? 1.45 : 1.06 }}
            className="cursor-pointer"
            onClick={() => setIsZoomed((z) => !z)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedColor}
                initial={{ opacity: 0.6, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0.6, scale: 0.95 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <ProductSVG
                  type={svgType}
                  color={selectedColor}
                  size={160}
                  animated={false}
                />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Decorative dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 opacity-30">
          {[0, 1, 2].map((i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          ))}
        </div>
      </div>

      {/* Color Picker */}
      {product.colors.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <Palette size={16} className="text-blue-500" />
            <span>Renk Seçimi</span>
            <span className="ml-auto text-xs text-slate-400 font-normal">
              {selectedColor}
            </span>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {product.colors.map((color) => {
              const hex = colorMap[color] || "#e8f4fd";
              const isSelected = color === selectedColor;
              const isLight =
                hex === "#f5f5f5" || hex === "#e8f4fd" || hex === "#fdd835" || hex === "#ffc107";

              return (
                <motion.button
                  key={color}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleColorSelect(color)}
                  title={color}
                  className={`relative w-9 h-9 rounded-full transition-shadow duration-200 ${
                    isSelected
                      ? "ring-2 ring-offset-2 ring-blue-500 shadow-md"
                      : "ring-1 ring-slate-200 hover:ring-slate-300 hover:shadow-sm"
                  }`}
                  style={{ backgroundColor: hex }}
                  aria-label={`Renk: ${color}`}
                  aria-pressed={isSelected}
                >
                  <AnimatePresence>
                    {isSelected && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <Check
                          size={16}
                          strokeWidth={3}
                          className={isLight ? "text-slate-700" : "text-white"}
                        />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
