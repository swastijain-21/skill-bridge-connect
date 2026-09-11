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

type ProvisioningInput = {
  fullName?: string;
  email?: string;
  role?: AppRole;
};

function isAppRole(value: unknown): value is AppRole {
  return value === "student" || value === "institution" || value === "industry" || value === "admin";
}

async function ensureCompanyRecord(profile: SessionProfile) {
  if (profile.role !== "industry") return null;

  const { data: existingCompany, error: existingCompanyError } = await supabase
    .from("companies")
    .select("*")
    .eq("profile_id", profile.id)
    .limit(1)
    .maybeSingle();
  if (existingCompanyError) throw existingCompanyError;
  if (existingCompany) return existingCompany;

  const { data: company, error: companyError } = await supabase
    .from("companies")
    .insert({
      profile_id: profile.id,
      name: profile.full_name || profile.email || "Industry partner",
    })
    .select("*")
    .single();
  if (companyError) throw companyError;
  return company;
}

async function ensureInstitutionRecord(profile: SessionProfile) {
  if (profile.role !== "institution") return null;

  const { data: existingInstitution, error: existingInstitutionError } = await supabase
    .from("institutions")
    .select("*")
    .eq("profile_id", profile.id)
    .limit(1)
    .maybeSingle();
  if (existingInstitutionError) throw existingInstitutionError;
  if (existingInstitution) return existingInstitution;

  const { data: institution, error: institutionError } = await supabase
    .from("institutions")
    .insert({
      profile_id: profile.id,
      name: profile.full_name || profile.email || "Institution",
    })
    .select("*")
    .single();
  if (institutionError) throw institutionError;
  return institution;
}

export async function provisionAuthenticatedUser(
  input: ProvisioningInput = {},
): Promise<SessionProfile> {
  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError) throw authError;
  if (!auth.user) throw new Error("You must be signed in to finish setting up your account.");

  const { data: existingProfile, error: existingProfileError } = await supabase
    .from("profiles")
    .select("id, user_id, full_name, email, role")
    .eq("user_id", auth.user.id)
    .maybeSingle();
  if (existingProfileError) throw existingProfileError;

  const metadata = auth.user.user_metadata;
  const email = input.email?.trim() || existingProfile?.email || auth.user.email || "";
  const fullName =
    input.fullName?.trim() ||
    existingProfile?.full_name ||
    (typeof metadata?.["full_name"] === "string" ? metadata["full_name"].trim() : "") ||
    email ||
    "SkillBridge user";
  const metadataRole = isAppRole(metadata?.["role"]) ? metadata["role"] : undefined;
  const role = input.role ?? existingProfile?.role ?? metadataRole ?? "student";
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .upsert(
      {
        user_id: auth.user.id,
        full_name: fullName,
        email,
        role,
      },
      { onConflict: "user_id" },
    )
    .select("id, user_id, full_name, email, role")
    .single();
  if (profileError) throw profileError;

  const { data: existingRole, error: existingRoleError } = await supabase
    .from("user_roles")
    .select("id")
    .eq("user_id", auth.user.id)
    .eq("role", role)
    .maybeSingle();
  if (existingRoleError) throw existingRoleError;

  if (!existingRole) {
    const { error: roleError } = await supabase
      .from("user_roles")
      .insert({ user_id: auth.user.id, role });
    if (roleError) throw roleError;
  }

  if (role === "student") {
    const { error: studentError } = await supabase
      .from("students")
      .upsert(
        {
          profile_id: profile.id,
          full_name: fullName,
          email,
        },
        { onConflict: "profile_id" },
      );
    if (studentError) throw studentError;
  }

  await ensureCompanyRecord(profile as SessionProfile);
  await ensureInstitutionRecord(profile as SessionProfile);

  return profile as SessionProfile;
}

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
      return ensureCompanyRecord(profile.data!);
    },
  });
}

export function useInstitutionRecord() {
  const profile = useProfile();
  return useQuery({
    queryKey: ["institution-record", profile.data?.id],
    enabled: !!profile.data?.id,
    queryFn: async () => {
      return ensureInstitutionRecord(profile.data!);
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
