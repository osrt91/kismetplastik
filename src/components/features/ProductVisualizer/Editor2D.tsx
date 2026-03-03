"use client";

import {
  useRef,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
  useState,
} from "react";
import { colorMap } from "@/components/ui/ProductSVG";
import type { CategorySlug } from "@/types/product";
import type { LogoOverlay, TextOverlay } from "@/types/visualizer";

interface Props {
  categorySlug: CategorySlug;
  color: string;
  customHex?: string;
  logo?: LogoOverlay;
  texts: TextOverlay[];
  onLogoPositionChange?: (x: number, y: number) => void;
}

export interface Editor2DRef {
  exportPNG: () => string | null;
}

function getHex(colorName: string, customHex?: string): string {
  if (customHex) return customHex;
  return colorMap[colorName] || "#e8f4fd";
}

type ShapeType = "bottle" | "cap" | "spray" | "pump" | "funnel";

const categoryToShape: Record<CategorySlug, ShapeType> = {
  "pet-siseler": "bottle",
  "plastik-siseler": "bottle",
  "kapaklar": "cap",
  "tipalar": "cap",
  "parmak-spreyler": "spray",
  "pompalar": "pump",
  "tetikli-pusturtuculer": "spray",
  "huniler": "funnel",
};

function drawProductSilhouette(
  ctx: CanvasRenderingContext2D,
  shape: ShapeType,
  fillColor: string,
  w: number,
  h: number
) {
  const cx = w / 2;
  const stroke = "#0A1628";

  ctx.save();
  ctx.lineWidth = 2;
  ctx.strokeStyle = stroke;
  ctx.fillStyle = fillColor;
  ctx.globalAlpha = 0.9;

  switch (shape) {
    case "bottle": {
      // Neck
      const nw = w * 0.12;
      const nh = h * 0.08;
      const ny = h * 0.05;
      ctx.fillStyle = "#1a237e";
      ctx.beginPath();
      ctx.roundRect(cx - nw, ny, nw * 2, nh, 3);
      ctx.fill();
      ctx.stroke();

      // Shoulder
      ctx.fillStyle = fillColor;
      ctx.beginPath();
      ctx.moveTo(cx - nw * 1.2, ny + nh);
      ctx.quadraticCurveTo(cx - w * 0.22, h * 0.2, cx - w * 0.22, h * 0.25);
      ctx.lineTo(cx + w * 0.22, h * 0.25);
      ctx.quadraticCurveTo(cx + w * 0.22, h * 0.2, cx + nw * 1.2, ny + nh);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Body
      ctx.beginPath();
      ctx.roundRect(cx - w * 0.22, h * 0.25, w * 0.44, h * 0.6, 4);
      ctx.fill();
      ctx.stroke();

      // Base
      ctx.beginPath();
      ctx.roundRect(cx - w * 0.23, h * 0.82, w * 0.46, h * 0.1, 4);
      ctx.fill();
      ctx.stroke();

      // Label area (ghost)
      ctx.fillStyle = "rgba(255,255,255,0.08)";
      ctx.beginPath();
      ctx.roundRect(cx - w * 0.16, h * 0.35, w * 0.32, h * 0.3, 4);
      ctx.fill();
      break;
    }
    case "cap": {
      const top = h * 0.15;
      const cw = w * 0.35;

      // Top disc
      ctx.beginPath();
      ctx.ellipse(cx, top, cw, h * 0.06, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Body
      ctx.beginPath();
      ctx.roundRect(cx - cw, top, cw * 2, h * 0.6, 4);
      ctx.fill();
      ctx.stroke();

      // Ridges
      ctx.globalAlpha = 0.15;
      for (let i = 0; i < 8; i++) {
        const x = cx - cw + (cw * 2 / 9) * (i + 1);
        ctx.beginPath();
        ctx.moveTo(x, top + h * 0.05);
        ctx.lineTo(x, top + h * 0.55);
        ctx.stroke();
      }
      ctx.globalAlpha = 0.9;
      break;
    }
    case "spray": {
      // Spray head
      ctx.fillStyle = "#555";
      ctx.beginPath();
      ctx.roundRect(cx - w * 0.1, h * 0.05, w * 0.2, h * 0.06, 3);
      ctx.fill();
      ctx.stroke();

      // Nozzle
      ctx.beginPath();
      ctx.moveTo(cx - w * 0.15, h * 0.06);
      ctx.lineTo(cx - w * 0.25, h * 0.03);
      ctx.lineTo(cx - w * 0.25, h * 0.05);
      ctx.lineTo(cx - w * 0.15, h * 0.08);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Collar
      ctx.fillStyle = fillColor;
      ctx.beginPath();
      ctx.roundRect(cx - w * 0.14, h * 0.11, w * 0.28, h * 0.06, 3);
      ctx.fill();
      ctx.stroke();

      // Body
      ctx.beginPath();
      ctx.roundRect(cx - w * 0.18, h * 0.17, w * 0.36, h * 0.65, 4);
      ctx.fill();
      ctx.stroke();

      // Base
      ctx.beginPath();
      ctx.roundRect(cx - w * 0.19, h * 0.8, w * 0.38, h * 0.1, 4);
      ctx.fill();
      ctx.stroke();
      break;
    }
    case "pump": {
      // Pump head
      ctx.fillStyle = "#aaa";
      ctx.beginPath();
      ctx.roundRect(cx - w * 0.08, h * 0.03, w * 0.16, h * 0.04, 3);
      ctx.fill();
      ctx.stroke();

      // Pump stem
      ctx.beginPath();
      ctx.roundRect(cx - w * 0.02, h * 0.07, w * 0.04, h * 0.08, 2);
      ctx.fill();
      ctx.stroke();

      // Nozzle
      ctx.beginPath();
      ctx.moveTo(cx + w * 0.05, h * 0.04);
      ctx.lineTo(cx + w * 0.18, h * 0.04);
      ctx.lineTo(cx + w * 0.18, h * 0.06);
      ctx.lineTo(cx + w * 0.05, h * 0.06);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Collar
      ctx.fillStyle = "#888";
      ctx.beginPath();
      ctx.roundRect(cx - w * 0.14, h * 0.15, w * 0.28, h * 0.05, 3);
      ctx.fill();
      ctx.stroke();

      // Body
      ctx.fillStyle = fillColor;
      ctx.beginPath();
      ctx.roundRect(cx - w * 0.2, h * 0.2, w * 0.4, h * 0.62, 4);
      ctx.fill();
      ctx.stroke();

      // Base
      ctx.beginPath();
      ctx.roundRect(cx - w * 0.21, h * 0.8, w * 0.42, h * 0.1, 4);
      ctx.fill();
      ctx.stroke();
      break;
    }
    case "funnel": {
      // Cone
      ctx.beginPath();
      ctx.moveTo(cx - w * 0.35, h * 0.15);
      ctx.lineTo(cx - w * 0.1, h * 0.55);
      ctx.lineTo(cx + w * 0.1, h * 0.55);
      ctx.lineTo(cx + w * 0.35, h * 0.15);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Tube
      ctx.beginPath();
      ctx.roundRect(cx - w * 0.1, h * 0.55, w * 0.2, h * 0.3, 3);
      ctx.fill();
      ctx.stroke();

      // Top rim
      ctx.beginPath();
      ctx.ellipse(cx, h * 0.15, w * 0.35, h * 0.04, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      break;
    }
  }

  ctx.restore();
}

const Editor2D = forwardRef<Editor2DRef, Props>(function Editor2D(
  { categorySlug, color, customHex, logo, texts, onLogoPositionChange },
  ref
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const logoImgRef = useRef<HTMLImageElement | null>(null);
  const [logoImgReady, setLogoImgReady] = useState(0);

  // Load logo image when URL changes
  useEffect(() => {
    if (!logo?.url) {
      logoImgRef.current = null;
      return;
    }
    const img = new Image();
    img.onload = () => {
      logoImgRef.current = img;
      setLogoImgReady((c) => c + 1);
    };
    img.src = logo.url;
  }, [logo?.url]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const hex = getHex(color, customHex);
    const shape = categoryToShape[categorySlug] || "bottle";

    // Clear
    ctx.clearRect(0, 0, w, h);

    // Background
    ctx.fillStyle = "#0D0D0D";
    ctx.fillRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = "rgba(255,255,255,0.03)";
    ctx.lineWidth = 1;
    const gridSize = 30;
    for (let x = 0; x <= w; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y <= h; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Draw product silhouette
    drawProductSilhouette(ctx, shape, hex, w, h);

    // Draw logo
    if (logo && logoImgRef.current) {
      const lx = logo.x * w;
      const ly = logo.y * h;
      const lw = logo.width * w;
      const lh = logo.height * h;
      ctx.drawImage(logoImgRef.current, lx, ly, lw, lh);
    }

    // Draw texts
    for (const text of texts) {
      ctx.save();
      ctx.font = `${text.fontSize}px ${text.fontFamily}`;
      ctx.fillStyle = text.color;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text.content, text.x * w, text.y * h);
      ctx.restore();
    }
    // logoImgReady triggers redraw when image finishes loading
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categorySlug, color, customHex, logo, logoImgReady, texts]);

  useEffect(() => {
    draw();
  }, [draw]);

  // Canvas resize observer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const resizeObserver = new ResizeObserver(() => {
      const { width, height } = parent.getBoundingClientRect();
      canvas.width = Math.floor(width * 2); // 2x for retina
      canvas.height = Math.floor(height * 2);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      draw();
    });
    resizeObserver.observe(parent);
    return () => resizeObserver.disconnect();
  }, [draw]);

  // Logo drag
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!logo || !canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      if (
        x >= logo.x &&
        x <= logo.x + logo.width &&
        y >= logo.y &&
        y <= logo.y + logo.height
      ) {
        setIsDragging(true);
      }
    },
    [logo]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDragging || !logo || !canvasRef.current || !onLogoPositionChange)
        return;
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - logo.width / 2;
      const y = (e.clientY - rect.top) / rect.height - logo.height / 2;
      onLogoPositionChange(
        Math.max(0, Math.min(1 - logo.width, x)),
        Math.max(0, Math.min(1 - logo.height, y))
      );
    },
    [isDragging, logo, onLogoPositionChange]
  );

  const handleMouseUp = useCallback(() => setIsDragging(false), []);

  const exportPNG = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    return canvas.toDataURL("image/png");
  }, []);

  useImperativeHandle(ref, () => ({ exportPNG }), [exportPNG]);

  return (
    <div className="relative h-full w-full">
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={isDragging ? "cursor-grabbing" : logo ? "cursor-grab" : "cursor-default"}
      />
    </div>
  );
});

export default Editor2D;
