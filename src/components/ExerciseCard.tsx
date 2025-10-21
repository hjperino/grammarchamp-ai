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
}

const ExerciseCard = ({ exercise, onComplete, moduleNumber, level, onNewExercise }: ExerciseCardProps) => {
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const checkAnswer = async () => {
    const isCorrect = userAnswer.trim().toLowerCase() === exercise.answer.toLowerCase();
    setFeedback(isCorrect ? "correct" : "incorrect");
    onComplete(isCorrect);
    
    // Save result to database if user is logged in
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase.from('exercise_results').insert({
        user_id: user.id,
        module_number: moduleNumber,
        exercise_id: exercise.id,
        correct: isCorrect
      });
      
      if (error) {
        console.error('Error saving result:', error);
      }
    }
  };

  const handleReset = () => {
    setUserAnswer("");
    setFeedback(null);
    setShowHint(false);
  };

  const generateNewExercise = async () => {
    if (!onNewExercise) return;
    
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-exercise', {
        body: {
          exerciseType: exercise.type,
          level: level
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
