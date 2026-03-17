"use client";

import { Download } from "lucide-react";

interface CatalogDownloadButtonProps {
  label: string;
}

export default function CatalogDownloadButton({ label }: CatalogDownloadButtonProps) {
  return (
    <button
      onClick={() =>
        alert(
          "Katalog indirme ozelligi yakinda aktif olacaktir. Lutfen bizimle iletisime gecin."
        )
      }
      className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-primary-900 px-5 py-3 text-sm font-semibold text-primary-900 transition-all hover:bg-primary-900 hover:text-white"
    >
      <Download size={18} className="bounce-on-hover" />
      {label}
    </button>
  );
}
