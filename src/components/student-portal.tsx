import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BookOpen,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Loader2,
  LogOut,
  Pencil,
  Plus,
  Save,
  Trash2,
  Upload,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useProfile, useStudentRecord } from "@/hooks/use-session";
import { computeMatch, careerReadiness, type SkillRequirement } from "@/lib/skill-match";
import { extractKnownSkills, extractResumeText } from "@/lib/resume-analysis";
import { cn } from "@/lib/utils";
import { EmptyState, ErrorState, LoadingState } from "@/components/states";
import { MatchBadge, PageHeader, SkillBar, StatCard } from "@/components/ui-bits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const navItems = [
  { to: "/student", label: "Dashboard", icon: LayoutDashboard },
  { to: "/student/profile", label: "Profile", icon: UserRound },
  { to: "/student/resume", label: "Resume", icon: FileText },
  { to: "/student/skills", label: "Skills", icon: GraduationCap },
  { to: "/student/projects", label: "Projects", icon: BriefcaseBusiness },
  { to: "/student/certifications", label: "Certifications", icon: CheckCircle2 },
  { to: "/student/assessments", label: "Assessments", icon: BookOpen },
  { to: "/student/skill-gaps", label: "Skill gaps", icon: CircleAlert },
  { to: "/student/learning", label: "Learning", icon: BookOpen },
  { to: "/student/opportunities", label: "Opportunities", icon: BriefcaseBusiness },
  { to: "/student/applications", label: "Applications", icon: CheckCircle2 },
] as const;

const degreeOptions = ["B.Tech", "B.E.", "B.Sc.", "BCA", "M.Tech", "M.E.", "M.Sc.", "MCA", "MBA", "PhD", "Other"];
const departmentOptions = ["Computer Science", "Information Technology", "Electronics & Communication", "Electrical", "Mechanical", "Civil", "Chemical", "Mathematics", "Physics", "Other"];

export function StudentShell({ children }: { children: ReactNode }) {
  const profile = useProfile();
  const student = useStudentRecord();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (profile.isLoading || student.isLoading) return <LoadingState label="Loading your portal…" />;
  if (profile.error || student.error) {
    const error = profile.error ?? student.error;
    return <ErrorState {...(error ? { message: error.message } : {})} />;
  }
  if (!profile.data || !student.data || profile.data.role !== "student") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <h1 className="text-xl font-semibold">Student profile unavailable</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in with a student account to access this portal.
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
          <Link to="/student" className="text-lg font-bold tracking-tight text-primary">
            SkillBridge
          </Link>
          <button className="lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Close menu">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="mt-5 space-y-1" aria-label="Student navigation">
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
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-card/95 px-4 backdrop-blur sm:px-8">
          <button
            className="rounded-md border p-2 lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <div className="ml-auto flex items-center gap-3 text-sm">
            <span className="hidden text-muted-foreground sm:inline">{student.data.full_name}</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
              {student.data.full_name.slice(0, 1).toUpperCase()}
            </span>
          </div>
        </header>
        <main className="mx-auto max-w-7xl p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}

function usePortalData() {
  const profile = useProfile();
  const student = useStudentRecord();
  const studentId = student.data?.id;
  const skills = useQuery({
    queryKey: ["student-skills", studentId],
    enabled: !!studentId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("student_skills")
        .select("*, skills(id, name, category, demand_score, description)")
        .eq("student_id", studentId!);
      if (error) throw error;
      return data;
    },
  });
  return { profile, student, skills, studentId };
}

function QueryState({ loading, error, children }: { loading: boolean; error: Error | null; children: ReactNode }) {
  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error.message} />;
  return <>{children}</>;
}

