import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Exercise } from "@/components/ExerciseCard";

type Level = "basic" | "intermediate" | "advanced" | "mixed";

/**
 * When `interest` changes to a non-empty value, regenerate all exercises
 * via the AI edge function so they match the chosen topic.
 */
export function useInterestExercises(
  defaultExercises: Exercise[],
  interest: string,
  level: Level
) {
  const [exercises, setExercises] = useState<Exercise[]>(defaultExercises);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const lastInterestRef = useRef<string>("");

  useEffect(() => {
    const trimmed = interest.trim();
    if (!trimmed || trimmed === lastInterestRef.current) return;
    lastInterestRef.current = trimmed;

    let cancelled = false;
    const regenerate = async () => {
      setIsRegenerating(true);
      try {
        const accessCode =
          sessionStorage.getItem("student_access_code") || undefined;

        const results = await Promise.all(
          defaultExercises.map(async (ex) => {
            const { data, error } = await supabase.functions.invoke(
              "generate-exercise",
              {
                body: {
                  exerciseType: ex.type,
                  level,
                  interest: trimmed,
                  accessCode,
                },
              }
            );
            if (error || !data || data.error) return ex; // fall back to default
            return {
              id: ex.id,
              type: ex.type,
              question: data.question,
              answer: data.answer,
              hint: data.hint,
              options: data.options,
            } as Exercise;
          })
        );

        if (!cancelled) {
          setExercises(results);
          toast.success(`Exercises personalized for "${trimmed}"`);
        }
      } catch (err) {
        console.error("Failed to personalize exercises:", err);
        if (!cancelled) toast.error("Could not personalize all exercises");
      } finally {
        if (!cancelled) setIsRegenerating(false);
      }
    };

    regenerate();
    return () => {
      cancelled = true;
    };
  }, [interest, level, defaultExercises]);

  const replaceExercise = (id: number, newEx: Exercise) => {
    setExercises((prev) =>
      prev.map((ex) => (ex.id === id ? { ...newEx, id } : ex))
    );
  };

  return { exercises, isRegenerating, replaceExercise };
}
