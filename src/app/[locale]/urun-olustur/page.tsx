"use client";

import { useState, useMemo } from "react";
import Link from "@/components/ui/LocaleLink";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Package,
  Droplets,
  Palette,
  CircleDot,
  Pipette,
  FileText,
  ChevronRight,
  RotateCcw,
} from "lucide-react";

/* ━━━━━━━━━━━━━━━━ TYPES ━━━━━━━━━━━━━━━━ */

interface Config {
  type: string;
  volume: string;
  shape: string;
  color: string;
  colorHex: string;
  closure: string;
}

/* ━━━━━━━━━━━━━━━━ DATA ━━━━━━━━━━━━━━━━ */

const bottleTypes = [
  { name: "PET Şişe", desc: "Hafif, dayanıklı ve geri dönüştürülebilir" },
  { name: "Plastik Şişe", desc: "Ekonomik ve çok yönlü çözüm" },
];

const volumes = [
  "30ml",
  "50ml",
  "100ml",
  "150ml",
  "200ml",
  "250ml",
  "300ml",
  "500ml",
];

const shapeOptions = [
  { name: "Düz", desc: "Düz kenarlı klasik form" },
  { name: "Oval", desc: "Zarif oval tasarım" },
  { name: "Silindir", desc: "Uzun silindirik form" },
  { name: "Yuvarlak", desc: "Dolgun yuvarlak gövde" },
];

const colorOptions = [
  { name: "Şeffaf", hex: "#E8F4FD" },
  { name: "Amber", hex: "#D97706" },
  { name: "Beyaz", hex: "#F9FAFB" },
  { name: "Füme", hex: "#6B7280" },
  { name: "Mavi", hex: "#3B82F6" },
  { name: "Pembe", hex: "#EC4899" },
  { name: "Siyah", hex: "#1F2937" },
  { name: "Yeşil", hex: "#22C55E" },
];

const closureOptions = [
  { name: "Vidalı Kapak", desc: "Standart vidalı kapak" },
  { name: "Flip-Top", desc: "Açılır kapak" },
  { name: "Pompa", desc: "Dozajlı pompa" },
  { name: "Sprey", desc: "Püskürtme başlığı" },
  { name: "Tıpa", desc: "Mantar/plastik tıpa" },
  { name: "Damlatıcı", desc: "Hassas dozaj damlatıcı" },
];

const stepDefs = [
  { num: 1, title: "Şişe Tipi", icon: Package },
  { num: 2, title: "Hacim", icon: Droplets },
  { num: 3, title: "Şekil", icon: CircleDot },
  { num: 4, title: "Renk", icon: Palette },
  { num: 5, title: "Kapak / Tıpa", icon: Pipette },
  { num: 6, title: "Özet", icon: FileText },
];

/* ━━━━━━━━━━━━━━━━ SVG DATA ━━━━━━━━━━━━━━━━ */

const bottlePaths: Record<string, string> = {
  Düz: "M85,68 Q85,60 100,60 Q115,60 115,68 L115,100 L132,110 L132,295 Q132,310 100,310 Q68,310 68,295 L68,110 L85,100 Z",
  Oval: "M85,68 Q85,60 100,60 Q115,60 115,68 L115,100 Q152,155 140,235 Q132,308 100,312 Q68,308 60,235 Q48,155 85,100 Z",
  Silindir:
    "M88,68 Q88,60 100,60 Q112,60 112,68 L112,100 L122,107 L122,305 Q122,320 100,320 Q78,320 78,305 L78,107 L88,100 Z",
  Yuvarlak:
    "M85,68 Q85,60 100,60 Q115,60 115,68 L115,100 Q165,140 158,225 Q152,302 100,312 Q48,302 42,225 Q35,140 85,100 Z",
};

const volumeScales: Record<string, number> = {
  "30ml": 0.55,
  "50ml": 0.62,
  "100ml": 0.72,
  "150ml": 0.78,
  "200ml": 0.84,
  "250ml": 0.9,
  "300ml": 0.95,
  "500ml": 1.0,
};

/* ━━━━━━━━━━━━━━━━ CAP SVG ━━━━━━━━━━━━━━━━ */

