create or replace function public.update_updated_at_column()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end; $$;

create or replace function public.current_institution_id()
returns uuid language sql stable security definer set search_path = public as $$
  select i.id from public.institutions i
  join public.profiles p on p.id = i.profile_id
  where p.user_id = auth.uid() limit 1
$$;

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

create index resume_skills_student_id_idx on public.resume_skills (student_id);
create index resume_skills_resume_id_idx on public.resume_skills (resume_id);

create trigger update_student_resumes_updated_at
  before update on public.student_resumes
  for each row execute function public.update_updated_at_column();

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