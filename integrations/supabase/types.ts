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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      account_lockouts: {
        Row: {
          created_at: string
          email: string
          failed_attempts: number
          id: string
          last_failed_attempt: string | null
          locked_until: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          failed_attempts?: number
          id?: string
          last_failed_attempt?: string | null
          locked_until?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          failed_attempts?: number
          id?: string
          last_failed_attempt?: string | null
          locked_until?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      app_settings: {
        Row: {
          created_at: string
          id: string
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      auth_rate_limits: {
        Row: {
          attempt_type: string
          attempted_at: string
          id: string
          identifier: string
          success: boolean
        }
        Insert: {
          attempt_type?: string
          attempted_at?: string
          id?: string
          identifier: string
          success?: boolean
        }
        Update: {
          attempt_type?: string
          attempted_at?: string
          id?: string
          identifier?: string
          success?: boolean
        }
        Relationships: []
      }
      daily_delivery_data: {
        Row: {
          created_at: string
          date: string
          delivery_centre_id: string
          delivery_percentage: number | null
          id: string
          is_locked: boolean | null
          mail_delivered: number | null
          mail_received: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          date: string
          delivery_centre_id: string
          delivery_percentage?: number | null
          id?: string
          is_locked?: boolean | null
          mail_delivered?: number | null
          mail_received?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          date?: string
          delivery_centre_id?: string
          delivery_percentage?: number | null
          id?: string
          is_locked?: boolean | null
          mail_delivered?: number | null
          mail_received?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_delivery_data_delivery_centre_id_fkey"
            columns: ["delivery_centre_id"]
            isOneToOne: false
            referencedRelation: "delivery_centres"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_office_data: {
        Row: {
          aadhaar_amount: number | null
          aadhaar_transactions: number | null
          account_close: number | null
          account_open: number | null
          created_at: string
          date: string
          first_year_premium: number | null
          gi_insurance: number | null
          id: string
          ippb_account_open: number | null
          ippb_premium_account_open: number | null
          is_locked: boolean | null
          mail_amount: number | null
          mail_bookings: number | null
          mystamp_procurement: number | null
          net_account_addition: number | null
          new_policy_indexed: number | null
          office_id: string
          renewal_premium: number | null
          sum_assured: number | null
          updated_at: string
        }
        Insert: {
          aadhaar_amount?: number | null
          aadhaar_transactions?: number | null
          account_close?: number | null
          account_open?: number | null
          created_at?: string
          date: string
          first_year_premium?: number | null
          gi_insurance?: number | null
          id?: string
          ippb_account_open?: number | null
          ippb_premium_account_open?: number | null
          is_locked?: boolean | null
          mail_amount?: number | null
          mail_bookings?: number | null
          mystamp_procurement?: number | null
          net_account_addition?: number | null
          new_policy_indexed?: number | null
          office_id: string
          renewal_premium?: number | null
          sum_assured?: number | null
          updated_at?: string
        }
        Update: {
          aadhaar_amount?: number | null
          aadhaar_transactions?: number | null
          account_close?: number | null
          account_open?: number | null
          created_at?: string
          date?: string
          first_year_premium?: number | null
          gi_insurance?: number | null
          id?: string
          ippb_account_open?: number | null
          ippb_premium_account_open?: number | null
          is_locked?: boolean | null
          mail_amount?: number | null
          mail_bookings?: number | null
          mystamp_procurement?: number | null
          net_account_addition?: number | null
          new_policy_indexed?: number | null
          office_id?: string
          renewal_premium?: number | null
          sum_assured?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_office_data_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "offices"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_centres: {
        Row: {
          centre_code: string | null
          created_at: string
          id: string
          name: string
        }
        Insert: {
          centre_code?: string | null
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          centre_code?: string | null
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      email_logs: {
        Row: {
          created_at: string
          email_type: string
          error_message: string | null
          id: string
          recipient_email: string
          recipient_name: string | null
          related_delivery_centre_id: string | null
          related_office_id: string | null
          status: string
          subject: string
        }
        Insert: {
          created_at?: string
          email_type: string
          error_message?: string | null
          id?: string
          recipient_email: string
          recipient_name?: string | null
          related_delivery_centre_id?: string | null
          related_office_id?: string | null
          status?: string
          subject: string
        }
        Update: {
          created_at?: string
          email_type?: string
          error_message?: string | null
          id?: string
          recipient_email?: string
          recipient_name?: string | null
          related_delivery_centre_id?: string | null
          related_office_id?: string | null
          status?: string
          subject?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_logs_related_delivery_centre_id_fkey"
            columns: ["related_delivery_centre_id"]
            isOneToOne: false
            referencedRelation: "delivery_centres"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_logs_related_office_id_fkey"
            columns: ["related_office_id"]
            isOneToOne: false
            referencedRelation: "offices"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_years: {
        Row: {
          created_at: string
          end_date: string
          id: string
          is_active: boolean | null
          start_date: string
          year_name: string
        }
        Insert: {
          created_at?: string
          end_date: string
          id?: string
          is_active?: boolean | null
          start_date: string
          year_name: string
        }
        Update: {
          created_at?: string
          end_date?: string
          id?: string
          is_active?: boolean | null
          start_date?: string
          year_name?: string
        }
        Relationships: []
      }
      office_targets: {
        Row: {
          aadhaar_amount_target: number | null
          aadhaar_transactions_target: number | null
          account_open_target: number | null
          created_at: string
          financial_year_id: string
          first_year_premium_target: number | null
          gi_insurance_target: number | null
          id: string
          ippb_account_target: number | null
          ippb_premium_target: number | null
          mail_amount_target: number | null
          mail_booking_target: number | null
          mystamp_target: number | null
          net_account_target: number | null
          new_policy_target: number | null
          office_id: string
          renewal_premium_target: number | null
          sum_assured_target: number | null
          updated_at: string
        }
        Insert: {
          aadhaar_amount_target?: number | null
          aadhaar_transactions_target?: number | null
          account_open_target?: number | null
          created_at?: string
          financial_year_id: string
          first_year_premium_target?: number | null
          gi_insurance_target?: number | null
          id?: string
          ippb_account_target?: number | null
          ippb_premium_target?: number | null
          mail_amount_target?: number | null
          mail_booking_target?: number | null
          mystamp_target?: number | null
          net_account_target?: number | null
          new_policy_target?: number | null
          office_id: string
          renewal_premium_target?: number | null
          sum_assured_target?: number | null
          updated_at?: string
        }
        Update: {
          aadhaar_amount_target?: number | null
          aadhaar_transactions_target?: number | null
          account_open_target?: number | null
          created_at?: string
          financial_year_id?: string
          first_year_premium_target?: number | null
          gi_insurance_target?: number | null
          id?: string
          ippb_account_target?: number | null
          ippb_premium_target?: number | null
          mail_amount_target?: number | null
          mail_booking_target?: number | null
          mystamp_target?: number | null
          net_account_target?: number | null
          new_policy_target?: number | null
          office_id?: string
          renewal_premium_target?: number | null
          sum_assured_target?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "office_targets_financial_year_id_fkey"
            columns: ["financial_year_id"]
            isOneToOne: false
            referencedRelation: "financial_years"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "office_targets_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "offices"
            referencedColumns: ["id"]
          },
        ]
      }
      offices: {
        Row: {
          created_at: string
          id: string
          name: string
          office_code: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          office_code?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          office_code?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_delivery_centre_assignments: {
        Row: {
          created_at: string
          delivery_centre_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          delivery_centre_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          delivery_centre_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_delivery_centre_assignments_delivery_centre_id_fkey"
            columns: ["delivery_centre_id"]
            isOneToOne: false
            referencedRelation: "delivery_centres"
            referencedColumns: ["id"]
          },
        ]
      }
      user_office_assignments: {
        Row: {
          created_at: string
          id: string
          office_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          office_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          office_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_office_assignments_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "offices"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      admin_delivery_centre_assignments_view: {
        Row: {
          centre_name: string | null
          created_at: string | null
          delivery_centre_id: string | null
          id: string | null
          user_id: string | null
        }
        Relationships: []
      }
      admin_office_assignments_view: {
        Row: {
          created_at: string | null
          id: string | null
          office_id: string | null
          office_name: string | null
          user_id: string | null
        }
        Relationships: []
      }
      admin_profiles_view: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string | null
          updated_at: string | null
        }
        Relationships: []
      }
      admin_user_roles_view: {
        Row: {
          id: string | null
          role: Database["public"]["Enums"]["app_role"] | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      check_account_lockout: {
        Args: { _email: string }
        Returns: {
          failed_attempts: number
          is_locked: boolean
          locked_until: string
        }[]
      }
      check_auth_rate_limit: {
        Args: {
          _attempt_type: string
          _identifier: string
          _max_attempts?: number
          _window_minutes?: number
        }
        Returns: {
          attempts_remaining: number
          blocked_until: string
          is_allowed: boolean
        }[]
      }
      get_all_delivery_centre_assignments_for_admin: {
        Args: never
        Returns: {
          centre_name: string
          created_at: string
          delivery_centre_id: string
          id: string
          user_id: string
        }[]
      }
      get_all_office_assignments_for_admin: {
        Args: never
        Returns: {
          created_at: string
          id: string
          office_id: string
          office_name: string
          user_id: string
        }[]
      }
      get_all_profiles_for_admin: {
        Args: never
        Returns: {
          created_at: string
          email: string
          full_name: string
          id: string
          updated_at: string
        }[]
      }
      get_all_user_roles_for_admin: {
        Args: never
        Returns: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_assigned_to_delivery_centre: {
        Args: { _delivery_centre_id: string; _user_id: string }
        Returns: boolean
      }
      is_assigned_to_office: {
        Args: { _office_id: string; _user_id: string }
        Returns: boolean
      }
      is_today: { Args: { _date: string }; Returns: boolean }
      record_auth_attempt: {
        Args: { _attempt_type: string; _identifier: string; _success: boolean }
        Returns: undefined
      }
      record_failed_login: {
        Args: { _email: string }
        Returns: {
          is_now_locked: boolean
          locked_until: string
          total_failures: number
        }[]
      }
      reset_account_lockout: { Args: { _email: string }; Returns: undefined }
    }
    Enums: {
      app_role: "admin" | "staff"
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
      app_role: ["admin", "staff"],
    },
  },
} as const