export function StudentDashboard() {
  const { profile, student, skills, studentId } = usePortalData();
  const assessments = useQuery({
    queryKey: ["student-assessment-results", studentId],
    enabled: !!studentId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("assessment_results")
        .select("*, skill_assessments(title, skill_id)")
        .eq("student_id", studentId!)
        .order("taken_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
  const opportunities = useOpportunities(studentId);
  const applications = useApplications(studentId);
  const resources = useLearningResources(skills.data?.map((s) => s.skill_id) ?? []);
  const completion = student.data ? profileCompletion(student.data) : 0;
  const readiness = careerReadiness(
    (skills.data ?? []).map((s) => ({ proficiency: s.proficiency, demand: s.skills?.demand_score ?? 0 })),
    completion,
  );
  const gaps = opportunities.data?.flatMap((o) => o.match.missing) ?? [];

  return (
    <QueryState
      loading={
        student.isLoading ||
        skills.isLoading ||
        assessments.isLoading ||
        opportunities.isLoading ||
        applications.isLoading ||
        resources.isLoading
      }
      error={
        (student.error ??
          skills.error ??
          assessments.error ??
          opportunities.error ??
          applications.error ??
          resources.error) as Error | null
      }
    >
      <PageHeader
        title={student.data?.full_name ? `Welcome back, ${student.data.full_name}!` : "Welcome back!"}
        description="Your progress, readiness, and next opportunities at a glance."
      />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Profile completion" value={`${completion}%`} hint="Keep your profile current" icon={UserRound} />
        <StatCard label="Skills" value={skills.data?.length ?? 0} hint="Skills in your portfolio" icon={GraduationCap} tone="accent" />
        <StatCard label="Skill readiness" value={`${readiness}%`} hint="Based on demand and proficiency" icon={CheckCircle2} />
        <StatCard label="Skill gaps" value={new Set(gaps).size} hint="Across active opportunities" icon={CircleAlert} tone="muted" />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Recommended opportunities</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {opportunities.data?.slice(0, 3).map((item) => <OpportunityRow key={item.opportunity.id} item={item} />)}
            {!opportunities.data?.length && <EmptyState title="No opportunities yet" description="Active opportunities will appear here when they are published." />}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Recommended learning</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {resources.data?.slice(0, 4).map((resource) => <ResourceRow key={resource.id} resource={resource} />)}
            {!resources.data?.length && <EmptyState title="No recommendations yet" description="Add skills or complete an assessment to get recommendations." />}
          </CardContent>
        </Card>
      </div>
      <Card className="mt-6">
        <CardHeader><CardTitle>Recent applications</CardTitle></CardHeader>
        <CardContent>
          {applications.data?.slice(0, 5).map((application) => (
            <div key={application.id} className="flex flex-wrap items-center justify-between gap-3 border-b py-3 last:border-0">
              <div><p className="font-medium">{application.opportunities?.title ?? "Opportunity"}</p><p className="text-xs text-muted-foreground">{new Date(application.applied_at).toLocaleDateString()}</p></div>
              <span className="rounded-full bg-muted px-2.5 py-1 text-xs capitalize">{application.status.replace("_", " ")}</span>
            </div>
          ))}
          {!applications.data?.length && <EmptyState title="No applications yet" description="Apply to a suitable opportunity to start tracking your journey." />}
        </CardContent>
      </Card>
    </QueryState>
  );
}

function profileCompletion(student: NonNullable<ReturnType<typeof useStudentRecord>["data"]>) {
  const fields = [student.full_name, student.email, student.phone, student.department, student.degree, student.graduation_year, student.cgpa, student.location, student.bio];
  return Math.round((fields.filter(Boolean).length / fields.length) * 100);
}

export function StudentResume() {
  const { studentId } = usePortalData();
  const client = useQueryClient();
  const [file, setFile] = useState<File>();
  const resume = useQuery({
    queryKey: ["student-resume", studentId],
    enabled: !!studentId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("student_resumes")
        .select("*")
        .eq("student_id", studentId!)
        .maybeSingle();
      if (error) throw error;
      if (!data) return null;
      const { data: resumeSkills, error: skillsError } = await supabase
        .from("resume_skills")
        .select("*, skills(name)")
        .eq("resume_id", data.id);
      if (skillsError) throw skillsError;
      return { ...data, resume_skills: resumeSkills ?? [] };
    },
  });
  const upload = useMutation({
    mutationFn: async () => {
      if (!studentId || !file) throw new Error("Choose a PDF, DOCX, or plain text resume.");
      if (file.size > 10 * 1024 * 1024) throw new Error("Resume must be smaller than 10 MB.");
      const allowed = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"];
      if (!allowed.includes(file.type)) throw new Error("Upload a PDF, DOCX, or plain text resume.");
      if (resume.data?.file_path) {
        const { error } = await supabase.storage.from("student-resumes").remove([resume.data.file_path]);
        if (error) throw error;
      }
      const path = `${studentId}/${crypto.randomUUID()}-${file.name}`;
      const { error: uploadError } = await supabase.storage.from("student-resumes").upload(path, file, { upsert: false });
      if (uploadError) throw uploadError;
      const { error } = await supabase.from("student_resumes").upsert({
        student_id: studentId,
        file_path: path,
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        extracted_text: null,
        parse_status: "pending",
      }, { onConflict: "student_id" });
      if (error) {
        await supabase.storage.from("student-resumes").remove([path]);
        throw error;
      }
    },
    onSuccess: () => {
      setFile(undefined);
      void client.invalidateQueries({ queryKey: ["student-resume", studentId] });
    },
  });
  const analyze = useMutation({
    mutationFn: async () => {
      if (!resume.data) throw new Error("Upload a resume first.");
      const { error: statusError } = await supabase.from("student_resumes").update({ parse_status: "processing" }).eq("id", resume.data.id);
      if (statusError) throw statusError;
      try {
        const { data: blob, error: downloadError } = await supabase.storage.from("student-resumes").download(resume.data.file_path);
        if (downloadError) throw downloadError;
        const text = await extractResumeText(new File([blob], resume.data.file_name, { type: resume.data.file_type }));
        if (!text.trim()) throw new Error("The resume did not contain readable text.");
        const { error: textError } = await supabase.from("student_resumes").update({
          extracted_text: text,
          parse_status: "parsed",
        }).eq("id", resume.data.id);
        if (textError) throw textError;
        const { data: catalog, error: catalogError } = await supabase.from("skills").select("id,name");
        if (catalogError) throw catalogError;
        const matches = extractKnownSkills(text, catalog);
        await supabase.from("resume_skills").delete().eq("resume_id", resume.data.id);
        if (matches.length) {
          const { error: skillsError } = await supabase.from("resume_skills").insert(
            matches.map((match) => ({ resume_id: resume.data!.id, skill_id: match.skillId, student_id: studentId!, evidence: match.evidence, confidence: Math.round(match.confidence), proficiency: Math.round(match.confidence * 100) })),
          );
          if (skillsError) throw skillsError;
        }
        const { error } = await supabase.from("student_resumes").update({
          parse_status: "completed",
        }).eq("id", resume.data.id);
        if (error) throw error;
        return matches.length;
      } catch (error) {
        await supabase.from("student_resumes").update({
          parse_status: "failed",
        }).eq("id", resume.data.id);
        throw error;
      }
    },
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: ["student-resume", studentId] });
      void client.invalidateQueries({ queryKey: ["opportunities", studentId] });
    },
  });
  const remove = useMutation({
    mutationFn: async () => {
      if (!resume.data) return;
      const { error: storageError } = await supabase.storage.from("student-resumes").remove([resume.data.file_path]);
      if (storageError) throw storageError;
      const { error } = await supabase.from("student_resumes").delete().eq("id", resume.data.id);
      if (error) throw error;
    },
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: ["student-resume", studentId] });
      void client.invalidateQueries({ queryKey: ["opportunities", studentId] });
    },
  });
  return <QueryState loading={resume.isLoading} error={resume.error as Error | null}>
    <PageHeader title="Resume" description="Add evidence from your resume to improve skill gaps and opportunity matches." />
    <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
      <Card><CardHeader><CardTitle>Resume evidence</CardTitle></CardHeader><CardContent className="space-y-4">
        {!resume.data && <p className="text-sm text-muted-foreground">No resume uploaded yet. Use a PDF, DOCX, or plain text file.</p>}
        {resume.data && <div className="flex items-center gap-3 rounded-md border p-3"><FileText className="h-5 w-5 text-primary" /><div className="min-w-0 flex-1"><p className="truncate font-medium">{resume.data.file_name}</p><p className="text-xs text-muted-foreground">{resume.data.parse_status} · {Math.round(resume.data.file_size / 1024)} KB</p></div></div>}
        {resume.data?.parse_status === "completed" && <div className="space-y-3"><p className="text-sm font-medium">Normalized skills found</p>{resume.data.resume_skills?.length ? resume.data.resume_skills.map((item) => <div key={item.id} className="rounded-md bg-muted/50 p-3"><div className="flex justify-between gap-3"><span className="font-medium">{item.skills?.name ?? "Skill"}</span><span className="text-xs text-muted-foreground">{Math.round(item.confidence * 100)}% confidence</span></div><p className="mt-1 text-xs text-muted-foreground">{item.evidence}</p></div>) : <p className="text-sm text-muted-foreground">No catalog skills were confidently identified.</p>}</div>}
      </CardContent></Card>
      <Card><CardHeader><CardTitle>{resume.data ? "Replace or re-analyze" : "Upload resume"}</CardTitle></CardHeader><CardContent className="space-y-4">
        <Input type="file" accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain" onChange={(event) => setFile(event.target.files?.[0])} />
        {file && <p className="text-xs text-muted-foreground">{file.name}</p>}
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => upload.mutate()} disabled={!file || upload.isPending}>{upload.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}Upload</Button>
          {resume.data && <Button variant="outline" onClick={() => analyze.mutate()} disabled={analyze.isPending || resume.data.parse_status === "processing"}>{analyze.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}Analyze resume</Button>}
          {resume.data && <Button variant="ghost" onClick={() => remove.mutate()} disabled={remove.isPending}><Trash2 className="mr-2 h-4 w-4" />Delete</Button>}
        </div>
        {(upload.error || analyze.error || remove.error) && <p className="text-sm text-destructive">{(upload.error ?? analyze.error ?? remove.error)?.message}</p>}
        {analyze.isSuccess && <p className="text-sm text-[var(--success)]">Resume analyzed. Matches now include resume evidence.</p>}
      </CardContent></Card>
    </div>
  </QueryState>;
}

