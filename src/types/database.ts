export type UserRole = "admin" | "dealer" | "customer";
export type QuoteStatus = "pending" | "reviewing" | "quoted" | "accepted" | "rejected";
export type OrderStatus = "pending" | "confirmed" | "production" | "shipping" | "delivered" | "cancelled";
export type PaymentStatus = "pending" | "paid" | "partial" | "refunded";
export type GalleryCategory = "uretim" | "urunler" | "etkinlikler";
export type BlogPostStatus = "draft" | "published";
export type SampleRequestStatus = "pending" | "reviewing" | "approved" | "shipped" | "rejected";
export type PreOrderStatus = "pending" | "confirmed" | "production" | "ready" | "delivered" | "cancelled";
export type TradeShowStatus = "upcoming" | "active" | "past";
export type ContactMessageStatus = "unread" | "read" | "replied";
export type WebhookEventStatus = "pending" | "processing" | "success" | "failed";

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
      profiles: {
        Row: DbProfile;
        Insert: Omit<DbProfile, "created_at" | "updated_at">;
        Update: Partial<Omit<DbProfile, "id">>;
      };
      orders: {
        Row: DbOrder;
        Insert: Omit<DbOrder, "id" | "order_number" | "created_at" | "updated_at">;
        Update: Partial<Omit<DbOrder, "id" | "order_number">>;
      };
      order_items: {
        Row: DbOrderItem;
        Insert: Omit<DbOrderItem, "id" | "created_at">;
        Update: Partial<Omit<DbOrderItem, "id">>;
      };
      order_status_history: {
        Row: DbOrderStatusHistory;
        Insert: Omit<DbOrderStatusHistory, "id" | "created_at">;
        Update: Partial<Omit<DbOrderStatusHistory, "id">>;
      };
      quote_requests: {
        Row: DbQuoteRequest;
        Insert: Omit<DbQuoteRequest, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<DbQuoteRequest, "id">>;
      };
      quote_items: {
        Row: DbQuoteItem;
        Insert: Omit<DbQuoteItem, "id" | "created_at">;
        Update: Partial<Omit<DbQuoteItem, "id">>;
      };
      gallery_images: {
        Row: DbGalleryImage;
        Insert: Omit<DbGalleryImage, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<DbGalleryImage, "id">>;
      };
      contact_messages: {
        Row: DbContactMessage;
        Insert: Omit<DbContactMessage, "id" | "created_at">;
        Update: Partial<Omit<DbContactMessage, "id">>;
      };
      sample_requests: {
        Row: DbSampleRequest;
        Insert: Omit<DbSampleRequest, "id" | "created_at">;
        Update: Partial<Omit<DbSampleRequest, "id">>;
      };
      pre_orders: {
        Row: DbPreOrder;
        Insert: Omit<DbPreOrder, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<DbPreOrder, "id">>;
      };
      resources: {
        Row: DbResource;
        Insert: Omit<DbResource, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<DbResource, "id">>;
      };
      catalog_downloads: {
        Row: DbCatalogDownload;
        Insert: Omit<DbCatalogDownload, "id" | "created_at">;
        Update: Partial<Omit<DbCatalogDownload, "id">>;
      };
      lead_downloads: {
        Row: DbLeadDownload;
        Insert: Omit<DbLeadDownload, "id" | "created_at">;
        Update: Partial<Omit<DbLeadDownload, "id">>;
      };
      certificates: {
        Row: DbCertificate;
        Insert: Omit<DbCertificate, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<DbCertificate, "id">>;
      };
      trade_shows: {
        Row: DbTradeShow;
        Insert: Omit<DbTradeShow, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<DbTradeShow, "id">>;
      };
      references: {
        Row: DbReference;
        Insert: Omit<DbReference, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<DbReference, "id">>;
      };
      milestones: {
        Row: DbMilestone;
        Insert: Omit<DbMilestone, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<DbMilestone, "id">>;
      };
      seo_settings: {
        Row: DbSeoSetting;
        Insert: Omit<DbSeoSetting, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<DbSeoSetting, "id">>;
      };
      site_settings: {
        Row: DbSiteSetting;
        Insert: Omit<DbSiteSetting, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<DbSiteSetting, "id">>;
      };
      content_sections: {
        Row: DbContentSection;
        Insert: Omit<DbContentSection, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<DbContentSection, "id">>;
      };
      faq_items: {
        Row: DbFaqItem;
        Insert: Omit<DbFaqItem, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<DbFaqItem, "id">>;
      };
      career_listings: {
        Row: DbCareerListing;
        Insert: Omit<DbCareerListing, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<DbCareerListing, "id">>;
      };
      notification_settings: {
        Row: DbNotificationSetting;
        Insert: Omit<DbNotificationSetting, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<DbNotificationSetting, "id">>;
      };
      chat_sessions: {
        Row: DbChatSession;
        Insert: Omit<DbChatSession, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<DbChatSession, "id">>;
      };
      webhook_events: {
        Row: DbWebhookEvent;
        Insert: Omit<DbWebhookEvent, "id" | "created_at">;
        Update: Partial<Omit<DbWebhookEvent, "id">>;
      };
      product_compatibility: {
        Row: DbProductCompatibility;
        Insert: Omit<DbProductCompatibility, "id" | "created_at">;
        Update: Partial<Omit<DbProductCompatibility, "id">>;
      };
      dia_stock_mappings: {
        Row: DbDiaStockMapping;
        Insert: Omit<DbDiaStockMapping, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<DbDiaStockMapping, "id">>;
      };
      dia_sync_logs: {
        Row: DbDiaSyncLog;
        Insert: Omit<DbDiaSyncLog, "id" | "created_at">;
        Update: Partial<Omit<DbDiaSyncLog, "id">>;
      };
      invoices: {
        Row: DbInvoice;
        Insert: Omit<DbInvoice, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<DbInvoice, "id">>;
      };
      glossary_terms: {
        Row: GlossaryTerm;
        Insert: Omit<GlossaryTerm, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<GlossaryTerm, "id">>;
      };
      translations: {
        Row: Translation;
        Insert: Omit<Translation, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Translation, "id">>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: UserRole;
      quote_status: QuoteStatus;
      order_status: OrderStatus;
      payment_status: PaymentStatus;
      gallery_category: GalleryCategory;
    };
  };
}

