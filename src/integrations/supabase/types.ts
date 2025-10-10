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
          city: string
          created_at: string
          description: string | null
          email: string
          facebook: string | null
          gallery_urls: string[] | null
          id: string
          image_url: string | null
          instagram: string | null
          name: string
          neighborhood: string
          pricing: string | null
          professional_name: string | null
          services: string[] | null
          updated_at: string
          user_id: string
          video_url: string | null
          whatsapp: string
        }
        Insert: {
          city: string
          created_at?: string
          description?: string | null
          email: string
          facebook?: string | null
          gallery_urls?: string[] | null
          id?: string
          image_url?: string | null
          instagram?: string | null
          name: string
          neighborhood: string
          pricing?: string | null
          professional_name?: string | null
          services?: string[] | null
          updated_at?: string
          user_id: string
          video_url?: string | null
          whatsapp: string
        }
        Update: {
          city?: string
          created_at?: string
          description?: string | null
          email?: string
          facebook?: string | null
          gallery_urls?: string[] | null
          id?: string
          image_url?: string | null
          instagram?: string | null
          name?: string
          neighborhood?: string
          pricing?: string | null
          professional_name?: string | null
          services?: string[] | null
          updated_at?: string
          user_id?: string
          video_url?: string | null
          whatsapp?: string
        }
        Relationships: []
      }
      payment_attempts: {
        Row: {
          amount: number
          approved_at: string | null
          created_at: string
          email: string | null
          id: string
          payment_id: string | null
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
          rating: number
        }
        Insert: {
          braider_id: string
          client_name: string
          comment?: string | null
          created_at?: string
          id?: string
          rating: number
        }
        Update: {
          braider_id?: string
          client_name?: string
          comment?: string | null
          created_at?: string
          id?: string
          rating?: number
        }
        Relationships: [
          {
            foreignKeyName: "reviews_braider_id_fkey"
            columns: ["braider_id"]
            isOneToOne: false
            referencedRelation: "braider_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
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
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
