-- Students must only read their own applications and assessment results.
DROP POLICY IF EXISTS "profiles readable" ON public.profiles;
CREATE POLICY "profiles own readable" ON public.profiles
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR NOT public.has_role(auth.uid(), 'student'));

DROP POLICY IF EXISTS "students readable" ON public.students;
CREATE POLICY "students own readable" ON public.students
  FOR SELECT TO authenticated
  USING (profile_id = public.current_profile_id() OR NOT public.has_role(auth.uid(), 'student'));

DROP POLICY IF EXISTS "student_skills readable" ON public.student_skills;
CREATE POLICY "student_skills own readable" ON public.student_skills
  FOR SELECT TO authenticated
  USING (student_id = public.current_student_id() OR NOT public.has_role(auth.uid(), 'student'));

DROP POLICY IF EXISTS "projects readable" ON public.projects;
CREATE POLICY "projects own readable" ON public.projects
  FOR SELECT TO authenticated
  USING (student_id = public.current_student_id() OR NOT public.has_role(auth.uid(), 'student'));

DROP POLICY IF EXISTS "certs readable" ON public.certifications;
CREATE POLICY "certs own readable" ON public.certifications
  FOR SELECT TO authenticated
  USING (student_id = public.current_student_id() OR NOT public.has_role(auth.uid(), 'student'));

DROP POLICY IF EXISTS "applications readable" ON public.applications;
CREATE POLICY "applications own readable" ON public.applications
  FOR SELECT TO authenticated
  USING (student_id = public.current_student_id() OR NOT public.has_role(auth.uid(), 'student'));

DROP POLICY IF EXISTS "results readable" ON public.assessment_results;
CREATE POLICY "results own readable" ON public.assessment_results
  FOR SELECT TO authenticated
  USING (student_id = public.current_student_id() OR NOT public.has_role(auth.uid(), 'student'));