// ==================== EXISTING TABLES ====================

export interface DbProduct {
  id: string;
  slug: string;
  name: string;
  category_slug: string;
  description: string;
  short_description: string;
  image_url: string | null;
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
  content_html: string | null;
  image_url: string | null;
  category: string;
  tags: string[];
  date: string;
  read_time: string;
  status: BlogPostStatus;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbProfile {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  company_name: string | null;
  tax_number: string | null;
  tax_office: string | null;
  company_address: string | null;
  city: string | null;
  district: string | null;
  role: UserRole;
  is_approved: boolean;
  is_active: boolean;
  avatar_url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbOrder {
  id: string;
  profile_id: string;
  order_number: string;
  status: OrderStatus;
  shipping_address: Record<string, unknown> | null;
  billing_address: Record<string, unknown> | null;
  subtotal: number;
  tax_amount: number;
  shipping_cost: number;
  total_amount: number;
  payment_method: string | null;
  payment_status: PaymentStatus;
  tracking_number: string | null;
  estimated_delivery: string | null;
  notes: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbOrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  notes: string | null;
  created_at: string;
}

export interface DbOrderStatusHistory {
  id: string;
  order_id: string;
  old_status: OrderStatus | null;
  new_status: OrderStatus;
  note: string | null;
  created_at: string;
}

export interface DbQuoteRequest {
  id: string;
  profile_id: string | null;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  message: string | null;
  status: QuoteStatus;
  admin_notes: string | null;
  response_message: string | null;
  total_amount: number | null;
  valid_until: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbQuoteItem {
  id: string;
  quote_request_id: string;
  product_id: string | null;
  product_name: string;
  quantity: number;
  unit_price: number | null;
  notes: string | null;
  created_at: string;
}

export interface DbGalleryImage {
  id: string;
  category: GalleryCategory;
  image_url: string;
  storage_path: string;
  title_tr: string;
  title_en: string;
  description_tr: string | null;
  description_en: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ==================== NEW TABLES ====================

export interface DbContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  subject: string;
  message: string;
  status: ContactMessageStatus;
  reply_message: string | null;
  replied_at: string | null;
  created_at: string;
}

export interface DbSampleRequest {
  id: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  product_categories: string[];
  message: string | null;
  status: SampleRequestStatus;
  admin_notes: string | null;
  created_at: string;
}

export interface DbPreOrder {
  id: string;
  profile_id: string;
  product_id: string | null;
  product_name: string;
  quantity: number;
  desired_date: string | null;
  notes: string | null;
  status: PreOrderStatus;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbResource {
  id: string;
  title_tr: string;
  title_en: string;
  description_tr: string;
  description_en: string;
  category_tr: string;
  category_en: string;
  file_url: string;
  storage_path: string | null;
  cover_image: string | null;
  page_count: number;
  is_active: boolean;
  display_order: number;
  download_count: number;
  created_at: string;
  updated_at: string;
}

export interface DbCatalogDownload {
  id: string;
  resource_id: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string | null;
  created_at: string;
}

export interface DbLeadDownload {
  id: string;
  resource_id: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string | null;
  created_at: string;
}

export interface DbCertificate {
  id: string;
  name_tr: string;
  name_en: string;
  description_tr: string;
  description_en: string;
  icon: string;
  pdf_url: string;
  storage_path: string | null;
  issuer: string;
  valid_until: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface DbTradeShow {
  id: string;
  name_tr: string;
  name_en: string;
  description_tr: string;
  description_en: string;
  location_tr: string;
  location_en: string;
  start_date: string;
  end_date: string;
  booth: string | null;
  website: string | null;
  status: TradeShowStatus;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbReference {
  id: string;
  name: string;
  logo_url: string;
  storage_path: string | null;
  website: string | null;
  sector_tr: string;
  sector_en: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface DbMilestone {
  id: string;
  year: number;
  title_tr: string;
  title_en: string;
  description_tr: string;
  description_en: string;
  icon: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface DbSeoSetting {
  id: string;
  page_path: string;
  meta_title_tr: string | null;
  meta_title_en: string | null;
  meta_description_tr: string | null;
  meta_description_en: string | null;
  og_image: string | null;
  canonical_url: string | null;
  no_index: boolean;
  json_ld: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface DbSiteSetting {
  id: string;
  key: string;
  value: string;
  group: string;
  created_at: string;
  updated_at: string;
}

export interface DbContentSection {
  id: string;
  section_key: string;
  title_tr: string | null;
  title_en: string | null;
  subtitle_tr: string | null;
  subtitle_en: string | null;
  content_tr: string | null;
  content_en: string | null;
  cta_text_tr: string | null;
  cta_text_en: string | null;
  cta_url: string | null;
  image_url: string | null;
  display_order: number;
  is_active: boolean;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface DbFaqItem {
  id: string;
  question_tr: string;
  question_en: string;
  answer_tr: string;
  answer_en: string;
  category: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbCareerListing {
  id: string;
  title_tr: string;
  title_en: string;
  description_tr: string;
  description_en: string;
  department: string;
  location: string;
  type: string;
  requirements_tr: string[];
  requirements_en: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbNotificationSetting {
  id: string;
  event_type: string;
  email_enabled: boolean;
  email_recipients: string[];
  webhook_enabled: boolean;
  webhook_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbChatSession {
  id: string;
  session_id: string;
  locale: string;
  messages: Record<string, unknown>[];
  created_at: string;
  updated_at: string;
}

export interface DbWebhookEvent {
  id: string;
  event_type: string;
  payload: Record<string, unknown>;
  status: WebhookEventStatus;
  retry_count: number;
  processed_at: string | null;
  error_message: string | null;
  created_at: string;
}

// ==================== DEALER-CARI MAPPING ====================

export type DealerPriceType = 'standard' | 'pesin' | 'vadeli' | 'ozel';

export interface DealerCariMapping {
  id: string;
  profile_id: string;
  dia_cari_kodu: string;
  dia_cari_unvan: string | null;
  is_approved: boolean;
  price_type: DealerPriceType;
  can_direct_order: boolean;
  created_at: string;
  updated_at: string;
}

// ==================== PRODUCT COMPATIBILITY ====================

export type CompatibilityType = 'fits' | 'recommended' | 'alternative';

export interface DbProductCompatibility {
  id: string;
  source_stock_kodu: string;
  source_category: string;
  compatible_stock_kodu: string;
  compatible_category: string;
  compatibility_type: CompatibilityType;
  notes: string | null;
  is_active: boolean;
  created_at: string;
}

// ==================== DIA ERP INTEGRATION ====================

export type InvoiceStatus = "draft" | "issued" | "paid" | "cancelled";

export type DiaSyncStatus = "pending" | "running" | "success" | "failed";

export interface DbDiaStockMapping {
  id: string;
  dia_stock_code: string;
  dia_stock_id: number;
  product_slug: string;
  product_id: string | null;
  is_active: boolean;
  last_synced_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbDiaSyncLog {
  id: string;
  sync_type: string; // "stock" | "cari" | "order"
  status: DiaSyncStatus;
  records_synced: number;
  records_failed: number;
  error_details: string[] | null;
  started_at: string;
  completed_at: string | null;
  created_at: string;
}

// ==================== INVOICES ====================

export interface DbInvoice {
  id: string;
  order_id: string;
  profile_id: string;
  invoice_number: string;
  company_name: string;
  company_address: string | null;
  tax_number: string | null;
  tax_office: string | null;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total_amount: number;
  pdf_url: string | null;
  storage_path: string | null;
  status: InvoiceStatus;
  issued_at: string;
  created_at: string;
  updated_at: string;
}

// ==================== CMS CONTENT ====================

export interface GlossaryTerm {
  id: string;
  term_tr: string;
  term_en: string;
  definition_tr: string;
  definition_en: string;
  letter: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Translation {
  id: string;
  source_table: string;
  source_id: string;
  field_name: string;
  locale: string;
  translated_text: string;
  is_manual: boolean;
  created_at: string;
  updated_at: string;
}
