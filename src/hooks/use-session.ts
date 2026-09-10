import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "student" | "institution" | "industry" | "admin";

export type SessionProfile = {
  id: string;
  user_id: string | null;
  full_name: string;
  email: string | null;
  role: AppRole;
};

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async (): Promise<SessionProfile | null> => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("id, user_id, full_name, email, role")
        .eq("user_id", auth.user.id)
        .maybeSingle();
      if (error) throw error;
      return (data as SessionProfile) ?? null;
    },
    staleTime: 30_000,
  });
}

export function useStudentRecord() {
  const profile = useProfile();
  return useQuery({
    queryKey: ["student-record", profile.data?.id],
    enabled: !!profile.data?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("students")
        .select("*, institutions(name, city, state)")
        .eq("profile_id", profile.data!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function useCompanyRecord() {
  const profile = useProfile();
  return useQuery({
    queryKey: ["company-record", profile.data?.id],
    enabled: !!profile.data?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .eq("profile_id", profile.data!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function useInstitutionRecord() {
  const profile = useProfile();
  return useQuery({
    queryKey: ["institution-record", profile.data?.id],
    enabled: !!profile.data?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("institutions")
        .select("*")
        .eq("profile_id", profile.data!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function homeFor(role: AppRole | undefined) {
  switch (role) {
    case "industry":
      return "/industry";
    case "institution":
      return "/institution";
    case "admin":
      return "/admin";
    default:
      return "/student";
  }
}
