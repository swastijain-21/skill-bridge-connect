import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ClipboardList,
  LayoutDashboard,
  Loader2,
  LogOut,
  Mail,
  MapPin,
  Pencil,
  Plus,
  Save,
  Sparkles,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useCompanyRecord, useInstitutionRecord, useProfile } from "@/hooks/use-session";
import { computeMatch, type SkillRequirement } from "@/lib/skill-match";
import { cn } from "@/lib/utils";
import { EmptyState, ErrorState, LoadingState } from "@/components/states";
import { MatchBadge, PageHeader, SkillBar, StatCard } from "@/components/ui-bits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

type OpportunitySkillInput = {
  skill_id: string;
  name: string;
  min_proficiency: number;
  weight: number;
};

type IndustryOpportunity = {
  opportunity: {
    id: string;
    company_id: string;
    title: string;
    type: string;
    description: string | null;
    location: string | null;
    work_mode: string | null;
    duration: string | null;
    stipend: string | null;
    eligibility: string | null;
    min_cgpa: number | null;
    experience_years: number;
    openings: number;
    deadline: string | null;
    is_active: boolean;
    created_at: string;
  };
  requirements: SkillRequirement[];
  applicationCount: number;
  companyName: string | null;
};

type CandidateProfile = {
  id: string;
  full_name: string;
  degree: string | null;
  department: string | null;
  graduation_year: number | null;
  cgpa: number | null;
  location: string | null;
  bio: string | null;
  student_skills?: Array<{
    skill_id: string;
    proficiency: number;
    skills?: { id: string; name: string; category: string | null } | null;
  }>;
  projects?: Array<{
    id: string;
    title: string;
    description: string | null;
    tech_stack: string[];
    link: string | null;
  }>;
  certifications?: Array<{
    id: string;
    title: string;
    issuer: string | null;
    issue_date: string | null;
    credential_url: string | null;
  }>;
  assessment_results?: Array<{
    score: number;
    taken_at: string;
    skill_assessments?: { title: string | null; skills?: { name: string | null } | null } | null;
  }>;
};

const navItems = [
  { to: "/industry", label: "Dashboard", icon: LayoutDashboard },
  { to: "/industry/opportunities", label: "Opportunities", icon: BriefcaseBusiness },
  { to: "/industry/applications", label: "Applications", icon: ClipboardList },
  { to: "/industry/profile", label: "Profile", icon: UserRound },
] as const;

function QueryState({ loading, error, children }: { loading: boolean; error: Error | null; children: ReactNode }) {
  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error.message} />;
  return <>{children}</>;
}

function useIndustryData() {
  const profile = useProfile();
  const company = useCompanyRecord();
  const institution = useInstitutionRecord();
  const companyId = company.data?.id;
  return { profile, company, institution, companyId };
}

export function IndustryShell({ children }: { children: ReactNode }) {
  const { profile, company, institution } = useIndustryData();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (profile.isLoading || company.isLoading || institution.isLoading) {
    return <LoadingState label="Loading industry portal…" />;
  }
  if (profile.error || company.error || institution.error) {
    const error = profile.error ?? company.error ?? institution.error;
    return <ErrorState message={error?.message ?? "Unable to load this portal."} />;
  }
  if (!profile.data || (profile.data.role !== "industry" && profile.data.role !== "institution")) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <h1 className="text-xl font-semibold">Industry portal unavailable</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in with an industry account to access this portal.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const signOut = async () => {
    await supabase.auth.signOut();
    await navigate({ to: "/" });
  };
  const displayName = company.data?.name ?? institution.data?.name ?? profile.data.full_name;

  return (
    <div className="min-h-screen bg-muted/30 text-foreground">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 border-r bg-card p-4 transition-transform lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between px-2 py-3">
          <Link to="/industry" className="text-lg font-bold tracking-tight text-primary">
            SkillBridge
          </Link>
          <button className="lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Close menu">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="mt-5 space-y-1" aria-label="Industry navigation">
          {navItems.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                location.pathname === to
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" aria-hidden />
              {label}
            </Link>
          ))}
        </nav>
        <button
          onClick={signOut}
          className="absolute bottom-5 left-7 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <LogOut className="h-4 w-4" /> Sign Out
        </button>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-card/95 px-4 backdrop-blur sm:px-8">
          <button
            className="rounded-md border p-2 lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
          <div className="ml-auto flex items-center gap-3 text-sm">
            <span className="hidden text-muted-foreground sm:inline">{displayName}</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
              {(displayName ?? "I").slice(0, 1).toUpperCase()}
            </span>
          </div>
        </header>
        <main className="mx-auto max-w-7xl p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}

