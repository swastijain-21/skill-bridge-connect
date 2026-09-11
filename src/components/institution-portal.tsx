import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Search,
  Save,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useInstitutionRecord, useProfile } from "@/hooks/use-session";
import { cn } from "@/lib/utils";
import { EmptyState, ErrorState, LoadingState } from "@/components/states";
import { PageHeader, SkillBar, StatCard } from "@/components/ui-bits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Skill = { id: string; name: string; category: string | null };
type StudentSkill = { skill_id: string; proficiency: number; skills: Skill | null };
type Student = {
  id: string;
  full_name: string;
  degree: string | null;
  department: string | null;
  graduation_year: number | null;
  cgpa: number | null;
  student_skills?: StudentSkill[];
  projects?: { id: string; title: string; description: string | null; tech_stack: string[] }[];
  certifications?: { id: string; title: string; issuer: string | null; issue_date: string | null }[];
  assessment_results?: {
    id: string;
    score: number;
    taken_at: string;
    skill_assessments: { title: string; skills: { name: string } | null } | null;
  }[];
};

const navItems = [
  { to: "/institution", label: "Dashboard", icon: LayoutDashboard },
  { to: "/institution/students", label: "Students", icon: Users },
  { to: "/institution/opportunities", label: "Opportunities", icon: BriefcaseBusiness },
  { to: "/institution/applications", label: "Applications", icon: ClipboardList },
  { to: "/institution/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/institution/profile", label: "Profile", icon: UserRound },
] as const;

function QueryState({ loading, error, children }: { loading: boolean; error: Error | null; children: ReactNode }) {
  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error.message} />;
  return <>{children}</>;
}

function useInstitutionData() {
  const profile = useProfile();
  const institution = useInstitutionRecord();
  return { profile, institution, institutionId: institution.data?.id };
}

async function fetchStudents(institutionId: string) {
  const { data, error } = await supabase
    .from("students")
    .select(
      "id,full_name,degree,department,graduation_year,cgpa,student_skills(skill_id,proficiency,skills(id,name,category)),projects(id,title,description,tech_stack),certifications(id,title,issuer,issue_date),assessment_results(id,score,taken_at,skill_assessments(title,skills(name)))",
    )
    .eq("institution_id", institutionId)
    .order("full_name");
  if (error) throw error;
  return (data ?? []) as Student[];
}

function useInstitutionStudents() {
  const { institutionId } = useInstitutionData();
  return useQuery({
    queryKey: ["institution-students", institutionId],
    enabled: !!institutionId,
    queryFn: () => fetchStudents(institutionId!),
  });
}

