CREATE TABLE public.student_resumes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL UNIQUE REFERENCES public.students(id) ON DELETE CASCADE,
  file_path text NOT NULL,
  file_name text NOT NULL,
  file_type text NOT NULL,
  file_size bigint NOT NULL,
  extracted_text text,
  parse_status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.resume_skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id uuid NOT NULL REFERENCES public.student_resumes(id) ON DELETE CASCADE,
  skill_id uuid NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  evidence text NOT NULL,
  confidence numeric(4,3) NOT NULL DEFAULT 0.7 CHECK (confidence >= 0 AND confidence <= 1),
  proficiency int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (resume_id, skill_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.student_resumes TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.resume_skills TO authenticated;
GRANT ALL ON public.student_resumes, public.resume_skills TO service_role;

ALTER TABLE public.student_resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "students manage own resumes" ON public.student_resumes
  FOR ALL TO authenticated
  USING (
    public.has_role(auth.uid(), 'student')
    AND student_id = public.current_student_id()
  )
  WITH CHECK (
    public.has_role(auth.uid(), 'student')
    AND student_id = public.current_student_id()
  );

CREATE POLICY "authorized users read resumes" ON public.student_resumes
  FOR SELECT TO authenticated
  USING (
    (
      public.has_role(auth.uid(), 'student')
      AND student_id = public.current_student_id()
    )
    OR public.has_role(auth.uid(), 'admin')
    OR (public.has_role(auth.uid(), 'institution')
        AND public.is_institution_student(student_id))
    OR (
      public.has_role(auth.uid(), 'industry')
      AND EXISTS (
        SELECT 1
        FROM public.applications a
        JOIN public.opportunities o ON o.id = a.opportunity_id
        WHERE a.student_id = student_resumes.student_id
          AND public.owns_company(o.company_id)
      )
    )
  );

CREATE POLICY "students manage own resume skills" ON public.resume_skills
  FOR ALL TO authenticated
  USING (
    public.has_role(auth.uid(), 'student')
    AND EXISTS (
      SELECT 1 FROM public.student_resumes r
      WHERE r.id = resume_id AND r.student_id = public.current_student_id()
    )
  )
  WITH CHECK (
    public.has_role(auth.uid(), 'student')
    AND EXISTS (
      SELECT 1 FROM public.student_resumes r
      WHERE r.id = resume_id AND r.student_id = public.current_student_id()
    )
  );

CREATE POLICY "authorized users read resume skills" ON public.resume_skills
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.student_resumes r
      WHERE r.id = resume_id
        AND (
          (
            public.has_role(auth.uid(), 'student')
            AND r.student_id = public.current_student_id()
          )
          OR public.has_role(auth.uid(), 'admin')
          OR (public.has_role(auth.uid(), 'institution')
              AND public.is_institution_student(r.student_id))
          OR (
            public.has_role(auth.uid(), 'industry')
            AND EXISTS (
              SELECT 1
              FROM public.applications a
              JOIN public.opportunities o ON o.id = a.opportunity_id
              WHERE a.student_id = r.student_id
                AND public.owns_company(o.company_id)
            )
          )
        )
    )
  );

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'student-resumes',
  'student-resumes',
  false,
  10485760,
  ARRAY[
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 10485760,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

CREATE POLICY "students upload own resumes" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'student-resumes'
    AND public.has_role(auth.uid(), 'student')
    AND split_part(name, '/', 1) = public.current_student_id()::text
  );

CREATE POLICY "students read own resumes" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'student-resumes'
    AND public.has_role(auth.uid(), 'student')
    AND split_part(name, '/', 1) = public.current_student_id()::text
  );

CREATE POLICY "authorized users read student resumes" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'student-resumes'
    AND EXISTS (
      SELECT 1
      FROM public.student_resumes r
      WHERE r.file_path = storage.objects.name
        AND (
          public.has_role(auth.uid(), 'admin')
          OR (
            public.has_role(auth.uid(), 'institution')
            AND public.is_institution_student(r.student_id)
          )
          OR (
            public.has_role(auth.uid(), 'industry')
            AND EXISTS (
              SELECT 1
              FROM public.applications a
              JOIN public.opportunities o ON o.id = a.opportunity_id
              WHERE a.student_id = r.student_id
                AND public.owns_company(o.company_id)
            )
          )
        )
    )
  );

CREATE POLICY "students update own resumes" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'student-resumes'
    AND public.has_role(auth.uid(), 'student')
    AND split_part(name, '/', 1) = public.current_student_id()::text
  )
  WITH CHECK (
    bucket_id = 'student-resumes'
    AND public.has_role(auth.uid(), 'student')
    AND split_part(name, '/', 1) = public.current_student_id()::text
  );

CREATE POLICY "students delete own resumes" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'student-resumes'
    AND public.has_role(auth.uid(), 'student')
    AND split_part(name, '/', 1) = public.current_student_id()::text
  );