async function getCandidateProfiles(): Promise<CandidateProfile[]> {
  const { data, error } = await supabase
    .from("students")
    .select(
      `
      id,
      full_name,
      degree,
      department,
      graduation_year,
      cgpa,
      location,
      bio,
      student_skills(
        skill_id,
        proficiency,
        skills(id, name, category)
      ),
      projects(id, title, description, tech_stack, link),
      certifications(id, title, issuer, issue_date, credential_url),
      assessment_results(
        score,
        taken_at,
        skill_assessments(title, skills(name))
      )
      `,
    )
    .order("full_name");
  if (error) throw error;
  return (data ?? []) as CandidateProfile[];
}

function buildSkillMap(student: CandidateProfile | undefined) {
  return Object.fromEntries(
    (student?.student_skills ?? []).map((row) => [row.skill_id, row.proficiency]),
  ) as Record<string, number>;
}

function getOpportunityRequirements(rows: Array<{ skill_id: string; min_proficiency: number; weight: number; skills?: { id: string; name: string; category: string | null } | null }>): SkillRequirement[] {
  return rows.map((row) => ({
    skillId: row.skill_id,
    name: row.skills?.name ?? "Skill",
    minProficiency: row.min_proficiency,
    weight: row.weight,
  }));
}

function useMyOpportunities(companyId: string | undefined) {
  return useQuery({
    queryKey: ["industry-opportunities", companyId],
    enabled: !!companyId,
    queryFn: async (): Promise<IndustryOpportunity[]> => {
      if (!companyId) return [];

      const { data: opportunities, error: opportunityError } = await supabase
        .from("opportunities")
        .select("*")
        .eq("company_id", companyId)
        .order("created_at", { ascending: false });
      if (opportunityError) throw opportunityError;
      if (!opportunities?.length) return [];

      const opportunityIds = opportunities.map((item) => item.id);
      const { data: skillRows, error: skillError } = await supabase
        .from("opportunity_skills")
        .select("*, skills(id, name, category)")
        .in("opportunity_id", opportunityIds);
      if (skillError) throw skillError;

      const appQuery = await supabase
        .from("applications")
        .select("id, opportunity_id")
        .in("opportunity_id", opportunityIds);
      if (appQuery.error) throw appQuery.error;

      const appCounts = new Map<string, number>();
      for (const row of appQuery.data ?? []) {
        appCounts.set(row.opportunity_id, (appCounts.get(row.opportunity_id) ?? 0) + 1);
      }

      const byOpportunity = new Map<string, Array<{ skill_id: string; min_proficiency: number; weight: number; skills?: { id: string; name: string; category: string | null } | null }>>();
      for (const row of skillRows ?? []) {
        const current = byOpportunity.get(row.opportunity_id) ?? [];
        current.push(row as any);
        byOpportunity.set(row.opportunity_id, current);
      }

      return opportunities.map((opportunity) => ({
        opportunity,
        requirements: getOpportunityRequirements(byOpportunity.get(opportunity.id) ?? []),
        applicationCount: appCounts.get(opportunity.id) ?? 0,
        companyName: null,
      }));
    },
  });
}

