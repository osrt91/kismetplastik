"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";

interface QRCodeProps {
  url: string;
  size?: number;
  color?: string;
  downloadLabel?: string;
}

export default function QRCodeComponent({
  url,
  size = 200,
  color = "#002060",
  downloadLabel = "PNG İndir",
}: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [svgMarkup, setSvgMarkup] = useState("");

  useEffect(() => {
    QRCode.toString(url, {
      type: "svg",
      margin: 2,
      width: size,
      color: { dark: color, light: "#ffffff" },
    }).then(setSvgMarkup);

    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, url, {
        width: size,
        margin: 2,
        color: { dark: color, light: "#ffffff" },
      });
    }
  }, [url, size, color]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = "kismetplastik-qr.png";
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-700"
        dangerouslySetInnerHTML={{ __html: svgMarkup }}
      />
      <canvas ref={canvasRef} className="hidden" />
      <button
        onClick={handleDownload}
        className="inline-flex items-center gap-2 rounded-lg bg-primary-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-800"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        {downloadLabel}
      </button>
    </div>
  );
}
