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
      messages: z.array(z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().max(2000),
      })).max(50),
      accessCode: z.string().max(20).optional(),
    });

    const parseResult = bodySchema.safeParse(await req.json());
    if (!parseResult.success) {
      return new Response(
        JSON.stringify({ error: "Invalid input parameters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { messages, accessCode } = parseResult.data;

    // Authorize: either logged-in user OR valid active access code
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
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are a helpful English grammar assistant. You ONLY answer questions related to English grammar, vocabulary, language usage, and English learning.

For gerunds and infinitives specifically, base your explanations on the englishpage.com Gerunds & Infinitives Tutorial (https://www.englishpage.com/gerunds/index.htm), Parts 1–3 (tips 1–20):
- Part 1 (basic, tips 1–6): what gerunds/infinitives are; gerund/infinitive as subject, complement, object; gerund-only verbs (enjoy, suggest, avoid, finish, mind, deny, admit, postpone, can't help, can't stand, consider); infinitive-only verbs (want, need, decide, hope, plan, offer, agree, promise, refuse, expect, learn, would like, seem).
- Part 2 (intermediate, tips 7–12): possessive + gerund; verb (+ noun) + infinitive (ask, tell, advise, expect, want, allow, persuade, remind, order, force, invite, warn); verb + gerund OR + noun + infinitive (advise, allow, encourage, permit, require); "go + gerund" for sports/recreation; gerund after prepositions, including verb+prep (look forward to, object to, admit to, confess to, insist on, succeed in), adjective+prep (scared of, good at, interested in), noun+prep (the secret to, the idea of, interest in).
- Part 3 (advanced, tips 13–20): meaning-change verbs (remember, forget, regret, stop, try, mean, need, go on); similar-meaning verbs (like, love, hate, prefer, start, begin, continue) — gerund = real experience, infinitive = potential; be+adj+inf (anxious, lucky, eager, ready, willing); noun+inf (decision, wish, plan, chance, way, time); infinitive of purpose; too+adj / enough+adj / enough+noun + infinitive; expressions + -ing (have fun/trouble + -ing, spend time + -ing, it's worth + -ing); verb of location + location + -ing; advanced progressive/passive/perfect gerund and infinitive forms (being taught, having taught, to be taught, to have taught, having been taught).

If someone asks about anything outside of English grammar and language learning (such as math, science, history, personal advice, etc.), politely decline and say:

"I'm specifically designed to help with English grammar questions only. Please ask me about grammar rules, sentence structure, vocabulary, or any English language topics, and I'll be happy to help!"

Keep your answers clear, concise, and educational. Provide examples when helpful. When relevant, you may cite the englishpage.com tutorial as the source.`,
          },
          ...messages,
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limits exceeded, please try again later." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service unavailable, please contact support." }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Service temporarily unavailable. Please try again." }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Grammar chat error:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred. Please try again." }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
