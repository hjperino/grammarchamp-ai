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
        title="Grammar Master — Gerunds vs. Infinitives English Course"
        description="Interactive English grammar course on gerunds and infinitives. Personalized exercises for students, progress tracking for teachers."
        path="/"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Course",
          name: "Gerunds vs. Infinitives — Interactive English Grammar Course",
          description: "Learn gerunds and infinitives with interactive exercises across basic, intermediate and advanced levels.",
          provider: {
            "@type": "Organization",
            name: "English Grammar Academy",
            url: "https://gerund-vs-infinitive.lovable.app/",
          },
        }}
      />
      <main className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <GraduationCap className="w-12 h-12 text-primary mx-auto" aria-hidden="true" />
            <h1 className="text-4xl font-bold">Grammar Master — Gerunds vs. Infinitives</h1>
            <p className="text-muted-foreground">Interaktives Lernprogramm für Englisch</p>
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
