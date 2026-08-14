export type ProfileRole = "admin" | "editor";
export type PostStatus = "draft" | "published";
export type ClientStatus = "aktif" | "pasif" | "arsiv";
export type GalleryCategory = "ofis" | "ekip" | "etkinlik" | "diger";
export type CaseStatus = "acik" | "kapali" | "beklemede";
export type HearingStatus = "planlandi" | "tamamlandi" | "ertelendi";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          role: ProfileRole;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          role?: ProfileRole;
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          role?: ProfileRole;
          created_at?: string;
        };
        Relationships: [];
      };
      posts: {
        Row: {
          id: string;
          slug: string;
          title_tr: string;
          title_en: string | null;
          excerpt_tr: string | null;
          excerpt_en: string | null;
          content_tr: string;
          content_en: string | null;
          cover_image_url: string | null;
          status: PostStatus;
          meta_title: string | null;
          meta_description: string | null;
          author_id: string | null;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title_tr: string;
          title_en?: string | null;
          excerpt_tr?: string | null;
          excerpt_en?: string | null;
          content_tr?: string;
          content_en?: string | null;
          cover_image_url?: string | null;
          status?: PostStatus;
          meta_title?: string | null;
          meta_description?: string | null;
          author_id?: string | null;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["posts"]["Insert"]>;
        Relationships: [];
      };
      announcements: {
        Row: {
          id: string;
          slug: string;
          title_tr: string;
          title_en: string | null;
          content_tr: string;
          content_en: string | null;
          is_pinned: boolean;
          is_active: boolean;
          published_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title_tr: string;
          title_en?: string | null;
          content_tr?: string;
          content_en?: string | null;
          is_pinned?: boolean;
          is_active?: boolean;
          published_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["announcements"]["Insert"]
        >;
        Relationships: [];
      };
      clients: {
        Row: {
          id: string;
          full_name: string;
          phone: string | null;
          email: string | null;
          practice_area: string | null;
          note: string | null;
          status: ClientStatus;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          full_name: string;
          phone?: string | null;
          email?: string | null;
          practice_area?: string | null;
          note?: string | null;
          status?: ClientStatus;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["clients"]["Insert"]>;
        Relationships: [];
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          message: string;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: string | null;
          message: string;
          is_read?: boolean;
          created_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["contact_messages"]["Insert"]
        >;
        Relationships: [];
      };
      site_settings: {
        Row: {
          id: number;
          phone: string | null;
          email: string | null;
          address_tr: string | null;
          address_en: string | null;
          working_hours_tr: string | null;
          working_hours_en: string | null;
          instagram_url: string | null;
          linkedin_url: string | null;
          facebook_url: string | null;
          maintenance_mode: boolean;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["site_settings"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["site_settings"]["Row"]>;
        Relationships: [];
      };
      gallery_images: {
        Row: {
          id: string;
          image_url: string;
          caption_tr: string | null;
          caption_en: string | null;
          category: GalleryCategory;
          sort_order: number;
          is_active: boolean;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          image_url: string;
          caption_tr?: string | null;
          caption_en?: string | null;
          category?: GalleryCategory;
          sort_order?: number;
          is_active?: boolean;
          created_by?: string | null;
          created_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["gallery_images"]["Insert"]
        >;
        Relationships: [];
      };
      cases: {
        Row: {
          id: string;
          client_id: string;
          title: string;
          case_number: string | null;
          practice_area: string | null;
          court: string | null;
          status: CaseStatus;
          opened_date: string;
          closed_date: string | null;
          note: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          client_id: string;
          title: string;
          case_number?: string | null;
          practice_area?: string | null;
          court?: string | null;
          status?: CaseStatus;
          opened_date?: string;
          closed_date?: string | null;
          note?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["cases"]["Insert"]>;
        Relationships: [];
      };
      hearings: {
        Row: {
          id: string;
          case_id: string;
          hearing_date: string;
          title: string | null;
          location: string | null;
          status: HearingStatus;
          outcome_note: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          case_id: string;
          hearing_date: string;
          title?: string | null;
          location?: string | null;
          status?: HearingStatus;
          outcome_note?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["hearings"]["Insert"]>;
        Relationships: [];
      };
      reminders: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          due_date: string;
          client_id: string | null;
          case_id: string | null;
          is_done: boolean;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          due_date: string;
          client_id?: string | null;
          case_id?: string | null;
          is_done?: boolean;
          created_by?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["reminders"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}
