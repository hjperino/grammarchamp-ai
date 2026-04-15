import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const teachers = [
      { email: "prof1@grammarmaster.ch", password: "Prof1Grammar!" },
      { email: "prof2@grammarmaster.ch", password: "Prof2Grammar!" },
    ];

    const results = [];

    for (const teacher of teachers) {
      // Check if user already exists
      const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
      const exists = existingUsers?.users?.find((u: any) => u.email === teacher.email);
      
      if (exists) {
        results.push({ email: teacher.email, status: "already exists" });
        continue;
      }

      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email: teacher.email,
        password: teacher.password,
        email_confirm: true,
      });

      if (error) {
        results.push({ email: teacher.email, status: "error", message: error.message });
      } else {
        results.push({ email: teacher.email, status: "created" });
      }
    }

    return new Response(JSON.stringify({ results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "An unexpected error occurred" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
