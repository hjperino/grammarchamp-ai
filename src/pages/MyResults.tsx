import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Trophy, Users } from "lucide-react";

interface ExerciseResult {
  id: string;
  module_number: number;
  exercise_id: string;
  correct: boolean;
  created_at: string | null;
  question: string | null;
  user_answer: string | null;
  correct_answer: string | null;
}

interface BenchmarkRow {
  module_number: number;
  exercise_id: string;
  total_attempts: number;
  correct_attempts: number;
  accuracy: number | null;
  participants: number;
}

const MODULES = [
  { number: 1, title: "Modul 1 — Basic Level" },
  { number: 2, title: "Modul 2 — Intermediate Level" },
  { number: 3, title: "Modul 3 — Advanced Level" },
  { number: 4, title: "Modul 4 — Mixed Practice" },
];

export default function MyResults() {
  const navigate = useNavigate();
  const [results, setResults] = useState<ExerciseResult[]>([]);
  const [benchmark, setBenchmark] = useState<BenchmarkRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const accessCode = sessionStorage.getItem("student_access_code");

    const load = async () => {
      let resData: ExerciseResult[] | null = null;

      if (accessCode) {
        const { data } = await supabase.rpc("get_student_results", { _code: accessCode });
        resData = (data as ExerciseResult[]) || [];
      } else {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate("/");
          return;
        }
        const { data } = await supabase
          .from("exercise_results")
          .select("id, module_number, exercise_id, correct, created_at, question, user_answer, correct_answer")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
        resData = (data as ExerciseResult[]) || [];
      }

      const { data: bmData } = await supabase.rpc("get_exercise_benchmark");

      setResults(resData || []);
      setBenchmark((bmData as BenchmarkRow[]) || []);
      setLoading(false);
    };

    load();
  }, [navigate]);

  const benchmarkMap = useMemo(() => {
    const m: Record<string, BenchmarkRow> = {};
    benchmark.forEach(b => {
      m[`${b.module_number}-${b.exercise_id}`] = b;
    });
    return m;
  }, [benchmark]);

  const overall = useMemo(() => {
    const total = results.length;
    const correct = results.filter(r => r.correct).length;
    const myAcc = total > 0 ? Math.round((correct / total) * 100) : 0;

    // Group benchmark over the same exercises the student attempted
    const attemptedKeys = new Set(results.map(r => `${r.module_number}-${r.exercise_id}`));
    const relevant = benchmark.filter(b => attemptedKeys.has(`${b.module_number}-${b.exercise_id}`));
    const groupTotal = relevant.reduce((s, b) => s + Number(b.total_attempts), 0);
    const groupCorrect = relevant.reduce((s, b) => s + Number(b.correct_attempts), 0);
    const groupAcc = groupTotal > 0 ? Math.round((groupCorrect / groupTotal) * 100) : 0;

    return { total, correct, myAcc, groupAcc };
  }, [results, benchmark]);

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background sticky top-0 z-10">
        <div className="container max-w-5xl flex h-14 items-center justify-between">
          <Link to="/home">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">Meine Ergebnisse</h1>
          <div className="w-20" />
        </div>
      </header>

      <div className="container max-w-5xl py-8 space-y-6">
        {loading ? (
          <Card><CardContent className="py-12 text-center text-muted-foreground">Lade Ergebnisse…</CardContent></Card>
        ) : results.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Trophy className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">Noch keine Ergebnisse. Beginnen Sie mit einer Übung!</p>
              <Link to="/home"><Button>Zu den Übungen</Button></Link>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-primary" />
                  Gesamtleistung
                </CardTitle>
                <CardDescription>Vergleich mit dem Durchschnitt aller Lernenden</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Du</p>
                    <p className="text-3xl font-bold text-primary">{overall.myAcc}%</p>
                    <p className="text-xs text-muted-foreground">{overall.correct}/{overall.total} richtig</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Users className="w-4 h-4" /> Gruppendurchschnitt
                    </p>
                    <p className="text-3xl font-bold">{overall.groupAcc}%</p>
                    <p className="text-xs text-muted-foreground">in den gleichen Übungen</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs"><span>Du</span><span>{overall.myAcc}%</span></div>
                  <Progress value={overall.myAcc} />
                  <div className="flex justify-between text-xs mt-2"><span>Gruppe</span><span>{overall.groupAcc}%</span></div>
                  <Progress value={overall.groupAcc} className="opacity-60" />
                </div>
              </CardContent>
            </Card>

            {MODULES.map(m => {
              const moduleResults = results.filter(r => r.module_number === m.number);
              if (moduleResults.length === 0) return null;
              const correctCount = moduleResults.filter(r => r.correct).length;
              return (
                <Card key={m.number}>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center justify-between">
                      <span>{m.title}</span>
                      <span className="text-sm font-normal text-muted-foreground">
                        {correctCount}/{moduleResults.length} richtig
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {moduleResults.map(r => {
                      const bm = benchmarkMap[`${r.module_number}-${r.exercise_id}`];
                      return (
                        <div
                          key={r.id}
                          className={`rounded-lg border-l-4 p-4 ${
                            r.correct ? "border-l-accent bg-accent/10" : "border-l-destructive bg-destructive/10"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                            <div className="text-xs text-muted-foreground">
                              Übung {r.exercise_id} · {r.created_at ? new Date(r.created_at).toLocaleString("de-CH") : "-"}
                            </div>
                            <div className="flex items-center gap-2">
                              {bm && (
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  Gruppe: {bm.accuracy ?? 0}% ({bm.participants} Teiln.)
                                </span>
                              )}
                              <Badge variant={r.correct ? "default" : "destructive"}>
                                {r.correct ? "Richtig" : "Falsch"}
                              </Badge>
                            </div>
                          </div>
                          {r.question && (
                            <p className="text-sm mb-2"><span className="font-medium">Frage:</span> {r.question}</p>
                          )}
                          <div className="grid sm:grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="font-medium">Deine Antwort: </span>
                              <span className={r.correct ? "text-accent font-semibold" : "text-destructive font-semibold"}>
                                {r.user_answer || "—"}
                              </span>
                            </div>
                            <div>
                              <span className="font-medium">Richtige Antwort: </span>
                              <span className="text-accent font-semibold">{r.correct_answer || "—"}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