export function StudentProfile() {
  const { student, profile, studentId } = usePortalData();
  const client = useQueryClient();
  type ProfileForm = { full_name: string; email: string; phone: string; department: string; degree: string; graduation_year: string; cgpa: string; location: string; bio: string };
  const [form, setForm] = useState<ProfileForm>({ full_name: "", email: "", phone: "", department: "", degree: "", graduation_year: "", cgpa: "", location: "", bio: "" });
  const [validationError, setValidationError] = useState("");
  useEffect(() => {
    if (student.data) setForm({ full_name: student.data.full_name, email: student.data.email ?? "", phone: student.data.phone ?? "", department: student.data.department ?? "", degree: student.data.degree ?? "", graduation_year: String(student.data.graduation_year ?? ""), cgpa: String(student.data.cgpa ?? ""), location: student.data.location ?? "", bio: student.data.bio ?? "" });
  }, [student.data]);
  const update = useMutation({
    mutationFn: async () => {
      if (!studentId) throw new Error("Student record not found.");
      const { error } = await supabase.from("students").update({
        full_name: form.full_name.trim(), email: form.email.trim() || null, phone: form.phone.trim() || null,
        department: form.department.trim() || null, degree: form.degree.trim() || null,
        graduation_year: form.graduation_year ? Number(form.graduation_year) : null,
        cgpa: form.cgpa ? Number(form.cgpa) : null, location: form.location.trim() || null, bio: form.bio.trim() || null,
      }).eq("id", studentId);
      if (error) throw error;
    },
    onSuccess: () => { void client.invalidateQueries({ queryKey: ["student-record", profile.data?.id] }); },
  });
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const year = form.graduation_year ? Number(form.graduation_year) : null;
    const cgpa = form.cgpa ? Number(form.cgpa) : null;
    setValidationError("");
    if (!form.full_name.trim()) return setValidationError("Full name is required.");
    if (form.phone && (form.phone.length < 7 || form.phone.length > 15)) return setValidationError("Phone number must contain 7 to 15 digits.");
    if (year !== null && (!Number.isInteger(year) || year < 1900 || year > 2200)) return setValidationError("Graduation year must be a valid year between 1900 and 2200.");
    if (cgpa !== null && (cgpa < 0 || cgpa > 10)) return setValidationError("CGPA must be a number from 0 to 10.");
    update.mutate();
  };
  return <QueryState loading={student.isLoading} error={student.error as Error | null}>
    <PageHeader title="Profile" description="Keep your student profile accurate for better matches." />
    <form onSubmit={submit} className="mt-6 grid gap-6 lg:grid-cols-2">
      <Card><CardHeader><CardTitle>Personal information</CardTitle></CardHeader><CardContent className="space-y-4">
        <Field label="Full name" value={form.full_name ?? ""} onChange={(v) => setForm({ ...form, full_name: v })} required />
        <Field label="Email" type="email" value={form.email ?? ""} onChange={(v) => setForm({ ...form, email: v })} />
        <Field label="Phone" value={form.phone ?? ""} onChange={(v) => setForm({ ...form, phone: v.replace(/\D/g, "").slice(0, 15) })} inputMode="numeric" maxLength={15} />
        <Field label="Location" value={form.location ?? ""} onChange={(v) => setForm({ ...form, location: v })} />
      </CardContent></Card>
      <Card><CardHeader><CardTitle>Education and about</CardTitle></CardHeader><CardContent className="space-y-4">
        <SelectField label="Department" value={form.department} options={departmentOptions} onChange={(v) => setForm({ ...form, department: v })} />
        <SelectField label="Course / degree" value={form.degree} options={degreeOptions} onChange={(v) => setForm({ ...form, degree: v })} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Graduation year" type="text" inputMode="numeric" value={form.graduation_year ?? ""} onChange={(v) => setForm({ ...form, graduation_year: v.replace(/\D/g, "").slice(0, 4) })} maxLength={4} />
          <Field label="CGPA (0-10)" type="text" inputMode="decimal" value={form.cgpa ?? ""} onChange={(v) => { if (v === "" || /^\d{0,2}(\.\d{0,2})?$/.test(v) && Number(v) <= 10) setForm({ ...form, cgpa: v }); }} />
        </div>
        <label className="block text-sm font-medium">Bio<textarea className="mt-1 min-h-28 w-full rounded-md border bg-background p-3 text-sm" value={form.bio ?? ""} onChange={(e) => setForm({ ...form, bio: e.target.value })} /></label>
        <Button type="submit" disabled={update.isPending}>{update.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}Save profile</Button>
        {validationError && <p className="text-sm text-destructive">{validationError}</p>}{update.isSuccess && <p className="text-sm text-[var(--success)]">Profile saved.</p>}{update.error && <p className="text-sm text-destructive">{update.error.message}</p>}
      </CardContent></Card>
    </form>
  </QueryState>;
}

