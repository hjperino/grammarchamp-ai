-- 1) Drop the overly broad SELECT policy that lets any anon/auth user read any active code's results
DROP POLICY IF EXISTS "Students can view their own results by access code" ON public.exercise_results;

-- 2) Provide a SECURITY DEFINER function that returns results only for a validated, active code
CREATE OR REPLACE FUNCTION public.get_student_results(_code text)
RETURNS TABLE(
  id uuid,
  module_number integer,
  exercise_id text,
  correct boolean,
  created_at timestamptz,
  question text,
  user_answer text,
  correct_answer text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT er.id, er.module_number, er.exercise_id, er.correct, er.created_at,
         er.question, er.user_answer, er.correct_answer
  FROM public.exercise_results er
  JOIN public.access_codes ac ON ac.id = er.access_code_id
  WHERE ac.code = upper(_code)
    AND ac.is_active = true
  ORDER BY er.created_at DESC;
$$;

REVOKE ALL ON FUNCTION public.get_student_results(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_student_results(text) TO anon, authenticated;

-- 3) Same pattern for student progress overview (counts only)
CREATE OR REPLACE FUNCTION public.get_student_progress(_code text)
RETURNS TABLE(
  module_number integer,
  exercise_id text,
  correct boolean
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT er.module_number, er.exercise_id, er.correct
  FROM public.exercise_results er
  JOIN public.access_codes ac ON ac.id = er.access_code_id
  WHERE ac.code = upper(_code)
    AND ac.is_active = true;
$$;

REVOKE ALL ON FUNCTION public.get_student_progress(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_student_progress(text) TO anon, authenticated;