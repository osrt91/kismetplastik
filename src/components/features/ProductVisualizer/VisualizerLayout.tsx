"use client";

import { useReducer, useRef, useCallback, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter, useParams } from "next/navigation";
import { RotateCcw, Cuboid, PenTool, Info } from "lucide-react";
import { products } from "@/data/products";
import { useLocale } from "@/contexts/LocaleContext";
import { cn } from "@/lib/utils";
import type { Product, CategorySlug } from "@/types/product";
import type {
  DesignConfig,
  VisualizerAction,
  LogoOverlay,
  TextOverlay,
} from "@/types/visualizer";
import { initialDesignConfig } from "@/types/visualizer";
import ProductSelector from "./ProductSelector";
import ColorPicker from "./ColorPicker";
import LogoUploader from "./LogoUploader";
import TextEditor from "./TextEditor";
import ExportPanel from "./ExportPanel";
import type { Viewer3DRef } from "./Viewer3D";
import type { Editor2DRef } from "./Editor2D";

// Dynamic imports for heavy components
const Viewer3D = dynamic(() => import("./Viewer3D"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
    </div>
  ),
});

const Editor2D = dynamic(() => import("./Editor2D"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
    </div>
  ),
});

function designReducer(state: DesignConfig, action: VisualizerAction): DesignConfig {
  switch (action.type) {
    case "SET_PRODUCT":
      return {
        ...state,
        productId: action.productId,
        categorySlug: action.categorySlug,
      };
    case "SET_COLOR":
      return {
        ...state,
        color: action.color,
        customHex: action.customHex,
      };
    case "SET_LOGO":
      return { ...state, logo: action.logo };
    case "REMOVE_LOGO":
      return { ...state, logo: undefined };
    case "SET_LOGO_POSITION":
      return state.logo
        ? { ...state, logo: { ...state.logo, x: action.x, y: action.y } }
        : state;
    case "ADD_TEXT":
      return { ...state, texts: [...state.texts, action.text] };
    case "UPDATE_TEXT":
      return {
        ...state,
        texts: state.texts.map((t) =>
          t.id === action.id ? { ...t, ...action.updates } : t
        ),
      };
    case "REMOVE_TEXT":
      return { ...state, texts: state.texts.filter((t) => t.id !== action.id) };
    case "SET_VIEW_MODE":
      return { ...state, viewMode: action.mode };
    case "RESET":
      return {
        ...initialDesignConfig,
        productId: state.productId,
        categorySlug: state.categorySlug,
      };
    default:
      return state;
  }
}

function checkWebGL(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return !!(
      canvas.getContext("webgl") || canvas.getContext("webgl2")
    );
  } catch {
    return false;
  }
}

