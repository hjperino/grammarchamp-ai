-- 1) Secure access_codes SELECT: only teachers can see their own codes
DROP POLICY IF EXISTS "Anyone can read active codes" ON public.access_codes;

CREATE POLICY "Teachers can view their own codes"
ON public.access_codes
FOR SELECT
USING (auth.uid() = teacher_id);

-- 2) SECURITY DEFINER function for anonymous student code validation
CREATE OR REPLACE FUNCTION public.validate_access_code(_code text)
RETURNS TABLE(id uuid, code text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT ac.id, ac.code
  FROM public.access_codes ac
  WHERE ac.code = upper(_code)
    AND ac.is_active = true
  LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.validate_access_code(text) TO anon, authenticated;

-- 3) Tighten exercise_results SELECT: own results OR teacher of the access code
DROP POLICY IF EXISTS "Authenticated users can view their own results" ON public.exercise_results;

CREATE POLICY "Users and teachers can view results"
ON public.exercise_results
FOR SELECT
USING (
  (auth.uid() IS NOT NULL AND auth.uid() = user_id)
  OR EXISTS (
    SELECT 1 FROM public.access_codes ac
    WHERE ac.id = exercise_results.access_code_id
      AND ac.teacher_id = auth.uid()
  )
);

-- 4) Tighten exercise_results INSERT: require active access code
DROP POLICY IF EXISTS "Authenticated users can insert their own results" ON public.exercise_results;

CREATE POLICY "Users and students can insert results"
ON public.exercise_results
FOR INSERT
WITH CHECK (
  (auth.uid() IS NOT NULL AND auth.uid() = user_id)
  OR (
    user_id IS NULL
    AND access_code_id IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.access_codes ac
      WHERE ac.id = access_code_id
        AND ac.is_active = true
    )
  )
);