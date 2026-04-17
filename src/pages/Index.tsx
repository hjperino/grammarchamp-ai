import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Target, Trophy, List, Sparkles, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { StudentProgressOverview } from "@/components/StudentProgressOverview";

const Index = () => {
  const navigate = useNavigate();
  const [studentCode, setStudentCode] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const code = sessionStorage.getItem("student_access_code");
    setStudentCode(code);
    
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // If neither student nor teacher, redirect to landing
  useEffect(() => {
    const code = sessionStorage.getItem("student_access_code");
    if (!code && !user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem("student_access_code_id");
    sessionStorage.removeItem("student_access_code");
    navigate("/");
  };

  const progress = 0;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="absolute top-4 right-4 z-20 flex gap-2 items-center">
        {studentCode && (
          <span className="text-sm text-muted-foreground mr-2">Code: {studentCode}</span>
        )}
        <Button variant="outline" size="sm" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" />
          Beenden
        </Button>
      </div>

      {/* Hero Section */}
      <section 
        className="py-20 px-4 text-center relative overflow-hidden"
        style={{ background: 'var(--gradient-hero)' }}
      >
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6 border border-primary/20">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Master English Grammar</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Gerunds vs. Infinitives
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Interactive English grammar course with exercises, detailed explanations, and progress tracking
          </p>
          
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/module/1">
              <Button variant="hero" size="lg">
                <BookOpen className="w-5 h-5" />
                Start Learning
              </Button>
            </Link>
            <Link to="/reference">
              <Button variant="outline" size="lg">
                <List className="w-5 h-5" />
                Reference Guide
              </Button>
            </Link>
          </div>
          
          {progress > 0 && (
            <div className="mt-8 max-w-md mx-auto">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">Your Progress</span>
                <span className="text-muted-foreground">{progress}%</span>
              </div>
              <Progress value={progress} />
            </div>
          )}
        </div>
      </section>

      {/* Course Modules */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <StudentProgressOverview />
        <h2 className="text-3xl font-bold text-center mb-12">Course Modules</h2>
        
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Link to="/module/1">
            <Card className="h-full hover:border-primary transition-colors cursor-pointer group">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Basic Level</CardTitle>
                <CardDescription>Module 1</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Learn the fundamentals of gerunds and infinitives, when to use each form, and practice with interactive exercises.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/module/2">
            <Card className="h-full hover:border-primary transition-colors cursor-pointer group">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4 group-hover:bg-secondary/20 transition-colors">
                  <BookOpen className="w-6 h-6 text-secondary" />
                </div>
                <CardTitle>Intermediate Level</CardTitle>
                <CardDescription>Module 2</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Dive deeper into usage patterns, common mistakes, and exceptions.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/module/3">
            <Card className="h-full hover:border-primary transition-colors cursor-pointer group">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                  <Trophy className="w-6 h-6 text-accent" />
                </div>
                <CardTitle>Advanced Level</CardTitle>
                <CardDescription>Module 3</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Master native-level nuances, tricky exceptions, and subtle meaning changes.
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
