// ============================================
// Supabase Database Types
// ============================================

// --- Enum Types ---

export type PaymentTerms = 'prepaid' | 'net15' | 'net30' | 'net60';
export type CompanyStatus = 'pending' | 'active' | 'suspended';
export type UserRoleB2B = 'admin' | 'company_admin' | 'buyer';
export type ProductCategoryEnum = 'pet_sise' | 'plastik_sise' | 'kapak' | 'tipa' | 'sprey' | 'pompa' | 'tetik' | 'huni' | 'diger';
export type OrderStatusB2B = 'draft' | 'pending' | 'confirmed' | 'production' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatusEnum = 'pending' | 'partial' | 'paid' | 'refunded';
export type QuoteStatusB2B = 'new' | 'reviewing' | 'sent' | 'accepted' | 'rejected';

// --- Database Interface ---

export interface Database {
  public: {
    Tables: {
      products: {
        Row: DbProduct;
        Insert: Omit<DbProduct, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<DbProduct, "id">>;
      };
      categories: {
        Row: DbCategory;
        Insert: Omit<DbCategory, "id" | "created_at">;
        Update: Partial<Omit<DbCategory, "id">>;
      };
      blog_posts: {
        Row: DbBlogPost;
        Insert: Omit<DbBlogPost, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<DbBlogPost, "id">>;
      };
      companies: {
        Row: DbCompany;
        Insert: Omit<DbCompany, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<DbCompany, "id">>;
      };
      b2b_profiles: {
        Row: DbB2BProfile;
        Insert: Omit<DbB2BProfile, "created_at" | "updated_at">;
        Update: Partial<Omit<DbB2BProfile, "id">>;
      };
      price_tiers: {
        Row: DbPriceTier;
        Insert: Omit<DbPriceTier, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<DbPriceTier, "id">>;
      };
      b2b_orders: {
        Row: DbB2BOrder;
        Insert: Omit<DbB2BOrder, "id" | "order_number" | "created_at" | "updated_at">;
        Update: Partial<Omit<DbB2BOrder, "id" | "order_number">>;
      };
      b2b_order_items: {
        Row: DbB2BOrderItem;
        Insert: Omit<DbB2BOrderItem, "id" | "subtotal" | "created_at" | "updated_at">;
        Update: Partial<Omit<DbB2BOrderItem, "id">>;
      };
      b2b_quote_requests: {
        Row: DbB2BQuoteRequest;
        Insert: Omit<DbB2BQuoteRequest, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<DbB2BQuoteRequest, "id">>;
      };
      saved_designs: {
        Row: DbSavedDesign;
        Insert: Omit<DbSavedDesign, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<DbSavedDesign, "id">>;
      };
    };
    Views: Record<string, never>;
    Functions: {
      calculate_tier_price: {
        Args: {
          p_product_id: string;
          p_quantity: number;
          p_company_id?: string | null;
        };
        Returns: number;
      };
    };
    Enums: {
      payment_terms_enum: PaymentTerms;
      company_status_enum: CompanyStatus;
      user_role_b2b: UserRoleB2B;
      product_category_enum: ProductCategoryEnum;
      order_status_b2b: OrderStatusB2B;
      payment_status_enum: PaymentStatusEnum;
      quote_status_b2b: QuoteStatusB2B;
    };
  };
}

// --- Existing Tables ---

export interface DbProduct {
  id: string;
  slug: string;
  name: string;
  category_slug: string;
  description: string;
  short_description: string;
  volume: string | null;
  weight: string | null;
  neck_diameter: string | null;
  height: string | null;
  diameter: string | null;
  material: string;
  colors: string[];
  color_codes: Record<string, string> | null;
  model: string | null;
  shape: string | null;
  surface_type: string | null;
  compatible_caps: string[] | null;
  min_order: number;
  in_stock: boolean;
  featured: boolean;
  specs: { label: string; value: string }[];
  // B2B fields (added in migration 002)
  sku: string | null;
  name_tr: string | null;
  name_en: string | null;
  b2b_category: ProductCategoryEnum | null;
  subcategory: string | null;
  volume_ml: number | null;
  neck_size_mm: number | null;
  color_options: Record<string, unknown>[];
  has_3d_model: boolean;
  model_3d_url: string | null;
  model_2d_url: string | null;
  thumbnail_url: string | null;
  images: Record<string, unknown>[];
  base_price: number | null;
  moq: number;
  weight_gram: number | null;
  dimensions: { width: number | null; height: number | null; depth: number | null };
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbCategory {
  id: string;
  slug: string;
  name: string;
  description: string;
  product_count: number;
  icon: string | null;
  created_at: string;
}

export interface DbBlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  category: string;
  date: string;
  read_time: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

// --- B2B Tables ---

export interface DbCompany {
  id: string;
  name: string;
  tax_number: string | null;
  sector: string | null;
  address: string | null;
  city: string | null;
  country: string;
  phone: string | null;
  email: string | null;
  website: string | null;
  logo_url: string | null;
  credit_limit: number;
  discount_rate: number;
  payment_terms: PaymentTerms;
  status: CompanyStatus;
  created_at: string;
  updated_at: string;
}

export interface DbB2BProfile {
  id: string;
  company_id: string | null;
  full_name: string;
  role: UserRoleB2B;
  phone: string | null;
  avatar_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbPriceTier {
  id: string;
  product_id: string;
  company_id: string | null;
  min_quantity: number;
  max_quantity: number | null;
  unit_price: number;
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface ShippingAddress {
  street?: string;
  city?: string;
  district?: string;
  postal_code?: string;
  country?: string;
}

export interface DbB2BOrder {
  id: string;
  order_number: string;
  company_id: string;
  created_by: string;
  status: OrderStatusB2B;
  total_amount: number;
  currency: string;
  payment_status: PaymentStatusEnum;
  payment_terms: PaymentTerms | null;
  shipping_address: ShippingAddress | null;
  notes: string | null;
  estimated_delivery: string | null;
  created_at: string;
  updated_at: string;
}

export interface DesignConfig {
  color?: string;
  label_url?: string;
  logo_position?: { x: number; y: number; scale: number };
  text_layers?: { text: string; font: string; size: number; position: { x: number; y: number } }[];
}

export interface DbB2BOrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  custom_color: string | null;
  custom_label_url: string | null;
  design_config: DesignConfig | null;
  created_at: string;
  updated_at: string;
}

export interface ProductRequest {
  product_id: string;
  quantity: number;
  notes?: string;
  custom_specs?: Record<string, unknown>;
}

export interface DbB2BQuoteRequest {
  id: string;
  company_id: string | null;
  contact_name: string;
  contact_email: string;
  contact_phone: string | null;
  company_name: string | null;
  product_requests: ProductRequest[];
  notes: string | null;
  status: QuoteStatusB2B;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbSavedDesign {
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
