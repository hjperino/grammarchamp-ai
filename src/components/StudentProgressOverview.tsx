import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Trophy } from "lucide-react";

const MODULES = [
  { number: 1, title: "Module 1 — Basic Level", total: 10 },
  { number: 2, title: "Module 2 — Intermediate Level", total: 10 },
  { number: 3, title: "Module 3 — Advanced Level", total: 9 },
  { number: 4, title: "Module 4 — Mixed Practice", total: 10 },
];

export const StudentProgressOverview = () => {
  const [accessCodeId, setAccessCodeId] = useState<string | null>(null);
  const [masteredByModule, setMasteredByModule] = useState<Record<number, Set<string>>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = sessionStorage.getItem("student_access_code_id");
    setAccessCodeId(id);
    if (!id) {
      setLoading(false);
      return;
    }

    const load = async () => {
      const { data, error } = await supabase
        .from("exercise_results")
        .select("module_number, exercise_id, correct")
        .eq("access_code_id", id)
        .eq("correct", true);

      if (!error && data) {
        const grouped: Record<number, Set<string>> = {};
        for (const row of data) {
          if (!grouped[row.module_number]) grouped[row.module_number] = new Set();
          grouped[row.module_number].add(row.exercise_id);
        }
        setMasteredByModule(grouped);
      }
      setLoading(false);
    };

    load();
  }, []);

  if (!accessCodeId) return null;

  const totalMastered = Object.values(masteredByModule).reduce(
    (sum, s) => sum + s.size,
    0
  );
  const totalExercises = MODULES.reduce((sum, m) => sum + m.total, 0);

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary" />
          Your Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading your progress…</p>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall</span>
              <span className="text-sm text-muted-foreground">
                {totalMastered} / {totalExercises} mastered
              </span>
            </div>
            <Progress value={(totalMastered / totalExercises) * 100} />

            <div className="grid gap-4 md:grid-cols-2 mt-4">
              {MODULES.map((m) => {
                const mastered = masteredByModule[m.number]?.size ?? 0;
                const pct = (mastered / m.total) * 100;
                const complete = mastered >= m.total;
                return (
                  <div
                    key={m.number}
                    className="rounded-lg border p-4 space-y-2 bg-card"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm flex items-center gap-2">
                        {complete && (
                          <CheckCircle2 className="w-4 h-4 text-primary" />
                        )}
                        {m.title}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {mastered} / {m.total}
                      </span>
                    </div>
                    <Progress value={pct} />
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              An exercise counts as mastered as soon as you've answered it correctly at least once.
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
};
