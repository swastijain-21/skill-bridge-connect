ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS project_file_path text,
  ADD COLUMN IF NOT EXISTS project_image_path text;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'project-files',
  'project-files',
  false,
  52428800,
  ARRAY['application/pdf', 'application/zip', 'application/x-zip-compressed', 'image/png', 'image/jpeg', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 52428800,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Students upload own project files" ON storage.objects;
CREATE POLICY "Students upload own project files"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'project-files'
    AND public.has_role(auth.uid(), 'student')
    AND split_part(name, '/', 1) = public.current_student_id()::text
  );

DROP POLICY IF EXISTS "Users view project files" ON storage.objects;
CREATE POLICY "Users view project files"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'project-files'
    AND (
      NOT public.has_role(auth.uid(), 'student')
      OR split_part(name, '/', 1) = public.current_student_id()::text
    )
  );

DROP POLICY IF EXISTS "Students update own project files" ON storage.objects;
CREATE POLICY "Students update own project files"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'project-files'
    AND public.has_role(auth.uid(), 'student')
    AND split_part(name, '/', 1) = public.current_student_id()::text
  )
  WITH CHECK (
    bucket_id = 'project-files'
    AND public.has_role(auth.uid(), 'student')
    AND split_part(name, '/', 1) = public.current_student_id()::text
  );

DROP POLICY IF EXISTS "Students delete own project files" ON storage.objects;
CREATE POLICY "Students delete own project files"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'project-files'
    AND public.has_role(auth.uid(), 'student')
    AND split_part(name, '/', 1) = public.current_student_id()::text
  );
