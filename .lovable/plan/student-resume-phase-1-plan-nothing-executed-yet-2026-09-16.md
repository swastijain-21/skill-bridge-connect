# Student Resume — Phase 1 plan (nothing executed yet)

Adds a resume upload + automatic skill detection feature to the Student portal, reusing the existing skills table, matching engine and access-control helpers. No existing table, policy or page is changed except the two small additions listed in section E.

## What the student sees

A new "Resume" item in the Student portal sidebar (`/student/resume`):

- Upload a PDF, DOCX or TXT resume (max 5 MB) into private storage.
- The text is read in the browser, then matched against the existing skills catalogue.
- Detected skills are listed with a confidence level and the sentence from the resume that triggered the match (evidence).
- "Add to my skill profile" writes the detected skills into the existing `student_skills` (source `resume`), so skill gaps, learning suggestions and opportunity match percentages immediately reflect the resume — the matching engine itself is untouched.
- Replace or delete the resume at any time; deleting removes the stored file too.

## A. Proposed schema

`public.student_resumes`
- `id` uuid pk, `student_id` uuid → students(id) unique, `file_name` text, `file_path` text (storage key `<student_id>/<uuid>.<ext>`), `file_type` text, `file_size` integer, `extracted_text` text, `parse_status` text ('pending' | 'parsed' | 'failed'), `created_at`, `updated_at`

`public.resume_skills`
- `id` uuid pk, `resume_id` uuid → student_resumes(id) on delete cascade, `student_id` uuid → students(id), `skill_id` uuid → skills(id), `confidence` integer 0-100, `proficiency` integer 0-100, `evidence` text, `created_at`; unique (resume_id, skill_id)

## B. Migration SQL (additive only)

```sql
-- helper: institution of the signed-in institution user
create or replace function public.current_institution_id()
returns uuid language sql stable security definer set search_path = public as $$
  select i.id from public.institutions i
  join public.profiles p on p.id = i.profile_id
  where p.user_id = auth.uid() limit 1
$$;

-- helper: may the caller read this student's resume?
create or replace function public.can_view_student_resume(_student_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select
    _student_id = public.current_student_id()
    or public.has_role(auth.uid(), 'admin')
    or exists (
      select 1 from public.students s
      where s.id = _student_id
        and s.institution_id is not null
        and s.institution_id = public.current_institution_id())
    or exists (
      select 1 from public.applications a
      join public.opportunities o on o.id = a.opportunity_id
      where a.student_id = _student_id and public.owns_company(o.company_id))
$$;

revoke execute on function public.current_institution_id() from public, anon;
revoke execute on function public.can_view_student_resume(uuid) from public, anon;
grant execute on function public.current_institution_id() to authenticated;
grant execute on function public.can_view_student_resume(uuid) to authenticated;

create table public.student_resumes (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null unique references public.students(id) on delete cascade,
  file_name text not null,
  file_path text not null,
  file_type text not null default 'application/pdf',
  file_size integer not null default 0,
  extracted_text text,
  parse_status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.student_resumes to authenticated;
grant all on public.student_resumes to service_role;
alter table public.student_resumes enable row level security;
create policy "resumes readable by permitted roles" on public.student_resumes
  for select to authenticated using (public.can_view_student_resume(student_id));
create policy "resumes insert own" on public.student_resumes
  for insert to authenticated with check (student_id = public.current_student_id());
create policy "resumes update own" on public.student_resumes
  for update to authenticated using (student_id = public.current_student_id())
  with check (student_id = public.current_student_id());
create policy "resumes delete own" on public.student_resumes
  for delete to authenticated using (student_id = public.current_student_id());

create table public.resume_skills (
  id uuid primary key default gen_random_uuid(),
  resume_id uuid not null references public.student_resumes(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  skill_id uuid not null references public.skills(id) on delete cascade,
  confidence integer not null default 0,
  proficiency integer not null default 0,
  evidence text,
  created_at timestamptz not null default now(),
  unique (resume_id, skill_id)
);
grant select, insert, update, delete on public.resume_skills to authenticated;
grant all on public.resume_skills to service_role;
alter table public.resume_skills enable row level security;
create policy "resume skills readable by permitted roles" on public.resume_skills
  for select to authenticated using (public.can_view_student_resume(student_id));
create policy "resume skills write own" on public.resume_skills
  for all to authenticated using (student_id = public.current_student_id())
  with check (student_id = public.current_student_id());

create index on public.resume_skills (student_id);
create index on public.resume_skills (resume_id);

create trigger update_student_resumes_updated_at
  before update on public.student_resumes
  for each row execute function public.update_updated_at_column();
```

(If `public.update_updated_at_column()` does not already exist, the migration creates it first with `security definer`-safe `search_path`.)

## C. Storage

Private bucket `student-resumes` (created with the bucket tool, not SQL), 5 MB per-file limit. Policies on `storage.objects`, keyed on the first path segment being the student's id:

```sql
create policy "resume files read" on storage.objects for select to authenticated
  using (bucket_id = 'student-resumes'
         and public.can_view_student_resume((storage.foldername(name))[1]::uuid));
create policy "resume files insert own" on storage.objects for insert to authenticated
  with check (bucket_id = 'student-resumes'
         and (storage.foldername(name))[1]::uuid = public.current_student_id());
create policy "resume files update own" on storage.objects for update to authenticated
  using (bucket_id = 'student-resumes'
         and (storage.foldername(name))[1]::uuid = public.current_student_id());
create policy "resume files delete own" on storage.objects for delete to authenticated
  using (bucket_id = 'student-resumes'
         and (storage.foldername(name))[1]::uuid = public.current_student_id());
```

Files are served through short-lived signed URLs only.

## D. Files to create

- `src/lib/resume-analysis.ts` — deterministic extraction: PDF via `pdfjs-dist`, DOCX via `mammoth`, TXT directly; normalises text, matches skill names + a built-in alias map (JS/JavaScript, ML/Machine Learning, Postgres/SQL…), scores confidence from occurrence count, section (skills vs body) and nearby years-of-experience, maps confidence → proficiency, captures the evidence sentence.
- `src/components/resume-panel.tsx` — upload card, parsing progress, detected-skill table with confidence/evidence, "Add to my skill profile", replace/delete, loading/empty/error/success states in the existing conventions.
- `src/routes/student.resume.tsx` — route wiring only.

New dependencies: `pdfjs-dist`, `mammoth` (both run in the browser, so nothing is added to the server runtime).

## E. Existing files modified

- `src/components/student-portal.tsx` — one new sidebar entry ("Resume"), plus a "Resume skills" hint on the dashboard. No change to existing queries or components.
- `src/lib/skill-match.ts` — unchanged. Resume skills flow through `student_skills`, so gaps and match percentages keep using the current engine.

## F. Risks / compatibility

- Text extraction from image-only (scanned) PDFs yields nothing; the UI says so and offers manual skill entry. No OCR in v1.
- Alias-based skill detection can miss unusual phrasing; the student reviews and can deselect any detected skill before it is saved.
- Writing resume skills into `student_skills` overwrites an existing self-reported value for the same skill; the UI warns and only overwrites when the resume score is higher.
- `pdfjs-dist` must be loaded client-side only (dynamic import) to avoid SSR breakage.
- Everything is additive; existing tables, policies, data and the matching engine stay as they are.