function Field({ label, value, onChange, type = "text", required, inputMode, min, max, step, maxLength }: { label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean; inputMode?: "numeric" | "decimal" | "text" | "email" | "tel" | "url"; min?: number; max?: number; step?: number; maxLength?: number }) {
  return <label className="block text-sm font-medium">{label}<Input className="mt-1" type={type} inputMode={inputMode} min={min} max={max} step={step} maxLength={maxLength} value={value} required={required} onChange={(e) => onChange(e.target.value)} /></label>;
}

function SelectField({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  const availableOptions = value && !options.includes(value) ? [value, ...options] : options;
  return <label className="block text-sm font-medium">{label}<select className="mt-1 h-10 w-full rounded-md border bg-background px-3 text-sm" value={value} onChange={(e) => onChange(e.target.value)}><option value="">Select {label.toLowerCase()}</option>{availableOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>;
}

export function StudentSkills() {
  const { skills, studentId } = usePortalData();
  const allSkills = useQuery({ queryKey: ["skills"], queryFn: async () => { const { data, error } = await supabase.from("skills").select("*").order("name"); if (error) throw error; return data; } });
  const assessments = useQuery({ queryKey: ["student-skill-assessment-scores", studentId], enabled: !!studentId, queryFn: async () => { const { data, error } = await supabase.from("assessment_results").select("score, skill_assessments(skill_id)").eq("student_id", studentId!); if (error) throw error; return data; } });
  const client = useQueryClient();
  const [selected, setSelected] = useState("");
  const [proficiency, setProficiency] = useState("50");
  const save = useMutation({
    mutationFn: async () => { if (!studentId || !selected) throw new Error("Choose a skill."); const { error } = await supabase.from("student_skills").upsert({ student_id: studentId, skill_id: selected, proficiency: Number(proficiency), source: "self" }, { onConflict: "student_id,skill_id" }); if (error) throw error; },
    onSuccess: () => { setSelected(""); void client.invalidateQueries({ queryKey: ["student-skills", studentId] }); },
  });
  const remove = useMutation({ mutationFn: async (id: string) => { const { error } = await supabase.from("student_skills").delete().eq("id", id); if (error) throw error; }, onSuccess: () => void client.invalidateQueries({ queryKey: ["student-skills", studentId] }) });
  const assessmentScores = new Map<string, number>();
  (assessments.data ?? []).forEach((result) => { const skillId = result.skill_assessments?.skill_id; if (skillId) assessmentScores.set(skillId, Math.max(assessmentScores.get(skillId) ?? 0, result.score)); });
  return <QueryState loading={skills.isLoading || allSkills.isLoading || assessments.isLoading} error={(skills.error ?? allSkills.error ?? assessments.error) as Error | null}><PageHeader title="Skills" description="Showcase your strengths and keep proficiency levels current." />
    <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]"><Card><CardHeader><CardTitle>My skills</CardTitle></CardHeader><CardContent className="space-y-5">
      {!skills.data?.length && <EmptyState title="No skills added" description="Add your first skill to improve matching." />}
      {skills.data?.map((item) => <div key={item.id} className="flex items-end gap-3"><div className="min-w-0 flex-1"><SkillBar name={item.skills?.name ?? "Skill"} value={item.proficiency} category={item.skills?.category} /><p className="mt-1 text-xs text-muted-foreground">Self-assessed: {item.proficiency}% · Assessment-based: {assessmentScores.has(item.skill_id) ? `${assessmentScores.get(item.skill_id)}%` : "Not assessed"}</p></div><button className="mb-0.5 rounded p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive" onClick={() => remove.mutate(item.id)} aria-label={`Remove ${item.skills?.name ?? "skill"}`}><Trash2 className="h-4 w-4" /></button></div>)}
    </CardContent></Card><Card><CardHeader><CardTitle>Add or update</CardTitle></CardHeader><CardContent className="space-y-4"><label className="block text-sm font-medium">Skill<select className="mt-1 h-10 w-full rounded-md border bg-background px-3 text-sm" value={selected} onChange={(e) => setSelected(e.target.value)}><option value="">Select a skill</option>{allSkills.data?.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select></label><label className="block text-sm font-medium">Proficiency: {proficiency}%<input className="mt-3 w-full accent-primary" type="range" min="0" max="100" value={proficiency} onChange={(e) => setProficiency(e.target.value)} /></label><Button onClick={() => save.mutate()} disabled={save.isPending || !selected}><Plus className="mr-2 h-4 w-4" />Save skill</Button>{save.error && <p className="text-sm text-destructive">{save.error.message}</p>}</CardContent></Card></div>
  </QueryState>;
}

type Project = { id: string; title: string; description: string | null; tech_stack: string[]; link: string | null };
type Certification = { id: string; title: string; issuer: string | null; issue_date: string | null; credential_url: string | null };

type PortfolioForm = { title: string; description: string; tech_stack: string; link: string; issuer: string; issue_date: string; credential_url: string };
function CrudForm({ kind, initial, onDone }: { kind: "project" | "certification"; initial: Project | Certification | undefined; onDone: () => void }) {
  const { studentId, skills } = usePortalData();
  const client = useQueryClient();
  const [form, setForm] = useState<PortfolioForm>(() => kind === "project" ? { title: (initial as Project)?.title ?? "", description: (initial as Project)?.description ?? "", tech_stack: (initial as Project)?.tech_stack.join(", ") ?? "", link: (initial as Project)?.link ?? "", issuer: "", issue_date: "", credential_url: "" } : { title: (initial as Certification)?.title ?? "", description: "", tech_stack: "", link: "", issuer: (initial as Certification)?.issuer ?? "", issue_date: (initial as Certification)?.issue_date ?? "", credential_url: (initial as Certification)?.credential_url ?? "" });
  const studentSkillNames = (skills.data ?? []).map((skill) => skill.skills?.name).filter((name): name is string => !!name);
  const [relatedSkills, setRelatedSkills] = useState<string[]>(() => kind === "project" ? ((initial as Project)?.tech_stack ?? []).filter((tag) => studentSkillNames.includes(tag)) : []);
  const mutation = useMutation({
    mutationFn: async () => {
      if (!studentId || !form.title.trim()) throw new Error("A title is required.");
      if (kind === "project") {
        if (!relatedSkills.length) throw new Error("Select at least one skill related to this project.");
        const existingTags = form.tech_stack.split(",").map((v) => v.trim()).filter(Boolean);
        const values = { student_id: studentId, title: form.title.trim(), description: form.description.trim() || null, tech_stack: [...new Set([...existingTags, ...relatedSkills])], link: form.link.trim() || null };
        const request = initial ? supabase.from("projects").update(values).eq("id", initial.id) : supabase.from("projects").insert(values);
        const { error } = await request;
        if (error) throw error;
      } else {
        const values = { student_id: studentId, title: form.title.trim(), issuer: form.issuer.trim() || null, issue_date: form.issue_date || null, credential_url: form.credential_url.trim() || null };
        const request = initial ? supabase.from("certifications").update(values).eq("id", initial.id) : supabase.from("certifications").insert(values);
        const { error } = await request;
        if (error) throw error;
      }
    },
    onSuccess: () => { void client.invalidateQueries({ queryKey: [kind === "project" ? "projects" : "certifications", studentId] }); onDone(); },
  });
  return <form className="space-y-3 rounded-lg border bg-muted/20 p-4" onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }}><Field label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} required />{kind === "project" ? <><label className="block text-sm font-medium">Description<textarea className="mt-1 min-h-20 w-full rounded-md border bg-background p-2 text-sm" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label><Field label="Tech stack (comma separated)" value={form.tech_stack} onChange={(v) => setForm({ ...form, tech_stack: v })} /><fieldset><legend className="text-sm font-medium">Related skills <span className="text-destructive">*</span></legend><div className="mt-2 grid gap-2 sm:grid-cols-2">{studentSkillNames.map((name) => <label key={name} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={relatedSkills.includes(name)} onChange={(e) => setRelatedSkills(e.target.checked ? [...relatedSkills, name] : relatedSkills.filter((skill) => skill !== name))} />{name}</label>)}</div>{!studentSkillNames.length && <p className="mt-1 text-xs text-muted-foreground">Add skills in the Skills section before creating a project.</p>}</fieldset><Field label="Project link" value={form.link} onChange={(v) => setForm({ ...form, link: v })} /></> : <><Field label="Issuer" value={form.issuer} onChange={(v) => setForm({ ...form, issuer: v })} /><Field label="Issue date" type="date" value={form.issue_date} onChange={(v) => setForm({ ...form, issue_date: v })} /><Field label="Credential URL" value={form.credential_url} onChange={(v) => setForm({ ...form, credential_url: v })} /></>}<div className="flex gap-2"><Button type="submit" disabled={mutation.isPending || (kind === "project" && !relatedSkills.length)}><Save className="mr-2 h-4 w-4" />{initial ? "Update" : "Create"}</Button><Button type="button" variant="outline" onClick={onDone}>Cancel</Button></div>{mutation.error && <p className="text-sm text-destructive">{mutation.error.message}</p>}</form>;
}

