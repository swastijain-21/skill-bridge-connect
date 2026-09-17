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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      resume_skills: {
        Row: {
          confidence: number
          created_at: string
          evidence: string
          id: string
          resume_id: string
          skill_id: string
          student_id: string
          proficiency: number
        }
        Insert: {
          confidence?: number
          created_at?: string
          evidence: string
          id?: string
          resume_id: string
          skill_id: string
          student_id: string
          proficiency?: number
        }
        Update: {
          confidence?: number
          created_at?: string
          evidence?: string
          id?: string
          resume_id?: string
          skill_id?: string
          student_id?: string
          proficiency?: number
        }
        Relationships: [
          {
            foreignKeyName: "resume_skills_resume_id_fkey"
            columns: ["resume_id"]
            isOneToOne: false
            referencedRelation: "student_resumes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resume_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      student_resumes: {
        Row: {
          created_at: string
          extracted_text: string | null
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id: string
          student_id: string
          parse_status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          extracted_text?: string | null
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id?: string
          student_id: string
          parse_status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          extracted_text?: string | null
          file_name?: string
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
          student_id?: string
          parse_status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "resume_skills_resume_id_fkey"
            columns: ["id"]
            isOneToOne: false
            referencedRelation: "resume_skills"
            referencedColumns: ["resume_id"]
          },
          {
            foreignKeyName: "student_resumes_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: true
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      applications: {
        Row: {
          applied_at: string
          cover_note: string | null
          id: string
          match_score: number
          opportunity_id: string
          status: Database["public"]["Enums"]["application_status"]
          student_id: string
          updated_at: string
        }
        Insert: {
          applied_at?: string
          cover_note?: string | null
          id?: string
          match_score?: number
          opportunity_id: string
          status?: Database["public"]["Enums"]["application_status"]
          student_id: string
          updated_at?: string
        }
        Update: {
          applied_at?: string
          cover_note?: string | null
          id?: string
          match_score?: number
          opportunity_id?: string
          status?: Database["public"]["Enums"]["application_status"]
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      assessment_results: {
        Row: {
          assessment_id: string
          id: string
          score: number
          student_id: string
          taken_at: string
        }
        Insert: {
          assessment_id: string
          id?: string
          score: number
          student_id: string
          taken_at?: string
        }
        Update: {
          assessment_id?: string
          id?: string
          score?: number
          student_id?: string
          taken_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessment_results_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "skill_assessments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessment_results_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      certifications: {
        Row: {
          credential_url: string | null
          id: string
          issue_date: string | null
          issuer: string | null
          student_id: string
          title: string
        }
        Insert: {
          credential_url?: string | null
          id?: string
          issue_date?: string | null
          issuer?: string | null
          student_id: string
          title: string
        }
        Update: {
          credential_url?: string | null
          id?: string
          issue_date?: string | null
          issuer?: string | null
          student_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "certifications_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          created_at: string
          description: string | null
          id: string
          location: string | null
          name: string
          profile_id: string | null
          sector: string | null
          size: string | null
          website: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          location?: string | null
          name: string
          profile_id?: string | null
          sector?: string | null
          size?: string | null
          website?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          location?: string | null
          name?: string
          profile_id?: string | null
          sector?: string | null
          size?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "companies_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback: {
        Row: {
          application_id: string | null
          comments: string | null
          company_id: string
          created_at: string
          id: string
          rating: number
          skills_endorsed: string[]
          skills_to_improve: string[]
          student_id: string
        }
        Insert: {
          application_id?: string | null
          comments?: string | null
          company_id: string
          created_at?: string
          id?: string
          rating?: number
          skills_endorsed?: string[]
          skills_to_improve?: string[]
          student_id: string
        }
        Update: {
          application_id?: string | null
          comments?: string | null
          company_id?: string
          created_at?: string
          id?: string
          rating?: number
          skills_endorsed?: string[]
          skills_to_improve?: string[]
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feedback_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      institutions: {
        Row: {
          city: string | null
          code: string | null
          created_at: string
          established: number | null
          id: string
          name: string
          profile_id: string | null
          state: string | null
          type: string | null
        }
        Insert: {
          city?: string | null
          code?: string | null
          created_at?: string
          established?: number | null
          id?: string
          name: string
          profile_id?: string | null
          state?: string | null
          type?: string | null
        }
        Update: {
          city?: string | null
          code?: string | null
          created_at?: string
          established?: number | null
          id?: string
          name?: string
          profile_id?: string | null
          state?: string | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "institutions_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_resources: {
        Row: {
          duration: string | null
          id: string
          level: string
          provider: string | null
          skill_id: string
          title: string
          type: string
          url: string | null
        }
        Insert: {
          duration?: string | null
          id?: string
          level?: string
          provider?: string | null
          skill_id: string
          title: string
          type?: string
          url?: string | null
        }
        Update: {
          duration?: string | null
          id?: string
          level?: string
          provider?: string | null
          skill_id?: string
          title?: string
          type?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "learning_resources_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          is_read: boolean
          title: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          title: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      opportunities: {
        Row: {
          company_id: string
          created_at: string
          deadline: string | null
          description: string | null
          duration: string | null
          eligibility: string | null
          experience_years: number
          id: string
          is_active: boolean
          location: string | null
          min_cgpa: number | null
          openings: number
          stipend: string | null
          title: string
          type: Database["public"]["Enums"]["opportunity_type"]
          work_mode: string | null
        }
        Insert: {
          company_id: string
          created_at?: string
          deadline?: string | null
          description?: string | null
          duration?: string | null
          eligibility?: string | null
          experience_years?: number
          id?: string
          is_active?: boolean
          location?: string | null
          min_cgpa?: number | null
          openings?: number
          stipend?: string | null
          title: string
          type?: Database["public"]["Enums"]["opportunity_type"]
          work_mode?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string
          deadline?: string | null
          description?: string | null
          duration?: string | null
          eligibility?: string | null
          experience_years?: number
          id?: string
          is_active?: boolean
          location?: string | null
          min_cgpa?: number | null
          openings?: number
          stipend?: string | null
          title?: string
          type?: Database["public"]["Enums"]["opportunity_type"]
          work_mode?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "opportunities_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      opportunity_skills: {
        Row: {
          id: string
          min_proficiency: number
          opportunity_id: string
          skill_id: string
          weight: number
        }
        Insert: {
          id?: string
          min_proficiency?: number
          opportunity_id: string
          skill_id: string
          weight?: number
        }
        Update: {
          id?: string
          min_proficiency?: number
          opportunity_id?: string
          skill_id?: string
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "opportunity_skills_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opportunity_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      placements: {
        Row: {
          company_id: string
          id: string
          opportunity_id: string | null
          package_lpa: number | null
          placed_on: string
          student_id: string
          type: Database["public"]["Enums"]["opportunity_type"]
        }
        Insert: {
          company_id: string
          id?: string
          opportunity_id?: string | null
          package_lpa?: number | null
          placed_on?: string
          student_id: string
          type?: Database["public"]["Enums"]["opportunity_type"]
        }
        Update: {
          company_id?: string
          id?: string
          opportunity_id?: string | null
          package_lpa?: number | null
          placed_on?: string
          student_id?: string
          type?: Database["public"]["Enums"]["opportunity_type"]
        }
        Relationships: [
          {
            foreignKeyName: "placements_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "placements_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "placements_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string
          description: string | null
          id: string
          link: string | null
          student_id: string
          tech_stack: string[]
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          link?: string | null
          student_id: string
          tech_stack?: string[]
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          link?: string | null
          student_id?: string
          tech_stack?: string[]
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      skill_assessments: {
        Row: {
          description: string | null
          duration_minutes: number
          id: string
          questions: Json
          skill_id: string
          title: string
        }
        Insert: {
          description?: string | null
          duration_minutes?: number
          id?: string
          questions?: Json
          skill_id: string
          title: string
        }
        Update: {
          description?: string | null
          duration_minutes?: number
          id?: string
          questions?: Json
          skill_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "skill_assessments_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      skills: {
        Row: {
          category: string
          demand_score: number
          description: string | null
          id: string
          name: string
        }
        Insert: {
          category?: string
          demand_score?: number
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          category?: string
          demand_score?: number
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      student_skills: {
        Row: {
          id: string
          proficiency: number
          skill_id: string
          source: string
          student_id: string
          updated_at: string
        }
        Insert: {
          id?: string
          proficiency?: number
          skill_id: string
          source?: string
          student_id: string
          updated_at?: string
        }
        Update: {
          id?: string
          proficiency?: number
          skill_id?: string
          source?: string
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_skills_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          bio: string | null
          cgpa: number | null
          created_at: string
          degree: string | null
          department: string | null
          email: string | null
          full_name: string
          graduation_year: number | null
          id: string
          institution_id: string | null
          location: string | null
          phone: string | null
          profile_id: string | null
        }
        Insert: {
          bio?: string | null
          cgpa?: number | null
          created_at?: string
          degree?: string | null
          department?: string | null
          email?: string | null
          full_name: string
          graduation_year?: number | null
          id?: string
          institution_id?: string | null
          location?: string | null
          phone?: string | null
          profile_id?: string | null
        }
        Update: {
          bio?: string | null
          cgpa?: number | null
          created_at?: string
          degree?: string | null
          department?: string | null
          email?: string | null
          full_name?: string
          graduation_year?: number | null
          id?: string
          institution_id?: string | null
          location?: string | null
          phone?: string | null
          profile_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "students_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
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
      [_ in never]: never
    }
    Functions: {
      current_profile_id: { Args: never; Returns: string }
      current_student_id: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      owns_company: { Args: { _company_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "student" | "institution" | "industry" | "admin"
      application_status:
        | "applied"
        | "under_review"
        | "shortlisted"
        | "interview"
        | "selected"
        | "rejected"
      opportunity_type: "internship" | "job"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["student", "institution", "industry", "admin"],
      application_status: [
        "applied",
        "under_review",
        "shortlisted",
        "interview",
        "selected",
        "rejected",
      ],
      opportunity_type: ["internship", "job"],
    },
  },
} as const
