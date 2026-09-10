
CREATE TYPE public.app_role AS ENUM ('student','institution','industry','admin');
CREATE TYPE public.opportunity_type AS ENUM ('internship','job');
CREATE TYPE public.application_status AS ENUM ('applied','under_review','shortlisted','interview','selected','rejected');

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE,
  full_name text NOT NULL DEFAULT '',
  email text,
  role public.app_role NOT NULL DEFAULT 'student',
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles readable" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "profiles insert own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "profiles update own" ON public.profiles FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT, INSERT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "roles readable" ON public.user_roles FOR SELECT TO authenticated USING (true);
CREATE POLICY "roles insert own" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.current_profile_id()
RETURNS uuid LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT id FROM public.profiles WHERE user_id = auth.uid() LIMIT 1
$$;

CREATE TABLE public.institutions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  name text NOT NULL,
  code text,
  city text,
  state text,
  type text,
  established int,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.institutions TO authenticated;
GRANT ALL ON public.institutions TO service_role;
ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "institutions readable" ON public.institutions FOR SELECT TO authenticated USING (true);
CREATE POLICY "institutions insert own" ON public.institutions FOR INSERT TO authenticated WITH CHECK (profile_id = public.current_profile_id());
CREATE POLICY "institutions update own" ON public.institutions FOR UPDATE TO authenticated USING (profile_id = public.current_profile_id()) WITH CHECK (profile_id = public.current_profile_id());

CREATE TABLE public.companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  name text NOT NULL,
  sector text,
  website text,
  location text,
  size text,
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.companies TO authenticated;
GRANT ALL ON public.companies TO service_role;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "companies readable" ON public.companies FOR SELECT TO authenticated USING (true);
CREATE POLICY "companies insert own" ON public.companies FOR INSERT TO authenticated WITH CHECK (profile_id = public.current_profile_id());
CREATE POLICY "companies update own" ON public.companies FOR UPDATE TO authenticated USING (profile_id = public.current_profile_id()) WITH CHECK (profile_id = public.current_profile_id());

CREATE OR REPLACE FUNCTION public.owns_company(_company_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.companies c
    JOIN public.profiles p ON p.id = c.profile_id
    WHERE c.id = _company_id AND p.user_id = auth.uid()
  )
$$;

CREATE TABLE public.students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid UNIQUE REFERENCES public.profiles(id) ON DELETE SET NULL,
  institution_id uuid REFERENCES public.institutions(id) ON DELETE SET NULL,
  full_name text NOT NULL,
  email text,
  phone text,
  department text,
  degree text,
  graduation_year int,
  cgpa numeric(3,2),
  location text,
  bio text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.students TO authenticated;
GRANT ALL ON public.students TO service_role;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
CREATE POLICY "students readable" ON public.students FOR SELECT TO authenticated USING (true);
CREATE POLICY "students insert own" ON public.students FOR INSERT TO authenticated WITH CHECK (profile_id = public.current_profile_id());
CREATE POLICY "students update own" ON public.students FOR UPDATE TO authenticated USING (profile_id = public.current_profile_id()) WITH CHECK (profile_id = public.current_profile_id());

CREATE OR REPLACE FUNCTION public.current_student_id()
RETURNS uuid LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT s.id FROM public.students s JOIN public.profiles p ON p.id = s.profile_id WHERE p.user_id = auth.uid() LIMIT 1
$$;

CREATE TABLE public.skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  category text NOT NULL DEFAULT 'technical',
  demand_score int NOT NULL DEFAULT 50,
  description text
);
GRANT SELECT ON public.skills TO authenticated;
GRANT ALL ON public.skills TO service_role;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "skills readable" ON public.skills FOR SELECT TO authenticated USING (true);

CREATE TABLE public.student_skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  skill_id uuid NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  proficiency int NOT NULL DEFAULT 0,
  source text NOT NULL DEFAULT 'self',
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (student_id, skill_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.student_skills TO authenticated;
GRANT ALL ON public.student_skills TO service_role;
ALTER TABLE public.student_skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "student_skills readable" ON public.student_skills FOR SELECT TO authenticated USING (true);
CREATE POLICY "student_skills own write" ON public.student_skills FOR ALL TO authenticated
  USING (student_id = public.current_student_id()) WITH CHECK (student_id = public.current_student_id());

CREATE TABLE public.skill_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_id uuid NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  duration_minutes int NOT NULL DEFAULT 10,
  questions jsonb NOT NULL DEFAULT '[]'::jsonb
);
GRANT SELECT ON public.skill_assessments TO authenticated;
GRANT ALL ON public.skill_assessments TO service_role;
ALTER TABLE public.skill_assessments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "assessments readable" ON public.skill_assessments FOR SELECT TO authenticated USING (true);

