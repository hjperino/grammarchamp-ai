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
              Advanced Structures
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-accent/10 border border-accent/20 p-4 rounded-lg">
              <p className="font-semibold mb-1">Module 3 focuses on three challenging advanced patterns.</p>
              <p className="text-sm text-muted-foreground">Possessive + gerund, passive forms, and past (perfect) gerund/infinitive forms.</p>
            </div>

            <div className="border-l-4 border-primary pl-4">
              <h4 className="font-semibold mb-2">1. Possessive + Gerund</h4>
              <p className="text-sm mb-2">In formal English, a possessive (my, your, his, her, our, their, John's) precedes a gerund when the focus is on the <em>action</em>, not on the person.</p>
              <p className="text-sm text-muted-foreground ml-4">I appreciate <em>his spontaneous helping</em> whenever I'm stuck.</p>
              <p className="text-sm text-muted-foreground ml-4">I don't like <em>his talking</em> badly about me behind my back. <span className="italic">(formal)</span></p>
              <p className="text-sm text-muted-foreground ml-4">I don't like <em>him talking</em> badly about me behind my back. <span className="italic">(informal/spoken)</span></p>
              <p className="text-sm text-muted-foreground ml-4">Would you mind <em>my asking</em> a question?</p>
              <div className="mt-2">
                <a
                  href="/Possessive_pronouns_before_gerunds.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all h-10 px-4 py-2"
                >
                  For advanced structures click here
                </a>
              </div>
            </div>

            <div className="border-l-4 border-secondary pl-4">
              <h4 className="font-semibold mb-2">2. Passive Gerund &amp; Passive Infinitive</h4>
              <p className="text-sm">• <strong>Passive gerund</strong> = being + past participle</p>
              <p className="text-sm text-muted-foreground ml-4">They enjoy <em>being talked about</em> in the social media a lot.</p>
              <p className="text-sm mt-2">• <strong>Passive infinitive</strong> = to be + past participle</p>
              <p className="text-sm text-muted-foreground ml-4">He wanted <em>to be taken</em> to the airport.</p>
            </div>

            <div className="border-l-4 border-accent pl-4">
              <h4 className="font-semibold mb-2">3. Past (Perfect) Gerund &amp; Infinitive</h4>
              <p className="text-sm mb-1">Use the perfect form when the gerund/infinitive action happened <em>before</em> the main verb.</p>
              <p className="text-sm">• <strong>Past gerund</strong> = having + past participle (passive: having been + pp)</p>
              <p className="text-sm text-muted-foreground ml-4">She did it even after <em>having been warned</em> against it.</p>
              <p className="text-sm mt-2">• <strong>Past infinitive</strong> = to have + past participle (passive: to have been + pp)</p>
              <p className="text-sm text-muted-foreground ml-4">He claimed <em>to have been fired</em> without reason.</p>
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
