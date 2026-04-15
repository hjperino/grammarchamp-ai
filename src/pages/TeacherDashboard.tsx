import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface AccessCode {
  id: string;
  code: string;
  label: string;
  is_active: boolean;
  created_at: string;
}

interface ExerciseResult {
  id: string;
  module_number: number;
  exercise_id: string;
  correct: boolean;
  created_at: string | null;
  access_code_id: string | null;
}

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [codes, setCodes] = useState<AccessCode[]>([]);
  const [newLabel, setNewLabel] = useState("");
  const [selectedCode, setSelectedCode] = useState<AccessCode | null>(null);
  const [studentResults, setStudentResults] = useState<ExerciseResult[]>([]);
  const [activeTab, setActiveTab] = useState("codes");
  const [codeStats, setCodeStats] = useState<Record<string, { total: number; correct: number }>>({});

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) navigate("/teacher/login");
      else setUser(session.user);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/teacher/login");
        return;
      }
      setUser(session.user);
      loadCodes();
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadCodes = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    const { data } = await supabase
      .from("access_codes")
      .select("*")
      .eq("teacher_id", user.id)
      .order("created_at", { ascending: false });
    
    if (data) {
      setCodes(data as AccessCode[]);
      loadAllStats(data as AccessCode[]);
    }
  };

  const loadAllStats = async (codesList: AccessCode[]) => {
    if (codesList.length === 0) return;
    
    const { data: results } = await supabase
      .from("exercise_results")
      .select("access_code_id, correct")
      .in("access_code_id", codesList.map(c => c.id));

    if (!results) return;

    const stats: Record<string, { total: number; correct: number }> = {};
    results.forEach((r: any) => {
      if (!r.access_code_id) return;
      if (!stats[r.access_code_id]) stats[r.access_code_id] = { total: 0, correct: 0 };
      stats[r.access_code_id].total++;
      if (r.correct) stats[r.access_code_id].correct++;
    });
    setCodeStats(stats);
  };

  const generateCode = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const createCode = async () => {
    if (!user) return;
    const code = generateCode();
    const { error } = await supabase.from("access_codes").insert({
      teacher_id: user.id,
      code,
      label: newLabel || `Lernende/r ${codes.length + 1}`,
    });
    if (error) {
      toast.error("Fehler beim Erstellen des Codes");
      return;
    }
    setNewLabel("");
    toast.success(`Code ${code} erstellt!`);
    loadCodes();
  };

  const toggleCodeActive = async (codeItem: AccessCode) => {
    await supabase
      .from("access_codes")
      .update({ is_active: !codeItem.is_active })
      .eq("id", codeItem.id);
    loadCodes();
  };

  const loadStudentResults = async (codeItem: AccessCode) => {
    setSelectedCode(codeItem);
    setActiveTab("answers");

    const { data } = await supabase
      .from("exercise_results")
      .select("*")
      .eq("access_code_id", codeItem.id)
      .order("created_at", { ascending: true });

    setStudentResults((data as ExerciseResult[]) || []);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/teacher/login");
  };

  const studentUrl = `${window.location.origin}/student`;

  if (!user) return null;

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container flex h-14 items-center justify-between">
          <h1 className="text-lg font-semibold">📚 Lehrperson-Portal</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{user.email}</span>
            <Button size="sm" variant="ghost" onClick={handleLogout}>Abmelden</Button>
          </div>
        </div>
      </header>

      <div className="container py-6">
        <div className="mb-6 rounded-lg border bg-muted/50 p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Link für Lernende:</p>
            <code className="text-xs text-muted-foreground">{studentUrl}</code>
          </div>
          <Button size="sm" variant="outline" onClick={() => {
            navigator.clipboard.writeText(studentUrl);
            toast.success("Link kopiert!");
          }}>
            Link kopieren
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="codes">Zugangscodes</TabsTrigger>
            <TabsTrigger value="overview">Fortschrittsübersicht</TabsTrigger>
            <TabsTrigger value="answers">Ergebnisse einsehen</TabsTrigger>
          </TabsList>

          <TabsContent value="codes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Neuen Code erstellen</CardTitle>
                <CardDescription>Erstellen Sie Codes für Ihre Lernenden.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <Input
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    placeholder="Name/Bezeichnung (z.B. Max Muster)"
                    className="flex-1"
                  />
                  <Button onClick={createCode}>Code erstellen</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ihre Codes</CardTitle>
                <CardDescription>Übersicht aller erstellten Zugangscodes</CardDescription>
              </CardHeader>
              <CardContent>
                {codes.length === 0 ? (
                  <p className="text-muted-foreground text-sm">Noch keine Codes erstellt.</p>
                ) : (
                  <div className="space-y-2">
                    {codes.map(c => (
                      <div key={c.id} className="flex items-center justify-between rounded-lg border p-3">
                        <div className="flex items-center gap-3">
                          <code className="rounded bg-muted px-2 py-1 font-mono text-lg font-bold tracking-wider">
                            {c.code}
                          </code>
                          <span className="text-sm">{c.label}</span>
                          <Badge variant={c.is_active ? "default" : "secondary"}>
                            {c.is_active ? "Aktiv" : "Inaktiv"}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => loadStudentResults(c)}>
                            Ergebnisse
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => toggleCodeActive(c)}>
                            {c.is_active ? "Deaktivieren" : "Aktivieren"}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Fortschritt aller Lernenden</CardTitle>
                <CardDescription>Übersicht über den Bearbeitungsstand</CardDescription>
              </CardHeader>
              <CardContent>
                {codes.length === 0 ? (
                  <p className="text-muted-foreground text-sm">Noch keine Codes erstellt.</p>
                ) : (
                  <div className="space-y-4">
                    {codes.map(c => {
                      const stats = codeStats[c.id];
                      const total = stats?.total ?? 0;
                      const correct = stats?.correct ?? 0;
                      const percent = total > 0 ? Math.round((correct / total) * 100) : 0;
                      return (
                        <div key={c.id} className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{c.label}</span>
                              <code className="text-xs text-muted-foreground font-mono">{c.code}</code>
                              {!c.is_active && <Badge variant="secondary" className="text-xs">Inaktiv</Badge>}
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {total} Übungen, {correct} richtig ({percent}%)
                            </span>
                          </div>
                          <Progress value={percent} className="h-2" />
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="answers" className="space-y-6">
            {!selectedCode ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">Wählen Sie einen Code aus der Code-Übersicht, um die Ergebnisse einzusehen.</p>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold">Ergebnisse: {selectedCode.label}</h2>
                    <p className="text-sm text-muted-foreground">Code: {selectedCode.code}</p>
                  </div>
                  <Button variant="outline" onClick={() => setSelectedCode(null)}>
                    Zurück
                  </Button>
                </div>

                {studentResults.length === 0 ? (
                  <Card>
                    <CardContent className="py-8 text-center">
                      <p className="text-muted-foreground">Noch keine Ergebnisse vorhanden.</p>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-2">
                        <div className="grid grid-cols-4 gap-4 text-sm font-medium text-muted-foreground border-b pb-2">
                          <span>Modul</span>
                          <span>Übung</span>
                          <span>Ergebnis</span>
                          <span>Datum</span>
                        </div>
                        {studentResults.map(r => (
                          <div key={r.id} className="grid grid-cols-4 gap-4 text-sm py-2 border-b last:border-0">
                            <span>Modul {r.module_number}</span>
                            <span>Übung {r.exercise_id}</span>
                            <Badge variant={r.correct ? "default" : "destructive"}>
                              {r.correct ? "Richtig" : "Falsch"}
                            </Badge>
                            <span className="text-muted-foreground">
                              {r.created_at ? new Date(r.created_at).toLocaleDateString("de-CH") : "-"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
