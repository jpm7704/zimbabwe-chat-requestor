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
      attachments: {
        Row: {
          id: string
          message_id: string | null
          name: string
          request_id: string | null
          size: number
          type: string
          uploaded_at: string
          url: string
        }
        Insert: {
          id?: string
          message_id?: string | null
          name: string
          request_id?: string | null
          size: number
          type: string
          uploaded_at?: string
          url: string
        }
        Update: {
          id?: string
          message_id?: string | null
          name?: string
          request_id?: string | null
          size?: number
          type?: string
          uploaded_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "attachments_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attachments_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "requests"
            referencedColumns: ["id"]
          },
        ]
      }
      field_visits: {
        Row: {
          assigned_officer_id: string | null
          assigned_officer_name: string | null
          created_at: string
          id: string
          location: string
          notes: string | null
          priority: string
          purpose: string | null
          region: string | null
          report_id: string | null
          report_submitted: boolean
          request_id: string | null
          status: string
          visit_date: string
        }
        Insert: {
          assigned_officer_id?: string | null
          assigned_officer_name?: string | null
          created_at?: string
          id?: string
          location: string
          notes?: string | null
          priority?: string
          purpose?: string | null
          region?: string | null
          report_id?: string | null
          report_submitted?: boolean
          request_id?: string | null
          status?: string
          visit_date: string
        }
        Update: {
          assigned_officer_id?: string | null
          assigned_officer_name?: string | null
          created_at?: string
          id?: string
          location?: string
          notes?: string | null
          priority?: string
          purpose?: string | null
          region?: string | null
          report_id?: string | null
          report_submitted?: boolean
          request_id?: string | null
          status?: string
          visit_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "field_visits_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "requests"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          id: string
          is_system_message: boolean | null
          request_id: string
          sender_id: string
          timestamp: string
        }
        Insert: {
          content: string
          id?: string
          is_system_message?: boolean | null
          request_id: string
          sender_id: string
          timestamp?: string
        }
        Update: {
          content?: string
          id?: string
          is_system_message?: boolean | null
          request_id?: string
          sender_id?: string
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "requests"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          link: string | null
          message: string
          read: boolean
          related_id: string | null
          target_roles: string[]
          title: string
          type: string
        }
        Insert: {
          created_at?: string
          id?: string
          link?: string | null
          message: string
          read?: boolean
          related_id?: string | null
          target_roles: string[]
          title: string
          type: string
        }
        Update: {
          created_at?: string
          id?: string
          link?: string | null
          message?: string
          read?: boolean
          related_id?: string | null
          target_roles?: string[]
          title?: string
          type?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          author_id: string | null
          author_name: string | null
          category: string | null
          content: string | null
          created_at: string
          id: string
          region: string | null
          status: string
          title: string
          type: string | null
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          author_name?: string | null
          category?: string | null
          content?: string | null
          created_at?: string
          id?: string
          region?: string | null
          status?: string
          title: string
          type?: string | null
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          author_name?: string | null
          category?: string | null
          content?: string | null
          created_at?: string
          id?: string
          region?: string | null
          status?: string
          title?: string
          type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      requests: {
        Row: {
          created_at: string
          description: string
          field_officer_id: string | null
          id: string
          notes: string | null
          program_manager_id: string | null
          status: string
          ticket_number: string
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description: string
          field_officer_id?: string | null
          id?: string
          notes?: string | null
          program_manager_id?: string | null
          status?: string
          ticket_number: string
          title: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string
          field_officer_id?: string | null
          id?: string
          notes?: string | null
          program_manager_id?: string | null
          status?: string
          ticket_number?: string
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      staff_roles: {
        Row: {
          can_approve: boolean | null
          can_assign: boolean | null
          created_at: string | null
          description: string | null
          display_name: string
          hierarchy_level: number
          id: string
          role_key: string
        }
        Insert: {
          can_approve?: boolean | null
          can_assign?: boolean | null
          created_at?: string | null
          description?: string | null
          display_name: string
          hierarchy_level: number
          id?: string
          role_key: string
        }
        Update: {
          can_approve?: boolean | null
          can_assign?: boolean | null
          created_at?: string | null
          description?: string | null
          display_name?: string
          hierarchy_level?: number
          id?: string
          role_key?: string
        }
        Relationships: []
      }
      staff_verification_codes: {
        Row: {
          code: string
          created_at: string | null
          expires_at: string
          id: string
          used: boolean | null
          used_at: string | null
          user_id: string
        }
        Insert: {
          code: string
          created_at?: string | null
          expires_at: string
          id?: string
          used?: boolean | null
          used_at?: string | null
          user_id: string
        }
        Update: {
          code?: string
          created_at?: string | null
          expires_at?: string
          id?: string
          used?: boolean | null
          used_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      status_updates: {
        Row: {
          id: string
          notes: string | null
          request_id: string
          status: string
          timestamp: string
          updated_by: string
        }
        Insert: {
          id?: string
          notes?: string | null
          request_id: string
          status: string
          timestamp?: string
          updated_by: string
        }
        Update: {
          id?: string
          notes?: string | null
          request_id?: string
          status?: string
          timestamp?: string
          updated_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "status_updates_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "requests"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          id: string
          name: string
          region: string | null
          role: string
          staff_number: number | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          id: string
          name: string
          region?: string | null
          role?: string
          staff_number?: number | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          region?: string | null
          role?: string
          staff_number?: number | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_manage_staff: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
      get_available_staff_roles: {
        Args: Record<PropertyKey, never>
        Returns: {
          role_key: string
          display_name: string
          description: string
        }[]
      }
      get_user_profile_role: {
        Args: {
          user_id: string
        }
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
