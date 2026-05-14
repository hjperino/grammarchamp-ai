import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";
import { SEO } from "@/components/SEO";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <>
      <SEO
        title="Grammar Master — Interactive English Grammar Course"
        description="Grammar Master: interactive English grammar courses. Current topic: Gerunds vs. Infinitives. More topics coming soon."
        path="/"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Grammar Master",
          description: "Interactive English grammar courses. Current topic: Gerunds vs. Infinitives. More topics to be added.",
          url: "https://gerund-vs-infinitive.lovable.app/",
        }}
      />
      <main className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-3">
            <GraduationCap className="w-12 h-12 text-primary mx-auto" aria-hidden="true" />
            <h1 className="text-4xl font-bold">Grammar Master</h1>
            <p className="text-muted-foreground">Interaktives Lernprogramm für Englisch</p>
            <div className="pt-2">
              <p className="text-lg font-semibold text-foreground">Themen / Topics</p>
              <ul className="mt-2 space-y-1 text-base text-muted-foreground">
                <li>• Gerunds vs. Infinitives</li>
                <li className="italic">Weitere Themen folgen / More Topics to Be Added</li>
              </ul>
            </div>
          </div>

          <Card>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                📝 Lernende
              </CardTitle>
              <CardDescription>
                Geben Sie Ihren Zugangscode ein, um zu starten
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => navigate("/student")}>
                Code eingeben & starten
              </Button>
            </CardContent>
          </Card>

          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate("/teacher/login")}
              className="text-xs text-muted-foreground hover:text-foreground underline"
            >
              Lehrperson? Hier anmelden
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
