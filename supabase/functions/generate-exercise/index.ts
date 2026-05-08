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
      exerciseType: z.enum(["fill-in", "multiple-choice"]),
      level: z.enum(["basic", "intermediate", "advanced", "mixed"]),
      interest: z.string().max(100).optional(),
      accessCode: z.string().max(20).optional(),
    });

    const parseResult = bodySchema.safeParse(await req.json());
    if (!parseResult.success) {
      return new Response(
        JSON.stringify({ error: "Invalid input parameters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { exerciseType, level, interest, accessCode } = parseResult.data;

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

    const interestContext = interest
      ? `\nTheme: Build the example around the topic "${interest}" (use it for scenery: nouns, places, people, settings).`
      : '';

    const levelVocabGuidance: Record<string, string> = {
      basic: "Use simple, high-frequency vocabulary (CEFR A2–B1). Avoid rare or technical words.",
      intermediate: "Use everyday but slightly richer vocabulary (CEFR B1–B2). Some less common verbs are welcome.",
      advanced: "Use sophisticated vocabulary and nuanced verbs (CEFR B2–C1), including phrasal verbs where natural.",
      mixed: "Adapt vocabulary to the difficulty of the structure being practised (B1–C1).",
    };

    const intermediatePatternBank = `
INTERMEDIATE PATTERN BANK (4A Verb patterns – actively rotate through these structures, do NOT only use plain "verb + gerund/infinitive"):

Verb + -ing (gerund):
- After prepositions following adjectives: committed to, justified in, meticulous about, renowned for, interested in, good at, tired of, afraid of, keen on.
- After prepositions following nouns/noun phrases: thanks for, in addition to, with a view to, the idea of, the purpose of, devotion to, the secret to, the key to.
- After verb (+ object) + preposition: specialise in, feel like, admire someone for, compliment someone on, accuse someone of, blame someone for, congratulate someone on, prevent someone from.
- After many verbs: involve, imagine, can't help, suggest, bother, mind, deny, avoid, consider, risk, miss, postpone.
- After phrasal verbs: end up, put off, give up, take up, burst out, keep on, carry on.
- After some adjectives: (not) worth, hopeless, pointless (these can also take "to"-infinitive).
- After time linkers: when, before, since, on, upon, until, while, whilst (e.g. "Kit broke his arm while skiing").
- -ing form as the SUBJECT of a sentence (gerund as noun): e.g. "Overfishing is depleting the cod species."
- -ing as participle/adjective: satisfying results, a mystifying problem, participating countries.
- Passive -ing: "He doesn't enjoy being corrected."

Infinitive with to:
- After certain verbs / verb+object combinations: arrange, manage, fail, prepare, bother, persuade someone, allow someone, want someone, occur to someone (e.g. "It didn't occur to me to resign").
- After adjectives: bound, inclined, interesting, liable, ready, reluctant, willing (e.g. "The road is liable to flood").
- After nouns/noun phrases: a (long) way, (it's her) ambition, (go to) great lengths, (there's) no need, (the) aim/motive is.
- After too + adjective/quantifier: "It's too heavy to lift", "There's too much to see".
- To express purpose: "He's saving to buy a house."

-ing form OR infinitive with to:
- Meaning changes: go on, remember, forget, start, regret, try, stop ("I remember locking the door" vs "Remember to lock the door").
- Little/no difference: start, begin, like.
- Perfect infinitive or perfect -ing to emphasise order: "I would love to have met Salvador Dalí."
- Perfect infinitive in the passive: "The report is still to be completed."

When level is "intermediate" or "mixed", actively VARY across this bank instead of only "verb + gerund/infinitive". Across a batch, include examples of: preposition + gerund (after adjective/noun/verb), time-linker + gerund, gerund as subject, passive -ing, too + adj + to-inf, adjective + to-inf, perfect infinitive, and a meaning-change verb (remember/forget/stop/try/regret).
`;

    const systemPrompt = `You are an English grammar teacher. Generate ONE NEW, UNIQUE exercise about gerunds and infinitives.
Level: ${level}
Exercise type: ${exerciseType}${interestContext}

VERB VARIETY (very important):
- The blank tests a verb in gerund or infinitive form. Pick an INTERESTING, VARIED main verb.
- Do NOT just reuse the topic word as the verb. For example, if the topic is "swimming", do NOT make the answer "swimming"; instead use related but different verbs like "diving", "training", "competing", "racing", "kicking", "floating", "breathing", "stretching", "improving", "qualifying", "drowning"... and place "swimming" / "the pool" / "the swim team" elsewhere in the sentence as context.
- More generally: the topic provides the SCENERY (nouns, places, people); the verb tested in the blank should be a DIFFERENT, fitting action verb.
- Across a session, produce DIFFERENT verbs each time. Avoid repeating typical textbook verbs (read, learn, eat, go, visit, do, see, ask, help).
- Vary subjects (I, you, he, she, we, they, the team, the coach, my friend, the kids, ...) and sentence structures.

VOCABULARY LEVEL:
${levelVocabGuidance[level] ?? levelVocabGuidance.mixed}
Stay within this level even when the topic is unusual — improvise creatively but keep the difficulty appropriate.

Return ONLY a JSON object with this structure:
{
  "question": "The exercise sentence with a blank marked as ___ (for fill-in, put the base verb in parentheses after the blank, e.g. '___ (dive)')",
  "answer": "the correct answer (lowercase)",
  "hint": "a helpful hint for the student",
  "options": ["option1", "option2", "option3", "option4"]  // only for multiple-choice
}

For fill-in: the answer is just the word(s) that go in the blank.
For multiple-choice: include 4 plausible options with the correct answer among them.`;

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
          {
            role: "user",
            content:
              `Generate a ${exerciseType} exercise for ${level} level${interest ? ` themed around "${interest}"` : ''}.\n` +
              `Pick a fresh, unexpected main verb for the blank — NOT the topic word itself.\n` +
              `Diversity seed: ${crypto.randomUUID()}. Use this to ensure the verb and scenario differ from any previous exercise.`,
          },
        ],
        temperature: 0.9,
        stream: false,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limits exceeded, please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required, please add funds to your Lovable AI workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Service temporarily unavailable. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("No JSON found in response:", content);
      return new Response(
        JSON.stringify({ error: "Invalid AI response format" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const exercise = JSON.parse(jsonMatch[0]);

    return new Response(JSON.stringify(exercise), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in generate-exercise function:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred. Please try again." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