export function StudentProjects() { return <StudentPortfolio kind="project" />; }
export function StudentCertifications() { return <StudentPortfolio kind="certification" />; }

function StudentPortfolio({ kind }: { kind: "project" | "certification" }) {
  const { studentId } = usePortalData();
  const query = useQuery({ queryKey: [kind === "project" ? "projects" : "certifications", studentId], enabled: !!studentId, queryFn: async () => { const table = kind === "project" ? "projects" : "certifications"; const request = supabase.from(table).select("*").eq("student_id", studentId!); const { data, error } = kind === "project" ? await request.order("created_at", { ascending: false }) : await request.order("issue_date", { ascending: false, nullsFirst: false }); if (error) throw error; return data; } });
  const client = useQueryClient(); const [editing, setEditing] = useState<Project | Certification>(); const [adding, setAdding] = useState(false);
  const remove = useMutation({ mutationFn: async (id: string) => { const { error } = await supabase.from(kind === "project" ? "projects" : "certifications").delete().eq("id", id); if (error) throw error; }, onSuccess: () => void client.invalidateQueries({ queryKey: [kind === "project" ? "projects" : "certifications", studentId] }) });
  const title = kind === "project" ? "Projects" : "Certifications";
  return <QueryState loading={query.isLoading} error={query.error as Error | null}><PageHeader title={title} description={kind === "project" ? "Tell employers what you have built." : "Keep your credentials in one place."} action={<Button onClick={() => { setAdding(true); setEditing(undefined); }}><Plus className="mr-2 h-4 w-4" />Add {kind}</Button>} />
    {(adding || editing) && <div className="mt-6"><CrudForm kind={kind} initial={editing} onDone={() => { setAdding(false); setEditing(undefined); }} /></div>}
    <div className="mt-6 grid gap-4 md:grid-cols-2">{query.data?.map((item) => <Card key={item.id}><CardContent className="p-5"><div className="flex justify-between gap-3"><div><h2 className="font-semibold">{item.title}</h2><p className="mt-1 text-sm text-muted-foreground">{"tech_stack" in item ? item.description : [item.issuer, item.issue_date].filter(Boolean).join(" · ")}</p>{"tech_stack" in item && <div className="mt-3 flex flex-wrap gap-1">{item.tech_stack.map((tag: string) => <span key={tag} className="rounded bg-muted px-2 py-1 text-xs">{tag}</span>)}</div>}</div><div className="flex gap-1"><button onClick={() => { setEditing(item); setAdding(false); }} aria-label="Edit"><Pencil className="h-4 w-4" /></button><button onClick={() => remove.mutate(item.id)} aria-label="Delete" className="text-destructive"><Trash2 className="h-4 w-4" /></button></div></div></CardContent></Card>)}</div>{!query.data?.length && <div className="mt-6"><EmptyState title={`No ${title.toLowerCase()} yet`} description={`Add a ${kind} to strengthen your profile.`} /></div>}</QueryState>;
}

