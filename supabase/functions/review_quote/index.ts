// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "@supabase/functions-js/edge-runtime.d.ts";
import { createSupabaseContext } from "@supabase/server";


// This endpoint uses 'publishable' | 'secret' access, apiKey is required.
// Use publishable for Client-facing, key-validated endpoints
// Use secret for Server-to-server, internal calls
export default {
  fetch: async (req) => {
    console.log("INVOKED", {
      method: req.method,
      url: req.url,
      hasApiKey: Boolean(req.headers.get("apikey")),
      hasAuthorization: Boolean(req.headers.get("authorization")),
    });

    const { data: ctx, error } = await createSupabaseContext(req, { auth: ["secret"] });

    if (error) {
      console.error("AUTH_ERROR", {
        code: error.code,
        message: error.message,
        status: error.status,
      });

      return Response.json(
        {
          message: error.message,
          code: error.code,
        },
        { status: error.status },
      );
    }

    console.log("AUTH_OK", { authMode: ctx.authMode });

    // Called by another service with a secret key
    // ctx.supabaseAdmin bypasses RLS — use for privileged operations
    /*
    if (ctx.authMode === "secret") {
      const { user_id } = await req.json();
      const { data } = await ctx.supabaseAdmin.auth.admin.getUserById(user_id);

      return Response.json({
        email: data?.user?.email,
      });
    }
    */

    const url = new URL(req.url);
    const name = url.searchParams.get("name") ?? url.searchParams.get("trigger") ?? "cron";

    console.log("SUCCESS", { name });

    return Response.json({
      message: `Hello ${name}!`,
    });
  },
};

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

curl -i --request GET 'http://127.0.0.1:54321/functions/v1/review_quote?name=Functions' \
  --header 'apikey: sb_secret_N7UND0UgjKTVK-Uodkm0Hg_xSvEMPvz' \
*/
