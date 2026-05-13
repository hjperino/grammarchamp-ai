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

  // Expressions where "to" (or another preposition) is a PREPOSITION, not part of an infinitive,
  // and therefore must be followed by a gerund (-ing form).
  // Pattern: regex tested against the text BEFORE the blank.
  const PREPOSITION_GERUND_TRIGGERS: { pattern: RegExp; label: string; explanation: string }[] = [
    {
      pattern: /\b(look|looks|looked|looking)\s+forward\s+to$/i,
      label: "look forward to",
      explanation: "Here 'to' is a preposition (part of 'look forward to'), not part of an infinitive. After a preposition, English requires the gerund (-ing form). Example: 'I look forward to seeing you.' (NOT 'to see you')",
    },
    { pattern: /\bobjects?\s+to$/i, label: "object to", explanation: "'Object to' takes a preposition 'to', so it must be followed by a gerund: 'She objects to working late.'" },
    { pattern: /\bobjected\s+to$/i, label: "object to", explanation: "'Object to' takes the preposition 'to', so it must be followed by a gerund: 'He objected to being interrupted.'" },
    { pattern: /\badmits?\s+to$/i, label: "admit to", explanation: "'Admit to' uses 'to' as a preposition → gerund follows: 'He admits to cheating.'" },
    { pattern: /\badmitted\s+to$/i, label: "admit to", explanation: "'Admit to' uses 'to' as a preposition → gerund follows: 'She admitted to lying.'" },
    { pattern: /\bconfess(es|ed)?\s+to$/i, label: "confess to", explanation: "'Confess to' uses 'to' as a preposition → gerund follows: 'He confessed to taking the money.'" },
    { pattern: /\b(get|gets|got|getting)\s+used\s+to$/i, label: "get used to", explanation: "In 'be/get used to', 'to' is a preposition → gerund follows: 'I'm getting used to living here.'" },
    { pattern: /\b(be|am|is|are|was|were|being|been)\s+used\s+to$/i, label: "be used to", explanation: "In 'be used to', 'to' is a preposition (meaning 'accustomed to') → gerund follows: 'She is used to working late.'" },
    { pattern: /\bthe\s+secret\s+to$/i, label: "the secret to", explanation: "'The secret to (something)' — here 'to' is a preposition introducing a noun phrase, so a gerund (-ing) follows: 'the secret to mixing ingredients perfectly.'" },
    { pattern: /\bthe\s+key\s+to$/i, label: "the key to", explanation: "'The key to (something)' — 'to' is a preposition, so a gerund follows: 'the key to succeeding.'" },
    { pattern: /\bthe\s+answer\s+to$/i, label: "the answer to", explanation: "'The answer to' — 'to' is a preposition, followed by a gerund or noun: 'the answer to passing the exam.'" },
    { pattern: /\b(commit|commits|committed)\s+to$/i, label: "commit to", explanation: "'Commit to' uses 'to' as a preposition → gerund follows: 'She committed to training daily.'" },
    { pattern: /\b(devote|devotes|devoted)\s+\w+\s+to$/i, label: "devote … to", explanation: "'Devote (something) to' — 'to' is a preposition, followed by a gerund: 'He devoted his life to helping others.'" },
    { pattern: /\b(dedicate|dedicates|dedicated)\s+\w+\s+to$/i, label: "dedicate … to", explanation: "'Dedicate (something) to' — 'to' is a preposition, followed by a gerund." },
    { pattern: /\bin\s+addition\s+to$/i, label: "in addition to", explanation: "'In addition to' — 'to' is a preposition, so a gerund follows: 'In addition to working, she studies.'" },
    { pattern: /\bopposed\s+to$/i, label: "opposed to", explanation: "'Opposed to' — 'to' is a preposition, followed by a gerund: 'He is opposed to changing the rules.'" },
    { pattern: /\bresort(s|ed)?\s+to$/i, label: "resort to", explanation: "'Resort to' — 'to' is a preposition, followed by a gerund: 'They resorted to lying.'" },
    { pattern: /\bprior\s+to$/i, label: "prior to", explanation: "'Prior to' — 'to' is a preposition, followed by a gerund or noun." },
    { pattern: /\bowing\s+to$/i, label: "owing to", explanation: "'Owing to' — 'to' is a preposition, followed by a gerund or noun." },
    { pattern: /\bwith\s+a\s+view\s+to$/i, label: "with a view to", explanation: "'With a view to' — 'to' is a preposition; a gerund follows: 'with a view to improving sales.'" },
    { pattern: /\bwhen\s+it\s+comes\s+to$/i, label: "when it comes to", explanation: "'When it comes to' — 'to' is a preposition, followed by a gerund: 'When it comes to cooking, he's an expert.'" },
  ];

  const detectPrepositionGerund = (): { label: string; explanation: string } | null => {
    // Get text before the blank (___)
    const blankIdx = exercise.question.indexOf("___");
    const before = (blankIdx >= 0 ? exercise.question.slice(0, blankIdx) : exercise.question)
      .replace(/[.,;:!?"'()]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    for (const trig of PREPOSITION_GERUND_TRIGGERS) {
      if (trig.pattern.test(before)) {
        return { label: trig.label, explanation: trig.explanation };
      }
    }
    return null;
  };

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

  const [isValidating, setIsValidating] = useState(false);

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
      } else if (exercise.type === "fill-in" && user.length > 0 && !sameBaseVerb(correct, user)) {
        // Different verb used → ask AI whether it's also semantically + structurally valid
        setIsValidating(true);
        try {
          const accessCode = sessionStorage.getItem("student_access_code") || undefined;
          const { data, error } = await supabase.functions.invoke("validate-answer", {
            body: {
              question: exercise.question,
              expectedAnswer: exercise.answer,
              userAnswer,
              accessCode,
            },
          });
          if (!error && data && data.acceptable === true) {
            isCorrect = true;
            note = data.explanation || `Accepted — "${userAnswer}" also works here, though the suggested answer was "${exercise.answer}".`;
          } else if (data?.explanation) {
            note = data.explanation;
          }
        } catch (e) {
          console.error("validate-answer failed:", e);
        } finally {
          setIsValidating(false);
        }
      }
    }

    // Preposition-gerund explanation: applies whether the answer is right or wrong,
    // because the pedagogical point ("to" is a preposition here, not an infinitive marker)
    // is valuable in both cases. Prepend it to any existing note.
    const prepInfo = detectPrepositionGerund();
    if (prepInfo) {
      const prepNote = `Grammar tip — "${prepInfo.label}": ${prepInfo.explanation}`;
      note = note ? `${prepNote}\n\n${note}` : prepNote;
    }

    setFeedback(isCorrect ? "correct" : "incorrect");
    setSoftNote(note);
    onComplete(isCorrect);
    
    // Save result: prioritize student access code over auth user
    const { data: { user: authUser } } = await supabase.auth.getUser();
    const accessCodeId = sessionStorage.getItem("student_access_code_id");

    if (!accessCodeId && !authUser) {
      toast.error("Kein Zugangscode gefunden. Bitte melden Sie sich erneut mit Ihrem Code an.");
    } else {
      const insertData: any = {
        module_number: moduleNumber,
        exercise_id: String(exercise.id),
        correct: isCorrect,
        question: exercise.question,
        user_answer: userAnswer,
        correct_answer: exercise.answer,
      };

      // Student mode (access code) takes priority — leave user_id NULL so RLS allows it
      // and so the result is attributed to the student code, not the logged-in teacher.
      if (accessCodeId) {
        insertData.access_code_id = accessCodeId;
      } else if (authUser) {
        insertData.user_id = authUser.id;
      }

      const { error } = await supabase.from('exercise_results').insert(insertData);

      if (error) {
        console.error('Error saving result:', error);
        toast.error("Ergebnis konnte nicht gespeichert werden. Bitte versuche es erneut.");
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
      const verbMatch = exercise.question.match(/\(([^)]+)\)/);
      const currentVerb = verbMatch ? verbMatch[1].trim().toLowerCase() : "";
      const { data, error } = await supabase.functions.invoke('generate-exercise', {
        body: { 
          exerciseType: exercise.type,
          level: level,
          interest: interest,
          accessCode,
          avoidVerbs: currentVerb ? [currentVerb] : [],
          avoidSentences: [exercise.question],
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
                    : userAnswer === option && !feedback
                    ? "default"
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
          <div className="bg-primary/10 text-foreground p-3 rounded-lg text-sm border border-primary/20 whitespace-pre-line">
            <span className="font-medium">Note:</span> {softNote}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex gap-2">
        {!feedback ? (
          <Button 
            onClick={checkAnswer} 
            disabled={!userAnswer || isValidating}
            className="w-full"
          >
            {isValidating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Checking...
              </>
            ) : (
              "Check Answer"
            )}
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
