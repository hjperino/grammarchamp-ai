import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.76.0";
import { z } from "https://esm.sh/zod@3.25.76";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const bodySchema = z.object({
      question: z.string().max(500),
      expectedAnswer: z.string().max(100),
      userAnswer: z.string().max(100),
      accessCode: z.string().max(20).optional(),
    });

    const parsed = bodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: "Invalid input" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { question, expectedAnswer, userAnswer, accessCode } = parsed.data;

    // Authorize
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );
    let authorized = false;
    const authHeader = req.headers.get("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.replace("Bearer ", "");
      const { data: claimsData } = await supabase.auth.getClaims(token);
      if (claimsData?.claims?.sub) authorized = true;
    }
    if (!authorized && accessCode) {
      const { data: codeRow } = await supabase
        .from("access_codes")
        .select("id")
        .eq("code", accessCode.toUpperCase())
        .eq("is_active", true)
        .maybeSingle();
      if (codeRow) authorized = true;
    }
    if (!authorized) {
      return new Response(JSON.stringify({ error: "Authentication required" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const systemPrompt = `You are an expert English grammar teacher evaluating a student's answer to a gerund/infinitive fill-in-the-blank exercise.

The student may have used a DIFFERENT verb than the expected answer. Your job is to decide whether the student's answer is ALSO acceptable, considering:

1. GRAMMATICAL FORM: Does the student's answer use the correct form (gerund -ing vs. infinitive to+verb vs. bare infinitive) that the sentence structure requires?
   - Some main verbs require gerund (enjoy, avoid, finish, mind, suggest, ...)
   - Some require infinitive (want, decide, hope, agree, advise sb, ...)
   - Some allow both (like, love, hate, prefer, start, begin, continue)
   - After prepositions: always gerund
   - Bare infinitive after modals, "make sb", "let sb", "help sb"

2. SEMANTIC PLAUSIBILITY: Does the student's verb choice make reasonable sense in the sentence's context? It does NOT need to be the most natural choice — only plausible.

3. SAME FORM as expected: The student's form (gerund vs. infinitive) should match what the sentence structure allows. If expected is "to practice" (infinitive) and student wrote "learning" (gerund), that is WRONG because the structure "advises sb ___" requires infinitive.

Respond ONLY with a JSON object:
{
  "acceptable": true | false,
  "explanation": "1-2 short sentences in English explaining why it is or isn't accepted. If accepted, briefly note that the expected answer was different but the student's choice also works."
}`;

    const userMsg = `Question: "${question}"
Expected answer: "${expectedAnswer}"
Student's answer: "${userAnswer}"

Is the student's answer also acceptable?`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMsg },
        ],
        stream: false,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      return new Response(JSON.stringify({ error: "Validation service unavailable" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return new Response(JSON.stringify({ acceptable: false, explanation: "Could not validate." }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const result = JSON.parse(jsonMatch[0]);
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in validate-answer:", error);
    return new Response(JSON.stringify({ error: "Unexpected error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
