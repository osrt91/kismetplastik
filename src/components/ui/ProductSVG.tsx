"use client";

interface Props {
  type: "bottle" | "jar" | "cap" | "preform" | "spray" | "set";
  color?: string;
  size?: number;
  className?: string;
  animated?: boolean;
}

const colorMap: Record<string, string> = {
  "Şeffaf": "#e8f4fd",
  "Mavi": "#4a90d9",
  "Yeşil": "#4caf50",
  "Amber": "#ff8f00",
  "Beyaz": "#f5f5f5",
  "Siyah": "#333333",
  "Kırmızı": "#e53935",
  "Füme": "#616161",
  "Pembe": "#ec407a",
  "Mor": "#7b1fa2",
  "Sarı": "#fdd835",
  "Turuncu": "#ff9800",
  "Lacivert": "#1a237e",
  "Gri": "#9e9e9e",
  "Gümüş": "#bdbdbd",
  "Altın": "#ffc107",
};

function getHexColor(name: string): string {
  return colorMap[name] || "#e8f4fd";
}

export default function ProductSVG({ type, color = "Şeffaf", size = 120, className = "", animated = false }: Props) {
  const fill = getHexColor(color);
  const stroke = "#0d47a1";
  const animClass = animated ? "transition-transform duration-500 hover:scale-110" : "";

  if (type === "bottle") {
    return (
      <svg width={size} height={size * 1.8} viewBox="0 0 80 144" fill="none" className={`${animClass} ${className}`}>
        <rect x="30" y="2" width="20" height="12" rx="2" fill={stroke} opacity="0.2" />
        <rect x="32" y="14" width="16" height="6" rx="1" fill={stroke} opacity="0.15" />
        <path d="M32 20 C32 20 24 35 24 45 L24 130 C24 136 30 140 40 140 C50 140 56 136 56 130 L56 45 C56 35 48 20 48 20 Z" fill={fill} stroke={stroke} strokeWidth="1.5" opacity="0.9" />
        <ellipse cx="40" cy="130" rx="16" ry="4" fill={stroke} opacity="0.08" />
        <path d="M30 50 C30 50 35 48 40 48 C45 48 50 50 50 50" stroke="white" strokeWidth="0.8" opacity="0.4" />
        <path d="M28 70 L52 70" stroke="white" strokeWidth="0.5" opacity="0.2" />
        <rect x="28" y="2" width="24" height="14" rx="3" fill={stroke} opacity="0.7" />
      </svg>
    );
  }

  if (type === "jar") {
    return (
      <svg width={size} height={size * 1.2} viewBox="0 0 100 120" fill="none" className={`${animClass} ${className}`}>
        <rect x="20" y="2" width="60" height="10" rx="3" fill={stroke} opacity="0.6" />
        <path d="M20 12 L20 100 C20 108 30 114 50 114 C70 114 80 108 80 100 L80 12 Z" fill={fill} stroke={stroke} strokeWidth="1.5" opacity="0.9" />
        <ellipse cx="50" cy="100" rx="30" ry="6" fill={stroke} opacity="0.08" />
        <path d="M25 30 C25 30 37 28 50 28 C63 28 75 30 75 30" stroke="white" strokeWidth="0.8" opacity="0.3" />
        <rect x="30" y="50" width="40" height="30" rx="4" fill="white" opacity="0.15" />
      </svg>
    );
  }

  if (type === "cap") {
    return (
      <svg width={size} height={size * 0.8} viewBox="0 0 80 64" fill="none" className={`${animClass} ${className}`}>
        <ellipse cx="40" cy="10" rx="28" ry="8" fill={fill} stroke={stroke} strokeWidth="1.5" opacity="0.9" />
        <path d="M12 10 L12 48 C12 56 24 60 40 60 C56 60 68 56 68 48 L68 10" fill={fill} stroke={stroke} strokeWidth="1.5" opacity="0.85" />
        <path d="M12 10 C12 18 24 22 40 22 C56 22 68 18 68 10" fill="white" opacity="0.15" />
        {[0,1,2,3,4,5,6,7,8].map(i => (
          <line key={i} x1={14 + i * 6} y1="22" x2={14 + i * 6} y2="55" stroke={stroke} strokeWidth="0.4" opacity="0.2" />
        ))}
        <ellipse cx="40" cy="50" rx="28" ry="5" fill={stroke} opacity="0.1" />
      </svg>
    );
  }

  if (type === "spray" || type === "preform") {
    return (
      <svg width={size * 0.7} height={size * 1.6} viewBox="0 0 56 128" fill="none" className={`${animClass} ${className}`}>
        <rect x="18" y="2" width="20" height="10" rx="2" fill={stroke} opacity="0.2" />
        <rect x="12" y="12" width="32" height="14" rx="3" fill={stroke} opacity="0.5" />
        <rect x="4" y="16" width="10" height="6" rx="2" fill={stroke} opacity="0.4" />
        <path d="M20 26 C20 26 16 38 16 48 L16 115 C16 120 22 124 28 124 C34 124 40 120 40 115 L40 48 C40 38 36 26 36 26 Z" fill={fill} stroke={stroke} strokeWidth="1.5" opacity="0.9" />
        <path d="M22 50 C22 50 25 48 28 48 C31 48 34 50 34 50" stroke="white" strokeWidth="0.8" opacity="0.4" />
      </svg>
    );
  }

  // Set (bottle + cap combo)
  return (
    <svg width={size * 1.2} height={size * 1.5} viewBox="0 0 120 150" fill="none" className={`${animClass} ${className}`}>
      {/* Bottle */}
      <rect x="40" y="12" width="20" height="10" rx="2" fill={stroke} opacity="0.2" />
      <path d="M42 22 C42 22 34 35 34 45 L34 120 C34 126 40 130 50 130 C60 130 66 126 66 120 L66 45 C66 35 58 22 58 22 Z" fill={fill} stroke={stroke} strokeWidth="1.5" opacity="0.9" />
      {/* Cap */}
      <ellipse cx="50" cy="8" rx="14" ry="4" fill={stroke} opacity="0.6" />
      <path d="M36 8 L36 14 C36 16 42 18 50 18 C58 18 64 16 64 14 L64 8" fill={stroke} opacity="0.5" />
      {/* Label */}
      <rect x="38" y="60" width="24" height="35" rx="3" fill="white" stroke={stroke} strokeWidth="0.5" opacity="0.25" />
    </svg>
  );
}

export { getHexColor, colorMap };
