// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "@supabase/functions-js/edge-runtime.d.ts";
import { SupabaseContext, withSupabase } from "@supabase/server";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../_shared/database.types.ts";

type PgmqReadArgs = {
  queue_name: string;
  vt?: number;
  qty?: number;
};

type PgmqReadMessage = {
  msg_id: number;
  read_ct: number;
  enqueued_at: string;
  vt: string;
  message: unknown;
  headers: unknown;
};

type PgmqRpcClient = {
  schema: (
    schema: "pgmq",
  ) => {
    rpc: (
      fn: "read",
      args: PgmqReadArgs,
    ) => Promise<{ data: PgmqReadMessage[] | null; error: unknown }>;
  };
};

const processMessage = (message: PgmqReadMessage) => {
};

// This endpoint uses 'publishable' | 'secret' access, apiKey is required.
// Use publishable for Client-facing, key-validated endpoints
// Use secret for Server-to-server, internal calls
export default {
  fetch: withSupabase(
    { auth: ["secret"] },
    async (_req, _ctx: SupabaseContext<Database>) => {
      const supabaseUrl = Deno.env.get("SUPABASE_URL");
      const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

      if (!supabaseUrl || !serviceRoleKey) {
        return Response.json({ error: "Missing Supabase env vars" }, {
          status: 500,
        });
      }

      const admin = createClient<Database>(supabaseUrl, serviceRoleKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      });

      const pgmq = admin as unknown as PgmqRpcClient;

      const { data: messages, error } = await pgmq.schema("pgmq").rpc("read", {
        queue_name: "quote_review",
        vt: 30, // Visibility Timeout in seconds
        qty: 5, // Number of messages to read
      });

      if (error) {
        console.error("RPC_ERROR pgmq.read", error);
        return Response.json(
          { error: "Failed to read queue", details: error },
          {
            status: 500,
          },
        );
      }

      console.log("Messages read from pgmq.read:", messages);

      return Response.json({
        messages,
      });
    },
  ),
};
