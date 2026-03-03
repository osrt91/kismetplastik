"use client";

import { Download, Save, ShoppingCart } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";

interface Props {
  onExportPNG: () => void;
  onSaveDesign: () => void;
  onRequestQuote: () => void;
  isExporting: boolean;
  isSaving: boolean;
  saveStatus: "idle" | "saving" | "saved" | "login";
}

export default function ExportPanel({
  onExportPNG,
  onSaveDesign,
  onRequestQuote,
  isExporting,
  isSaving,
  saveStatus,
}: Props) {
  const { dict } = useLocale();
  const v = dict.visualizer;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Save */}
      <button
        onClick={onSaveDesign}
        disabled={isSaving}
        className="flex items-center gap-2 rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2.5 text-sm font-medium text-neutral-200 transition-colors hover:border-neutral-600 hover:bg-neutral-700 disabled:opacity-50"
      >
        <Save size={16} />
        {saveStatus === "saving"
          ? v.saving
          : saveStatus === "saved"
          ? v.saved
          : saveStatus === "login"
          ? v.loginToSave
          : v.saveDesign}
      </button>

      {/* Export PNG */}
      <button
        onClick={onExportPNG}
        disabled={isExporting}
        className="flex items-center gap-2 rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2.5 text-sm font-medium text-neutral-200 transition-colors hover:border-neutral-600 hover:bg-neutral-700 disabled:opacity-50"
      >
        <Download size={16} />
        {isExporting ? v.exportingImage : v.exportPNG}
      </button>

      {/* Request Quote */}
      <button
        onClick={onRequestQuote}
        className="flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-neutral-900 transition-colors hover:bg-amber-400"
      >
        <ShoppingCart size={16} />
        {v.requestQuote}
      </button>
    </div>
  );
}