export default function VisualizerLayout() {
  const { dict } = useLocale();
  const v = dict.visualizer;
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "tr";

  // Pick first product as default
  const defaultProduct = products[0];
  const [state, dispatch] = useReducer(designReducer, {
    ...initialDesignConfig,
    productId: defaultProduct.id,
    categorySlug: defaultProduct.category,
  });

  const [selectedCategory, setSelectedCategory] = useState<CategorySlug | "all">("all");
  const [isExporting, setIsExporting] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "login">("idle");
  const [webglSupported] = useState(() => checkWebGL());

  const viewer3DRef = useRef<Viewer3DRef>(null);
  const editor2DRef = useRef<Editor2DRef>(null);

  const selectedProduct = products.find((p) => p.id === state.productId) || defaultProduct;

  const handleProductSelect = useCallback(
    (product: Product) => {
      dispatch({
        type: "SET_PRODUCT",
        productId: product.id,
        categorySlug: product.category,
      });
      // Default to product's first color
      if (product.colors[0]) {
        dispatch({ type: "SET_COLOR", color: product.colors[0] });
      }
    },
    []
  );

  const handleColorChange = useCallback(
    (colorName: string, customHex?: string) => {
      dispatch({ type: "SET_COLOR", color: colorName, customHex });
    },
    []
  );

  const handleLogoUpload = useCallback((logo: LogoOverlay) => {
    dispatch({ type: "SET_LOGO", logo });
  }, []);

  const handleLogoRemove = useCallback(() => {
    dispatch({ type: "REMOVE_LOGO" });
  }, []);

  const handleLogoPosition = useCallback((x: number, y: number) => {
    dispatch({ type: "SET_LOGO_POSITION", x, y });
  }, []);

  const handleAddText = useCallback((text: TextOverlay) => {
    dispatch({ type: "ADD_TEXT", text });
  }, []);

  const handleUpdateText = useCallback(
    (id: string, updates: Partial<TextOverlay>) => {
      dispatch({ type: "UPDATE_TEXT", id, updates });
    },
    []
  );

  const handleRemoveText = useCallback((id: string) => {
    dispatch({ type: "REMOVE_TEXT", id });
  }, []);

  const handleExportPNG = useCallback(() => {
    setIsExporting(true);
    let dataUrl: string | null = null;

    if (state.viewMode === "3d" && viewer3DRef.current) {
      dataUrl = viewer3DRef.current.exportScreenshot();
    } else if (editor2DRef.current) {
      dataUrl = editor2DRef.current.exportPNG();
    }

    if (dataUrl) {
      const link = document.createElement("a");
      link.download = `kismet-design-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    }

    setTimeout(() => setIsExporting(false), 500);
  }, [state.viewMode]);

  const handleSaveDesign = useCallback(() => {
    // For now, show login prompt since auth integration is separate
    setSaveStatus("login");
    setTimeout(() => setSaveStatus("idle"), 2000);
  }, []);

  const handleRequestQuote = useCallback(() => {
    const designParam = encodeURIComponent(
      JSON.stringify({
        productId: state.productId,
        color: state.color,
        customHex: state.customHex,
      })
    );
    router.push(`/${locale}/teklif-al?design=${designParam}`);
  }, [router, locale, state.productId, state.color, state.customHex]);

  const handleReset = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col bg-[#0D0D0D] md:flex-row">
      {/* Left Panel */}
      <aside className="flex w-full shrink-0 flex-col border-b border-neutral-800 bg-[#1A1A1A] md:w-[280px] md:border-b-0 md:border-r md:overflow-y-auto">
        {/* Panel header */}
        <div className="flex items-center justify-between border-b border-neutral-800 px-4 py-3">
          <h2 className="font-display text-sm font-semibold text-neutral-200">
            {v.title}
          </h2>
          <button
            onClick={handleReset}
            title={v.resetView}
            className="rounded-md p-1.5 text-neutral-500 transition-colors hover:bg-neutral-700 hover:text-neutral-300"
          >
            <RotateCcw size={14} />
          </button>
        </div>

        {/* Scrollable panel content - on mobile horizontal, on desktop vertical */}
        <div className="flex gap-4 overflow-x-auto px-4 py-4 md:flex-col md:overflow-x-visible md:gap-5">
          {/* Product Selector */}
          <div className="min-w-[200px] md:min-w-0">
            <ProductSelector
              selectedProductId={state.productId}
              selectedCategory={selectedCategory}
              onProductSelect={handleProductSelect}
              onCategoryChange={setSelectedCategory}
            />
          </div>

          {/* Color Picker */}
          <div className="min-w-[200px] md:min-w-0">
            <ColorPicker
              selectedColor={state.color}
              onColorChange={handleColorChange}
            />
          </div>

          {/* Logo Uploader */}
          <div className="min-w-[200px] md:min-w-0">
            <LogoUploader
              logo={state.logo}
              onLogoUpload={handleLogoUpload}
              onLogoRemove={handleLogoRemove}
            />
          </div>

          {/* Text Editor */}
          <div className="min-w-[200px] md:min-w-0">
            <TextEditor
              texts={state.texts}
              onAddText={handleAddText}
              onUpdateText={handleUpdateText}
              onRemoveText={handleRemoveText}
            />
          </div>

          {/* Dimensions info */}
          {selectedProduct && (
            <div className="min-w-[200px] md:min-w-0">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                <Info size={14} />
                <span>{v.dimensions}</span>
              </div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
                {selectedProduct.volume && (
                  <>
                    <span className="text-neutral-500">{v.volume}</span>
                    <span className="text-neutral-300">{selectedProduct.volume}</span>
                  </>
                )}
                {selectedProduct.weight && (
                  <>
                    <span className="text-neutral-500">{v.weight}</span>
                    <span className="text-neutral-300">{selectedProduct.weight}</span>
                  </>
                )}
                {selectedProduct.neckDiameter && (
                  <>
                    <span className="text-neutral-500">{v.neckDiameter}</span>
                    <span className="text-neutral-300">{selectedProduct.neckDiameter}</span>
                  </>
                )}
                {selectedProduct.height && (
                  <>
                    <span className="text-neutral-500">{v.height}</span>
                    <span className="text-neutral-300">{selectedProduct.height}</span>
                  </>
                )}
                {selectedProduct.diameter && (
                  <>
                    <span className="text-neutral-500">{v.diameter}</span>
                    <span className="text-neutral-300">{selectedProduct.diameter}</span>
                  </>
                )}
                <span className="text-neutral-500">{v.material}</span>
                <span className="text-neutral-300">{selectedProduct.material}</span>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between border-b border-neutral-800 bg-[#141414] px-4 py-2">
          <div className="flex items-center gap-1">
            {/* View mode toggle */}
            <button
              onClick={() => dispatch({ type: "SET_VIEW_MODE", mode: "3d" })}
              disabled={!webglSupported}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                state.viewMode === "3d"
                  ? "bg-amber-500/15 text-amber-400"
                  : "text-neutral-400 hover:text-neutral-200",
                !webglSupported && "cursor-not-allowed opacity-40"
              )}
            >
              <Cuboid size={14} />
              {v.view3D}
            </button>
            <button
              onClick={() => dispatch({ type: "SET_VIEW_MODE", mode: "2d" })}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                state.viewMode === "2d"
                  ? "bg-amber-500/15 text-amber-400"
                  : "text-neutral-400 hover:text-neutral-200"
              )}
            >
              <PenTool size={14} />
              {v.view2D}
            </button>
          </div>

          {/* Product name */}
          <span className="text-xs text-neutral-500">
            {selectedProduct.name}
          </span>
        </div>

        {/* Viewport */}
        <div className="relative flex-1 bg-[#0D0D0D]">
          {state.viewMode === "3d" && webglSupported ? (
            <Viewer3D
              ref={viewer3DRef}
              categorySlug={state.categorySlug}
              color={state.color}
              customHex={state.customHex}
            />
          ) : (
            <Editor2D
              ref={editor2DRef}
              categorySlug={state.categorySlug}
              color={state.color}
              customHex={state.customHex}
              logo={state.logo}
              texts={state.texts}
              onLogoPositionChange={handleLogoPosition}
            />
          )}

          {/* View hint */}
          {state.viewMode === "3d" && webglSupported && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
              <span className="rounded-full bg-neutral-900/80 px-3 py-1 text-[10px] text-neutral-500 backdrop-blur-sm">
                {v.rotateHint}
              </span>
            </div>
          )}

          {!webglSupported && state.viewMode === "3d" && (
            <div className="absolute inset-0 flex items-center justify-center bg-neutral-900/80">
              <p className="text-sm text-neutral-400">{v.webglNotSupported}</p>
            </div>
          )}
        </div>

        {/* Export Panel */}
        <div className="border-t border-neutral-800 bg-[#141414] px-4 py-3">
          <ExportPanel
            onExportPNG={handleExportPNG}
            onSaveDesign={handleSaveDesign}
            onRequestQuote={handleRequestQuote}
            isExporting={isExporting}
            isSaving={saveStatus === "saving"}
            saveStatus={saveStatus}
          />
        </div>
      </div>
    </div>
  );
}
