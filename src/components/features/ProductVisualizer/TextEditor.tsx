"use client";

import { useState } from "react";
import { Type, Plus, Trash2 } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import type { TextOverlay } from "@/types/visualizer";
import { cn } from "@/lib/utils";

interface Props {
  texts: TextOverlay[];
  onAddText: (text: TextOverlay) => void;
  onUpdateText: (id: string, updates: Partial<TextOverlay>) => void;
  onRemoveText: (id: string) => void;
}

const FONT_OPTIONS = [
  { label: "Fraunces", value: "Fraunces, Georgia, serif" },
  { label: "Instrument Sans", value: "Instrument Sans, sans-serif" },
  { label: "JetBrains Mono", value: "JetBrains Mono, monospace" },
];

export default function TextEditor({
  texts,
  onAddText,
  onUpdateText,
  onRemoveText,
}: Props) {
  const { dict } = useLocale();
  const v = dict.visualizer;
  const [newText, setNewText] = useState("");

  const handleAdd = () => {
    if (!newText.trim()) return;
    onAddText({
      id: crypto.randomUUID(),
      content: newText.trim(),
      x: 0.3,
      y: 0.5,
      fontSize: 24,
      fontFamily: FONT_OPTIONS[0].value,
      color: "#ffffff",
    });
    setNewText("");
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">
        <Type size={14} />
        <span>{v.textOverlay}</span>
      </div>

      {/* Add new text */}
      <div className="flex gap-1.5">
        <input
          type="text"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder={v.textPlaceholder}
          className="flex-1 rounded-md border border-neutral-700 bg-neutral-800 px-2 py-1.5 text-xs text-neutral-200 placeholder:text-neutral-600 outline-none focus:border-amber-500"
        />
        <button
          onClick={handleAdd}
          disabled={!newText.trim()}
          className="rounded-md bg-amber-500/20 p-1.5 text-amber-400 transition-colors hover:bg-amber-500/30 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Plus size={14} />
        </button>
      </div>

      {/* Existing texts */}
      <div className="flex max-h-[180px] flex-col gap-2 overflow-y-auto">
        {texts.map((text) => (
          <div
            key={text.id}
            className="rounded-lg border border-neutral-700/50 bg-neutral-800/50 p-2.5"
          >
            <div className="mb-2 flex items-start justify-between gap-2">
              <span
                className="flex-1 text-sm text-neutral-200 truncate"
                title={text.content}
              >
                {text.content}
              </span>
              <button
                onClick={() => onRemoveText(text.id)}
                className="shrink-0 rounded p-0.5 text-neutral-500 transition-colors hover:bg-red-500/20 hover:text-red-400"
              >
                <Trash2 size={12} />
              </button>
            </div>

            {/* Font */}
            <select
              value={text.fontFamily}
              onChange={(e) =>
                onUpdateText(text.id, { fontFamily: e.target.value })
              }
              className="mb-1.5 w-full rounded border border-neutral-700 bg-neutral-800 px-2 py-1 text-[11px] text-neutral-300 outline-none focus:border-amber-500"
            >
              {FONT_OPTIONS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>

            {/* Size + Color */}
            <div className="flex items-center gap-2">
              <label className="text-[10px] text-neutral-500">{v.fontSize}</label>
              <input
                type="range"
                min={12}
                max={72}
                value={text.fontSize}
                onChange={(e) =>
                  onUpdateText(text.id, { fontSize: Number(e.target.value) })
                }
                className={cn(
                  "h-1 flex-1 appearance-none rounded-full bg-neutral-700",
                  "[&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-500"
                )}
              />
              <span className="w-6 text-right text-[10px] text-neutral-500">
                {text.fontSize}
              </span>
              <input
                type="color"
                value={text.color}
                onChange={(e) =>
                  onUpdateText(text.id, { color: e.target.value })
                }
                className="h-5 w-5 cursor-pointer rounded border border-neutral-600 bg-transparent"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
