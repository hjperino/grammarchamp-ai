import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <GraduationCap className="w-12 h-12 text-primary mx-auto" />
          <h1 className="text-4xl font-bold">Grammar Master</h1>
          <p className="text-muted-foreground">Gerunds vs. Infinitives — Interaktives Lernprogramm</p>
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
    </div>
  );
}
