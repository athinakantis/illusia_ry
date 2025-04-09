export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      booked_item: {
        Row: {
          booking_id: string
          created_at: string
          id: string
          item_id: string
          quantity: number
          user_id: string
        }
        Insert: {
          booking_id: string
          created_at?: string
          id?: string
          item_id: string
          quantity: number
          user_id: string
        }
        Update: {
          booking_id?: string
          created_at?: string
          id?: string
          item_id?: string
          quantity?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "booked_item_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["booking_id"]
          },
          {
            foreignKeyName: "booked_item_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "frontend_item_view"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "booked_item_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "booked_item_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      bookings: {
        Row: {
          booking_id: string
          created_at: string | null
          end_date: string
          item_id: string
          start_date: string
          status: string
          user_id: string
        }
        Insert: {
          booking_id?: string
          created_at?: string | null
          end_date: string
          item_id?: string
          start_date: string
          status: string
          user_id?: string
        }
        Update: {
          booking_id?: string
          created_at?: string | null
          end_date?: string
          item_id?: string
          start_date?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      categories: {
        Row: {
          category_id: string
          category_name: string | null
          created_at: string | null
          description: string | null
        }
        Insert: {
          category_id?: string
          category_name?: string | null
          created_at?: string | null
          description?: string | null
        }
        Update: {
          category_id?: string
          category_name?: string | null
          created_at?: string | null
          description?: string | null
        }
        Relationships: []
      }
      item_tags: {
        Row: {
          created_at: string
          item_id: string
          tag_id: string | null
        }
        Insert: {
          created_at?: string
          item_id: string
          tag_id?: string | null
        }
        Update: {
          created_at?: string
          item_id?: string
          tag_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "item_tags_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: true
            referencedRelation: "frontend_item_view"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "item_tags_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: true
            referencedRelation: "items"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "item_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["tag_id"]
          },
        ]
      }
      items: {
        Row: {
          category_id: string
          created_at: string | null
          description: string | null
          image_path: string | null
          item_id: string
          item_name: string
          location: string
          quantity: number
        }
        Insert: {
          category_id: string
          created_at?: string | null
          description?: string | null
          image_path?: string | null
          item_id?: string
          item_name: string
          location: string
          quantity: number
        }
        Update: {
          category_id?: string
          created_at?: string | null
          description?: string | null
          image_path?: string | null
          item_id?: string
          item_name?: string
          location?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_category"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["category_id"]
          },
        ]
      }
      roles: {
        Row: {
          id: string
          role_title: string
        }
        Insert: {
          id?: string
          role_title: string
        }
        Update: {
          id?: string
          role_title?: string
        }
        Relationships: []
      }
      system_logs: {
        Row: {
          action_type: string
          created_at: string | null
          log_id: string
          metadata: Json | null
          target_id: string | null
          user_id: string | null
        }
        Insert: {
          action_type: string
          created_at?: string | null
          log_id?: string
          metadata?: Json | null
          target_id?: string | null
          user_id?: string | null
        }
        Update: {
          action_type?: string
          created_at?: string | null
          log_id?: string
          metadata?: Json | null
          target_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      tags: {
        Row: {
          created_at: string | null
          description: string | null
          tag_id: string
          tag_name: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          tag_id?: string
          tag_name?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          tag_id?: string
          tag_name?: string | null
        }
        Relationships: []
      }
      test: {
        Row: {
          created_at: string
          id: number
          text: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          text?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          text?: string | null
        }
        Relationships: []
      }
      test_data: {
        Row: {
          Content_summary: string | null
          Description: string | null
          id: string
          quantity: number | null
          Storage_details: string | null
          Storage_location: string | null
        }
        Insert: {
          Content_summary?: string | null
          Description?: string | null
          id?: string
          quantity?: number | null
          Storage_details?: string | null
          Storage_location?: string | null
        }
        Update: {
          Content_summary?: string | null
          Description?: string | null
          id?: string
          quantity?: number | null
          Storage_details?: string | null
          Storage_location?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          role_id: string
          user_id: string
        }
        Insert: {
          role_id: string
          user_id: string
        }
        Update: {
          role_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      users: {
        Row: {
          display_name: string | null
          email: string
          user_id: string
        }
        Insert: {
          display_name?: string | null
          email?: string
          user_id?: string
        }
        Update: {
          display_name?: string | null
          email?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      frontend_item_view: {
        Row: {
          category_name: string | null
          description: string | null
          image_path: string | null
          item_id: string | null
          item_name: string | null
          quantity: number | null
          tags: string[] | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_user_role: {
        Args: { p_user_id: string }
        Returns: string
      }
      is_user_admin: {
        Args: { p_user_id: string }
        Returns: boolean
      }
      update_user_role: {
        Args: { p_user_id: string; p_role_title: string }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
