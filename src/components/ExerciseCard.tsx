import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";

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
}

const ExerciseCard = ({ exercise, onComplete }: ExerciseCardProps) => {
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [showHint, setShowHint] = useState(false);

  const checkAnswer = () => {
    const isCorrect = userAnswer.trim().toLowerCase() === exercise.answer.toLowerCase();
    setFeedback(isCorrect ? "correct" : "incorrect");
    onComplete(isCorrect);
  };

  const handleReset = () => {
    setUserAnswer("");
    setFeedback(null);
    setShowHint(false);
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
          <Button 
            onClick={handleReset}
            variant="outline"
            className="w-full"
          >
            Try Another
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ExerciseCard;