export function InstitutionShell({ children }: { children: ReactNode }) {
  const { profile, institution } = useInstitutionData();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (profile.isLoading || institution.isLoading) return <LoadingState label="Loading institution portal…" />;
  if (profile.error || institution.error) {
    const error = profile.error ?? institution.error;
    return <ErrorState message={error?.message ?? "Unable to load this portal."} />;
  }
  if (!profile.data || profile.data.role !== "institution" || !institution.data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <h1 className="text-xl font-semibold">Institution portal unavailable</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in with an institution account to access this portal.
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

  return (
    <div className="min-h-screen bg-muted/30 text-foreground">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 border-r bg-card p-4 transition-transform lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between px-2 py-3">
          <Link to="/institution" className="text-lg font-bold tracking-tight text-primary">
            SkillBridge
          </Link>
          <button className="lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Close menu">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="mt-5 space-y-1" aria-label="Institution navigation">
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
          <button className="rounded-md border p-2 lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <ArrowRight className="h-4 w-4" />
          </button>
          <div className="ml-auto flex items-center gap-3 text-sm">
            <span className="hidden text-muted-foreground sm:inline">{institution.data.name}</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
              {institution.data.name.slice(0, 1).toUpperCase()}
            </span>
          </div>
        </header>
        <main className="mx-auto max-w-7xl p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}

export function InstitutionDashboard() {
  const students = useInstitutionStudents();
  const { institutionId } = useInstitutionData();
  const applications = useQuery({
    queryKey: ["institution-dashboard-applications", institutionId],
    enabled: !!institutionId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("applications")
        .select("id,status,applied_at,student_id,students!inner(institution_id)")
        .eq("students.institution_id", institutionId!);
      if (error) throw error;
      return data ?? [];
    },
  });
  const placements = useQuery({
    queryKey: ["institution-dashboard-placements", institutionId],
    enabled: !!institutionId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("placements")
        .select("id,placed_on,student_id,students!inner(institution_id)")
        .eq("students.institution_id", institutionId!);
      if (error) throw error;
      return data ?? [];
    },
  });
  const totals = useMemo(() => {
    const list = students.data ?? [];
    const gaps = list.filter((student) => (student.student_skills ?? []).some((skill) => skill.proficiency < 60));
    return {
      mapped: list.filter((student) => (student.student_skills ?? []).length > 0).length,
      assessed: list.filter((student) => (student.assessment_results ?? []).length > 0).length,
      gaps: gaps.length,
    };
  }, [students.data]);
  const activity = (applications.data ?? []).slice(0, 5);

  return (
    <QueryState
      loading={students.isLoading || applications.isLoading || placements.isLoading}
      error={(students.error ?? applications.error ?? placements.error) as Error | null}
    >
      <PageHeader title="Institution dashboard" description="A live view of learner readiness and outcomes." />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Total students" value={students.data?.length ?? 0} icon={Users} />
        <StatCard label="Students with skills" value={totals.mapped} icon={GraduationCap} tone="accent" />
        <StatCard label="Assessment results" value={totals.assessed} icon={CheckCircle2} />
        <StatCard label="Identified skill gaps" value={totals.gaps} icon={BarChart3} tone="muted" />
        <StatCard label="Total applications" value={applications.data?.length ?? 0} icon={ClipboardList} />
        <StatCard label="Total placements" value={placements.data?.length ?? 0} icon={BriefcaseBusiness} tone="accent" />
      </div>
      <Card className="mt-6">
        <CardHeader><CardTitle>Recent activity</CardTitle></CardHeader>
        <CardContent>
          {activity.length ? (
            <div className="space-y-3">
              {activity.map((item) => (
                <div key={item.id} className="flex items-center justify-between border-b pb-3 text-sm last:border-0 last:pb-0">
                  <span>Student application submitted</span>
                  <span className="text-muted-foreground">{new Date(item.applied_at).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          ) : <EmptyState title="No recent activity" description="Applications from your students will appear here." />}
        </CardContent>
      </Card>
    </QueryState>
  );
}

function StudentDetail({ student }: { student: Student }) {
  const gaps = (student.student_skills ?? []).filter((skill) => skill.proficiency < 60);
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>{student.full_name}</CardTitle>
        <p className="text-sm text-muted-foreground">
          {[student.degree, student.department, student.graduation_year ? `Class of ${student.graduation_year}` : null].filter(Boolean).join(" · ") || "Academic details not provided"}
        </p>
      </CardHeader>
      <CardContent className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3">
          <h3 className="font-medium">Skills</h3>
          {(student.student_skills ?? []).map((skill) => (
            <SkillBar
              key={skill.skill_id}
              name={skill.skills?.name ?? "Skill"}
              value={skill.proficiency}
              {...(skill.skills?.category ? { category: skill.skills.category } : {})}
            />
          ))}
          {!student.student_skills?.length && <p className="text-sm text-muted-foreground">No skills mapped.</p>}
          <h3 className="pt-2 font-medium">Skill gaps</h3>
          <p className="text-sm text-muted-foreground">{gaps.length ? gaps.map((skill) => skill.skills?.name).filter(Boolean).join(", ") : "No identified gaps from current proficiency data."}</p>
        </div>
        <div className="space-y-5">
          <div><h3 className="font-medium">Assessment results</h3>{student.assessment_results?.length ? student.assessment_results.map((result) => <p key={result.id} className="mt-2 text-sm">{result.skill_assessments?.title ?? "Assessment"}: <strong>{result.score}%</strong></p>) : <p className="mt-2 text-sm text-muted-foreground">No assessment results.</p>}</div>
          <div><h3 className="font-medium">Projects</h3>{student.projects?.length ? student.projects.map((project) => <p key={project.id} className="mt-2 text-sm">{project.title}</p>) : <p className="mt-2 text-sm text-muted-foreground">No projects listed.</p>}</div>
          <div><h3 className="font-medium">Certifications</h3>{student.certifications?.length ? student.certifications.map((certification) => <p key={certification.id} className="mt-2 text-sm">{certification.title}{certification.issuer ? ` · ${certification.issuer}` : ""}</p>) : <p className="mt-2 text-sm text-muted-foreground">No certifications listed.</p>}</div>
        </div>
      </CardContent>
    </Card>
  );
}

export function InstitutionStudents() {
  const students = useInstitutionStudents();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Student | null>(null);
  const filtered = (students.data ?? []).filter((student) => student.full_name.toLowerCase().includes(search.toLowerCase()));
  return (
    <QueryState loading={students.isLoading} error={students.error as Error | null}>
      <PageHeader title="Students" description="Review the read-only learner profiles associated with your institution." />
      <div className="relative mt-6 max-w-md"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input className="pl-9" placeholder="Search by name" value={search} onChange={(event) => setSearch(event.target.value)} /></div>
      <div className="mt-6 grid gap-3">
        {filtered.map((student) => <button key={student.id} onClick={() => setSelected(student)} className="rounded-lg border bg-card p-4 text-left transition hover:border-primary"><div className="flex items-center justify-between"><div><p className="font-medium">{student.full_name}</p><p className="mt-1 text-sm text-muted-foreground">{[student.degree, student.department].filter(Boolean).join(" · ") || "Academic details not provided"}</p></div><span className="text-sm text-muted-foreground">{student.cgpa ? `CGPA ${student.cgpa}` : ""}</span></div></button>)}
      </div>
      {!filtered.length && <div className="mt-6"><EmptyState title={search ? "No students found" : "No students associated"} description={search ? "Try a different name." : "Students linked to this institution will appear here."} /></div>}
      {selected && <StudentDetail student={selected} />}
    </QueryState>
  );
}

type Opportunity = { id: string; title: string; type: string; location: string | null; eligibility: string | null; deadline: string | null; companies: { name: string } | null; opportunity_skills: { min_proficiency: number; skills: { name: string } | null }[] };

export function InstitutionOpportunities() {
  const opportunities = useQuery({
    queryKey: ["institution-opportunities"],
    queryFn: async () => {
      const { data, error } = await supabase.from("opportunities").select("id,title,type,location,eligibility,deadline,companies(name),opportunity_skills(min_proficiency,skills(name))").eq("is_active", true).order("deadline", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Opportunity[];
    },
  });
  return <QueryState loading={opportunities.isLoading} error={opportunities.error as Error | null}><PageHeader title="Opportunities" description="Live opportunities published by industry partners." /><div className="mt-6 space-y-4">{opportunities.data?.map((opportunity) => <Card key={opportunity.id}><CardContent className="p-5"><div className="flex flex-col justify-between gap-3 sm:flex-row"><div><h2 className="font-semibold">{opportunity.title}</h2><p className="mt-1 text-sm text-muted-foreground">{opportunity.companies?.name ?? "Company"} · {opportunity.type} · {opportunity.location ?? "Location not specified"}</p><p className="mt-3 text-sm">{opportunity.opportunity_skills.map((item) => `${item.skills?.name ?? "Skill"} (${item.min_proficiency}%)`).join(" · ") || "No required skills listed"}</p><p className="mt-2 text-xs text-muted-foreground">{opportunity.eligibility ?? "Eligibility not specified"}{opportunity.deadline ? ` · Deadline ${new Date(opportunity.deadline).toLocaleDateString()}` : ""}</p></div></div></CardContent></Card>)}</div>{!opportunities.data?.length && <div className="mt-6"><EmptyState title="No active opportunities" description="Industry opportunities will appear here." /></div>}</QueryState>;
}

type Application = { id: string; status: string; match_score: number; applied_at: string; students: { full_name: string } | null; opportunities: { title: string; companies: { name: string } | null } | null };

export function InstitutionApplications() {
  const { institutionId } = useInstitutionData();
  const applications = useQuery({
    queryKey: ["institution-applications", institutionId],
    enabled: !!institutionId,
    queryFn: async () => {
      const { data, error } = await supabase.from("applications").select("id,status,match_score,applied_at,students!inner(full_name,institution_id),opportunities(title,companies(name))").eq("students.institution_id", institutionId!).order("applied_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Application[];
    },
  });
  return <QueryState loading={applications.isLoading} error={applications.error as Error | null}><PageHeader title="Applications" description="Applications submitted by students at your institution. Statuses are read-only." /><Card className="mt-6"><CardContent className="p-0">{applications.data?.map((application) => <div key={application.id} className="flex flex-col gap-2 border-b p-5 last:border-0 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-medium">{application.students?.full_name ?? "Student"}</p><p className="text-sm text-muted-foreground">{application.opportunities?.title ?? "Opportunity"} · {application.opportunities?.companies?.name ?? "Company"}</p></div><div className="flex items-center gap-3 text-sm"><span className="rounded-full bg-muted px-3 py-1 capitalize">{application.status.replace("_", " ")}</span><span className="text-muted-foreground">{application.match_score}% match</span><span className="text-muted-foreground">{new Date(application.applied_at).toLocaleDateString()}</span></div></div>)}{!applications.data?.length && <div className="p-6"><EmptyState title="No applications yet" description="Student applications will appear here." /></div>}</CardContent></Card></QueryState>;
}

export function InstitutionAnalytics() {
  const students = useInstitutionStudents();
  const { institutionId } = useInstitutionData();
  const applications = useQuery({ queryKey: ["institution-analytics-applications", institutionId], enabled: !!institutionId, queryFn: async () => { const { data, error } = await supabase.from("applications").select("status,student_id,students!inner(institution_id)").eq("students.institution_id", institutionId!); if (error) throw error; return data ?? []; } });
  const skillCounts = useMemo(() => { const counts = new Map<string, { name: string; value: number }>(); (students.data ?? []).forEach((student) => (student.student_skills ?? []).forEach((item) => { const name = item.skills?.name ?? "Skill"; const current = counts.get(name) ?? { name, value: 0 }; current.value += 1; counts.set(name, current); })); return [...counts.values()].sort((a, b) => b.value - a.value).slice(0, 6); }, [students.data]);
  const gapCounts = useMemo(() => { const counts = new Map<string, { name: string; value: number }>(); (students.data ?? []).forEach((student) => (student.student_skills ?? []).filter((item) => item.proficiency < 60).forEach((item) => { const name = item.skills?.name ?? "Skill"; const current = counts.get(name) ?? { name, value: 0 }; current.value += 1; counts.set(name, current); })); return [...counts.values()].sort((a, b) => b.value - a.value).slice(0, 6); }, [students.data]);
  const statusCounts = useMemo(() => { const counts = new Map<string, number>(); (applications.data ?? []).forEach((item) => counts.set(item.status, (counts.get(item.status) ?? 0) + 1)); return [...counts.entries()]; }, [applications.data]);
  const studentsWithAssessments = (students.data ?? []).filter((student) => (student.assessment_results ?? []).length > 0).length;
  const studentsWithGaps = (students.data ?? []).filter((student) => (student.student_skills ?? []).some((item) => item.proficiency < 60)).length;
  return <QueryState loading={students.isLoading || applications.isLoading} error={(students.error ?? applications.error) as Error | null}><PageHeader title="Analytics" description="Simple insights calculated from your institution's live data." /><div className="mt-6 grid gap-4 sm:grid-cols-2"><StatCard label="Students assessed" value={studentsWithAssessments} icon={CheckCircle2} /><StatCard label="Students with skill gaps" value={studentsWithGaps} icon={BarChart3} tone="muted" /></div><div className="mt-6 grid gap-6 lg:grid-cols-3"><Card><CardHeader><CardTitle>Most common skills</CardTitle></CardHeader><CardContent className="space-y-4">{skillCounts.map((skill) => <SkillBar key={skill.name} name={skill.name} value={skill.value} required={students.data?.length ?? 0} />)}{!skillCounts.length && <EmptyState title="No skill data yet" />}</CardContent></Card><Card><CardHeader><CardTitle>Largest skill gaps</CardTitle></CardHeader><CardContent className="space-y-4">{gapCounts.map((skill) => <SkillBar key={skill.name} name={skill.name} value={skill.value} required={students.data?.length ?? 0} status="gap" />)}{!gapCounts.length && <EmptyState title="No gap data yet" />}</CardContent></Card><Card><CardHeader><CardTitle>Applications by status</CardTitle></CardHeader><CardContent className="space-y-3">{statusCounts.map(([status, count]) => <div key={status} className="flex items-center justify-between rounded-md bg-muted/50 p-3 text-sm"><span className="capitalize">{status.replace("_", " ")}</span><strong>{count}</strong></div>)}{!statusCounts.length && <EmptyState title="No application data yet" />}</CardContent></Card></div></QueryState>;
}

export function InstitutionProfile() {
  const { institution } = useInstitutionData();
  const client = useQueryClient();
  const [form, setForm] = useState({ name: "", code: "", city: "", state: "", type: "", established: "" });
  const [initialized, setInitialized] = useState(false);
  if (institution.data && !initialized) { setForm({ name: institution.data.name, code: institution.data.code ?? "", city: institution.data.city ?? "", state: institution.data.state ?? "", type: institution.data.type ?? "", established: institution.data.established?.toString() ?? "" }); setInitialized(true); }
  const update = useMutation({ mutationFn: async () => { if (!institution.data?.id || !form.name.trim()) throw new Error("Institution name is required."); const { error } = await supabase.from("institutions").update({ name: form.name.trim(), code: form.code.trim() || null, city: form.city.trim() || null, state: form.state.trim() || null, type: form.type.trim() || null, established: form.established ? Number(form.established) : null }).eq("id", institution.data.id); if (error) throw error; }, onSuccess: () => { void client.invalidateQueries({ queryKey: ["institution-record"] }); } });
  return <QueryState loading={institution.isLoading} error={institution.error as Error | null}><PageHeader title="Institution profile" description="Keep your institution's public profile details up to date." /><Card className="mt-6 max-w-2xl"><CardContent className="grid gap-4 p-6 sm:grid-cols-2">{(["name", "code", "city", "state", "type", "established"] as const).map((field) => <label key={field} className={field === "name" ? "sm:col-span-2" : ""}><span className="text-sm font-medium capitalize">{field}</span><Input className="mt-1" value={form[field]} onChange={(event) => setForm({ ...form, [field]: event.target.value })} /></label>)}<div className="sm:col-span-2"><Button onClick={() => update.mutate()} disabled={update.isPending}><Save className="mr-2 h-4 w-4" />{update.isPending ? "Saving…" : "Save profile"}</Button>{update.error && <p className="mt-2 text-sm text-destructive">{update.error.message}</p>}{update.isSuccess && <p className="mt-2 text-sm text-[var(--success)]">Profile saved.</p>}</div></CardContent></Card></QueryState>;
}
