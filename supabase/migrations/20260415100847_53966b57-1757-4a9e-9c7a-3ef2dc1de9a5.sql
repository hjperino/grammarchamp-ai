
-- Create access_codes table
CREATE TABLE public.access_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  code TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL DEFAULT '',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.access_codes ENABLE ROW LEVEL SECURITY;

-- Anyone can read codes (students need to validate)
CREATE POLICY "Anyone can read active codes"
ON public.access_codes
FOR SELECT
USING (true);

-- Teachers can manage their own codes
CREATE POLICY "Teachers can create codes"
ON public.access_codes
FOR INSERT
WITH CHECK (auth.uid() = teacher_id);

CREATE POLICY "Teachers can update their codes"
ON public.access_codes
FOR UPDATE
USING (auth.uid() = teacher_id);

CREATE POLICY "Teachers can delete their codes"
ON public.access_codes
FOR DELETE
USING (auth.uid() = teacher_id);

-- Add access_code_id to exercise_results and make user_id nullable
ALTER TABLE public.exercise_results
ADD COLUMN access_code_id UUID REFERENCES public.access_codes(id) ON DELETE CASCADE;

ALTER TABLE public.exercise_results
ALTER COLUMN user_id DROP NOT NULL;

-- Drop old RLS policies on exercise_results
DROP POLICY IF EXISTS "Users can insert their own results" ON public.exercise_results;
DROP POLICY IF EXISTS "Users can view their own results" ON public.exercise_results;

-- New RLS policies for exercise_results: support both authenticated users and anonymous students
CREATE POLICY "Authenticated users can insert their own results"
ON public.exercise_results
FOR INSERT
WITH CHECK (
  (auth.uid() IS NOT NULL AND auth.uid() = user_id)
  OR
  (access_code_id IS NOT NULL AND user_id IS NULL)
);

CREATE POLICY "Authenticated users can view their own results"
ON public.exercise_results
FOR SELECT
USING (
  (auth.uid() IS NOT NULL AND auth.uid() = user_id)
  OR
  (access_code_id IS NOT NULL)
);
