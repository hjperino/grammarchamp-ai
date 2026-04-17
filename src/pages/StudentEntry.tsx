import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { GraduationCap } from "lucide-react";

export default function StudentEntry() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase
        .rpc("validate_access_code", { _code: code.trim().toUpperCase() });

      if (error) throw error;
      const row = Array.isArray(data) ? data[0] : data;
      if (!row) {
        toast.error("Ungültiger oder inaktiver Code. Bitte prüfen Sie den Code.");
        return;
      }

      sessionStorage.setItem("student_access_code_id", data.id);
      sessionStorage.setItem("student_access_code", data.code);
      navigate("/home");
    } catch (err: any) {
      toast.error("Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <GraduationCap className="w-10 h-10 text-primary" />
          </div>
          <CardTitle className="text-2xl">Grammar Master</CardTitle>
          <CardDescription>
            Geben Sie Ihren Zugangscode ein, um zu starten
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="CODE EINGEBEN"
                className="text-center text-lg tracking-widest font-mono"
                maxLength={8}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading || code.length < 4}>
              {loading ? "Wird geprüft..." : "Starten"}
            </Button>
          </form>
          <div className="mt-6 rounded-md bg-muted p-4 text-sm text-muted-foreground">
            <p className="font-medium mb-1">💡 Hinweis:</p>
            <p>Ihr Fortschritt wird automatisch gespeichert. Sie können jederzeit mit demselben Code weitermachen.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
