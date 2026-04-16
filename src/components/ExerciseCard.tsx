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

  // Feeling verbs: gerund preferred (stronger feeling), infinitive also accepted
  const FEELING_VERBS = ["love", "loves", "loved", "like", "likes", "liked", "hate", "hates", "hated"];
  // Verbs where both forms are equally correct, no special note needed
  const NEUTRAL_FLEXIBLE_VERBS = ["start", "starts", "started", "begin", "begins", "began", "continue", "continues", "continued"];
  // "prefer" accepts both forms AND has the special "X-ing to Y-ing" comparison structure
  const PREFER_VERBS = ["prefer", "prefers", "preferred"];

  const detectFlexibleVerb = (): "feeling" | "neutral" | "prefer" | null => {
    const q = exercise.question.toLowerCase();
    if (PREFER_VERBS.some((v) => new RegExp(`\\b${v}\\b`).test(q))) return "prefer";
    if (FEELING_VERBS.some((v) => new RegExp(`\\b${v}\\b`).test(q))) return "feeling";
    if (NEUTRAL_FLEXIBLE_VERBS.some((v) => new RegExp(`\\b${v}\\b`).test(q))) return "neutral";
    return null;
  };

  const sameBaseVerb = (a: string, b: string): boolean => {
    const norm = (s: string) => s.replace(/^to\s+/, "").replace(/ying$/, "ie").replace(/ing$/, "").trim();
    const na = norm(a);
    const nb = norm(b);
    return !!na && na === nb;
  };

  const checkAnswer = async () => {
    const correct = exercise.answer.toLowerCase().trim();
    const user = userAnswer.toLowerCase().trim();
    const exact = user === correct;

    let isCorrect = exact;
    let note: string | null = null;

    if (!exact) {
      const verbType = detectFlexibleVerb();
      if (verbType && sameBaseVerb(correct, user)) {
        isCorrect = true;
        const usedInfinitive = user.startsWith("to ");
        if (verbType === "feeling") {
          note = usedInfinitive
            ? "Accepted. With like, love, hate, the gerund (-ing) is more common and expresses a stronger, more genuine feeling, while the infinitive (to + verb) is fine in less dramatic, more general contexts."
            : "Correct! With like, love, hate, the gerund (-ing) is preferred and expresses a stronger feeling. The infinitive (to + verb) is also acceptable in less dramatic contexts.";
        } else if (verbType === "prefer") {
          note = "Accepted — with 'prefer', both gerund and infinitive are correct. Note the special comparison structure: 'I prefer walking to running' (gerund + to + gerund) or 'I prefer to walk rather than (to) run'.";
        }
        // neutral verbs: accepted silently, no note
      }
    }

    setFeedback(isCorrect ? "correct" : "incorrect");
    setSoftNote(note);
    onComplete(isCorrect);
    
    // Save result: either for logged-in user or anonymous student with access code
    const { data: { user: authUser } } = await supabase.auth.getUser();
    const accessCodeId = sessionStorage.getItem("student_access_code_id");
    
    if (authUser || accessCodeId) {
      const insertData: any = {
        module_number: moduleNumber,
        exercise_id: String(exercise.id),
        correct: isCorrect,
      };
      
      if (authUser) {
        insertData.user_id = authUser.id;
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
