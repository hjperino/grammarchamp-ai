ALTER TABLE public.exercise_results
ADD COLUMN question text,
ADD COLUMN user_answer text,
ADD COLUMN correct_answer text;