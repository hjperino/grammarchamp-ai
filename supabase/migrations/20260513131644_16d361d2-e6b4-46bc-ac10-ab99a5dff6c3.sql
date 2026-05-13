
-- Allow students authenticated by an active access code to read their own results
CREATE POLICY "Students can view their own results by access code"
ON public.exercise_results
FOR SELECT
TO anon, authenticated
USING (
  access_code_id IS NOT NULL
  AND public.is_access_code_active(access_code_id)
);

-- Aggregate benchmark function (no PII): per (module, exercise), total attempts and correctness
CREATE OR REPLACE FUNCTION public.get_exercise_benchmark()
RETURNS TABLE(
  module_number integer,
  exercise_id text,
  total_attempts bigint,
  correct_attempts bigint,
  accuracy numeric,
  participants bigint
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    module_number,
    exercise_id,
    COUNT(*)::bigint AS total_attempts,
    COUNT(*) FILTER (WHERE correct)::bigint AS correct_attempts,
    ROUND(100.0 * COUNT(*) FILTER (WHERE correct) / NULLIF(COUNT(*), 0), 1) AS accuracy,
    COUNT(DISTINCT COALESCE(access_code_id::text, user_id::text))::bigint AS participants
  FROM public.exercise_results
  GROUP BY module_number, exercise_id;
$$;

GRANT EXECUTE ON FUNCTION public.get_exercise_benchmark() TO anon, authenticated;
