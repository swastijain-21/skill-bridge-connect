CREATE OR REPLACE FUNCTION public.current_institution_id()
RETURNS uuid LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT i.id
  FROM public.institutions i
  JOIN public.profiles p ON p.id = i.profile_id
  WHERE p.user_id = auth.uid()
  LIMIT 1
$$;

CREATE OR REPLACE FUNCTION public.is_institution_student(_student_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.students
    WHERE id = _student_id AND institution_id = public.current_institution_id()
  )
$$;

REVOKE EXECUTE ON FUNCTION public.current_institution_id() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_institution_student(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.current_institution_id() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_institution_student(uuid) TO authenticated;

DROP POLICY IF EXISTS "students own readable" ON public.students;
CREATE POLICY "students institution readable" ON public.students
  FOR SELECT TO authenticated
  USING (
    profile_id = public.current_profile_id()
    OR public.has_role(auth.uid(), 'industry')
    OR public.has_role(auth.uid(), 'admin')
    OR (public.has_role(auth.uid(), 'institution') AND institution_id = public.current_institution_id())
  );

DROP POLICY IF EXISTS "student_skills own readable" ON public.student_skills;
CREATE POLICY "student_skills institution readable" ON public.student_skills
  FOR SELECT TO authenticated
  USING (
    student_id = public.current_student_id()
    OR public.has_role(auth.uid(), 'industry')
    OR public.has_role(auth.uid(), 'admin')
    OR (public.has_role(auth.uid(), 'institution') AND public.is_institution_student(student_id))
  );

DROP POLICY IF EXISTS "projects own readable" ON public.projects;
CREATE POLICY "projects institution readable" ON public.projects
  FOR SELECT TO authenticated
  USING (
    student_id = public.current_student_id()
    OR public.has_role(auth.uid(), 'industry')
    OR public.has_role(auth.uid(), 'admin')
    OR (public.has_role(auth.uid(), 'institution') AND public.is_institution_student(student_id))
  );

DROP POLICY IF EXISTS "certs own readable" ON public.certifications;
CREATE POLICY "certs institution readable" ON public.certifications
  FOR SELECT TO authenticated
  USING (
    student_id = public.current_student_id()
    OR public.has_role(auth.uid(), 'industry')
    OR public.has_role(auth.uid(), 'admin')
    OR (public.has_role(auth.uid(), 'institution') AND public.is_institution_student(student_id))
  );

DROP POLICY IF EXISTS "applications own readable" ON public.applications;
CREATE POLICY "applications institution readable" ON public.applications
  FOR SELECT TO authenticated
  USING (
    student_id = public.current_student_id()
    OR public.has_role(auth.uid(), 'industry')
    OR public.has_role(auth.uid(), 'admin')
    OR (public.has_role(auth.uid(), 'institution') AND public.is_institution_student(student_id))
  );

DROP POLICY IF EXISTS "results own readable" ON public.assessment_results;
CREATE POLICY "results institution readable" ON public.assessment_results
  FOR SELECT TO authenticated
  USING (
    student_id = public.current_student_id()
    OR public.has_role(auth.uid(), 'industry')
    OR public.has_role(auth.uid(), 'admin')
    OR (public.has_role(auth.uid(), 'institution') AND public.is_institution_student(student_id))
  );
