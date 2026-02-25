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
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

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
