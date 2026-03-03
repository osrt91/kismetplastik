import type { CategorySlug } from "@/types/product";

export interface LogoOverlay {
  url: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface TextOverlay {
  id: string;
  content: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  color: string;
}

export interface DesignConfig {
  productId: string;
  categorySlug: CategorySlug;
  color: string;
  customHex?: string;
  logo?: LogoOverlay;
  texts: TextOverlay[];
  viewMode: "2d" | "3d";
}

export interface SavedDesign {
  id: string;
  user_id: string;
  product_id: string;
  name: string;
  design_data: DesignConfig;
  preview_url: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export type VisualizerAction =
  | { type: "SET_PRODUCT"; productId: string; categorySlug: CategorySlug }
  | { type: "SET_COLOR"; color: string; customHex?: string }
  | { type: "SET_LOGO"; logo: LogoOverlay }
  | { type: "REMOVE_LOGO" }
  | { type: "SET_LOGO_POSITION"; x: number; y: number }
  | { type: "ADD_TEXT"; text: TextOverlay }
  | { type: "UPDATE_TEXT"; id: string; updates: Partial<TextOverlay> }
  | { type: "REMOVE_TEXT"; id: string }
  | { type: "SET_VIEW_MODE"; mode: "2d" | "3d" }
  | { type: "RESET" };

export const initialDesignConfig: DesignConfig = {
  productId: "",
  categorySlug: "pet-siseler",
  color: "Şeffaf",
  texts: [],
  viewMode: "3d",
};
