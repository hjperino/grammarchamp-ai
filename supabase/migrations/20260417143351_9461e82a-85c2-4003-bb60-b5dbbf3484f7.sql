-- Create a SECURITY DEFINER helper that bypasses RLS on access_codes
-- so the INSERT policy on exercise_results can verify code activity for anonymous students.
CREATE OR REPLACE FUNCTION public.is_access_code_active(_code_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.access_codes
    WHERE id = _code_id AND is_active = true
  );
$$;

-- Replace the INSERT policy to use the SECURITY DEFINER function
DROP POLICY IF EXISTS "Users and students can insert results" ON public.exercise_results;

CREATE POLICY "Users and students can insert results"
ON public.exercise_results
FOR INSERT
TO anon, authenticated
WITH CHECK (
  ((auth.uid() IS NOT NULL) AND (auth.uid() = user_id))
  OR
  ((user_id IS NULL) AND (access_code_id IS NOT NULL) AND public.is_access_code_active(access_code_id))
);