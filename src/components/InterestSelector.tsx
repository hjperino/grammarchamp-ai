import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

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
  "nature"
];

export const InterestSelector = ({ value, onChange }: InterestSelectorProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-primary" />
        <Label htmlFor="interest">Personalize Your Practice (Optional)</Label>
      </div>
      <p className="text-sm text-muted-foreground">
        Choose or enter a topic you're interested in to make exercises more relevant and engaging.
      </p>
      <div className="flex gap-2">
        <Input
          id="interest"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g., sports, movies, gardening..."
          className="flex-1"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {popularInterests.map((interest) => (
          <Button
            key={interest}
            variant="outline"
            size="sm"
            onClick={() => onChange(interest)}
            className={value === interest ? "border-primary bg-primary/10" : ""}
          >
            {interest}
          </Button>
        ))}
      </div>
    </div>
  );
};
