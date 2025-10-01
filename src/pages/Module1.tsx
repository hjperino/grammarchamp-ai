import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import ExerciseCard, { Exercise } from "@/components/ExerciseCard";
import { ArrowLeft, BookOpen, GraduationCap } from "lucide-react";
import { toast } from "sonner";

const Module1 = () => {
  const [completedExercises, setCompletedExercises] = useState(0);
  const totalExercises = 10;

  const exercises: Exercise[] = [
    {
      id: 1,
      question: "I enjoy ___ (read) books before bed.",
      answer: "reading",
      hint: "Use the -ing form after 'enjoy'",
      type: "fill-in"
    },
    {
      id: 2,
      question: "She wants ___ (learn) Spanish.",
      answer: "to learn",
      hint: "Use 'to + verb' after 'want'",
      type: "fill-in"
    },
    {
      id: 3,
      question: "They avoid ___ (eat) fast food.",
      answer: "eating",
      hint: "Use the -ing form after 'avoid'",
      type: "fill-in"
    },
    {
      id: 4,
      question: "Choose the correct form: I decided ___ early.",
      answer: "to leave",
      options: ["leaving", "to leave", "leave", "left"],
      type: "multiple-choice"
    },
    {
      id: 5,
      question: "He suggested ___ (go) to the park.",
      answer: "going",
      hint: "Use the -ing form after 'suggest'",
      type: "fill-in"
    },
    {
      id: 6,
      question: "We plan ___ (visit) Paris next summer.",
      answer: "to visit",
      hint: "Use 'to + verb' after 'plan'",
      type: "fill-in"
    },
    {
      id: 7,
      question: "Choose the correct form: She finished ___ her homework.",
      answer: "doing",
      options: ["doing", "to do", "do", "did"],
      type: "multiple-choice"
    },
    {
      id: 8,
      question: "I hope ___ (see) you soon.",
      answer: "to see",
      hint: "Use 'to + verb' after 'hope'",
      type: "fill-in"
    },
    {
      id: 9,
      question: "They keep ___ (ask) the same question.",
      answer: "asking",
      hint: "Use the -ing form after 'keep'",
      type: "fill-in"
    },
    {
      id: 10,
      question: "Choose the correct form: We offered ___ them.",
      answer: "to help",
      options: ["helping", "to help", "help", "helped"],
      type: "multiple-choice"
    }
  ];

  const handleExerciseComplete = (correct: boolean) => {
    if (correct && completedExercises < totalExercises) {
      setCompletedExercises(prev => prev + 1);
      toast.success("Great job!", {
        description: "You answered correctly!"
      });
    }
  };

  const progressPercentage = (completedExercises / totalExercises) * 100;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-primary" />
            <span className="font-semibold">Module 1: Basic Level</span>
          </div>
          <div className="w-32" />
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress */}
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

        {/* Lesson Content */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              What are Gerunds and Infinitives?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Gerund (-ing form)</h3>
              <p className="text-muted-foreground mb-2">
                A gerund is the -ing form of a verb used as a noun. It can be the subject or object of a sentence.
              </p>
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <p><strong>Examples:</strong></p>
                <p>• <strong>Swimming</strong> is my favorite sport.</p>
                <p>• I enjoy <strong>reading</strong> books.</p>
                <p>• She finished <strong>writing</strong> the report.</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Infinitive (to + base verb)</h3>
              <p className="text-muted-foreground mb-2">
                An infinitive is "to" + the base form of a verb. It can express purpose or follow certain verbs.
              </p>
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <p><strong>Examples:</strong></p>
                <p>• I want <strong>to learn</strong> French.</p>
                <p>• She decided <strong>to travel</strong> abroad.</p>
                <p>• We hope <strong>to see</strong> you soon.</p>
              </div>
            </div>

            <div className="bg-primary/10 border border-primary/20 p-4 rounded-lg">
              <h4 className="font-semibold mb-2 text-primary">Key Rules:</h4>
              <ul className="space-y-2 text-sm">
                <li>• Some verbs are followed by gerunds: enjoy, finish, avoid, suggest, mind</li>
                <li>• Some verbs are followed by infinitives: want, decide, hope, plan, offer</li>
                <li>• <em className="text-muted-foreground">French: Un gérondif est la forme -ing utilisée comme nom</em></li>
                <li>• <em className="text-muted-foreground">Spanish: Un gerundio es la forma -ing usada como sustantivo</em></li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Exercises */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Practice Exercises</h2>
          {exercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              onComplete={handleExerciseComplete}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="mt-8 flex justify-between">
          <Link to="/">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <Link to="/module/2">
            <Button variant="secondary">
              Next: Module 2
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Module1;