function useMyApplications(companyId: string | undefined) {
  return useQuery({
    queryKey: ["industry-applications", companyId],
    enabled: !!companyId,
    queryFn: async () => {
      if (!companyId) return [];

      const { data: opportunities, error: opportunityError } = await supabase
        .from("opportunities")
        .select("id")
        .eq("company_id", companyId);
      if (opportunityError) throw opportunityError;
      if (!opportunities?.length) return [];

      const opportunityIds = opportunities.map((item) => item.id);
      const { data, error } = await supabase
        .from("applications")
        .select(
          `
          *,
          opportunities(id, title, company_id),
          students(
            id,
            full_name,
            degree,
            department,
            location,
            student_skills(skill_id, proficiency, skills(id, name, category)),
            projects(id, title, description, tech_stack, link),
            certifications(id, title, issuer, issue_date, credential_url),
            assessment_results(score, taken_at, skill_assessments(title, skills(name)))
          )
          `,
        )
        .in("opportunity_id", opportunityIds)
        .order("applied_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

function CandidateProfileSheet({ candidate, onClose }: { candidate: CandidateProfile | null; onClose: () => void }) {
  if (!candidate) return null;

  const skillRows = candidate.student_skills ?? [];
  const strongestSkills = [...skillRows]
    .sort((a, b) => (b.proficiency ?? 0) - (a.proficiency ?? 0))
    .slice(0, 6);

  return (
    <Card className="mt-6 border-primary/30">
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <CardTitle>Candidate profile</CardTitle>
        <button className="text-sm text-muted-foreground hover:text-foreground" onClick={onClose} aria-label="Close candidate profile">
          <X className="h-4 w-4" />
        </button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Name</p>
            <p className="mt-2 text-xl font-semibold">{candidate.full_name}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Academic profile</p>
            <p className="mt-2 text-sm text-foreground">
              {candidate.degree ?? "Degree not listed"} • {candidate.department ?? "Department not listed"}
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-md border bg-muted/20 p-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">CGPA</p>
            <p className="mt-2 font-medium">{candidate.cgpa ?? "N/A"}</p>
          </div>
          <div className="rounded-md border bg-muted/20 p-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Graduation</p>
            <p className="mt-2 font-medium">{candidate.graduation_year ?? "N/A"}</p>
          </div>
          <div className="rounded-md border bg-muted/20 p-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Location</p>
            <p className="mt-2 font-medium">{candidate.location ?? "N/A"}</p>
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Skills</p>
          <div className="mt-3 space-y-3">
            {strongestSkills.length ? strongestSkills.map((skill) => (
              <SkillBar
                key={skill.skill_id}
                name={skill.skills?.name ?? "Skill"}
                value={skill.proficiency}
                category={skill.skills?.category ?? ""}
              />
            )) : <p className="text-sm text-muted-foreground">No skills listed for this candidate.</p>}
          </div>
        </div>

        {candidate.bio ? (
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Summary</p>
            <p className="mt-2 text-sm leading-6 text-foreground">{candidate.bio}</p>
          </div>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Projects</p>
            <div className="mt-3 space-y-3">
              {(candidate.projects ?? []).length ? (
                candidate.projects?.map((project) => (
                  <div key={project.id} className="rounded-md border bg-muted/20 p-3">
                    <p className="font-medium">{project.title}</p>
                    {project.description ? <p className="mt-1 text-sm text-muted-foreground">{project.description}</p> : null}
                    {project.tech_stack?.length ? (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {project.tech_stack.map((tag) => (
                          <span key={`${project.id}-${tag}`} className="rounded bg-background px-2 py-1 text-[10px] uppercase tracking-wide text-muted-foreground">
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No projects on record.</p>
              )}
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Certifications</p>
            <div className="mt-3 space-y-3">
              {(candidate.certifications ?? []).length ? (
                candidate.certifications?.map((cert) => (
                  <div key={cert.id} className="rounded-md border bg-muted/20 p-3">
                    <p className="font-medium">{cert.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{cert.issuer ?? "Issuer not listed"}</p>
                    {cert.issue_date ? <p className="mt-1 text-xs text-muted-foreground">Issued {new Date(cert.issue_date).toLocaleDateString()}</p> : null}
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No certifications listed.</p>
              )}
            </div>
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Assessment / skill signals</p>
          <div className="mt-3 space-y-3">
            {(candidate.assessment_results ?? []).length ? (
              candidate.assessment_results?.map((result, index) => (
                <div key={`${result.taken_at}-${index}`} className="flex items-center justify-between rounded-md border bg-muted/20 p-3">
                  <div>
                    <p className="font-medium">{result.skill_assessments?.title ?? "Assessment"}</p>
                    <p className="text-xs text-muted-foreground">{result.skill_assessments?.skills?.name ?? "Skill"}</p>
                  </div>
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">{result.score}%</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No assessment data available.</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function IndustryDashboard() {
  const { profile, company, institution, companyId } = useIndustryData();
  const opportunities = useMyOpportunities(companyId);
  const applications = useMyApplications(companyId);
  const displayName = company.data?.name ?? institution.data?.name ?? profile.data?.full_name ?? "Industry partner";

  const recentActivity = useMemo(() => {
    return (applications.data ?? []).slice(0, 5);
  }, [applications.data]);

  return (
    <QueryState
      loading={opportunities.isLoading || applications.isLoading}
      error={(opportunities.error ?? applications.error) as Error | null}
    >
      <PageHeader
        title={profile.data?.full_name ? `Welcome back, ${displayName}!` : "Welcome back!"}
        description="Track your internship and placement pipeline, recent applications, and active opportunities."
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total opportunities" value={opportunities.data?.length ?? 0} hint="Posted by your team" icon={BriefcaseBusiness} tone="primary" />
        <StatCard label="Active opportunities" value={opportunities.data?.filter((item) => item.opportunity.is_active).length ?? 0} hint="Currently open" icon={CheckCircle2} tone="accent" />
        <StatCard label="Applications received" value={applications.data?.length ?? 0} hint="Across all posted roles" icon={ClipboardList} tone="muted" />
        <StatCard label="Openings" value={opportunities.data?.reduce((total, item) => total + item.opportunity.openings, 0) ?? 0} hint="Total open seats" icon={Sparkles} tone="accent" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.length ? recentActivity.map((application) => (
              <div key={application.id} className="flex items-center justify-between gap-3 rounded-md border p-3">
                <div>
                  <p className="font-medium">{application.students?.full_name ?? "Candidate"}</p>
                  <p className="text-xs text-muted-foreground">
                    {application.opportunities?.title ?? "Opportunity"} • {new Date(application.applied_at).toLocaleDateString()}
                  </p>
                </div>
                <span className="rounded-full bg-muted px-2.5 py-1 text-xs capitalize">
                  {application.status.replace("_", " ")}
                </span>
              </div>
            )) : (
              <EmptyState title="No recent applications" description="Applications for your opportunities will appear here as soon as candidates start applying." />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Opportunity coverage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {opportunities.data?.length ? opportunities.data.slice(0, 4).map((item) => (
              <div key={item.opportunity.id} className="rounded-md border p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">{item.opportunity.title}</p>
                  <span className="rounded-full bg-primary/10 px-2 py-1 text-[10px] uppercase tracking-wide text-primary">
                    {item.opportunity.is_active ? "Open" : "Closed"}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{item.applicationCount} applications received</p>
                <div className="mt-2 space-y-2">
                  {item.requirements.slice(0, 3).map((requirement) => (
                    <div key={requirement.skillId} className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{requirement.name}</span>
                      <span>{requirement.minProficiency}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )) : (
              <EmptyState title="No opportunities posted yet" description="Create your first internship or placement opportunity to start receiving applications." />
            )}
          </CardContent>
        </Card>
      </div>
    </QueryState>
  );
}

const statusOptions = ["applied", "under_review", "shortlisted", "interview", "selected", "rejected"] as const;
type ApplicationStatus = (typeof statusOptions)[number];

export function IndustryOpportunities() {
  const { companyId, profile } = useIndustryData();
  const queryClient = useQueryClient();
  const allSkills = useQuery({
    queryKey: ["all-skills"],
    queryFn: async () => {
      const { data, error } = await supabase.from("skills").select("*").order("name");
      if (error) throw error;
      return data ?? [];
    },
  });
  const candidates = useQuery({
    queryKey: ["industry-candidates"],
    enabled: !!companyId,
    queryFn: getCandidateProfiles,
  });
  const opportunities = useMyOpportunities(companyId);
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateProfile | null>(null);
  const [expandedOpportunity, setExpandedOpportunity] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    type: "internship" as "internship" | "job",
    work_mode: "On-site",
    duration: "",
    stipend: "",
    eligibility: "",
    min_cgpa: "0",
    experience_years: "0",
    openings: "1",
    deadline: "",
    is_active: true,
    requiredSkills: [] as OpportunitySkillInput[],
  });

  const resetForm = () => {
    setEditingId(null);
    setForm({
      title: "",
      description: "",
      location: "",
      type: "internship",
      work_mode: "On-site",
      duration: "",
      stipend: "",
      eligibility: "",
      min_cgpa: "0",
      experience_years: "0",
      openings: "1",
      deadline: "",
      is_active: true,
      requiredSkills: [],
    });
  };

  const openEdit = (opportunity: IndustryOpportunity) => {
    setEditingId(opportunity.opportunity.id);
    setForm({
      title: opportunity.opportunity.title,
      description: opportunity.opportunity.description ?? "",
      location: opportunity.opportunity.location ?? "",
      type: opportunity.opportunity.type as "internship" | "job",
      work_mode: opportunity.opportunity.work_mode ?? "On-site",
      duration: opportunity.opportunity.duration ?? "",
      stipend: opportunity.opportunity.stipend ?? "",
      eligibility: opportunity.opportunity.eligibility ?? "",
      min_cgpa: String(opportunity.opportunity.min_cgpa ?? 0),
      experience_years: String(opportunity.opportunity.experience_years ?? 0),
      openings: String(opportunity.opportunity.openings ?? 1),
      deadline: opportunity.opportunity.deadline ?? "",
      is_active: opportunity.opportunity.is_active,
      requiredSkills: opportunity.requirements.map((row) => ({
        skill_id: row.skillId,
        name: row.name,
        min_proficiency: row.minProficiency,
        weight: row.weight,
      })),
    });
  };

  const addSkillToForm = (skillId: string, skillName: string) => {
    if (!skillId || form.requiredSkills.some((skill) => skill.skill_id === skillId)) return;
    setForm((current) => ({
      ...current,
      requiredSkills: [
        ...current.requiredSkills,
        {
          skill_id: skillId,
          name: skillName,
          min_proficiency: 60,
          weight: 1,
        },
      ],
    }));
  };

  const updateSkillInForm = (skillId: string, patch: Partial<OpportunitySkillInput>) => {
    setForm((current) => ({
      ...current,
      requiredSkills: current.requiredSkills.map((skill) =>
        skill.skill_id === skillId ? { ...skill, ...patch } : skill,
      ),
    }));
  };

  const saveOpportunity = useMutation({
    mutationFn: async () => {
      if (!companyId) throw new Error("Company record not found.");
      if (!form.title.trim()) throw new Error("Opportunity title is required.");

      const payload = {
        company_id: companyId,
        title: form.title.trim(),
        description: form.description.trim() || null,
        location: form.location.trim() || null,
        type: form.type,
        work_mode: form.work_mode.trim() || "On-site",
        duration: form.duration.trim() || null,
        stipend: form.stipend.trim() || null,
        eligibility: form.eligibility.trim() || null,
        min_cgpa: Number(form.min_cgpa) || 0,
        experience_years: Number(form.experience_years) || 0,
        openings: Number(form.openings) || 1,
        deadline: form.deadline || null,
        is_active: form.is_active,
      };

      let opportunityId = editingId;

      if (editingId) {
        const { error } = await supabase.from("opportunities").update(payload).eq("id", editingId);
        if (error) throw error;
        await supabase.from("opportunity_skills").delete().eq("opportunity_id", editingId);
      } else {
        const { data, error } = await supabase.from("opportunities").insert(payload).select("id").single();
        if (error) throw error;
        opportunityId = data.id;
      }

      if (!opportunityId) throw new Error("Unable to save opportunity details.");
      if (form.requiredSkills.length) {
        const rows = form.requiredSkills.map((skill) => ({
          opportunity_id: opportunityId!,
          skill_id: skill.skill_id,
          min_proficiency: Number(skill.min_proficiency),
          weight: Number(skill.weight),
        }));
        const { error: skillsError } = await supabase.from("opportunity_skills").insert(rows);
        if (skillsError) throw skillsError;
      }
    },
    onSuccess: async () => {
      resetForm();
      await queryClient.invalidateQueries({ queryKey: ["industry-opportunities", companyId] });
      await queryClient.invalidateQueries({ queryKey: ["industry-applications", companyId] });
    },
  });

  const deleteOpportunity = useMutation({
    mutationFn: async (opportunityId: string) => {
      const { error } = await supabase.from("opportunities").delete().eq("id", opportunityId).eq("company_id", companyId!);
      if (error) throw error;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["industry-opportunities", companyId] });
      await queryClient.invalidateQueries({ queryKey: ["industry-applications", companyId] });
    },
  });

  const candidateMatches = useMemo(() => {
    if (!opportunities.data || !candidates.data) return {} as Record<string, Array<{ candidate: CandidateProfile; match: ReturnType<typeof computeMatch> }>>;

    const map: Record<string, Array<{ candidate: CandidateProfile; match: ReturnType<typeof computeMatch> }>> = {};
    for (const item of opportunities.data) {
      const results = (candidates.data ?? [])
        .map((candidate) => ({ candidate, match: computeMatch(item.requirements, buildSkillMap(candidate)) }))
        .filter((result) => result.match.score > 0)
        .sort((a, b) => b.match.score - a.match.score)
        .slice(0, 3);
      map[item.opportunity.id] = results;
    }
    return map;
  }, [candidates.data, opportunities.data]);

  return (
    <QueryState loading={opportunities.isLoading || allSkills.isLoading || candidates.isLoading} error={(opportunities.error ?? allSkills.error ?? candidates.error) as Error | null}>
      <PageHeader
        title="Opportunities"
        description="Post, manage and review opportunities for your company."
        action={
          <Button onClick={() => { resetForm(); setEditingId(""); }} variant="default">
            <Plus className="mr-2 h-4 w-4" />
            New opportunity
          </Button>
        }
      />

      {(editingId !== null || !opportunities.data?.length || !!form.title || form.requiredSkills.length > 0) && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>{editingId ? "Edit opportunity" : "Create opportunity"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block text-sm font-medium">
                Title
                <Input value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} className="mt-2" />
              </label>
              <label className="block text-sm font-medium">
                Type
                <select
                  value={form.type}
                  onChange={(event) => setForm((current) => ({ ...current, type: event.target.value as "internship" | "job" }))}
                  className="mt-2 h-10 w-full rounded-md border bg-background px-3 text-sm"
                >
                  <option value="internship">Internship</option>
                  <option value="job">Placement</option>
                </select>
              </label>
              <label className="block text-sm font-medium md:col-span-2">
                Description
                <Textarea value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} className="mt-2 min-h-28" />
              </label>
              <label className="block text-sm font-medium">
                Location
                <Input value={form.location} onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))} className="mt-2" />
              </label>
              <label className="block text-sm font-medium">
                Work mode
                <Input value={form.work_mode} onChange={(event) => setForm((current) => ({ ...current, work_mode: event.target.value }))} className="mt-2" />
              </label>
              <label className="block text-sm font-medium">
                Duration
                <Input value={form.duration} onChange={(event) => setForm((current) => ({ ...current, duration: event.target.value }))} className="mt-2" />
              </label>
              <label className="block text-sm font-medium">
                Stipend
                <Input value={form.stipend} onChange={(event) => setForm((current) => ({ ...current, stipend: event.target.value }))} className="mt-2" />
              </label>
              <label className="block text-sm font-medium">
                Eligibility
                <Input value={form.eligibility} onChange={(event) => setForm((current) => ({ ...current, eligibility: event.target.value }))} className="mt-2" />
              </label>
              <label className="block text-sm font-medium">
                Minimum CGPA
                <Input type="number" min="0" max="10" step="0.1" value={form.min_cgpa} onChange={(event) => setForm((current) => ({ ...current, min_cgpa: event.target.value }))} className="mt-2" />
              </label>
              <label className="block text-sm font-medium">
                Experience years
                <Input type="number" min="0" value={form.experience_years} onChange={(event) => setForm((current) => ({ ...current, experience_years: event.target.value }))} className="mt-2" />
              </label>
              <label className="block text-sm font-medium">
                Openings
                <Input type="number" min="1" value={form.openings} onChange={(event) => setForm((current) => ({ ...current, openings: event.target.value }))} className="mt-2" />
              </label>
              <label className="block text-sm font-medium">
                Deadline
                <Input type="date" value={form.deadline} onChange={(event) => setForm((current) => ({ ...current, deadline: event.target.value }))} className="mt-2" />
              </label>
              <label className="flex items-center gap-3 text-sm font-medium text-foreground">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(event) => setForm((current) => ({ ...current, is_active: event.target.checked }))}
                />
                Active opportunity
              </label>
            </div>

            <div className="rounded-lg border bg-muted/20 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <label className="flex-1 text-sm font-medium">
                  Add required skill
                  <select
                    className="mt-2 h-10 w-full rounded-md border bg-background px-3 text-sm"
                    value=""
                    onChange={(event) => {
                      const skill = allSkills.data?.find((item) => item.id === event.target.value);
                      if (skill) addSkillToForm(skill.id, skill.name);
                    }}
                  >
                    <option value="">Select a skill</option>
                    {allSkills.data?.map((skill) => (
                      <option key={skill.id} value={skill.id}>{skill.name}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="mt-4 space-y-3">
                {form.requiredSkills.length ? form.requiredSkills.map((skill) => (
                  <div key={skill.skill_id} className="flex flex-col gap-2 rounded-md border bg-background p-3 sm:flex-row sm:items-center">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{skill.name}</p>
                    </div>
                    <label className="text-xs text-muted-foreground">
                      Minimum proficiency
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={skill.min_proficiency}
                        onChange={(event) => updateSkillInForm(skill.skill_id, { min_proficiency: Number(event.target.value) })}
                        className="mt-1 block w-24 rounded-md border bg-background px-2 py-1.5 text-sm"
                      />
                    </label>
                    <label className="text-xs text-muted-foreground">
                      Weight
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={skill.weight}
                        onChange={(event) => updateSkillInForm(skill.skill_id, { weight: Number(event.target.value) })}
                        className="mt-1 block w-20 rounded-md border bg-background px-2 py-1.5 text-sm"
                      />
                    </label>
                    <button
                      type="button"
                      className="rounded-md border px-2 py-1 text-xs text-destructive"
                      onClick={() =>
                        setForm((current) => ({
                          ...current,
                          requiredSkills: current.requiredSkills.filter((item) => item.skill_id !== skill.skill_id),
                        }))
                      }
                    >
                      Remove
                    </button>
                  </div>
                )) : <p className="text-sm text-muted-foreground">No skills selected yet. Add at least one required skill to improve candidate matching.</p>}
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={() => saveOpportunity.mutate()} disabled={saveOpportunity.isPending}>
                {saveOpportunity.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                {editingId ? "Save changes" : "Post opportunity"}
              </Button>
              <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
            </div>
            {saveOpportunity.error ? <p className="text-sm text-destructive">{saveOpportunity.error.message}</p> : null}
          </CardContent>
        </Card>
      )}

      <div className="mt-6 space-y-4">
        {opportunities.data?.length ? opportunities.data.map((item) => (
          <Card key={item.opportunity.id}>
            <CardContent className="p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold">{item.opportunity.title}</h2>
                    <span className="rounded-full bg-muted px-2.5 py-1 text-[10px] uppercase tracking-wide text-muted-foreground">
                      {item.opportunity.type}
                    </span>
                    {!item.opportunity.is_active ? <span className="rounded-full bg-destructive/10 px-2.5 py-1 text-[10px] uppercase tracking-wide text-destructive">Closed</span> : null}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {item.opportunity.location ?? "Remote / hybrid"} • {item.opportunity.work_mode ?? "On-site"}
                  </p>
                  {item.opportunity.description ? <p className="mt-3 text-sm leading-6 text-foreground">{item.opportunity.description}</p> : null}
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                    {item.opportunity.deadline ? <span>Deadline {new Date(item.opportunity.deadline).toLocaleDateString()}</span> : null}
                    {item.opportunity.stipend ? <span>Stipend {item.opportunity.stipend}</span> : null}
                    <span>{item.applicationCount} applications</span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.requirements.map((requirement) => (
                      <span key={`${item.opportunity.id}-${requirement.skillId}`} className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">
                        {requirement.name} ({requirement.minProficiency}%)
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 lg:flex-col lg:items-end">
                  <Button variant="outline" onClick={() => setExpandedOpportunity(expandedOpportunity === item.opportunity.id ? null : item.opportunity.id)}>
                    {expandedOpportunity === item.opportunity.id ? "Hide matches" : "View matches"}
                  </Button>
                  <Button variant="outline" onClick={() => openEdit(item)}>
                    <Pencil className="mr-2 h-4 w-4" /> Edit
                  </Button>
                  <Button variant="destructive" onClick={() => deleteOpportunity.mutate(item.opportunity.id)} disabled={deleteOpportunity.isPending}>
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </Button>
                </div>
              </div>

              {expandedOpportunity === item.opportunity.id && (
                <div className="mt-5 border-t pt-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Strongest matches</h3>
                  <div className="mt-3 space-y-3">
                    {(() => {
                      const opportunityMatches = candidateMatches[item.opportunity.id] ?? [];
                      return opportunityMatches.length ? opportunityMatches.map(({ candidate, match }) => (
                        <div key={candidate.id} className="flex flex-col gap-3 rounded-md border bg-muted/20 p-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="font-medium">{candidate.full_name}</p>
                            <p className="text-xs text-muted-foreground">
                              {candidate.degree ?? "Degree not listed"} • {candidate.department ?? "Department not listed"}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <MatchBadge score={match.score} size="sm" />
                            <Button variant="outline" size="sm" onClick={() => setSelectedCandidate(candidate)}>
                              View candidate
                            </Button>
                          </div>
                        </div>
                      )) : <p className="text-sm text-muted-foreground">No candidate matches available yet.</p>;
                    })()}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )) : (
          <EmptyState title="No opportunities yet" description="Create your first opportunity to match with students and receive internship or placement applications." />
        )}
      </div>

      {selectedCandidate ? <CandidateProfileSheet candidate={selectedCandidate} onClose={() => setSelectedCandidate(null)} /> : null}
    </QueryState>
  );
}

export function IndustryApplications() {
  const { companyId } = useIndustryData();
  const opportunities = useMyOpportunities(companyId);
  const applications = useMyApplications(companyId);
  const queryClient = useQueryClient();
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateProfile | null>(null);

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: ApplicationStatus }) => {
      const { error } = await supabase
        .from("applications")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["industry-applications", companyId] });
    },
  });

  return (
    <QueryState loading={opportunities.isLoading || applications.isLoading} error={(opportunities.error ?? applications.error) as Error | null}>
      <PageHeader title="Applications" description="Review candidates and update application status for your opportunities." />

      <div className="mt-6 space-y-4">
        {applications.data?.length ? applications.data.map((application) => {
          const student = application.students as CandidateProfile | null;
          const opportunity = application.opportunities as { id: string; title: string } | null;
          const skillSummary = (student?.student_skills ?? []).slice(0, 4).map((skill) => `${skill.skills?.name ?? "Skill"} ${skill.proficiency}%`).join(" • ") || "No skill details available";

          return (
            <Card key={application.id}>
              <CardContent className="p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-semibold">{student?.full_name ?? "Candidate"}</p>
                      <Button variant="outline" size="sm" onClick={() => setSelectedCandidate(student ?? null)}>
                        View candidate
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">{opportunity?.title ?? "Opportunity"}</p>
                    <p className="text-sm text-muted-foreground">{skillSummary}</p>
                    <p className="text-xs text-muted-foreground">Applied {new Date(application.applied_at).toLocaleDateString()}</p>
                  </div>

                  <div className="flex flex-col items-start gap-2 md:items-end">
                    <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                      {application.match_score}% match
                    </span>
                    <label className="text-xs text-muted-foreground">
                      Status
                      <select
                        value={application.status}
                        onChange={(event) => updateStatus.mutate({ id: application.id, status: event.target.value as ApplicationStatus })}
                        className="mt-1 block min-w-40 rounded-md border bg-background px-2 py-2 text-sm"
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>{status.replace("_", " ")}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        }) : (
          <EmptyState title="No applications yet" description="Applications for your current opportunities will appear here once students submit them." />
        )}
      </div>

      {selectedCandidate ? <CandidateProfileSheet candidate={selectedCandidate} onClose={() => setSelectedCandidate(null)} /> : null}
    </QueryState>
  );
}

export function IndustryProfile() {
  const { profile, company, institution } = useIndustryData();

  const companyName = company.data?.name ?? institution.data?.name ?? profile.data?.full_name ?? "Industry partner";
  const companyDetails = company.data ?? null;

  return (
    <QueryState loading={company.isLoading || institution.isLoading || profile.isLoading} error={(company.error ?? institution.error ?? profile.error) as Error | null}>
      <PageHeader title="Profile" description="Your profile details are used for opportunity publishing and employer visibility." />
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Account details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-foreground">
            <div className="flex items-center gap-3 rounded-md border bg-muted/20 p-3">
              <Building2 className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">{companyName}</p>
                <p className="text-muted-foreground">{profile.data?.role === "industry" ? "Industry account" : "Institution account"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{profile.data?.email ?? "No email on file"}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{companyDetails?.location ?? "Location not specified"}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Organization overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-foreground">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Sector</p>
              <p className="mt-1">{companyDetails?.sector ?? "Not provided"}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Size</p>
              <p className="mt-1">{companyDetails?.size ?? "Not provided"}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Website</p>
              <p className="mt-1">{companyDetails?.website ?? "Not provided"}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Description</p>
              <p className="mt-1 leading-6 text-muted-foreground">{companyDetails?.description ?? "No description yet."}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </QueryState>
  );
}