type Question = { prompt: string; options: string[]; answer: number; difficulty: "Easy" | "Medium" | "Hard"; topic: string };
type Assessment = { id: string; title: string; description: string | null; duration_minutes: number; questions: unknown; skills: { name: string } | null };
export function StudentAssessments() {
  const { studentId } = usePortalData();
  const assessments = useQuery({ queryKey: ["assessments"], queryFn: async () => { const { data, error } = await supabase.from("skill_assessments").select("*, skills(name)").order("title"); if (error) throw error; return data; } });
  const catalogSkills = useQuery({ queryKey: ["assessment-skill-catalog"], queryFn: async () => { const { data, error } = await supabase.from("skills").select("id,name").order("name"); if (error) throw error; return data; } });
  const results = useQuery({ queryKey: ["student-assessment-results", studentId], enabled: !!studentId, queryFn: async () => { const { data, error } = await supabase.from("assessment_results").select("*, skill_assessments(title, skills(name))").eq("student_id", studentId!); if (error) throw error; return data; } });
  const client = useQueryClient(); const [active, setActive] = useState<Assessment>(); const [answers, setAnswers] = useState<number[]>([]);
  const submit = useMutation({ mutationFn: async () => { if (!active || !studentId) throw new Error("Select an assessment."); const questions = parseQuestions(active.questions); const correct = questions.filter((q, i) => q.answer === answers[i]).length; const score = questions.length ? Math.round((correct / questions.length) * 100) : 0; const { error } = await supabase.from("assessment_results").insert({ assessment_id: active.id, student_id: studentId, score }); if (error) throw error; return score; }, onSuccess: () => { setActive(undefined); setAnswers([]); void client.invalidateQueries({ queryKey: ["student-assessment-results", studentId] }); } });
  const assessmentSkillIds = new Set((assessments.data ?? []).filter((assessment) => parseQuestions(assessment.questions).length >= 10).map((assessment) => assessment.skill_id));
  const incompleteSkills = (catalogSkills.data ?? []).filter((skill) => !assessmentSkillIds.has(skill.id)).map((skill) => skill.name);
  return <QueryState loading={assessments.isLoading || catalogSkills.isLoading || results.isLoading} error={(assessments.error ?? catalogSkills.error ?? results.error) as Error | null}><PageHeader title="Assessments" description="Validate your knowledge with assessments from the SkillBridge catalog." />
    {incompleteSkills.length > 0 && <p className="mt-4 rounded-md border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-900">Question banks are incomplete for: {incompleteSkills.join(", ")}. These skills are not offered until their banks contain at least 10 questions.</p>}
    {active ? <AssessmentRunner assessment={active} answers={answers} setAnswers={setAnswers} onSubmit={() => submit.mutate()} pending={submit.isPending} onCancel={() => { setActive(undefined); setAnswers([]); }} /> : <div className="mt-6 grid gap-4 md:grid-cols-2">{assessments.data?.map((assessment) => { const count = parseQuestions(assessment.questions).length; const ready = count >= 10; return <Card key={assessment.id}><CardContent className="p-5"><p className="text-xs font-medium uppercase text-primary">{assessment.skills?.name}</p><h2 className="mt-1 font-semibold">{assessment.title}</h2><p className="mt-1 text-sm text-muted-foreground">{assessment.description}</p><div className="mt-4 flex items-center justify-between"><span className="text-xs text-muted-foreground">{count} questions · {assessment.duration_minutes} min</span><Button size="sm" disabled={!ready} onClick={() => { setActive({ ...assessment, questions: selectQuestions(assessment.questions) }); setAnswers([]); }}>{ready ? "Start" : "Question bank incomplete"}</Button></div></CardContent></Card>; })}</div>}
    {!active && results.data?.length ? <Card className="mt-6"><CardHeader><CardTitle>My results</CardTitle></CardHeader><CardContent className="space-y-2">{results.data.map((result) => <div key={result.id} className="flex justify-between border-b py-3 last:border-0"><span>{result.skill_assessments?.title}</span><strong>{result.score}%</strong></div>)}</CardContent></Card> : null}
  </QueryState>;
}
function parseQuestions(value: unknown): Question[] { if (!Array.isArray(value)) return []; return value.filter((q): q is Record<string, unknown> => typeof q === "object" && q !== null && (typeof q["prompt"] === "string" || typeof q["q"] === "string") && Array.isArray(q["options"]) && typeof q["answer"] === "number").map((q) => ({ prompt: (q["prompt"] ?? q["q"]) as string, options: q["options"] as string[], answer: q["answer"] as number, difficulty: q["difficulty"] === "Hard" || q["difficulty"] === "Medium" ? q["difficulty"] : "Easy", topic: typeof q["topic"] === "string" ? q["topic"] : "Core concepts" })); }
function selectQuestions(value: unknown): Question[] { const bank = parseQuestions(value); const byDifficulty = (difficulty: Question["difficulty"]) => shuffle(bank.filter((question) => question.difficulty === difficulty)); const selected = [...byDifficulty("Easy").slice(0, 5), ...byDifficulty("Medium").slice(0, 5), ...byDifficulty("Hard").slice(0, 5)]; return shuffle(selected.length >= 15 ? selected : bank); }
function shuffle<T>(items: T[]): T[] { return [...items].sort(() => Math.random() - 0.5); }
function AssessmentRunner({ assessment, answers, setAnswers, onSubmit, pending, onCancel }: { assessment: Assessment; answers: number[]; setAnswers: (answers: number[]) => void; onSubmit: () => void; pending: boolean; onCancel: () => void }) { const questions = parseQuestions(assessment.questions); return <Card className="mt-6"><CardHeader><CardTitle>{assessment.title}</CardTitle></CardHeader><CardContent className="space-y-6">{questions.map((q, i) => <fieldset key={`${q.topic}-${q.prompt}`} className="space-y-2"><legend className="font-medium">{i + 1}. {q.prompt} <span className="ml-2 rounded-full bg-muted px-2 py-1 text-xs font-normal text-muted-foreground">{q.difficulty}</span></legend>{q.options.map((option, j) => <label key={option} className="flex items-center gap-2 text-sm"><input type="radio" name={`q-${i}`} checked={answers[i] === j} onChange={() => { const next = [...answers]; next[i] = j; setAnswers(next); }} />{option}</label>)}</fieldset>)}<div className="flex gap-2"><Button onClick={onSubmit} disabled={pending || answers.length !== questions.length}>Submit assessment</Button><Button variant="outline" onClick={onCancel}>Cancel</Button></div></CardContent></Card>; }