function CapSVG({
  type,
  color,
  stroke,
}: {
  type: string;
  color: string;
  stroke: string;
}) {
  switch (type) {
    case "Vidalı Kapak":
      return (
        <g>
          <rect
            x="79"
            y="38"
            width="42"
            height="26"
            rx="4"
            fill={color}
            stroke={stroke}
            strokeWidth="1"
          />
          <line
            x1="79"
            y1="46"
            x2="121"
            y2="46"
            stroke={stroke}
            strokeWidth="0.7"
            opacity="0.4"
          />
          <line
            x1="79"
            y1="52"
            x2="121"
            y2="52"
            stroke={stroke}
            strokeWidth="0.7"
            opacity="0.4"
          />
          <line
            x1="79"
            y1="58"
            x2="121"
            y2="58"
            stroke={stroke}
            strokeWidth="0.7"
            opacity="0.4"
          />
        </g>
      );
    case "Flip-Top":
      return (
        <g>
          <rect
            x="79"
            y="46"
            width="42"
            height="18"
            rx="4"
            fill={color}
            stroke={stroke}
            strokeWidth="1"
          />
          <path
            d="M81,46 Q81,30 100,26 Q119,30 119,46"
            fill={color}
            stroke={stroke}
            strokeWidth="1"
          />
        </g>
      );
    case "Pompa":
      return (
        <g>
          <rect
            x="82"
            y="52"
            width="36"
            height="14"
            rx="3"
            fill={color}
            stroke={stroke}
            strokeWidth="1"
          />
          <rect
            x="95"
            y="10"
            width="10"
            height="42"
            rx="3"
            fill={color}
            stroke={stroke}
            strokeWidth="1"
          />
          <rect
            x="85"
            y="2"
            width="30"
            height="12"
            rx="6"
            fill={color}
            stroke={stroke}
            strokeWidth="1"
          />
        </g>
      );
    case "Sprey":
      return (
        <g>
          <rect
            x="82"
            y="52"
            width="36"
            height="14"
            rx="3"
            fill={color}
            stroke={stroke}
            strokeWidth="1"
          />
          <rect
            x="95"
            y="20"
            width="10"
            height="32"
            rx="3"
            fill={color}
            stroke={stroke}
            strokeWidth="1"
          />
          <path
            d="M95,22 L72,14 L72,20 L95,28"
            fill={color}
            stroke={stroke}
            strokeWidth="1"
          />
        </g>
      );
    case "Tıpa":
      return (
        <path
          d="M87,64 L84,42 Q84,32 100,32 Q116,32 116,42 L113,64 Z"
          fill={color}
          stroke={stroke}
          strokeWidth="1"
        />
      );
    case "Damlatıcı":
      return (
        <g>
          <rect
            x="82"
            y="52"
            width="36"
            height="14"
            rx="3"
            fill={color}
            stroke={stroke}
            strokeWidth="1"
          />
          <rect
            x="96"
            y="24"
            width="8"
            height="28"
            rx="2"
            fill={color}
            stroke={stroke}
            strokeWidth="1"
          />
          <ellipse
            cx="100"
            cy="16"
            rx="12"
            ry="14"
            fill={color}
            stroke={stroke}
            strokeWidth="1"
          />
        </g>
      );
    default:
      return null;
  }
}

/* ━━━━━━━━━━━━━━━━ BOTTLE PREVIEW ━━━━━━━━━━━━━━━━ */

