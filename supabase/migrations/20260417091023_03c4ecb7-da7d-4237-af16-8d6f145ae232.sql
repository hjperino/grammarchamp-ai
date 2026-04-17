-- Allow teachers to delete results belonging to their own access codes
CREATE POLICY "Teachers can delete results for their codes"
ON public.exercise_results
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.access_codes ac
    WHERE ac.id = exercise_results.access_code_id
      AND ac.teacher_id = auth.uid()
  )
);

-- Add cascading delete on the access_code_id foreign key
ALTER TABLE public.exercise_results
  DROP CONSTRAINT IF EXISTS exercise_results_access_code_id_fkey;

ALTER TABLE public.exercise_results
  ADD CONSTRAINT exercise_results_access_code_id_fkey
  FOREIGN KEY (access_code_id)
  REFERENCES public.access_codes(id)
  ON DELETE CASCADE;