import { createBrowserClient } from "@supabase/ssr";
import { getAppConfig } from "@/lib/config";
import { env } from "@/lib/envlib";
import { Database } from "./database.types";

const supabaseUrl = getAppConfig().supabaseUrl;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const supabaseBrowserClient = () =>
  createBrowserClient<Database>(supabaseUrl, supabaseKey);
