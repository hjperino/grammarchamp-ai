import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, ExternalLink } from "lucide-react";

interface ModuleReferenceLinksProps {
  level: "basic" | "intermediate" | "advanced";
}

const BASIC_LINKS = {
  title: "Basic Level References",
  partUrl: "https://www.englishpage.com/gerunds/part_1.htm",
  partLabel: "Part 1: Basic Gerunds & Infinitives",
  exercises: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  lists: [
    { label: "Gerund List", url: "https://www.englishpage.com/gerunds/gerund_list.htm" },
    { label: "Infinitive List", url: "https://www.englishpage.com/gerunds/infinitive_list.htm" },
  ],
};

const INTERMEDIATE_LINKS = {
  title: "Intermediate Level References",
  partUrl: "https://www.englishpage.com/gerunds/part_2.htm",
  partLabel: "Part 2: Intermediate Gerunds & Infinitives",
  exercises: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
  lists: [
    { label: "Verb + Noun + Infinitive", url: "https://www.englishpage.com/gerunds/verb_noun_infinitive_list.htm" },
    { label: "Gerund or Noun + Infinitive", url: "https://www.englishpage.com/gerunds/gerund_or_noun_infinitive_list.htm" },
    { label: "Go + Gerund", url: "https://www.englishpage.com/gerunds/go_gerund.htm" },
    { label: "Adjective + Prep + Gerund", url: "https://www.englishpage.com/gerunds/adjective_prep_gerund_list.htm" },
    { label: "Noun + Prep + Gerund", url: "https://www.englishpage.com/gerunds/noun_prep_gerund_list.htm" },
  ],
};

const ADVANCED_LINKS = {
  title: "Advanced Level References",
  partUrl: "https://www.englishpage.com/gerunds/part_3.htm",
  partLabel: "Part 3: Advanced Gerunds & Infinitives",
  exercises: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
  lists: [
    { label: "Gerund/Inf Different Meaning", url: "https://www.englishpage.com/gerunds/gerund_or_infinitive_different_list.htm" },
    { label: "Gerund/Inf Same Meaning", url: "https://www.englishpage.com/gerunds/gerund_or_infinitive_same_list.htm" },
    { label: "Adjective + Infinitive", url: "https://www.englishpage.com/gerunds/adjective_infinitive_list.htm" },
    { label: "Noun + Infinitive", url: "https://www.englishpage.com/gerunds/noun_infinitive_list.htm" },
    { label: "Expressions + -ing", url: "https://www.englishpage.com/gerunds/expression_ing.htm" },
    { label: "Verb of Location + -ing", url: "https://www.englishpage.com/gerunds/verb_location_ing.htm" },
  ],
};

export const ModuleReferenceLinks = ({ level }: ModuleReferenceLinksProps) => {
  const config =
    level === "basic"
      ? BASIC_LINKS
      : level === "intermediate"
      ? INTERMEDIATE_LINKS
      : ADVANCED_LINKS;

  return (
    <Card className="mb-8 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <BookOpen className="w-5 h-5 text-primary" />
          {config.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div>
          <a
            className="text-primary underline font-medium inline-flex items-center gap-1"
            href={config.partUrl}
            target="_blank"
            rel="noreferrer"
          >
            {config.partLabel}
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        <div>
          <h4 className="font-semibold mb-1 text-xs uppercase tracking-wide text-muted-foreground">
            Exercises
          </h4>
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {config.exercises.map((n) => (
              <a
                key={n}
                className="text-primary underline text-xs"
                href={`https://www.englishpage.com/gerunds/gerunds_infinitives_${n}.htm`}
                target="_blank"
                rel="noreferrer"
              >
                Ex.{n}
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-1 text-xs uppercase tracking-wide text-muted-foreground">
            Reference Lists
          </h4>
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {config.lists.map((l) => (
              <a
                key={l.label}
                className="text-primary underline text-xs inline-flex items-center gap-1"
                href={l.url}
                target="_blank"
                rel="noreferrer"
              >
                {l.label}
                <ExternalLink className="w-3 h-3" />
              </a>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
