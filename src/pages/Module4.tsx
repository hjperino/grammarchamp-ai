import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import ExerciseCard, { Exercise } from "@/components/ExerciseCard";
import { ArrowLeft, BookOpen, GraduationCap } from "lucide-react";
import { toast } from "sonner";

const Module4 = () => {
  const [completedExercises, setCompletedExercises] = useState(0);
  const totalExercises = 10;

  const [exercises, setExercises] = useState<Exercise[]>([
    {
      id: 1,
      question: "I stopped ___ (smoke) five years ago.",
      answer: "smoking",
      hint: "Use gerund when 'stop' means to quit doing something",
      type: "fill-in"
    },
    {
      id: 2,
      question: "Choose the correct form: She forgot ___ the door.",
      answer: "to lock",
      options: ["locking", "to lock", "lock", "locked"],
      hint: "Use infinitive when the action hasn't happened yet",
      type: "multiple-choice"
    },
    {
      id: 3,
      question: "He regrets ___ (not study) harder in school.",
      answer: "not studying",
      hint: "Use gerund when regretting past actions",
      type: "fill-in"
    },
    {
      id: 4,
      question: "Try ___ (add) more salt to the recipe.",
      answer: "adding",
      hint: "Use gerund when suggesting an experiment",
      type: "fill-in"
    },
    {
      id: 5,
      question: "Choose the correct form: I remember ___ my first day of school.",
      answer: "attending",
      options: ["to attend", "attending", "attend", "attended"],
      hint: "Use gerund when remembering past events",
      type: "multiple-choice"
    },
    {
      id: 6,
      question: "We stopped ___ (have) lunch at the café.",
      answer: "to have",
      hint: "Use infinitive when stopping to do something else",
      type: "fill-in"
    },
    {
      id: 7,
      question: "Choose the correct form: Don't forget ___ me tomorrow.",
      answer: "to call",
      options: ["calling", "to call", "call", "called"],
      hint: "Use infinitive for future actions",
      type: "multiple-choice"
    },
    {
      id: 8,
      question: "She went on ___ (talk) for hours.",
      answer: "talking",
      hint: "Use gerund when continuing the same action",
      type: "fill-in"
    },
    {
      id: 9,
      question: "I regret ___ (tell) you that we're sold out.",
      answer: "to tell",
      hint: "Use infinitive when expressing regret about present news",
      type: "fill-in"
    },
    {
      id: 10,
      question: "Choose the correct form: He tried ___ the window, but it was stuck.",
      answer: "to open",
      options: ["opening", "to open", "open", "opened"],
      hint: "Use infinitive when making an effort to do something",
      type: "multiple-choice"
    }
  ]);

  const handleExerciseComplete = (correct: boolean) => {
    if (correct && completedExercises < totalExercises) {
      setCompletedExercises(prev => prev + 1);
      toast.success("Well done!", {
        description: "You're mastering the tricky cases!"
      });
    }
  };

  const handleNewExercise = (exerciseId: number, newExercise: Exercise) => {
    setExercises(prev => 
      prev.map(ex => ex.id === exerciseId ? { ...newExercise, id: exerciseId } : ex)
    );
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
            <GraduationCap className="w-5 h-5 text-accent" />
            <span className="font-semibold">Module 4: Mixed Exercises</span>
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
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-accent" />
              Verbs That Change Meaning
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground mb-4">
              Some verbs can be followed by both gerunds and infinitives, but their meanings change significantly.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Stop</h3>
                <p className="text-sm mb-2"><strong>+ gerund:</strong> quit the action</p>
                <p className="text-sm text-muted-foreground">• I stopped smoking.</p>
                <p className="text-sm mt-2"><strong>+ infinitive:</strong> pause to do something else</p>
                <p className="text-sm text-muted-foreground">• I stopped to smoke.</p>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Remember / Forget</h3>
                <p className="text-sm mb-2"><strong>+ gerund:</strong> recall past actions</p>
                <p className="text-sm text-muted-foreground">• I remember meeting you.</p>
                <p className="text-sm mt-2"><strong>+ infinitive:</strong> future obligations</p>
                <p className="text-sm text-muted-foreground">• Remember to call me.</p>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Try</h3>
                <p className="text-sm mb-2"><strong>+ gerund:</strong> experiment</p>
                <p className="text-sm text-muted-foreground">• Try adding salt.</p>
                <p className="text-sm mt-2"><strong>+ infinitive:</strong> make an effort</p>
                <p className="text-sm text-muted-foreground">• Try to be on time.</p>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Regret</h3>
                <p className="text-sm mb-2"><strong>+ gerund:</strong> past actions</p>
                <p className="text-sm text-muted-foreground">• I regret saying that.</p>
                <p className="text-sm mt-2"><strong>+ infinitive:</strong> present news</p>
                <p className="text-sm text-muted-foreground">• I regret to inform you...</p>
              </div>
            </div>

            <div className="bg-accent/10 border border-accent/20 p-4 rounded-lg mt-4">
              <h4 className="font-semibold mb-2 text-accent">Challenge Yourself:</h4>
              <p className="text-sm">
                These exercises mix all levels and focus on verbs that change meaning. 
                Pay close attention to context to determine whether to use a gerund or infinitive!
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Mixed Practice Exercises</h2>
          {exercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              onComplete={handleExerciseComplete}
              moduleNumber={4}
              level="mixed"
              onNewExercise={(newEx) => handleNewExercise(exercise.id, newEx)}
            />
          ))}
        </div>

        <div className="mt-8 flex justify-between">
          <Link to="/module/3">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous: Module 3
            </Button>
          </Link>
          <Link to="/reference">
            <Button variant="secondary">
              View Reference Guide
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Module4;
