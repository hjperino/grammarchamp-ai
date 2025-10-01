import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Target, Trophy, List, Sparkles } from "lucide-react";

const Index = () => {
  const progress = 0; // This will be dynamic with actual progress tracking

  return (
    <div className="min-h-screen">
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
        <h2 className="text-3xl font-bold text-center mb-12">Course Modules</h2>
        
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Module 1 */}
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
                <ul className="text-sm space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    What are gerunds?
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    What are infinitives?
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    10 interactive exercises
                  </li>
                </ul>
              </CardContent>
            </Card>
          </Link>

          {/* Module 2 */}
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
                  Dive deeper into usage patterns, common mistakes, and exceptions. Master verb patterns with gerunds and infinitives.
                </p>
                <ul className="text-sm space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                    Common verb patterns
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                    Avoiding mistakes
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                    10 practice exercises
                  </li>
                </ul>
              </CardContent>
            </Card>
          </Link>

          {/* Module 3 */}
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
                  Master native-level nuances, tricky exceptions, and subtle meaning changes. Complete with a comprehensive final test.
                </p>
                <ul className="text-sm space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                    Subtle differences
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                    Meaning changes
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                    Final comprehensive test
                  </li>
                </ul>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose This Course?</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <BookOpen className="w-8 h-8 text-primary mb-2" />
                <CardTitle className="text-lg">Clear Explanations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Step-by-step lessons with examples and multilingual support
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Target className="w-8 h-8 text-secondary mb-2" />
                <CardTitle className="text-lg">Interactive Practice</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Self-correcting exercises with instant feedback
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Trophy className="w-8 h-8 text-accent mb-2" />
                <CardTitle className="text-lg">Track Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Monitor your improvement and earn achievements
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <List className="w-8 h-8 text-primary mb-2" />
                <CardTitle className="text-lg">Complete Reference</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Comprehensive lists and quick-reference guides
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
