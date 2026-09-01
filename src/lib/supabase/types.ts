// Hand-written to match supabase/migrations/0001_schema.sql plus
// 0003_fix_assessment_answers_unique.sql and 0004_fix_schema_drift.sql.
// If the schema changes, update this file to match — there is no live
// project connection available to regenerate it automatically.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      admin_users: {
        Row: {
          id: string;
          email: string;
          role: string;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          role?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["admin_users"]["Insert"]>;
        Relationships: [];
      };
      announcements: {
        Row: {
          id: string;
          message: string;
          link_text: string | null;
          link_url: string | null;
          bg_color: string;
          text_color: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["announcements"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["announcements"]["Insert"]>;
        Relationships: [];
      };
      testimonials: {
        Row: {
          id: string;
          name: string;
          location: string;
          role: string;
          quote: string;
          avatar_url: string | null;
          rating: number;
          is_featured: boolean;
          display_order: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["testimonials"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["testimonials"]["Insert"]>;
        Relationships: [];
      };
      faqs: {
        Row: {
          id: string;
          category: string;
          question: string;
          answer: string;
          display_order: number;
          is_published: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["faqs"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["faqs"]["Insert"]>;
        Relationships: [];
      };
      team_members: {
        Row: {
          id: string;
          name: string;
          role: string;
          bio: string;
          image_url: string;
          linkedin_url: string | null;
          is_founder: boolean;
          display_order: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["team_members"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["team_members"]["Insert"]>;
        Relationships: [];
      };
      leads: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          phone: string;
          city: string | null;
          occupation: string | null;
          age_group: string | null;
          contact_as: string | null;
          primary_goal: string | null;
          preferred_meeting: string | null;
          preferred_date: string | null;
          preferred_time: string | null;
          notes: string | null;
          status: "new" | "contacted" | "scheduled" | "closed";
          submitted_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["leads"]["Row"], "id" | "submitted_at" | "status"> & {
          id?: string;
          status?: "new" | "contacted" | "scheduled" | "closed";
          submitted_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["leads"]["Insert"]>;
        Relationships: [];
      };
      newsletter_subscribers: {
        Row: {
          id: string;
          email: string;
          subscribed_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          subscribed_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["newsletter_subscribers"]["Insert"]>;
        Relationships: [];
      };
      articles: {
        Row: {
          id: string;
          slug: string;
          title: string;
          cover_image: string | null;
          category: string;
          author: string;
          excerpt: string;
          content: string;
          read_time: string | null;
          article_date: string;
          featured: boolean;
          published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["articles"]["Row"],
          "id" | "created_at" | "updated_at"
        > & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Database["public"]["Tables"]["articles"]["Insert"]>;
        Relationships: [];
      };
      site_settings: {
        Row: {
          id: number;
          site_title: string;
          meta_description: string | null;
          favicon_url: string | null;
          logo_url: string | null;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["site_settings"]["Row"]> & { id: number };
        Update: Partial<Database["public"]["Tables"]["site_settings"]["Row"]>;
        Relationships: [];
      };
      customers: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          phone: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          email: string;
          phone?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["customers"]["Insert"]>;
        Relationships: [];
      };
      family_profiles: {
        Row: {
          customer_id: string;
          primary_member: Json;
          spouse: Json | null;
          children: Json;
          monthly_expenses: number | null;
          total_assets: number | null;
          total_liabilities: number | null;
          risk_profile: "conservative" | "moderate" | "aggressive" | null;
          goals: string[];
          existing_investments: Json;
          existing_insurance: Json;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["family_profiles"]["Row"]> & {
          customer_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["family_profiles"]["Row"]>;
        Relationships: [];
      };
      assessment_answers: {
        Row: {
          id: string;
          customer_id: string;
          graha_id: string;
          question_id: string;
          value: Json;
          answered_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["assessment_answers"]["Row"], "id" | "answered_at"> & {
          id?: string;
          answered_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["assessment_answers"]["Insert"]>;
        Relationships: [];
      };
      assessment_results: {
        Row: {
          customer_id: string;
          overall_score: number;
          overall_status: "excellent" | "good" | "fair" | "poor";
          graha_scores: Json;
          graha_details: Json;
          recommendations: string[];
          advisor_notes: string | null;
          action_plan: Json;
          strongest_graha: string | null;
          weakest_graha: string | null;
          pdf_url: string | null;
          unlocked: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["assessment_results"]["Row"]> & {
          customer_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["assessment_results"]["Row"]>;
        Relationships: [];
      };
      newsletter_sends: {
        Row: {
          id: string;
          subject: string;
          body: string;
          sent_at: string;
          sent_by: string | null;
          recipient_count: number;
        };
        Insert: Omit<Database["public"]["Tables"]["newsletter_sends"]["Row"], "id" | "sent_at"> & {
          id?: string;
          sent_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["newsletter_sends"]["Insert"]>;
        Relationships: [];
      };
      page_views: {
        Row: {
          id: string;
          path: string;
          referrer: string | null;
          viewed_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["page_views"]["Row"], "id" | "viewed_at"> & {
          id?: string;
          viewed_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["page_views"]["Insert"]>;
        Relationships: [];
      };
      payments: {
        Row: {
          id: string;
          customer_id: string;
          razorpay_order_id: string;
          razorpay_payment_id: string | null;
          amount: number;
          currency: string;
          status: "created" | "paid" | "failed" | "superseded_by_retake";
          created_at: string;
          paid_at: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["payments"]["Row"], "id" | "created_at" | "currency"> & {
          id?: string;
          created_at?: string;
          currency?: string;
        };
        Update: Partial<Database["public"]["Tables"]["payments"]["Insert"]>;
        Relationships: [];
      };
      device_sessions: {
        Row: {
          id: string;
          user_id: string;
          user_type: "admin" | "mykundali";
          device_id: string;
          device_label: string | null;
          last_seen_at: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["device_sessions"]["Row"], "id" | "last_seen_at" | "created_at"> & {
          id?: string;
          last_seen_at?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["device_sessions"]["Insert"]>;
        Relationships: [];
      };
      testimonial_submissions: {
        Row: {
          id: string;
          customer_id: string | null;
          name: string;
          testimonial: string;
          status: "new" | "featured" | "dismissed";
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["testimonial_submissions"]["Row"], "id" | "status" | "created_at"> & {
          id?: string;
          status?: "new" | "featured" | "dismissed";
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["testimonial_submissions"]["Insert"]>;
        Relationships: [];
      };
      email_send_log: {
        Row: {
          id: string;
          count: number;
          sent_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["email_send_log"]["Row"], "id" | "count" | "sent_at"> & {
          id?: string;
          count?: number;
          sent_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["email_send_log"]["Insert"]>;
        Relationships: [];
      };
      signup_otp_codes: {
        Row: {
          id: string;
          email: string;
          otp_hash: string;
          attempts: number;
          expires_at: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["signup_otp_codes"]["Row"], "id" | "attempts" | "created_at"> & {
          id?: string;
          attempts?: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["signup_otp_codes"]["Insert"]>;
        Relationships: [];
      };
      rate_limit_hits: {
        Row: {
          id: string;
          key: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["rate_limit_hits"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["rate_limit_hits"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