CREATE TABLE public.assessment_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id uuid NOT NULL REFERENCES public.skill_assessments(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  score int NOT NULL,
  taken_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.assessment_results TO authenticated;
GRANT ALL ON public.assessment_results TO service_role;
ALTER TABLE public.assessment_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "results readable" ON public.assessment_results FOR SELECT TO authenticated USING (true);
CREATE POLICY "results insert own" ON public.assessment_results FOR INSERT TO authenticated WITH CHECK (student_id = public.current_student_id());

CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  tech_stack text[] NOT NULL DEFAULT '{}',
  link text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.projects TO authenticated;
GRANT ALL ON public.projects TO service_role;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "projects readable" ON public.projects FOR SELECT TO authenticated USING (true);
CREATE POLICY "projects own write" ON public.projects FOR ALL TO authenticated
  USING (student_id = public.current_student_id()) WITH CHECK (student_id = public.current_student_id());

CREATE TABLE public.certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  title text NOT NULL,
  issuer text,
  issue_date date,
  credential_url text
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.certifications TO authenticated;
GRANT ALL ON public.certifications TO service_role;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "certs readable" ON public.certifications FOR SELECT TO authenticated USING (true);
CREATE POLICY "certs own write" ON public.certifications FOR ALL TO authenticated
  USING (student_id = public.current_student_id()) WITH CHECK (student_id = public.current_student_id());

CREATE TABLE public.opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  title text NOT NULL,
  type public.opportunity_type NOT NULL DEFAULT 'internship',
  description text,
  location text,
  work_mode text DEFAULT 'On-site',
  duration text,
  stipend text,
  eligibility text,
  min_cgpa numeric(3,2) DEFAULT 0,
  experience_years int NOT NULL DEFAULT 0,
  openings int NOT NULL DEFAULT 1,
  deadline date,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.opportunities TO authenticated;
GRANT ALL ON public.opportunities TO service_role;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "opportunities readable" ON public.opportunities FOR SELECT TO authenticated USING (true);
CREATE POLICY "opportunities own write" ON public.opportunities FOR ALL TO authenticated
  USING (public.owns_company(company_id)) WITH CHECK (public.owns_company(company_id));

CREATE TABLE public.opportunity_skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id uuid NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
  skill_id uuid NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  min_proficiency int NOT NULL DEFAULT 60,
  weight int NOT NULL DEFAULT 1,
  UNIQUE (opportunity_id, skill_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.opportunity_skills TO authenticated;
GRANT ALL ON public.opportunity_skills TO service_role;
ALTER TABLE public.opportunity_skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "opportunity_skills readable" ON public.opportunity_skills FOR SELECT TO authenticated USING (true);
CREATE POLICY "opportunity_skills own write" ON public.opportunity_skills FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.opportunities o WHERE o.id = opportunity_id AND public.owns_company(o.company_id)))
  WITH CHECK (EXISTS (SELECT 1 FROM public.opportunities o WHERE o.id = opportunity_id AND public.owns_company(o.company_id)));

CREATE TABLE public.applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id uuid NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  status public.application_status NOT NULL DEFAULT 'applied',
  match_score int NOT NULL DEFAULT 0,
  cover_note text,
  applied_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (opportunity_id, student_id)
);
GRANT SELECT, INSERT, UPDATE ON public.applications TO authenticated;
GRANT ALL ON public.applications TO service_role;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "applications readable" ON public.applications FOR SELECT TO authenticated USING (true);
CREATE POLICY "applications insert own" ON public.applications FOR INSERT TO authenticated WITH CHECK (student_id = public.current_student_id());
CREATE POLICY "applications update by owner or company" ON public.applications FOR UPDATE TO authenticated
  USING (student_id = public.current_student_id() OR EXISTS (SELECT 1 FROM public.opportunities o WHERE o.id = opportunity_id AND public.owns_company(o.company_id)))
  WITH CHECK (student_id = public.current_student_id() OR EXISTS (SELECT 1 FROM public.opportunities o WHERE o.id = opportunity_id AND public.owns_company(o.company_id)));

CREATE TABLE public.placements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  opportunity_id uuid REFERENCES public.opportunities(id) ON DELETE SET NULL,
  type public.opportunity_type NOT NULL DEFAULT 'job',
  package_lpa numeric(5,2),
  placed_on date NOT NULL DEFAULT current_date
);
GRANT SELECT, INSERT ON public.placements TO authenticated;
GRANT ALL ON public.placements TO service_role;
ALTER TABLE public.placements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "placements readable" ON public.placements FOR SELECT TO authenticated USING (true);
CREATE POLICY "placements company insert" ON public.placements FOR INSERT TO authenticated WITH CHECK (public.owns_company(company_id));

CREATE TABLE public.feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  application_id uuid REFERENCES public.applications(id) ON DELETE SET NULL,
  rating int NOT NULL DEFAULT 4,
  comments text,
  skills_endorsed text[] NOT NULL DEFAULT '{}',
  skills_to_improve text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.feedback TO authenticated;
GRANT ALL ON public.feedback TO service_role;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY "feedback readable" ON public.feedback FOR SELECT TO authenticated USING (true);
CREATE POLICY "feedback company insert" ON public.feedback FOR INSERT TO authenticated WITH CHECK (public.owns_company(company_id));

CREATE TABLE public.learning_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_id uuid NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  title text NOT NULL,
  provider text,
  url text,
  type text NOT NULL DEFAULT 'course',
  level text NOT NULL DEFAULT 'beginner',
  duration text
);
GRANT SELECT ON public.learning_resources TO authenticated;
GRANT ALL ON public.learning_resources TO service_role;
ALTER TABLE public.learning_resources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "resources readable" ON public.learning_resources FOR SELECT TO authenticated USING (true);

CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  body text,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notifications own" ON public.notifications FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "notifications own insert" ON public.notifications FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "notifications own update" ON public.notifications FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
