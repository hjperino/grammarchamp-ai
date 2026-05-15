import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import ExerciseCard, { Exercise } from "@/components/ExerciseCard";
import { InterestSelector } from "@/components/InterestSelector";
import { GrammarHelp } from "@/components/GrammarHelp";
import { ModuleReferenceLinks } from "@/components/ModuleReferenceLinks";
import { useInterestExercises } from "@/hooks/useInterestExercises";
import { ArrowLeft, BookOpen, GraduationCap, Trophy, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { SEO } from "@/components/SEO";

const DEFAULT_EXERCISES: Exercise[] = [
  // Possessive + gerund
  { id: 1, question: "I really appreciate ___ ___ (he / help) me whenever I'm stuck. (formal)", answer: "his helping", hint: "Formal English: possessive pronoun + gerund — focus is on the action.", type: "fill-in" },
  { id: 2, question: "I don't like ___ ___ (he / talk) badly about me behind my back. (formal/written)", answer: "his talking", hint: "Use the possessive before the gerund in formal English.", type: "fill-in" },
  { id: 3, question: "Choose the most formal version: There's no chance of ___ on time.", answer: "John's finishing", options: ["John finishing", "John's finishing", "John to finish", "John finish"], type: "multiple-choice" },
  // Passive gerund / passive infinitive
  { id: 4, question: "He wanted ___ (take) to the airport, not to drive himself.", answer: "to be taken", hint: "Passive infinitive: to be + past participle.", type: "fill-in" },
  { id: 5, question: "They actually enjoy ___ (talk) about on social media a lot.", answer: "being talked", hint: "Passive gerund after 'enjoy': being + past participle.", type: "fill-in" },
  { id: 6, question: "Choose: She hates ___ in public, even when the criticism is fair.", answer: "being criticised", options: ["to criticise", "criticising", "being criticised", "to be criticising"], type: "multiple-choice" },
  // Past gerund / past infinitive
  { id: 7, question: "She did it even after ___ (warn) against it several times.", answer: "having been warned", hint: "Past passive gerund: having been + past participle.", type: "fill-in" },
  { id: 8, question: "He claimed ___ (fire) without any reason.", answer: "to have been fired", hint: "Past passive infinitive: to have been + past participle.", type: "fill-in" },
  { id: 9, question: "Choose: I would love ___ Salvador Dalí in person.", answer: "to have met", options: ["to meet", "meeting", "to have met", "to be met"], type: "multiple-choice" },
];

const Module3 = () => {
  const [completedExercises, setCompletedExercises] = useState(0);
  const [interest, setInterest] = useState("");
  const totalExercises = 9;

  const { exercises, isRegenerating, replaceExercise } = useInterestExercises(
    DEFAULT_EXERCISES,
    interest,
    "advanced"
  );

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
      <SEO
        title="Module 3: Advanced — Gerunds & Infinitives | Grammar Master"
        description="Master native-level nuances, meaning changes, and tricky exceptions for gerunds and infinitives across 9 advanced exercises."
        path="/module/3"
      />
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/home">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-accent" aria-hidden="true" />
            <h1 className="font-semibold text-base">Module 3: Advanced Level — Gerunds & Infinitives</h1>
          </div>
          <div className="w-32" />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
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

        <ModuleReferenceLinks level="advanced" />

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Advanced Practice</h2>
            {isRegenerating && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                Personalizing exercises…
              </div>
            )}
          </div>
          {exercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              onComplete={handleExerciseComplete}
              moduleNumber={3}
              level="advanced"
              onNewExercise={(newEx) => replaceExercise(exercise.id, newEx)}
              interest={interest}
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
      </main>
      <GrammarHelp />
    </div>
  );
};

export default Module3;
