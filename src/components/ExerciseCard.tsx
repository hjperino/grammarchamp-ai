import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, XCircle, AlertCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Exercise {
  id: number;
  question: string;
  answer: string;
  hint?: string;
  type: "fill-in" | "multiple-choice";
  options?: string[];
}

interface ExerciseCardProps {
  exercise: Exercise;
  onComplete: (correct: boolean) => void;
  moduleNumber: number;
  level: "basic" | "intermediate" | "advanced" | "mixed";
  onNewExercise?: (newExercise: Exercise) => void;
  interest?: string;
}

const ExerciseCard = ({ exercise, onComplete, moduleNumber, level, onNewExercise, interest }: ExerciseCardProps) => {
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [softNote, setSoftNote] = useState<string | null>(null);

  // Verbs that accept BOTH gerund and infinitive with little change in meaning
  const FLEXIBLE_VERBS = ["love", "loves", "loved", "like", "likes", "liked", "hate", "hates", "hated", "prefer", "prefers", "preferred", "start", "starts", "started", "begin", "begins", "began", "continue", "continues", "continued"];

  const toGerund = (verb: string): string => {
    const v = verb.toLowerCase();
    if (v.endsWith("ie")) return v.slice(0, -2) + "ying";
    if (v.endsWith("e") && v.length > 2) return v.slice(0, -1) + "ing";
    return v + "ing";
  };

  const toInfinitive = (verb: string): string => {
    const v = verb.toLowerCase();
    const base = v.endsWith("ying") ? v.slice(0, -4) + "ie"
      : v.endsWith("ing") ? (v.slice(0, -3).match(/[bcdfghjklmnpqrstvwxz]$/) ? v.slice(0, -3) + "e" : v.slice(0, -3))
      : v;
    return "to " + base;
  };

  const isFlexibleAlternative = (): { matches: boolean; usedForm: "gerund" | "infinitive" | null } => {
    const question = exercise.question.toLowerCase();
    const hasFlexibleVerb = FLEXIBLE_VERBS.some((v) => new RegExp(`\\b${v}\\b`).test(question));
    if (!hasFlexibleVerb) return { matches: false, usedForm: null };

    const correct = exercise.answer.toLowerCase().trim();
    const user = userAnswer.toLowerCase().trim();

    // Strip leading "to " for comparison base
    const correctBase = correct.replace(/^to\s+/, "").replace(/ing$/, "").replace(/ying$/, "ie");
    const userBase = user.replace(/^to\s+/, "").replace(/ing$/, "").replace(/ying$/, "ie");

    if (correctBase && correctBase === userBase) {
      const userForm: "gerund" | "infinitive" = user.startsWith("to ") ? "infinitive" : "gerund";
      return { matches: true, usedForm: userForm };
    }
    return { matches: false, usedForm: null };
  };

  const checkAnswer = async () => {
    const exact = userAnswer.trim().toLowerCase() === exercise.answer.toLowerCase();
    let isCorrect = exact;
    let note: string | null = null;

    if (!exact) {
      const flex = isFlexibleAlternative();
      if (flex.matches) {
        isCorrect = true;
        note = flex.usedForm === "infinitive"
          ? "Good — with verbs like love, like, hate, both forms are accepted. The gerund (-ing) often expresses a stronger, more genuine feeling, while the infinitive (to + verb) is common in less dramatic, more general contexts."
          : "Correct! With love, like, hate, the gerund (-ing) is more common and expresses a stronger, more genuine feeling. The infinitive (to + verb) is also accepted, especially in less dramatic contexts.";
      }
    }

    setFeedback(isCorrect ? "correct" : "incorrect");
    setSoftNote(note);
    onComplete(isCorrect);
    
    // Save result: either for logged-in user or anonymous student with access code
    const { data: { user } } = await supabase.auth.getUser();
    const accessCodeId = sessionStorage.getItem("student_access_code_id");
    
    if (user || accessCodeId) {
      const insertData: any = {
        module_number: moduleNumber,
        exercise_id: String(exercise.id),
        correct: isCorrect,
      };
      
      if (user) {
        insertData.user_id = user.id;
      }
      if (accessCodeId) {
        insertData.access_code_id = accessCodeId;
      }

      const { error } = await supabase.from('exercise_results').insert(insertData);
      
      if (error) {
        console.error('Error saving result:', error);
      }
    }
  };

  const handleReset = () => {
    setUserAnswer("");
    setFeedback(null);
    setShowHint(false);
    setSoftNote(null);
  };

  const generateNewExercise = async () => {
    if (!onNewExercise) return;
    
    setIsGenerating(true);
    try {
      const accessCode = sessionStorage.getItem("student_access_code") || undefined;
      const { data, error } = await supabase.functions.invoke('generate-exercise', {
        body: { 
          exerciseType: exercise.type,
          level: level,
          interest: interest,
          accessCode,
        }
      });

      if (error) throw error;
      
      if (data.error) {
        toast.error(data.error);
        return;
      }

      const newExercise: Exercise = {
        id: exercise.id,
        question: data.question,
        answer: data.answer,
        hint: data.hint,
        type: exercise.type,
        options: data.options
      };

      onNewExercise(newExercise);
      handleReset();
      toast.success("New exercise generated!");
    } catch (error) {
      console.error('Error generating exercise:', error);
      toast.error("Failed to generate new exercise");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className={`transition-all ${
      feedback === "correct" ? "border-accent" : 
      feedback === "incorrect" ? "border-destructive" : ""
    }`}>
      <CardHeader>
        <CardTitle className="text-lg flex items-start justify-between">
          <span>Exercise {exercise.id}</span>
          {exercise.hint && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowHint(!showHint)}
            >
              <AlertCircle className="w-4 h-4" />
              Hint
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-foreground">{exercise.question}</p>
        
        {showHint && exercise.hint && (
          <div className="bg-muted p-3 rounded-lg text-sm">
            <span className="font-medium">Hint:</span> {exercise.hint}
          </div>
        )}
        
        {exercise.type === "fill-in" && (
          <Input
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Type your answer..."
            disabled={feedback !== null}
            className="text-base"
            onKeyPress={(e) => {
              if (e.key === "Enter" && userAnswer && !feedback) {
                checkAnswer();
              }
            }}
          />
        )}
        
        {exercise.type === "multiple-choice" && exercise.options && (
          <div className="space-y-2">
            {exercise.options.map((option, idx) => (
              <Button
                key={idx}
                variant={
                  feedback && option.toLowerCase() === exercise.answer.toLowerCase()
                    ? "success"
                    : userAnswer === option && feedback === "incorrect"
                    ? "destructive"
                    : "outline"
                }
                className="w-full justify-start"
                onClick={() => setUserAnswer(option)}
                disabled={feedback !== null}
              >
                {option}
              </Button>
            ))}
          </div>
        )}
        
        {feedback && (
          <div className={`flex items-center gap-2 p-3 rounded-lg ${
            feedback === "correct" ? "bg-accent/10 text-accent" : "bg-destructive/10 text-destructive"
          }`}>
            {feedback === "correct" ? (
              <>
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-medium">Correct! Well done!</span>
              </>
            ) : (
              <>
                <XCircle className="w-5 h-5" />
                <span className="font-medium">
                  Incorrect. The correct answer is: <strong>{exercise.answer}</strong>
                </span>
              </>
            )}
          </div>
        )}

        {softNote && (
          <div className="bg-primary/10 text-foreground p-3 rounded-lg text-sm border border-primary/20">
            <span className="font-medium">Note:</span> {softNote}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex gap-2">
        {!feedback ? (
          <Button 
            onClick={checkAnswer} 
            disabled={!userAnswer}
            className="w-full"
          >
            Check Answer
          </Button>
        ) : (
          <div className="flex gap-2 w-full">
            <Button 
              onClick={handleReset}
              variant="outline"
              className="flex-1"
            >
              Reset
            </Button>
            {onNewExercise && (
              <Button 
                onClick={generateNewExercise}
                variant="secondary"
                className="flex-1"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Try Another"
                )}
              </Button>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default ExerciseCard;