function BottlePreview({ config }: { config: Config }) {
  const activeShape = config.shape || "Düz";
  const fillColor = config.colorHex;
  const scale = config.volume ? (volumeScales[config.volume] ?? 0.75) : 0.75;
  const isDark = ["#1F2937", "#6B7280"].includes(fillColor);
  const capColor = isDark ? "#D1D5DB" : "#4B5563";
  const capStroke = isDark ? "#9CA3AF" : "#374151";
  const bottleStroke = isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.12)";

  return (
    <div className="relative flex min-h-[280px] items-center justify-center overflow-hidden rounded-2xl border border-neutral-200 bg-gradient-to-b from-neutral-50 to-neutral-100/80 lg:min-h-[520px]">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #000 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <svg
        viewBox="0 0 200 340"
        className="relative z-10 h-[220px] w-auto lg:h-[400px]"
      >
        <ellipse
          cx="100"
          cy="325"
          rx={45 * scale}
          ry={6 * scale}
          fill="rgba(0,0,0,0.06)"
          style={{ transition: "all 0.5s ease" }}
        />

        <g
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "100px 200px",
            transition: "transform 0.5s ease",
          }}
        >
          {Object.entries(bottlePaths).map(([shapeName, pathD]) => (
            <path
              key={shapeName}
              d={pathD}
              fill={fillColor}
              stroke={bottleStroke}
              strokeWidth="1.5"
              style={{
                opacity: shapeName === activeShape ? 1 : 0,
                transform:
                  shapeName === activeShape ? "scale(1)" : "scale(0.95)",
                transition:
                  "opacity 0.4s ease, transform 0.4s ease, fill 0.5s ease, stroke 0.5s ease",
                transformOrigin: "100px 190px",
              }}
            />
          ))}

          <ellipse
            cx="100"
            cy="60"
            rx="16"
            ry="3"
            fill="none"
            stroke={bottleStroke}
            strokeWidth="1"
            style={{ transition: "stroke 0.5s ease" }}
          />

          {closureOptions.map((c) => (
            <g
              key={c.name}
              style={{
                opacity: config.closure === c.name ? 1 : 0,
                transform:
                  config.closure === c.name
                    ? "translateY(0)"
                    : "translateY(-15px)",
                transition:
                  "opacity 0.4s ease, transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
            >
              <CapSVG type={c.name} color={capColor} stroke={capStroke} />
            </g>
          ))}
        </g>
      </svg>

      <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1.5 lg:bottom-4 lg:left-4 lg:right-4 lg:gap-2">
        {config.type && (
          <span className="rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-medium text-neutral-700 shadow-sm backdrop-blur-sm lg:text-xs">
            {config.type}
          </span>
        )}
        {config.volume && (
          <span className="rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-medium text-neutral-700 shadow-sm backdrop-blur-sm lg:text-xs">
            {config.volume}
          </span>
        )}
        {config.shape && (
          <span className="rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-medium text-neutral-700 shadow-sm backdrop-blur-sm lg:text-xs">
            {config.shape}
          </span>
        )}
        {config.color && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-medium text-neutral-700 shadow-sm backdrop-blur-sm lg:text-xs">
            <span
              className="h-2.5 w-2.5 rounded-full border border-neutral-200"
              style={{ backgroundColor: config.colorHex }}
            />
            {config.color}
          </span>
        )}
        {config.closure && (
          <span className="rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-medium text-neutral-700 shadow-sm backdrop-blur-sm lg:text-xs">
            {config.closure}
          </span>
        )}
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━ OPTION CARD ━━━━━━━━━━━━━━━━ */

function OptionCard({
  selected,
  onClick,
  children,
  className = "",
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative rounded-xl border-2 text-left transition-all duration-300 ${
        selected
          ? "border-primary-500 bg-primary-50 shadow-md shadow-primary-100"
          : "border-neutral-200 bg-white hover:border-primary-200 hover:shadow-sm"
      } ${className}`}
    >
      {selected && (
        <span className="absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary-500 text-white">
          <Check size={12} />
        </span>
      )}
      {children}
    </button>
  );
}

/* ━━━━━━━━━━━━━━━━ MAIN PAGE ━━━━━━━━━━━━━━━━ */

export default function UrunOlusturPage() {
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState<Config>({
    type: "",
    volume: "",
    shape: "",
    color: "",
    colorHex: "#E8F4FD",
    closure: "",
  });

  const canProceed = useMemo(() => {
    switch (step) {
      case 1:
        return !!config.type;
      case 2:
        return !!config.volume;
      case 3:
        return !!config.shape;
      case 4:
        return !!config.color;
      case 5:
        return !!config.closure;
      default:
        return true;
    }
  }, [step, config]);

  const handleSelect = (
    field: keyof Config,
    value: string,
    extra?: Partial<Config>,
  ) => {
    setConfig((prev) => ({ ...prev, [field]: value, ...extra }));
  };

  const nextStep = () => {
    if (canProceed && step < 6) setStep(step + 1);
  };
  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };
  const resetConfig = () => {
    setStep(1);
    setConfig({
      type: "",
      volume: "",
      shape: "",
      color: "",
      colorHex: "#E8F4FD",
      closure: "",
    });
  };

  const teklifUrl = useMemo(() => {
    const params = new URLSearchParams({
      type: config.type,
      volume: config.volume,
      shape: config.shape,
      color: config.color,
      closure: config.closure,
    });
    return `/teklif-al?${params.toString()}`;
  }, [config]);

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="grid gap-4 sm:grid-cols-2">
            {bottleTypes.map((t) => (
              <OptionCard
                key={t.name}
                selected={config.type === t.name}
                onClick={() => handleSelect("type", t.name)}
                className="p-5"
              >
                <Package
                  size={28}
                  className={
                    config.type === t.name
                      ? "text-primary-600"
                      : "text-neutral-400 transition-colors group-hover:text-primary-400"
                  }
                />
                <p className="mt-3 font-bold text-neutral-900">{t.name}</p>
                <p className="mt-1 text-sm text-neutral-500">{t.desc}</p>
              </OptionCard>
            ))}
          </div>
        );

      case 2:
        return (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {volumes.map((v) => (
              <OptionCard
                key={v}
                selected={config.volume === v}
                onClick={() => handleSelect("volume", v)}
                className="px-3 py-4 text-center"
              >
                <Droplets
                  size={20}
                  className={`mx-auto mb-2 transition-colors ${config.volume === v ? "text-primary-500" : "text-neutral-300"}`}
                />
                <p className="font-bold text-neutral-700">{v}</p>
              </OptionCard>
            ))}
          </div>
        );

      case 3:
        return (
          <div className="grid grid-cols-2 gap-4">
            {shapeOptions.map((s) => (
              <OptionCard
                key={s.name}
                selected={config.shape === s.name}
                onClick={() => handleSelect("shape", s.name)}
                className="p-4"
              >
                <svg
                  viewBox="0 0 200 340"
                  className="mx-auto mb-2 h-16 w-auto"
                >
                  <path
                    d={bottlePaths[s.name]}
                    fill={config.colorHex}
                    stroke="rgba(0,0,0,0.1)"
                    strokeWidth="2"
                    style={{ transition: "fill 0.5s ease" }}
                  />
                </svg>
                <p className="text-center font-bold text-neutral-900">
                  {s.name}
                </p>
                <p className="mt-0.5 text-center text-xs text-neutral-500">
                  {s.desc}
                </p>
              </OptionCard>
            ))}
          </div>
        );

      case 4:
        return (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {colorOptions.map((c) => (
              <OptionCard
                key={c.name}
                selected={config.color === c.name}
                onClick={() =>
                  handleSelect("color", c.name, { colorHex: c.hex })
                }
                className="p-4 text-center"
              >
                <span
                  className={`mx-auto mb-2 block h-10 w-10 rounded-full border-2 transition-all duration-300 ${
                    config.color === c.name
                      ? "scale-110 border-primary-400 shadow-md"
                      : "border-neutral-200 group-hover:scale-105 group-hover:shadow-sm"
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
                <p className="text-sm font-semibold text-neutral-700">
                  {c.name}
                </p>
              </OptionCard>
            ))}
          </div>
        );

      case 5:
        return (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {closureOptions.map((c) => (
              <OptionCard
                key={c.name}
                selected={config.closure === c.name}
                onClick={() => handleSelect("closure", c.name)}
                className="p-4"
              >
                <svg
                  viewBox="60 -2 80 75"
                  className="mx-auto mb-2 h-10 w-auto"
                >
                  <CapSVG type={c.name} color="#4B5563" stroke="#374151" />
                </svg>
                <p className="text-center text-sm font-bold text-neutral-900">
                  {c.name}
                </p>
                <p className="mt-0.5 text-center text-xs text-neutral-500">
                  {c.desc}
                </p>
              </OptionCard>
            ))}
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="rounded-xl border border-neutral-200 bg-white p-5 lg:p-6">
              <h3 className="mb-4 text-lg font-bold text-primary-900">
                Ürün Özeti
              </h3>
              <div className="space-y-3">
                {[
                  { label: "Şişe Tipi", value: config.type },
                  { label: "Hacim", value: config.volume },
                  { label: "Şekil", value: config.shape },
                  { label: "Renk", value: config.color },
                  { label: "Kapak / Tıpa", value: config.closure },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-center justify-between border-b border-neutral-100 pb-2 last:border-0"
                  >
                    <span className="text-sm text-neutral-500">
                      {item.label}
                    </span>
                    <span className="font-semibold text-neutral-900">
                      {item.value}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Link
                href={teklifUrl}
                className="group flex w-full items-center justify-center gap-2 rounded-xl py-4 font-bold text-primary-900 shadow-lg transition-all duration-300 hover:shadow-xl active:scale-[0.98]"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, var(--accent-500), var(--accent-400), var(--accent-600), var(--accent-500))",
                  backgroundSize: "300% 100%",
                  animation: "shimmer 4s ease infinite",
                }}
              >
                <span className="absolute inset-0 -translate-x-full rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
                <span className="relative flex items-center gap-2">
                  Teklif İste
                  <ArrowRight
                    size={20}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </span>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-center"
            >
              <button
                type="button"
                onClick={resetConfig}
                className="inline-flex items-center gap-2 text-sm text-neutral-500 transition-colors hover:text-primary-700"
              >
                <RotateCcw size={14} />
                Yeniden Başla
              </button>
            </motion.div>
          </div>
        );
    }
  };

  return (
    <section className="bg-white">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-700 to-primary-900 py-14 lg:py-20">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <Package
          size={260}
          strokeWidth={0.5}
          className="pointer-events-none absolute -right-8 top-1/2 -translate-y-1/2 text-white/[0.04] lg:right-20"
        />

        <div className="relative mx-auto max-w-7xl px-4 lg:px-6">
          <nav className="mb-6 flex items-center gap-1.5 text-sm text-white/60">
            <Link href="/" className="transition-colors hover:text-white">
              Ana Sayfa
            </Link>
            <ChevronRight size={14} />
            <span className="text-white">Ürün Oluştur</span>
          </nav>
          <h1 className="mb-3 text-3xl font-extrabold text-white sm:text-4xl">
            Ürününüzü Tasarlayın
          </h1>
          <p className="max-w-2xl text-white/70">
            Adım adım özel kozmetik ambalajınızı yapılandırın ve hemen teklif
            alın.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6 lg:py-14">
        {/* Step Progress */}
        <div className="mb-8 flex items-center overflow-x-auto pb-2">
          {stepDefs.map((s, i) => (
            <div key={s.num} className="flex items-center">
              <button
                type="button"
                onClick={() => {
                  if (s.num <= step) setStep(s.num);
                }}
                disabled={s.num > step}
                className={`flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-all ${
                  s.num === step
                    ? "bg-primary-500 text-white shadow-md shadow-primary-500/20"
                    : s.num < step
                      ? "cursor-pointer bg-primary-100 text-primary-700 hover:bg-primary-200"
                      : "bg-neutral-100 text-neutral-400"
                }`}
              >
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                    s.num === step
                      ? "bg-white text-primary-700"
                      : s.num < step
                        ? "bg-primary-500 text-white"
                        : "bg-neutral-200 text-neutral-500"
                  }`}
                >
                  {s.num < step ? <Check size={12} /> : s.num}
                </span>
                <span className="hidden sm:inline">{s.title}</span>
              </button>
              {i < stepDefs.length - 1 && (
                <div
                  className={`mx-1.5 h-px w-4 sm:mx-2 sm:w-10 ${i < step - 1 ? "bg-primary-300" : "bg-neutral-200"}`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Two-column layout */}
        <div className="grid gap-8 lg:grid-cols-[3fr_2fr]">
          {/* Left: Preview */}
          <BottlePreview config={config} />

          {/* Right: Step Content */}
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <div className="mb-5">
                  <h2 className="flex items-center gap-2 text-xl font-bold text-primary-900">
                    {(() => {
                      const Icon = stepDefs[step - 1].icon;
                      return <Icon size={22} className="text-primary-500" />;
                    })()}
                    Adım {step}: {stepDefs[step - 1].title}
                  </h2>
                  {step < 6 && (
                    <p className="mt-1 text-sm text-neutral-500">
                      Bir seçenek belirleyin
                    </p>
                  )}
                </div>

                {renderStepContent()}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            {step < 6 && (
              <div className="mt-8 flex items-center justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={step === 1}
                  className="flex items-center gap-2 rounded-xl border border-neutral-200 px-5 py-3 text-sm font-semibold text-neutral-700 transition-all hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ArrowLeft size={16} />
                  Geri
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!canProceed}
                  className="flex items-center gap-2 rounded-xl bg-primary-500 px-6 py-3 text-sm font-bold text-white shadow-md shadow-primary-500/20 transition-all hover:bg-primary-600 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-40"
                >
                  İleri
                  <ArrowRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
