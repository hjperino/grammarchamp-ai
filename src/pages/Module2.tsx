import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import ExerciseCard, { Exercise } from "@/components/ExerciseCard";
import { InterestSelector } from "@/components/InterestSelector";
import { GrammarHelp } from "@/components/GrammarHelp";
import { ArrowLeft, BookOpen, GraduationCap } from "lucide-react";
import { toast } from "sonner";

const Module2 = () => {
  const [completedExercises, setCompletedExercises] = useState(0);
  const [interest, setInterest] = useState("");
  const totalExercises = 10;

  const [exercises, setExercises] = useState<Exercise[]>([
    {
      id: 1,
      question: "She admitted ___ (steal) the money.",
      answer: "stealing",
      hint: "Use gerund after 'admit'",
      type: "fill-in"
    },
    {
      id: 2,
      question: "They agreed ___ (help) us.",
      answer: "to help",
      hint: "Use infinitive after 'agree'",
      type: "fill-in"
    },
    {
      id: 3,
      question: "Choose the correct form: I can't stand ___ in line.",
      answer: "waiting",
      options: ["to wait", "waiting", "wait", "waited"],
      type: "multiple-choice"
    },
    {
      id: 4,
      question: "He denied ___ (break) the window.",
      answer: "breaking",
      hint: "Use gerund after 'deny'",
      type: "fill-in"
    },
    {
      id: 5,
      question: "We expect ___ (arrive) by noon.",
      answer: "to arrive",
      hint: "Use infinitive after 'expect'",
      type: "fill-in"
    },
    {
      id: 6,
      question: "Choose the correct form: She considers ___ abroad.",
      answer: "moving",
      options: ["to move", "moving", "move", "moved"],
      type: "multiple-choice"
    },
    {
      id: 7,
      question: "They promise ___ (be) on time.",
      answer: "to be",
      hint: "Use infinitive after 'promise'",
      type: "fill-in"
    },
    {
      id: 8,
      question: "I miss ___ (live) in the countryside.",
      answer: "living",
      hint: "Use gerund after 'miss'",
      type: "fill-in"
    },
    {
      id: 9,
      question: "Choose the correct form: We refuse ___ late.",
      answer: "to work",
      options: ["working", "to work", "work", "worked"],
      type: "multiple-choice"
    },
    {
      id: 10,
      question: "He postponed ___ (make) the decision.",
      answer: "making",
      hint: "Use gerund after 'postpone'",
      type: "fill-in"
    }
  ]);

  const handleNewExercise = (exerciseId: number, newExercise: Exercise) => {
    setExercises(prev => 
      prev.map(ex => ex.id === exerciseId ? { ...newExercise, id: exerciseId } : ex)
    );
  };

  const handleExerciseComplete = (correct: boolean) => {
    if (correct && completedExercises < totalExercises) {
      setCompletedExercises(prev => prev + 1);
      toast.success("Excellent work!", {
        description: "You're making great progress!"
      });
    }
  };

  const progressPercentage = (completedExercises / totalExercises) * 100;

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
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-secondary" />
            <span className="font-semibold">Module 2: Intermediate Level</span>
          </div>
          <div className="w-32" />
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Your Progress</span>
              <span className="text-sm text-muted-foreground">
                {completedExercises} / {totalExercises} exercises
              </span>
            </div>
            <Progress value={progressPercentage} />
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <InterestSelector value={interest} onChange={setInterest} />
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-secondary" />
              Common Verb Patterns
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Verbs Followed by Gerunds</h3>
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <p className="text-sm text-muted-foreground mb-2">
                  These verbs are always followed by gerunds (-ing form):
                </p>
                <p><strong>admit, avoid, consider, deny, enjoy, finish, keep, mind, miss, postpone, practice, suggest</strong></p>
                <p className="text-sm mt-2">Examples:</p>
                <p>• She <strong>admitted stealing</strong> the money.</p>
                <p>• I <strong>miss living</strong> by the beach.</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Verbs Followed by Infinitives</h3>
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <p className="text-sm text-muted-foreground mb-2">
                  These verbs are always followed by infinitives (to + verb):
                </p>
                <p><strong>agree, decide, expect, hope, plan, promise, refuse, want, wish</strong></p>
                <p className="text-sm mt-2">Examples:</p>
                <p>• They <strong>agreed to help</strong> us.</p>
                <p>• We <strong>expect to arrive</strong> by noon.</p>
              </div>
            </div>

            <div className="bg-secondary/10 border border-secondary/20 p-4 rounded-lg">
              <h4 className="font-semibold mb-2 text-secondary">Common Mistakes to Avoid:</h4>
              <ul className="space-y-2 text-sm">
                <li>• ❌ I enjoy to read → ✅ I enjoy reading</li>
                <li>• ❌ She wants visiting → ✅ She wants to visit</li>
                <li>• ❌ They avoid to exercise → ✅ They avoid exercising</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Practice Exercises</h2>
          {exercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              onComplete={handleExerciseComplete}
              moduleNumber={2}
              level="intermediate"
              onNewExercise={(newEx) => handleNewExercise(exercise.id, newEx)}
              interest={interest}
            />
          ))}
        </div>

        <div className="mt-8 flex justify-between">
          <Link to="/module/1">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous: Module 1
            </Button>
          </Link>
          <Link to="/module/3">
            <Button variant="secondary">
              Next: Module 3
            </Button>
          </Link>
        </div>
      </div>
      <GrammarHelp />
    </div>
  );
};

export default Module2;
