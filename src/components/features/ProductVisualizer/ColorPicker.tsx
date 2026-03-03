"use client";

import { useState } from "react";
import { Palette, Check } from "lucide-react";
import { colorMap } from "@/components/ui/ProductSVG";
import { useLocale } from "@/contexts/LocaleContext";
import { cn } from "@/lib/utils";

interface Props {
  selectedColor: string;
  onColorChange: (colorName: string, hex?: string) => void;
}

const isLightColor = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 160;
};

export default function ColorPicker({ selectedColor, onColorChange }: Props) {
  const { dict } = useLocale();
  const v = dict.visualizer;
  const [customHex, setCustomHex] = useState("");

  const handleCustomApply = () => {
    if (/^#[0-9A-Fa-f]{6}$/.test(customHex)) {
      onColorChange(customHex, customHex);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">
        <Palette size={14} />
        <span>{v.colorPalette}</span>
      </div>

      {/* Color swatches */}
      <div className="grid grid-cols-4 gap-2">
        {Object.entries(colorMap).map(([name, hex]) => {
          const isSelected = selectedColor === name;
          const light = isLightColor(hex);
          return (
            <button
              key={name}
              onClick={() => onColorChange(name)}
              title={name}
              className={cn(
                "relative h-8 w-full rounded-md transition-all",
                isSelected
                  ? "ring-2 ring-amber-500 ring-offset-1 ring-offset-neutral-900"
                  : "ring-1 ring-neutral-600 hover:ring-neutral-400"
              )}
              style={{ backgroundColor: hex }}
            >
              {isSelected && (
                <Check
                  size={14}
                  strokeWidth={3}
                  className={cn(
                    "absolute inset-0 m-auto",
                    light ? "text-neutral-800" : "text-white"
                  )}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Selected color label */}
      <div className="text-xs text-neutral-500">
        {selectedColor}
      </div>

      {/* Custom hex */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[11px] font-medium text-neutral-500">
          {v.customColor}
        </span>
        <div className="flex gap-1.5">
          <input
            type="text"
            value={customHex}
            onChange={(e) => setCustomHex(e.target.value)}
            placeholder={v.customHexPlaceholder}
            maxLength={7}
            className="flex-1 rounded-md border border-neutral-700 bg-neutral-800 px-2 py-1.5 text-xs text-neutral-200 placeholder:text-neutral-600 outline-none focus:border-amber-500"
          />
          <button
            onClick={handleCustomApply}
            disabled={!/^#[0-9A-Fa-f]{6}$/.test(customHex)}
            className="rounded-md bg-amber-500/20 px-2.5 py-1.5 text-xs font-medium text-amber-400 transition-colors hover:bg-amber-500/30 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {v.applyColor}
          </button>
        </div>
      </div>
    </div>
  );
}
