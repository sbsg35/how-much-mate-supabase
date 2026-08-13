import { createBrowserClient } from "@supabase/ssr";
import { env } from "@/lib/envlib";
import { Database } from "./database.types";

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const supabaseBrowserClient = () =>
  createBrowserClient<Database>(supabaseUrl, supabaseKey);