type OpportunityItem = { opportunity: { id: string; title: string; type: string; location: string | null; deadline: string | null; eligibility: string | null; min_cgpa: number | null; company_id: string }; company: { name: string } | null; requirements: SkillRequirement[]; match: ReturnType<typeof computeMatch> };
function useOpportunities(studentId: string | undefined) {
  const skills = useQuery({ queryKey: ["student-skills", studentId], enabled: !!studentId, queryFn: async () => { const { data, error } = await supabase.from("student_skills").select("skill_id, proficiency").eq("student_id", studentId!); if (error) throw error; return data; } });
  const resumeSkills = useQuery({ queryKey: ["resume-skills", studentId], enabled: !!studentId, queryFn: async () => { const { data: resume, error } = await supabase.from("student_resumes").select("id, parse_status").eq("student_id", studentId!).maybeSingle(); if (error) throw error; if (!resume || resume.parse_status !== "completed") return []; const { data, error: skillsError } = await supabase.from("resume_skills").select("skill_id").eq("resume_id", resume.id); if (skillsError) throw skillsError; return data ?? []; } });
  const assessmentSkills = useQuery({ queryKey: ["assessment-skill-evidence", studentId], enabled: !!studentId, queryFn: async () => { const { data, error } = await supabase.from("assessment_results").select("score, skill_assessments(skill_id)").eq("student_id", studentId!); if (error) throw error; return data; } });
  return useQuery({ queryKey: ["opportunities", studentId, skills.data, resumeSkills.data, assessmentSkills.data], enabled: !!studentId && !skills.isLoading && !resumeSkills.isLoading && !assessmentSkills.isLoading, queryFn: async (): Promise<OpportunityItem[]> => { const [{ data: opportunities, error: opportunityError }, { data: requirements, error: requirementError }, { data: companies, error: companyError }, { data: skillRows, error: skillError }] = await Promise.all([supabase.from("opportunities").select("id,title,type,location,deadline,eligibility,min_cgpa,company_id").eq("is_active", true).order("deadline"), supabase.from("opportunity_skills").select("opportunity_id,skill_id,min_proficiency,weight"), supabase.from("companies").select("id,name"), supabase.from("skills").select("id,name")]); if (opportunityError || requirementError || companyError || skillError) throw opportunityError ?? requirementError ?? companyError ?? skillError; const names = new Map(skillRows.map((s) => [s.id, s.name])); const studentMap = Object.fromEntries((skills.data ?? []).map((s) => [s.skill_id, s.proficiency])); const evidence: Record<string, ("resume" | "assessment" | "profile")[]> = {}; (skills.data ?? []).forEach((s) => { evidence[s.skill_id] = ["profile"]; }); (assessmentSkills.data ?? []).forEach((result) => { const skillId = result.skill_assessments?.skill_id; if (skillId) { studentMap[skillId] = Math.max(studentMap[skillId] ?? 0, result.score); evidence[skillId] = Array.from(new Set<"resume" | "assessment" | "profile">([...(evidence[skillId] ?? []), "assessment"])); } }); (resumeSkills.data ?? []).forEach((result) => { studentMap[result.skill_id] = Math.max(studentMap[result.skill_id] ?? 0, 100); evidence[result.skill_id] = Array.from(new Set<"resume" | "assessment" | "profile">([...(evidence[result.skill_id] ?? []), "resume"])); }); return opportunities.map((opportunity) => { const reqs = requirements.filter((r) => r.opportunity_id === opportunity.id).map((r) => ({ skillId: r.skill_id, name: names.get(r.skill_id) ?? "Required skill", minProficiency: r.min_proficiency, weight: r.weight })); return { opportunity, company: companies.find((c) => c.id === opportunity.company_id) ?? null, requirements: reqs, match: computeMatch(reqs, studentMap, evidence) }; }); } });
}
export function StudentSkillGaps() { const opportunities = useOpportunities(useStudentRecord().data?.id); const grouped = useMemo(() => { const all = opportunities.data?.flatMap((o) => o.match.breakdown) ?? []; const map = new Map<string, (typeof all)[number]>(); all.forEach((item) => { const previous = map.get(item.skillId); if (!previous || item.actual > previous.actual) map.set(item.skillId, item); }); return [...map.values()]; }, [opportunities.data]); return <QueryState loading={opportunities.isLoading} error={opportunities.error as Error | null}><PageHeader title="Resume-based skill gaps" description="Required skills are compared with resume evidence, assessments, and your declared profile skills." /><div className="mt-6 grid gap-4 md:grid-cols-3">{(["met", "partial", "gap"] as const).map((status) => <Card key={status}><CardHeader><CardTitle className="capitalize">{status === "met" ? "Strong skills" : status === "partial" ? "Partial / weak" : "Missing skills"}</CardTitle></CardHeader><CardContent className="space-y-4">{grouped.filter((s) => s.status === status).map((skill) => <div key={skill.skillId}><SkillBar name={skill.name} value={skill.actual} required={skill.required} status={skill.status} /><p className="mt-1 text-xs text-muted-foreground">{skill.evidence.length ? `Evidence: ${skill.evidence.join(", ")}` : "No supporting evidence yet."}</p></div>)}{!grouped.some((s) => s.status === status) && <p className="text-sm text-muted-foreground">No skills in this group.</p>}</CardContent></Card>)}</div></QueryState>; }
export function StudentLearning() { const student = useStudentRecord(); const opportunities = useOpportunities(student.data?.id); const gapIds = [...new Set(opportunities.data?.flatMap((item) => item.match.breakdown.filter((skill) => skill.status !== "met").map((skill) => skill.skillId)) ?? [])]; const resources = useLearningResources(gapIds); return <QueryState loading={resources.isLoading || opportunities.isLoading} error={(resources.error ?? opportunities.error) as Error | null}><PageHeader title="Learning resources" description="Resources connected to your resume-based skill gaps and active opportunities." /><div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{resources.data?.map((resource) => <ResourceCard key={resource.id} resource={resource} />)}</div>{!resources.data?.length && <div className="mt-6"><EmptyState title="No learning resources found" description="Resources will appear as gaps are identified and added to the catalog." /></div>}</QueryState>; }
function useLearningResources(skillIds: string[]) { return useQuery({ queryKey: ["learning-resources", skillIds], queryFn: async () => { let query = supabase.from("learning_resources").select("*, skills(name)").order("title"); if (skillIds.length) query = query.in("skill_id", skillIds); const { data, error } = await query; if (error) throw error; return data; } }); }
function ResourceRow({ resource }: { resource: { title: string; provider: string | null } }) { return <div className="border-b pb-2 last:border-0"><p className="text-sm font-medium">{resource.title}</p><p className="text-xs text-muted-foreground">{resource.provider ?? "Learning resource"}</p></div>; }
function ResourceCard({ resource }: { resource: { id: string; title: string; provider: string | null; url: string | null; type: string; level: string; duration: string | null; skills: { name: string } | null } }) { return <Card><CardContent className="p-5"><span className="text-xs uppercase text-primary">{resource.skills?.name} · {resource.level}</span><h2 className="mt-2 font-semibold">{resource.title}</h2><p className="mt-1 text-sm text-muted-foreground">{resource.provider}{resource.duration ? ` · ${resource.duration}` : ""}</p>{resource.url && <a className="mt-4 inline-block text-sm font-medium text-primary underline" href={resource.url} target="_blank" rel="noreferrer">Open resource</a>}</CardContent></Card>; }
export function StudentOpportunities() { const student = useStudentRecord(); const opportunities = useOpportunities(student.data?.id); const applications = useApplications(student.data?.id); const client = useQueryClient(); const apply = useMutation({ mutationFn: async (item: OpportunityItem) => { if (!student.data?.id) throw new Error("Student record not found."); if (applications.data?.some((a) => a.opportunity_id === item.opportunity.id)) throw new Error("You have already applied to this opportunity."); if (item.opportunity.min_cgpa !== null && (student.data.cgpa === null || student.data.cgpa < item.opportunity.min_cgpa)) throw new Error(`Your CGPA does not meet this opportunity's minimum requirement of ${item.opportunity.min_cgpa}.`); const { error } = await supabase.from("applications").insert({ student_id: student.data.id, opportunity_id: item.opportunity.id, match_score: item.match.score }); if (error) throw error; }, onSuccess: () => { void client.invalidateQueries({ queryKey: ["applications", student.data?.id] }); } }); return <QueryState loading={opportunities.isLoading} error={opportunities.error as Error | null}><PageHeader title="Opportunities" description="Explore active opportunities matched to your actual skills." /><div className="mt-6 space-y-4">{opportunities.data?.map((item) => { const belowCgpa = item.opportunity.min_cgpa !== null && (student.data?.cgpa === null || (student.data?.cgpa ?? 0) < item.opportunity.min_cgpa); return <Card key={item.opportunity.id}><CardContent className="p-5"><div className="flex flex-col justify-between gap-4 sm:flex-row"><div><div className="flex flex-wrap items-center gap-2"><h2 className="text-lg font-semibold">{item.opportunity.title}</h2><MatchBadge score={item.match.score} /></div><p className="mt-1 text-sm text-muted-foreground">{item.company?.name ?? "Company"} · {item.opportunity.type} · {item.opportunity.location ?? "Location not specified"}</p><p className="mt-3 text-sm">{item.requirements.map((r) => `${r.name} (${r.minProficiency}%)`).join(" · ") || "No required skills listed"}</p><p className="mt-2 text-xs text-muted-foreground">{item.opportunity.eligibility ?? "Eligibility not specified"}{item.opportunity.min_cgpa !== null ? ` · Minimum CGPA ${item.opportunity.min_cgpa}` : ""}{item.opportunity.deadline ? ` · Deadline ${new Date(item.opportunity.deadline).toLocaleDateString()}` : ""}</p>{belowCgpa && <p className="mt-2 text-sm text-destructive">Your CGPA does not meet this opportunity's minimum requirement.</p>}</div><Button disabled={applications.data?.some((a) => a.opportunity_id === item.opportunity.id) || apply.isPending || belowCgpa} onClick={() => apply.mutate(item)}>{applications.data?.some((a) => a.opportunity_id === item.opportunity.id) ? "Applied" : "Apply now"}</Button></div></CardContent></Card>; })}</div>{!opportunities.data?.length && <div className="mt-6"><EmptyState title="No active opportunities" description="Check back soon for new roles." /></div>}{apply.error && <p className="mt-4 text-sm text-destructive">{apply.error.message}</p>}{apply.isSuccess && <p className="mt-4 text-sm text-[var(--success)]">Application submitted.</p>}</QueryState>; }
function useApplications(studentId: string | undefined) { return useQuery({ queryKey: ["applications", studentId], enabled: !!studentId, queryFn: async () => { const { data, error } = await supabase.from("applications").select("*, opportunities(title, company_id, companies(name))").eq("student_id", studentId!).order("applied_at", { ascending: false }); if (error) throw error; return data; } }); }
export function StudentApplications() { const student = useStudentRecord(); const applications = useApplications(student.data?.id); return <QueryState loading={applications.isLoading} error={applications.error as Error | null}><PageHeader title="Applications" description="Track the opportunities you have applied to." /><Card className="mt-6"><CardContent className="p-0">{applications.data?.map((item) => <div key={item.id} className="flex flex-col gap-3 border-b p-5 last:border-0 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-semibold">{item.opportunities?.title ?? "Opportunity"}</h2><p className="text-sm text-muted-foreground">{item.opportunities?.companies?.name ?? "Company"} · Applied {new Date(item.applied_at).toLocaleDateString()}</p></div><div className="text-left sm:text-right"><span className="rounded-full bg-muted px-3 py-1 text-xs capitalize">{item.status.replace("_", " ")}</span><p className="mt-2 text-xs text-muted-foreground">Updated {new Date(item.updated_at).toLocaleDateString()}</p></div></div>)}{!applications.data?.length && <div className="p-6"><EmptyState title="No applications yet" description="Your submitted applications will appear here." /></div>}</CardContent></Card></QueryState>; }

function OpportunityRow({ item }: { item: OpportunityItem }) { return <Link to="/student/opportunities" className="flex items-center justify-between gap-3 rounded-md border p-3 hover:bg-muted"><div><p className="font-medium">{item.opportunity.title}</p><p className="text-xs text-muted-foreground">{item.company?.name ?? "Company"} · {item.opportunity.location ?? "Flexible"}</p></div><MatchBadge score={item.match.score} size="sm" /></Link>; }
