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
          uploaded_at: string | null
          url: string
        }
        Insert: {
          id?: string
          message_id?: string | null
          name: string
          request_id?: string | null
          size: number
          type: string
          uploaded_at?: string | null
          url: string
        }
        Update: {
          id?: string
          message_id?: string | null
          name?: string
          request_id?: string | null
          size?: number
          type?: string
          uploaded_at?: string | null
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
      audit_log: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip_address: string | null
          new_data: Json | null
          old_data: Json | null
          record_id: string | null
          table_name: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      field_visits: {
        Row: {
          assigned_officer_id: string | null
          assigned_officer_name: string | null
          created_at: string | null
          id: string
          location: string | null
          priority: string
          purpose: string | null
          region: string | null
          report_id: string | null
          report_submitted: boolean | null
          request_id: string | null
          status: string
          updated_at: string | null
          visit_date: string | null
        }
        Insert: {
          assigned_officer_id?: string | null
          assigned_officer_name?: string | null
          created_at?: string | null
          id?: string
          location?: string | null
          priority?: string
          purpose?: string | null
          region?: string | null
          report_id?: string | null
          report_submitted?: boolean | null
          request_id?: string | null
          status?: string
          updated_at?: string | null
          visit_date?: string | null
        }
        Update: {
          assigned_officer_id?: string | null
          assigned_officer_name?: string | null
          created_at?: string | null
          id?: string
          location?: string | null
          priority?: string
          purpose?: string | null
          region?: string | null
          report_id?: string | null
          report_submitted?: boolean | null
          request_id?: string | null
          status?: string
          updated_at?: string | null
          visit_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "field_visits_assigned_officer_id_fkey"
            columns: ["assigned_officer_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "field_visits_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "requests"
            referencedColumns: ["id"]
          },
        ]
      }
      issues: {
        Row: {
          created_at: string
          description: string
          id: string
          project_id: string | null
          reported_date: string
          resolved_date: string | null
          severity: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          project_id?: string | null
          reported_date?: string
          resolved_date?: string | null
          severity?: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          project_id?: string | null
          reported_date?: string
          resolved_date?: string | null
          severity?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "issues_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      kpis: {
        Row: {
          created_at: string
          current_value: number
          description: string | null
          id: string
          name: string
          project_id: string | null
          target_value: number
          unit: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_value?: number
          description?: string | null
          id?: string
          name: string
          project_id?: string | null
          target_value: number
          unit: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_value?: number
          description?: string | null
          id?: string
          name?: string
          project_id?: string | null
          target_value?: number
          unit?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "kpis_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
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
          timestamp: string | null
        }
        Insert: {
          content: string
          id?: string
          is_system_message?: boolean | null
          request_id: string
          sender_id: string
          timestamp?: string | null
        }
        Update: {
          content?: string
          id?: string
          is_system_message?: boolean | null
          request_id?: string
          sender_id?: string
          timestamp?: string | null
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
          content: string
          created_at: string | null
          id: string
          link: string | null
          read: boolean | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          link?: string | null
          read?: boolean | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          link?: string | null
          read?: boolean | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      program_assignments: {
        Row: {
          created_at: string
          id: string
          program_id: string | null
          responsible_party_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          program_id?: string | null
          responsible_party_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          program_id?: string | null
          responsible_party_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "program_assignments_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "program_assignments_responsible_party_id_fkey"
            columns: ["responsible_party_id"]
            isOneToOne: false
            referencedRelation: "responsible_parties"
            referencedColumns: ["id"]
          },
        ]
      }
      programs: {
        Row: {
          actual_end_date: string | null
          budget: number
          created_at: string
          description: string | null
          id: string
          name: string
          spent: number
          start_date: string
          status: Database["public"]["Enums"]["status_type"]
          target_end_date: string
          thematic_area: Database["public"]["Enums"]["thematic_area"]
          updated_at: string
        }
        Insert: {
          actual_end_date?: string | null
          budget?: number
          created_at?: string
          description?: string | null
          id?: string
          name: string
          spent?: number
          start_date: string
          status?: Database["public"]["Enums"]["status_type"]
          target_end_date: string
          thematic_area: Database["public"]["Enums"]["thematic_area"]
          updated_at?: string
        }
        Update: {
          actual_end_date?: string | null
          budget?: number
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          spent?: number
          start_date?: string
          status?: Database["public"]["Enums"]["status_type"]
          target_end_date?: string
          thematic_area?: Database["public"]["Enums"]["thematic_area"]
          updated_at?: string
        }
        Relationships: []
      }
      project_assignments: {
        Row: {
          created_at: string
          id: string
          project_id: string | null
          responsible_party_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          project_id?: string | null
          responsible_party_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          project_id?: string | null
          responsible_party_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_assignments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_assignments_responsible_party_id_fkey"
            columns: ["responsible_party_id"]
            isOneToOne: false
            referencedRelation: "responsible_parties"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          activities: string | null
          budget: number
          completed_date: string | null
          created_at: string
          description: string | null
          due_date: string
          id: string
          milestones: string | null
          name: string
          objectives: string | null
          program_id: string | null
          progress: number
          region: string | null
          resources: string | null
          risks: string | null
          spent: number
          start_date: string
          status: Database["public"]["Enums"]["status_type"]
          updated_at: string
        }
        Insert: {
          activities?: string | null
          budget?: number
          completed_date?: string | null
          created_at?: string
          description?: string | null
          due_date: string
          id?: string
          milestones?: string | null
          name: string
          objectives?: string | null
          program_id?: string | null
          progress?: number
          region?: string | null
          resources?: string | null
          risks?: string | null
          spent?: number
          start_date: string
          status?: Database["public"]["Enums"]["status_type"]
          updated_at?: string
        }
        Update: {
          activities?: string | null
          budget?: number
          completed_date?: string | null
          created_at?: string
          description?: string | null
          due_date?: string
          id?: string
          milestones?: string | null
          name?: string
          objectives?: string | null
          program_id?: string | null
          progress?: number
          region?: string | null
          resources?: string | null
          risks?: string | null
          spent?: number
          start_date?: string
          status?: Database["public"]["Enums"]["status_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      regions: {
        Row: {
          active: boolean | null
          code: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          code?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          code?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      report_templates: {
        Row: {
          active: boolean | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          template_fields: Json
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          template_fields: Json
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          template_fields?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      reports: {
        Row: {
          author_id: string | null
          content: string
          created_at: string | null
          field_visit_id: string | null
          id: string
          request_id: string | null
          status: string
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          content: string
          created_at?: string | null
          field_visit_id?: string | null
          id?: string
          request_id?: string | null
          status?: string
          title: string
          type: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          content?: string
          created_at?: string | null
          field_visit_id?: string | null
          id?: string
          request_id?: string | null
          status?: string
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reports_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_field_visit_id_fkey"
            columns: ["field_visit_id"]
            isOneToOne: false
            referencedRelation: "field_visits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "requests"
            referencedColumns: ["id"]
          },
        ]
      }
      request_types: {
        Row: {
          active: boolean | null
          color: string | null
          created_at: string | null
          description: string | null
          display_name: string
          icon: string | null
          id: string
          key: string
          requires_approval: boolean | null
          requires_field_visit: boolean | null
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          display_name: string
          icon?: string | null
          id?: string
          key: string
          requires_approval?: boolean | null
          requires_field_visit?: boolean | null
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          display_name?: string
          icon?: string | null
          id?: string
          key?: string
          requires_approval?: boolean | null
          requires_field_visit?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      requests: {
        Row: {
          created_at: string | null
          description: string
          due_date: string | null
          field_officer_id: string | null
          id: string
          is_enquiry: boolean | null
          notes: string | null
          priority: string | null
          program_manager_id: string | null
          region: string | null
          status: string
          ticket_number: string
          title: string
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description: string
          due_date?: string | null
          field_officer_id?: string | null
          id?: string
          is_enquiry?: boolean | null
          notes?: string | null
          priority?: string | null
          program_manager_id?: string | null
          region?: string | null
          status?: string
          ticket_number: string
          title: string
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string
          due_date?: string | null
          field_officer_id?: string | null
          id?: string
          is_enquiry?: boolean | null
          notes?: string | null
          priority?: string | null
          program_manager_id?: string | null
          region?: string | null
          status?: string
          ticket_number?: string
          title?: string
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      responsible_parties: {
        Row: {
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string | null
          role: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          role: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          role?: string
        }
        Relationships: []
      }
      settings: {
        Row: {
          created_at: string | null
          id: string
          is_global: boolean | null
          key: string
          updated_at: string | null
          user_id: string | null
          value: Json
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_global?: boolean | null
          key: string
          updated_at?: string | null
          user_id?: string | null
          value: Json
        }
        Update: {
          created_at?: string | null
          id?: string
          is_global?: boolean | null
          key?: string
          updated_at?: string | null
          user_id?: string | null
          value?: Json
        }
        Relationships: [
          {
            foreignKeyName: "settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
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
      status_updates: {
        Row: {
          id: string
          notes: string | null
          request_id: string
          status: string
          timestamp: string | null
          updated_by: string
        }
        Insert: {
          id?: string
          notes?: string | null
          request_id: string
          status: string
          timestamp?: string | null
          updated_by: string
        }
        Update: {
          id?: string
          notes?: string | null
          request_id?: string
          status?: string
          timestamp?: string | null
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
      system_status: {
        Row: {
          component: string
          created_at: string | null
          id: string
          last_checked: string | null
          message: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          component: string
          created_at?: string | null
          id?: string
          last_checked?: string | null
          message?: string | null
          status: string
          updated_at?: string | null
        }
        Update: {
          component?: string
          created_at?: string | null
          id?: string
          last_checked?: string | null
          message?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          region: string | null
          role: string
          staff_number: number | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          first_name?: string | null
          id: string
          last_name?: string | null
          region?: string | null
          role?: string
          staff_number?: number | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          region?: string | null
          role?: string
          staff_number?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      workflow_statuses: {
        Row: {
          approver_role: string | null
          color: string | null
          created_at: string | null
          description: string | null
          display_name: string
          icon: string | null
          id: string
          is_final: boolean | null
          key: string
          order_index: number
          requires_approval: boolean | null
          updated_at: string | null
        }
        Insert: {
          approver_role?: string | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          display_name: string
          icon?: string | null
          id?: string
          is_final?: boolean | null
          key: string
          order_index: number
          requires_approval?: boolean | null
          updated_at?: string | null
        }
        Update: {
          approver_role?: string | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          display_name?: string
          icon?: string | null
          id?: string
          is_final?: boolean | null
          key?: string
          order_index?: number
          requires_approval?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      workflow_transitions: {
        Row: {
          allowed_roles: string[]
          created_at: string | null
          from_status: string
          id: string
          requires_approval: boolean | null
          requires_comment: boolean | null
          to_status: string
          updated_at: string | null
        }
        Insert: {
          allowed_roles: string[]
          created_at?: string | null
          from_status: string
          id?: string
          requires_approval?: boolean | null
          requires_comment?: boolean | null
          to_status: string
          updated_at?: string | null
        }
        Update: {
          allowed_roles?: string[]
          created_at?: string | null
          from_status?: string
          id?: string
          requires_approval?: boolean | null
          requires_comment?: boolean | null
          to_status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workflow_transitions_from_status_fkey"
            columns: ["from_status"]
            isOneToOne: false
            referencedRelation: "workflow_statuses"
            referencedColumns: ["key"]
          },
          {
            foreignKeyName: "workflow_transitions_to_status_fkey"
            columns: ["to_status"]
            isOneToOne: false
            referencedRelation: "workflow_statuses"
            referencedColumns: ["key"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_default_admin: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      status_type:
        | "On Track"
        | "At Risk"
        | "Delayed"
        | "Completed"
        | "Not Started"
      thematic_area:
        | "Health and Wellness"
        | "Food & Nutrition Security"
        | "Education"
        | "WASH"
        | "Empowerment"
        | "Disaster Risk Reduction"
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
