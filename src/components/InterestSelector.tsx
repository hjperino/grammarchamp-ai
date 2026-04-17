import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles, Check } from "lucide-react";

interface InterestSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const popularInterests = [
  "holidays",
  "football",
  "dance",
  "travelling",
  "cooking",
  "music",
  "technology",
  "nature",
];

export const InterestSelector = ({ value, onChange }: InterestSelectorProps) => {
  const [draft, setDraft] = useState(value);

  // Keep draft in sync if parent value changes externally
  useEffect(() => {
    setDraft(value);
  }, [value]);

  const handleApply = () => {
    onChange(draft.trim());
  };

  const isDirty = draft.trim() !== value.trim();
  const canApply = draft.trim().length > 0 && isDirty;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-primary" />
        <Label htmlFor="interest">Personalize Your Practice (Optional)</Label>
      </div>
      <p className="text-sm text-muted-foreground">
        Choose or enter a topic you're interested in to make exercises more relevant and engaging. Click <strong>Apply</strong> to update the exercises with your topic.
      </p>
      <div className="flex gap-2">
        <Input
          id="interest"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && canApply) {
              e.preventDefault();
              handleApply();
            }
          }}
          placeholder="e.g., sports, movies, gardening..."
          className="flex-1"
        />
        <Button onClick={handleApply} disabled={!canApply}>
          <Check className="w-4 h-4 mr-1" />
          Apply
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {popularInterests.map((interest) => (
          <Button
            key={interest}
            variant="outline"
            size="sm"
            onClick={() => setDraft(interest)}
            className={draft === interest ? "border-primary bg-primary/10" : ""}
          >
            {interest}
          </Button>
        ))}
      </div>
      {value && (
        <p className="text-xs text-muted-foreground">
          Currently active topic: <strong className="text-foreground">{value}</strong>
        </p>
      )}
    </div>
  );
};
