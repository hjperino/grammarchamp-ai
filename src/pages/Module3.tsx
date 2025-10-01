import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import ExerciseCard, { Exercise } from "@/components/ExerciseCard";
import { ArrowLeft, BookOpen, GraduationCap, Trophy } from "lucide-react";
import { toast } from "sonner";

const Module3 = () => {
  const [completedExercises, setCompletedExercises] = useState(0);
  const totalExercises = 9;

  const exercises: Exercise[] = [
    {
      id: 1,
      question: "I remember ___ (meet) you at the party. (past event)",
      answer: "meeting",
      hint: "'Remember + gerund' = recall a past event",
      type: "fill-in"
    },
    {
      id: 2,
      question: "Remember ___ (lock) the door before you leave. (future action)",
      answer: "to lock",
      hint: "'Remember + infinitive' = don't forget to do something",
      type: "fill-in"
    },
    {
      id: 3,
      question: "Choose: He stopped ___ when I entered. (he was smoking)",
      answer: "smoking",
      options: ["to smoke", "smoking", "smoke", "smoked"],
      type: "multiple-choice"
    },
    {
      id: 4,
      question: "She stopped ___ (buy) milk. (she stopped in order to buy)",
      answer: "to buy",
      hint: "'Stop + infinitive' = stop in order to do something",
      type: "fill-in"
    },
    {
      id: 5,
      question: "Try ___ (eat) less sugar if you want to lose weight.",
      answer: "eating",
      hint: "'Try + gerund' = experiment with something",
      type: "fill-in"
    },
    {
      id: 6,
      question: "Choose: I forgot ___ him. Now he's upset. (I should have called)",
      answer: "to call",
      options: ["calling", "to call", "call", "called"],
      type: "multiple-choice"
    },
    {
      id: 7,
      question: "I'll never forget ___ (see) the Grand Canyon.",
      answer: "seeing",
      hint: "'Forget + gerund' = won't forget a past experience",
      type: "fill-in"
    },
    {
      id: 8,
      question: "Choose: He went on ___ for another hour. (continued)",
      answer: "talking",
      options: ["to talk", "talking", "talk", "talked"],
      type: "multiple-choice"
    },
    {
      id: 9,
      question: "After finishing school, she went on ___ (study) medicine.",
      answer: "to study",
      hint: "'Go on + infinitive' = do something next/after",
      type: "fill-in"
    }
  ];

  const handleExerciseComplete = (correct: boolean) => {
    if (correct && completedExercises < totalExercises) {
      setCompletedExercises(prev => prev + 1);
      toast.success("Outstanding!", {
        description: "You're mastering advanced patterns!"
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
            <GraduationCap className="w-5 h-5 text-accent" />
            <span className="font-semibold">Module 3: Advanced Level</span>
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
              <Trophy className="w-5 h-5 text-accent" />
              Verbs That Change Meaning
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-accent/10 border border-accent/20 p-4 rounded-lg">
              <p className="font-semibold mb-2">Some verbs can be followed by either gerund or infinitive, but the meaning changes!</p>
            </div>

            <div className="space-y-4">
              <div className="border-l-4 border-primary pl-4">
                <h4 className="font-semibold mb-2">Remember</h4>
                <p className="text-sm">• <strong>remember + gerund</strong> = recall a past event</p>
                <p className="text-sm text-muted-foreground ml-4">I remember <em>meeting</em> you. (I recall that we met)</p>
                <p className="text-sm mt-2">• <strong>remember + infinitive</strong> = don't forget to do something</p>
                <p className="text-sm text-muted-foreground ml-4">Remember <em>to lock</em> the door. (Don't forget)</p>
              </div>

              <div className="border-l-4 border-secondary pl-4">
                <h4 className="font-semibold mb-2">Stop</h4>
                <p className="text-sm">• <strong>stop + gerund</strong> = quit an activity</p>
                <p className="text-sm text-muted-foreground ml-4">He stopped <em>smoking</em>. (He quit)</p>
                <p className="text-sm mt-2">• <strong>stop + infinitive</strong> = stop in order to do something</p>
                <p className="text-sm text-muted-foreground ml-4">He stopped <em>to smoke</em>. (He paused to have a cigarette)</p>
              </div>

              <div className="border-l-4 border-accent pl-4">
                <h4 className="font-semibold mb-2">Forget</h4>
                <p className="text-sm">• <strong>forget + gerund</strong> = won't forget a past experience</p>
                <p className="text-sm text-muted-foreground ml-4">I'll never forget <em>seeing</em> Paris. (memory)</p>
                <p className="text-sm mt-2">• <strong>forget + infinitive</strong> = fail to do something</p>
                <p className="text-sm text-muted-foreground ml-4">I forgot <em>to call</em> him. (I didn't call)</p>
              </div>

              <div className="border-l-4 border-primary pl-4">
                <h4 className="font-semibold mb-2">Try</h4>
                <p className="text-sm">• <strong>try + gerund</strong> = experiment with something</p>
                <p className="text-sm text-muted-foreground ml-4">Try <em>eating</em> less sugar. (experiment)</p>
                <p className="text-sm mt-2">• <strong>try + infinitive</strong> = attempt to do something</p>
                <p className="text-sm text-muted-foreground ml-4">I tried <em>to open</em> the door. (attempted)</p>
              </div>

              <div className="border-l-4 border-secondary pl-4">
                <h4 className="font-semibold mb-2">Go on</h4>
                <p className="text-sm">• <strong>go on + gerund</strong> = continue the same activity</p>
                <p className="text-sm text-muted-foreground ml-4">He went on <em>talking</em>. (continued)</p>
                <p className="text-sm mt-2">• <strong>go on + infinitive</strong> = do something next</p>
                <p className="text-sm text-muted-foreground ml-4">He went on <em>to study</em> law. (next step)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Advanced Practice</h2>
          {exercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              onComplete={handleExerciseComplete}
            />
          ))}
        </div>

        <div className="mt-8 flex justify-between">
          <Link to="/module/2">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous: Module 2
            </Button>
          </Link>
          <Link to="/reference">
            <Button variant="success">
              <BookOpen className="w-4 h-4 mr-2" />
              View Reference Guide
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Module3;
