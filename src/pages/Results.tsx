import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, TrendingUp, Award, Target } from "lucide-react";
import { toast } from "sonner";

interface ModuleStats {
  moduleNumber: number;
  total: number;
  correct: number;
  percentage: number;
}

const Results = () => {
  const [moduleStats, setModuleStats] = useState<ModuleStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    fetchResults();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }
    setUserEmail(user.email || "");
  };

  const fetchResults = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('exercise_results')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      // Group by module and calculate stats
      const statsByModule: { [key: number]: { total: number; correct: number } } = {};
      
      data?.forEach((result) => {
        if (!statsByModule[result.module_number]) {
          statsByModule[result.module_number] = { total: 0, correct: 0 };
        }
        statsByModule[result.module_number].total++;
        if (result.correct) {
          statsByModule[result.module_number].correct++;
        }
      });

      const stats: ModuleStats[] = Object.entries(statsByModule).map(([module, stats]) => ({
        moduleNumber: parseInt(module),
        total: stats.total,
        correct: stats.correct,
        percentage: Math.round((stats.correct / stats.total) * 100),
      }));

      stats.sort((a, b) => a.moduleNumber - b.moduleNumber);
      setModuleStats(stats);
    } catch (error: any) {
      toast.error("Failed to load results");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const getModuleName = (num: number) => {
    const names: { [key: number]: string } = {
      1: "Basic Level",
      2: "Intermediate Level",
      3: "Advanced Level",
      4: "Mixed Exercises",
    };
    return names[num] || `Module ${num}`;
  };

  const totalExercises = moduleStats.reduce((sum, stat) => sum + stat.total, 0);
  const totalCorrect = moduleStats.reduce((sum, stat) => sum + stat.correct, 0);
  const overallPercentage = totalExercises > 0 ? Math.round((totalCorrect / totalExercises) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{userEmail}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Your Progress</h1>
          <p className="text-muted-foreground">Track your learning journey</p>
        </div>

        {loading ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Loading your results...</p>
            </CardContent>
          </Card>
        ) : moduleStats.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Award className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium mb-2">No exercises completed yet</p>
              <p className="text-muted-foreground mb-6">Start practicing to see your progress!</p>
              <Link to="/">
                <Button>Start Learning</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Overall Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-4xl font-bold text-primary">{overallPercentage}%</p>
                    <p className="text-muted-foreground">Success Rate</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-semibold">{totalCorrect} / {totalExercises}</p>
                    <p className="text-muted-foreground">Exercises Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {moduleStats.map((stat) => (
              <Card key={stat.moduleNumber}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-secondary" />
                      Module {stat.moduleNumber}: {getModuleName(stat.moduleNumber)}
                    </span>
                    <span className="text-primary">{stat.percentage}%</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Progress</span>
                    <span className="text-sm font-medium">{stat.correct} / {stat.total} correct</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full transition-all duration-500"
                      style={{ width: `${stat.percentage}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;
