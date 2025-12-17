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
      about_list_items: {
        Row: {
          about_id: string | null
          created_at: string | null
          display_order: number
          id: string
          text: string
        }
        Insert: {
          about_id?: string | null
          created_at?: string | null
          display_order?: number
          id?: string
          text: string
        }
        Update: {
          about_id?: string | null
          created_at?: string | null
          display_order?: number
          id?: string
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "about_list_items_about_id_fkey"
            columns: ["about_id"]
            isOneToOne: false
            referencedRelation: "about_section"
            referencedColumns: ["id"]
          },
        ]
      }
      about_section: {
        Row: {
          created_at: string | null
          id: string
          image_1_url: string | null
          image_2_url: string | null
          main_paragraph: string
          mission_icon: string
          mission_text: string
          mission_title: string
          section_subtitle: string
          section_title: string
          updated_at: string | null
          vision_icon: string
          vision_text: string
          vision_title: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          image_1_url?: string | null
          image_2_url?: string | null
          main_paragraph: string
          mission_icon?: string
          mission_text: string
          mission_title: string
          section_subtitle?: string
          section_title: string
          updated_at?: string | null
          vision_icon?: string
          vision_text: string
          vision_title: string
        }
        Update: {
          created_at?: string | null
          id?: string
          image_1_url?: string | null
          image_2_url?: string | null
          main_paragraph?: string
          mission_icon?: string
          mission_text?: string
          mission_title?: string
          section_subtitle?: string
          section_title?: string
          updated_at?: string | null
          vision_icon?: string
          vision_text?: string
          vision_title?: string
        }
        Relationships: []
      }
      contact_details: {
        Row: {
          address: string
          created_at: string | null
          email: string
          hotline: string
          id: string
          updated_at: string | null
        }
        Insert: {
          address: string
          created_at?: string | null
          email: string
          hotline: string
          id?: string
          updated_at?: string | null
        }
        Update: {
          address?: string
          created_at?: string | null
          email?: string
          hotline?: string
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      cta_section: {
        Row: {
          created_at: string | null
          description: string
          id: string
          image_url: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          image_url?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          image_url?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      footer_content: {
        Row: {
          about_text: string
          copyright_text: string
          created_at: string | null
          id: string
          newsletter_title: string
          updated_at: string | null
        }
        Insert: {
          about_text: string
          copyright_text?: string
          created_at?: string | null
          id?: string
          newsletter_title: string
          updated_at?: string | null
        }
        Update: {
          about_text?: string
          copyright_text?: string
          created_at?: string | null
          id?: string
          newsletter_title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      footer_links: {
        Row: {
          created_at: string | null
          display_order: number
          id: string
          section: string
          text: string
          url: string
        }
        Insert: {
          created_at?: string | null
          display_order?: number
          id?: string
          section: string
          text: string
          url: string
        }
        Update: {
          created_at?: string | null
          display_order?: number
          id?: string
          section?: string
          text?: string
          url?: string
        }
        Relationships: []
      }
      hero_cards: {
        Row: {
          created_at: string | null
          display_order: number
          hero_id: string | null
          icon_name: string
          id: string
          subtitle: string
          title: string
        }
        Insert: {
          created_at?: string | null
          display_order?: number
          hero_id?: string | null
          icon_name: string
          id?: string
          subtitle: string
          title: string
        }
        Update: {
          created_at?: string | null
          display_order?: number
          hero_id?: string | null
          icon_name?: string
          id?: string
          subtitle?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "hero_cards_hero_id_fkey"
            columns: ["hero_id"]
            isOneToOne: false
            referencedRelation: "hero_section"
            referencedColumns: ["id"]
          },
        ]
      }
      hero_section: {
        Row: {
          created_at: string | null
          cta_text: string
          cta_url: string
          hero_image_url: string | null
          id: string
          subtitle: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          cta_text?: string
          cta_url?: string
          hero_image_url?: string | null
          id?: string
          subtitle: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          cta_text?: string
          cta_url?: string
          hero_image_url?: string | null
          id?: string
          subtitle?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      objectives: {
        Row: {
          created_at: string | null
          description: string
          display_order: number
          icon_name: string
          id: string
          position: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          display_order?: number
          icon_name: string
          id?: string
          position: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          display_order?: number
          icon_name?: string
          id?: string
          position?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      objectives_section_settings: {
        Row: {
          banner_image_url: string | null
          created_at: string | null
          id: string
          section_subtitle: string
          section_title: string
          updated_at: string | null
        }
        Insert: {
          banner_image_url?: string | null
          created_at?: string | null
          id?: string
          section_subtitle?: string
          section_title: string
          updated_at?: string | null
        }
        Update: {
          banner_image_url?: string | null
          created_at?: string | null
          id?: string
          section_subtitle?: string
          section_title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      page_cta_sections: {
        Row: {
          button_text: string | null
          button_url: string | null
          created_at: string
          description: string
          id: string
          image_url: string | null
          page_name: string
          title: string
          updated_at: string
        }
        Insert: {
          button_text?: string | null
          button_url?: string | null
          created_at?: string
          description: string
          id?: string
          image_url?: string | null
          page_name: string
          title: string
          updated_at?: string
        }
        Update: {
          button_text?: string | null
          button_url?: string | null
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          page_name?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      photobio_section_settings: {
        Row: {
          created_at: string | null
          cta_text: string
          id: string
          section_subtitle: string
          section_title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          cta_text?: string
          id?: string
          section_subtitle?: string
          section_title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          cta_text?: string
          id?: string
          section_subtitle?: string
          section_title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      photobiomodulation_cards: {
        Row: {
          author: string
          comments_count: number
          created_at: string | null
          description: string | null
          display_order: number
          id: string
          image_url: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author?: string
          comments_count?: number
          created_at?: string | null
          description?: string | null
          display_order?: number
          id?: string
          image_url?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author?: string
          comments_count?: number
          created_at?: string | null
          description?: string | null
          display_order?: number
          id?: string
          image_url?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      service_categories: {
        Row: {
          created_at: string
          display_order: number
          id: string
          page: string
          subtitle: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          page?: string
          subtitle: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          page?: string
          subtitle?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      service_items: {
        Row: {
          author: string
          category_id: string | null
          created_at: string
          display_order: number
          id: string
          image_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          author?: string
          category_id?: string | null
          created_at?: string
          display_order?: number
          id?: string
          image_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          author?: string
          category_id?: string | null
          created_at?: string
          display_order?: number
          id?: string
          image_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      site_settings: {
        Row: {
          created_at: string | null
          favicon_url: string | null
          id: string
          logo_url: string | null
          site_description: string
          site_title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          favicon_url?: string | null
          id?: string
          logo_url?: string | null
          site_description?: string
          site_title?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          favicon_url?: string | null
          id?: string
          logo_url?: string | null
          site_description?: string
          site_title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      social_links: {
        Row: {
          created_at: string | null
          display_order: number
          icon_name: string
          id: string
          platform: string
          url: string
        }
        Insert: {
          created_at?: string | null
          display_order?: number
          icon_name: string
          id?: string
          platform: string
          url: string
        }
        Update: {
          created_at?: string | null
          display_order?: number
          icon_name?: string
          id?: string
          platform?: string
          url?: string
        }
        Relationships: []
      }
      statistics: {
        Row: {
          created_at: string | null
          description: string
          display_order: number
          id: string
          number: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          display_order?: number
          id?: string
          number: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          display_order?: number
          id?: string
          number?: string
          updated_at?: string | null
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
          role?: Database["public"]["Enums"]["app_role"]
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
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "editor" | "viewer"
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
      app_role: ["admin", "editor", "viewer"],
    },
  },
} as const
