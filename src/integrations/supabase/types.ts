export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      braider_profiles: {
        Row: {
          average_rating: number | null
          city: string
          created_at: string
          description: string | null
          email: string
          facebook: string | null
          gallery_urls: string[] | null
          id: string
          image_url: string | null
          instagram: string | null
          is_premium: boolean | null
          leads_count: number | null
          mercado_pago_id: string | null
          name: string
          neighborhood: string
          plan_tier: Database["public"]["Enums"]["plan_tier"] | null
          premium_since: string | null
          pricing: string | null
          professional_name: string | null
          services: string[] | null
          status: string | null
          total_reviews: number | null
          trial_ends_at: string | null
          updated_at: string
          user_id: string
          video_url: string | null
          view_count: number | null
          whatsapp: string
          whatsapp_click_count: number | null
        }
        Insert: {
          average_rating?: number | null
          city: string
          created_at?: string
          description?: string | null
          email: string
          facebook?: string | null
          gallery_urls?: string[] | null
          id?: string
          image_url?: string | null
          instagram?: string | null
          is_premium?: boolean | null
          leads_count?: number | null
          mercado_pago_id?: string | null
          name: string
          neighborhood: string
          plan_tier?: Database["public"]["Enums"]["plan_tier"] | null
          premium_since?: string | null
          pricing?: string | null
          professional_name?: string | null
          services?: string[] | null
          status?: string | null
          total_reviews?: number | null
          trial_ends_at?: string | null
          updated_at?: string
          user_id: string
          video_url?: string | null
          view_count?: number | null
          whatsapp: string
          whatsapp_click_count?: number | null
        }
        Update: {
          average_rating?: number | null
          city?: string
          created_at?: string
          description?: string | null
          email?: string
          facebook?: string | null
          gallery_urls?: string[] | null
          id?: string
          image_url?: string | null
          instagram?: string | null
          is_premium?: boolean | null
          leads_count?: number | null
          mercado_pago_id?: string | null
          name?: string
          neighborhood?: string
          plan_tier?: Database["public"]["Enums"]["plan_tier"] | null
          premium_since?: string | null
          pricing?: string | null
          professional_name?: string | null
          services?: string[] | null
          status?: string | null
          total_reviews?: number | null
          trial_ends_at?: string | null
          updated_at?: string
          user_id?: string
          video_url?: string | null
          view_count?: number | null
          whatsapp?: string
          whatsapp_click_count?: number | null
        }
        Relationships: []
      }
      cities: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          state: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          state?: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          state?: string
        }
        Relationships: []
      }
      city_suggestions: {
        Row: {
          created_at: string | null
          id: string
          name: string
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          state: string
          status: string
          suggested_by: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          state?: string
          status?: string
          suggested_by?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          state?: string
          status?: string
          suggested_by?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      coupons: {
        Row: {
          code: string
          created_at: string | null
          current_uses: number | null
          discount_amount: number | null
          discount_percent: number | null
          id: string
          is_active: boolean | null
          max_uses: number | null
          updated_at: string | null
          valid_until: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          current_uses?: number | null
          discount_amount?: number | null
          discount_percent?: number | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          updated_at?: string | null
          valid_until?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          current_uses?: number | null
          discount_amount?: number | null
          discount_percent?: number | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          updated_at?: string | null
          valid_until?: string | null
        }
        Relationships: []
      }
      favorites: {
        Row: {
          braider_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          braider_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          braider_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_braider_id_fkey"
            columns: ["braider_id"]
            isOneToOne: false
            referencedRelation: "active_braiders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_braider_id_fkey"
            columns: ["braider_id"]
            isOneToOne: false
            referencedRelation: "braider_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          braider_id: string
          client_id: string | null
          created_at: string
          id: string
        }
        Insert: {
          braider_id: string
          client_id?: string | null
          created_at?: string
          id?: string
        }
        Update: {
          braider_id?: string
          client_id?: string | null
          created_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "leads_braider_id_fkey"
            columns: ["braider_id"]
            isOneToOne: false
            referencedRelation: "active_braiders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_braider_id_fkey"
            columns: ["braider_id"]
            isOneToOne: false
            referencedRelation: "braider_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      neighborhood_suggestions: {
        Row: {
          city_id: string | null
          city_name: string
          created_at: string | null
          id: string
          name: string
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          suggested_by: string | null
          updated_at: string | null
        }
        Insert: {
          city_id?: string | null
          city_name: string
          created_at?: string | null
          id?: string
          name: string
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          suggested_by?: string | null
          updated_at?: string | null
        }
        Update: {
          city_id?: string | null
          city_name?: string
          created_at?: string | null
          id?: string
          name?: string
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          suggested_by?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "neighborhood_suggestions_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
      neighborhoods: {
        Row: {
          city_id: string
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
        }
        Insert: {
          city_id: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
        }
        Update: {
          city_id?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "neighborhoods_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_attempts: {
        Row: {
          amount: number
          approved_at: string | null
          created_at: string
          email: string | null
          id: string
          payment_id: string | null
          payment_method: string | null
          plan_type: string
          qr_code: string | null
          qr_code_base64: string | null
          status: string
          updated_at: string
          user_name: string
        }
        Insert: {
          amount: number
          approved_at?: string | null
          created_at?: string
          email?: string | null
          id?: string
          payment_id?: string | null
          payment_method?: string | null
          plan_type: string
          qr_code?: string | null
          qr_code_base64?: string | null
          status?: string
          updated_at?: string
          user_name: string
        }
        Update: {
          amount?: number
          approved_at?: string | null
          created_at?: string
          email?: string | null
          id?: string
          payment_id?: string | null
          payment_method?: string | null
          plan_type?: string
          qr_code?: string | null
          qr_code_base64?: string | null
          status?: string
          updated_at?: string
          user_name?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          braider_id: string
          client_name: string
          comment: string | null
          created_at: string
          id: string
          is_verified: boolean | null
          rating: number
          service_date: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          braider_id: string
          client_name: string
          comment?: string | null
          created_at?: string
          id?: string
          is_verified?: boolean | null
          rating: number
          service_date?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          braider_id?: string
          client_name?: string
          comment?: string | null
          created_at?: string
          id?: string
          is_verified?: boolean | null
          rating?: number
          service_date?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_braider_id_fkey"
            columns: ["braider_id"]
            isOneToOne: false
            referencedRelation: "active_braiders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_braider_id_fkey"
            columns: ["braider_id"]
            isOneToOne: false
            referencedRelation: "braider_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          amount: number | null
          created_at: string
          id: string
          is_active: boolean
          is_blocked: boolean
          last_payment_date: string | null
          next_payment_date: string | null
          plan_type: string
          status: string
          trial_ends_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount?: number | null
          created_at?: string
          id?: string
          is_active?: boolean
          is_blocked?: boolean
          last_payment_date?: string | null
          next_payment_date?: string | null
          plan_type?: string
          status?: string
          trial_ends_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number | null
          created_at?: string
          id?: string
          is_active?: boolean
          is_blocked?: boolean
          last_payment_date?: string | null
          next_payment_date?: string | null
          plan_type?: string
          status?: string
          trial_ends_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      active_braiders: {
        Row: {
          average_rating: number | null
          city: string | null
          created_at: string | null
          description: string | null
          display_priority: number | null
          email: string | null
          facebook: string | null
          gallery_urls: string[] | null
          id: string | null
          image_url: string | null
          instagram: string | null
          is_premium: boolean | null
          leads_count: number | null
          mercado_pago_id: string | null
          name: string | null
          neighborhood: string | null
          plan_tier: Database["public"]["Enums"]["plan_tier"] | null
          premium_since: string | null
          pricing: string | null
          professional_name: string | null
          services: string[] | null
          status: string | null
          total_reviews: number | null
          trial_ends_at: string | null
          updated_at: string | null
          user_id: string | null
          video_url: string | null
          view_count: number | null
          whatsapp: string | null
          whatsapp_click_count: number | null
        }
        Insert: {
          average_rating?: number | null
          city?: string | null
          created_at?: string | null
          description?: string | null
          display_priority?: never
          email?: string | null
          facebook?: string | null
          gallery_urls?: string[] | null
          id?: string | null
          image_url?: string | null
          instagram?: string | null
          is_premium?: boolean | null
          leads_count?: number | null
          mercado_pago_id?: string | null
          name?: string | null
          neighborhood?: string | null
          plan_tier?: Database["public"]["Enums"]["plan_tier"] | null
          premium_since?: string | null
          pricing?: string | null
          professional_name?: string | null
          services?: string[] | null
          status?: string | null
          total_reviews?: number | null
          trial_ends_at?: string | null
          updated_at?: string | null
          user_id?: string | null
          video_url?: string | null
          view_count?: number | null
          whatsapp?: string | null
          whatsapp_click_count?: number | null
        }
        Update: {
          average_rating?: number | null
          city?: string | null
          created_at?: string | null
          description?: string | null
          display_priority?: never
          email?: string | null
          facebook?: string | null
          gallery_urls?: string[] | null
          id?: string | null
          image_url?: string | null
          instagram?: string | null
          is_premium?: boolean | null
          leads_count?: number | null
          mercado_pago_id?: string | null
          name?: string | null
          neighborhood?: string | null
          plan_tier?: Database["public"]["Enums"]["plan_tier"] | null
          premium_since?: string | null
          pricing?: string | null
          professional_name?: string | null
          services?: string[] | null
          status?: string | null
          total_reviews?: number | null
          trial_ends_at?: string | null
          updated_at?: string | null
          user_id?: string | null
          video_url?: string | null
          view_count?: number | null
          whatsapp?: string | null
          whatsapp_click_count?: number | null
        }
        Relationships: []
      }
      approved_payments: {
        Row: {
          amount: number | null
          approved_at: string | null
          created_at: string | null
          email: string | null
          id: string | null
          payment_id: string | null
          plan_type: string | null
          user_name: string | null
        }
        Insert: {
          amount?: number | null
          approved_at?: string | null
          created_at?: string | null
          email?: string | null
          id?: string | null
          payment_id?: string | null
          plan_type?: string | null
          user_name?: string | null
        }
        Update: {
          amount?: number | null
          approved_at?: string | null
          created_at?: string | null
          email?: string | null
          id?: string | null
          payment_id?: string | null
          plan_type?: string | null
          user_name?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      approve_city_suggestion: {
        Args: { reviewer_id: string; suggestion_id: string }
        Returns: undefined
      }
      approve_neighborhood_suggestion: {
        Args: { reviewer_id: string; suggestion_id: string }
        Returns: undefined
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_view_count: { Args: { profile_id: string }; Returns: undefined }
      process_subscription_statuses: { Args: never; Returns: undefined }
    }
    Enums: {
      app_role: "admin" | "braider" | "client"
      plan_tier: "free" | "pro" | "premium"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "braider", "client"],
      plan_tier: ["free", "pro", "premium"],
    },
  },
} as const
