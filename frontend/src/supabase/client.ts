import { createBrowserClient } from "@supabase/ssr";
import { Database } from "./database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const supabaseBrowserClient = () =>
  createBrowserClient<Database>(supabaseUrl!, supabaseKey!);
