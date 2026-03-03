"use client";

import { useCallback, useRef } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import type { LogoOverlay } from "@/types/visualizer";

interface Props {
  logo?: LogoOverlay;
  onLogoUpload: (logo: LogoOverlay) => void;
  onLogoRemove: () => void;
}

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_TYPES = ["image/png", "image/svg+xml", "image/jpeg"];

export default function LogoUploader({ logo, onLogoUpload, onLogoRemove }: Props) {
  const { dict } = useLocale();
  const v = dict.visualizer;
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (!ACCEPTED_TYPES.includes(file.type)) return;
      if (file.size > MAX_SIZE) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        onLogoUpload({
          url,
          x: 0.3,
          y: 0.4,
          width: 0.4,
          height: 0.2,
        });
      };
      reader.readAsDataURL(file);
    },
    [onLogoUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">
        <ImageIcon size={14} />
        <span>{v.logoUpload}</span>
      </div>

      {logo ? (
        <div className="relative rounded-lg border border-neutral-700 bg-neutral-800 p-2">
          {/* eslint-disable-next-line @next/next/no-img-element -- data URL from local file upload */}
          <img
            src={logo.url}
            alt="Logo"
            className="h-16 w-full rounded object-contain"
          />
          <button
            onClick={onLogoRemove}
            className="absolute -right-1.5 -top-1.5 rounded-full bg-red-500/80 p-0.5 text-white transition-colors hover:bg-red-500"
          >
            <X size={12} />
          </button>
          <p className="mt-1.5 text-center text-[10px] text-neutral-500">
            {v.removeLogo}
          </p>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed border-neutral-600 bg-neutral-800/50 px-3 py-5 transition-colors hover:border-amber-500/50 hover:bg-neutral-800"
        >
          <Upload size={20} className="text-neutral-500" />
          <span className="text-xs text-neutral-400">{v.dragDrop}</span>
          <span className="text-[10px] text-neutral-600">{v.maxFileSize}</span>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".png,.svg,.jpeg,.jpg"
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}
