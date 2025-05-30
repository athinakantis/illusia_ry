export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      bookings: {
        Row: {
          booking_id: string
          created_at: string | null
          status: string
          user_id: string
        }
        Insert: {
          booking_id?: string
          created_at?: string | null
          status?: string
          user_id: string
        }
        Update: {
          booking_id?: string
          created_at?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_activity_view_test"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_role_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_with_roles_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_invoice_summary"
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
          image_path: string | null
        }
        Insert: {
          category_id?: string
          category_name?: string | null
          created_at?: string | null
          description?: string | null
          image_path?: string | null
        }
        Update: {
          category_id?: string
          category_name?: string | null
          created_at?: string | null
          description?: string | null
          image_path?: string | null
        }
        Relationships: []
      }
      invoice_bookings: {
        Row: {
          booking_id: string
          invoice_id: number
        }
        Insert: {
          booking_id: string
          invoice_id: number
        }
        Update: {
          booking_id?: string
          invoice_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_bookings_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "booking_owners"
            referencedColumns: ["booking_id"]
          },
          {
            foreignKeyName: "invoice_bookings_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["booking_id"]
          },
          {
            foreignKeyName: "invoice_bookings_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["invoice_id"]
          },
          {
            foreignKeyName: "invoice_bookings_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "v_invoice_summary"
            referencedColumns: ["invoice_id"]
          },
        ]
      }
      invoice_items: {
        Row: {
          description: string | null
          invoice_id: number
          invoice_item_id: number
          item_id: string | null
          item_name: string
          quantity: number
          total: number | null
          unit_price: number
        }
        Insert: {
          description?: string | null
          invoice_id: number
          invoice_item_id?: never
          item_id?: string | null
          item_name?: string
          quantity: number
          total?: number | null
          unit_price: number
        }
        Update: {
          description?: string | null
          invoice_id?: number
          invoice_item_id?: never
          item_id?: string | null
          item_name?: string
          quantity?: number
          total?: number | null
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["invoice_id"]
          },
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "v_invoice_summary"
            referencedColumns: ["invoice_id"]
          },
          {
            foreignKeyName: "invoice_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "frontend_item_view"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "invoice_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "invoice_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items_with_tags_and_categories"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "invoice_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "new_items"
            referencedColumns: ["item_id"]
          },
        ]
      }
      invoice_settings: {
        Row: {
          key: string
          value: string
        }
        Insert: {
          key: string
          value: string
        }
        Update: {
          key?: string
          value?: string
        }
        Relationships: []
      }
      invoices: {
        Row: {
          barcode_data: string | null
          created_at: string
          date_issued: string
          due_date: string
          invoice_id: number
          invoice_no: string
          notes: string | null
          pdf_generated_at: string | null
          pdf_url: string | null
          reference_number: string | null
          status: string
          subtotal: number
          tax: number
          total: number
          updated_at: string
          user_id: string
          vat_rate: number
        }
        Insert: {
          barcode_data?: string | null
          created_at?: string
          date_issued?: string
          due_date?: string
          invoice_id?: never
          invoice_no?: string
          notes?: string | null
          pdf_generated_at?: string | null
          pdf_url?: string | null
          reference_number?: string | null
          status?: string
          subtotal?: number
          tax?: number
          total?: number
          updated_at?: string
          user_id: string
          vat_rate?: number
        }
        Update: {
          barcode_data?: string | null
          created_at?: string
          date_issued?: string
          due_date?: string
          invoice_id?: never
          invoice_no?: string
          notes?: string | null
          pdf_generated_at?: string | null
          pdf_url?: string | null
          reference_number?: string | null
          status?: string
          subtotal?: number
          tax?: number
          total?: number
          updated_at?: string
          user_id?: string
          vat_rate?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoices_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_activity_view_test"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "invoices_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_role_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "invoices_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_with_roles_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "invoices_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "invoices_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_invoice_summary"
            referencedColumns: ["user_id"]
          },
        ]
      }
      item_reservations: {
        Row: {
          booking_id: string
          created_at: string | null
          end_date: string
          id: string
          is_active: boolean
          item_id: string
          quantity: number
          start_date: string
        }
        Insert: {
          booking_id: string
          created_at?: string | null
          end_date: string
          id?: string
          is_active?: boolean
          item_id: string
          quantity: number
          start_date: string
        }
        Update: {
          booking_id?: string
          created_at?: string | null
          end_date?: string
          id?: string
          is_active?: boolean
          item_id?: string
          quantity?: number
          start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "item_reservations_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "booking_owners"
            referencedColumns: ["booking_id"]
          },
          {
            foreignKeyName: "item_reservations_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["booking_id"]
          },
          {
            foreignKeyName: "item_reservations_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "frontend_item_view"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "item_reservations_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "item_reservations_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items_with_tags_and_categories"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "item_reservations_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "new_items"
            referencedColumns: ["item_id"]
          },
        ]
      }
      item_tags: {
        Row: {
          created_at: string
          item_id: string
          tag_id: string
        }
        Insert: {
          created_at?: string
          item_id: string
          tag_id: string
        }
        Update: {
          created_at?: string
          item_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "item_tags_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "frontend_item_view"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "item_tags_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "item_tags_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items_with_tags_and_categories"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "item_tags_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "new_items"
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
          image_path: string[] | null
          item_id: string
          item_name: string
          location: string
          quantity: number
          visible: boolean
        }
        Insert: {
          category_id: string
          created_at?: string | null
          description?: string | null
          image_path?: string[] | null
          item_id?: string
          item_name: string
          location: string
          quantity: number
          visible?: boolean
        }
        Update: {
          category_id?: string
          created_at?: string | null
          description?: string | null
          image_path?: string[] | null
          item_id?: string
          item_name?: string
          location?: string
          quantity?: number
          visible?: boolean
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
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string | null
          metadata: Json | null
          read_at: string | null
          recipient_type: string
          severity: string | null
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string | null
          metadata?: Json | null
          read_at?: string | null
          recipient_type: string
          severity?: string | null
          title: string
          type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string | null
          metadata?: Json | null
          read_at?: string | null
          recipient_type?: string
          severity?: string | null
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_activity_view_test"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_role_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_with_roles_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_invoice_summary"
            referencedColumns: ["user_id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          invoice_id: number
          method: string
          paid_at: string
          payment_id: string
          transaction_ref: string | null
        }
        Insert: {
          amount: number
          invoice_id: number
          method: string
          paid_at?: string
          payment_id?: string
          transaction_ref?: string | null
        }
        Update: {
          amount?: number
          invoice_id?: number
          method?: string
          paid_at?: string
          payment_id?: string
          transaction_ref?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["invoice_id"]
          },
          {
            foreignKeyName: "payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "v_invoice_summary"
            referencedColumns: ["invoice_id"]
          },
        ]
      }
      profiles: {
        Row: {
          is_admin: boolean
          user_id: string
        }
        Insert: {
          is_admin?: boolean
          user_id: string
        }
        Update: {
          is_admin?: boolean
          user_id?: string
        }
        Relationships: []
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
          metadata_fts: unknown | null
          table_name: string | null
          target_id: string | null
          user_id: string | null
        }
        Insert: {
          action_type: string
          created_at?: string | null
          log_id?: string
          metadata?: Json | null
          metadata_fts?: unknown | null
          table_name?: string | null
          target_id?: string | null
          user_id?: string | null
        }
        Update: {
          action_type?: string
          created_at?: string | null
          log_id?: string
          metadata?: Json | null
          metadata_fts?: unknown | null
          table_name?: string | null
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
            referencedRelation: "user_activity_view_test"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_role_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_with_roles_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_invoice_summary"
            referencedColumns: ["user_id"]
          },
        ]
      }
      users: {
        Row: {
          display_name: string | null
          email: string | null
          profile_image_url: string | null
          user_id: string
          user_status: string | null
        }
        Insert: {
          display_name?: string | null
          email?: string | null
          profile_image_url?: string | null
          user_id?: string
          user_status?: string | null
        }
        Update: {
          display_name?: string | null
          email?: string | null
          profile_image_url?: string | null
          user_id?: string
          user_status?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      booking_owners: {
        Row: {
          booking_id: string | null
          created_at: string | null
          display_name: string | null
          email: string | null
          status: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_activity_view_test"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_role_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_with_roles_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_invoice_summary"
            referencedColumns: ["user_id"]
          },
        ]
      }
      frontend_item_view: {
        Row: {
          category_name: string | null
          description: string | null
          image_path: string[] | null
          item_id: string | null
          item_name: string | null
          quantity: number | null
          tags: string[] | null
        }
        Relationships: []
      }
      items_with_tags_and_categories: {
        Row: {
          category_name: string | null
          description: string | null
          item_id: string | null
          item_name: string | null
          tags: string[] | null
        }
        Relationships: []
      }
      new_items: {
        Row: {
          category_id: string | null
          category_name: string | null
          created_at: string | null
          description: string | null
          image_path: string[] | null
          item_id: string | null
          item_name: string | null
          location: string | null
          quantity: number | null
          tags: string[] | null
          visible: boolean | null
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
      upcoming_bookings: {
        Row: {
          booking_id: string | null
          created_at: string | null
          end_date: string | null
          id: string | null
          item_id: string | null
          quantity: number | null
          start_date: string | null
          status: string | null
        }
        Relationships: [
          {
            foreignKeyName: "item_reservations_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "booking_owners"
            referencedColumns: ["booking_id"]
          },
          {
            foreignKeyName: "item_reservations_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["booking_id"]
          },
          {
            foreignKeyName: "item_reservations_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "frontend_item_view"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "item_reservations_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "item_reservations_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items_with_tags_and_categories"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "item_reservations_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "new_items"
            referencedColumns: ["item_id"]
          },
        ]
      }
      user_activity_view: {
        Row: {
          confirmed_at: string | null
          display_name: string | null
          last_sign_in_at: string | null
        }
        Relationships: []
      }
      user_activity_view_test: {
        Row: {
          confirmed_at: string | null
          display_name: string | null
          email: string | null
          last_sign_in_at: string | null
          user_id: string | null
        }
        Relationships: []
      }
      user_role_view: {
        Row: {
          display_name: string | null
          email: string | null
          role_title: string | null
          user_id: string | null
        }
        Relationships: []
      }
      user_with_roles_view: {
        Row: {
          display_name: string | null
          email: string | null
          role_title: string | null
          user_id: string | null
          user_status: string | null
        }
        Relationships: []
      }
      v_invoice_line_items: {
        Row: {
          invoice_id: number | null
          invoice_item_id: number | null
          invoice_no: string | null
          item_name: string | null
          line_total: number | null
          quantity: number | null
          unit_price: number | null
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["invoice_id"]
          },
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "v_invoice_summary"
            referencedColumns: ["invoice_id"]
          },
        ]
      }
      v_invoice_summary: {
        Row: {
          booking_ids: string | null
          customer_email: string | null
          customer_name: string | null
          date_issued: string | null
          due_date: string | null
          invoice_id: number | null
          invoice_no: string | null
          pdf_generated_at: string | null
          pdf_url: string | null
          status: string | null
          subtotal: number | null
          tax: number | null
          total: number | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      _actor: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      add_user_role_to_jwt: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      check_item_availability: {
        Args: {
          target_item_id: string
          desired_start: string
          desired_end: string
        }
        Returns: number
      }
      create_booking_with_reservations: {
        Args: { _user_id: string; _items: Json }
        Returns: Json
      }
      custom_access_token_hook: {
        Args: { event: Json }
        Returns: Json
      }
      get_admin_notifications: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          message: string
          link: string
          is_read: boolean
          amount: number
        }[]
      }
      get_latest_refresh_token: {
        Args:
          | { p_user_id: string }
          | { p_user_id: string }
          | { p_user_id: string }
        Returns: {
          token: string
          parent: string
        }[]
      }
      get_notifications: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          message: string
          link: string
          is_read: boolean
          amount: number
        }[]
      }
      get_unique_item_reservations: {
        Args: { limit_count: number }
        Returns: {
          booking_id: string
          created_at: string
          end_date: string
          id: string
          item_id: string
          quantity: number
          start_date: string
          status: string
          user_id: string
          display_name: string
          email: string
        }[]
      }
      get_user_bookings: {
        Args: { p_user_id: string }
        Returns: {
          booking_id: string
          user_id: string
          status: string
          created_at: string
          reservations: Json
        }[]
      }
      get_user_reservations_grouped: {
        Args: { user_id: string }
        Returns: Json
      }
      get_user_role: {
        Args: { p_user_id: string }
        Returns: string
      }
      has_role: {
        Args: { role_name: string }
        Returns: boolean
      }
      is_user_admin: {
        Args: { p_user_id: string }
        Returns: boolean
      }
      is_user_head_admin: {
        Args: { p_user_id: string }
        Returns: boolean
      }
      is_user_strict_admin: {
        Args: { p_user_id: string }
        Returns: boolean
      }
      set_current_user: {
        Args: Record<PropertyKey, never>
        Returns: undefined
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
  public: {
    Enums: {},
  },
} as const
