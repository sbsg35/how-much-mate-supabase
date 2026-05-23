import { createServerClient } from "@supabase/ssr";

import { cookies } from "next/headers";
import { Database } from "./database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const createSsrClient = (cookieStore: ReturnType<typeof cookies>) =>
  createServerClient<Database>(supabaseUrl!, supabaseKey!, {
    cookies: {
      // the purpose of this getAll function is to retrieve cookies from the request headers when called from a Server Component.
      async getAll() {
        const store = await cookieStore;
        return store.getAll();
      },
      // this setAll function has the purpose of setting cookies in the response headers when called from a Server Component.
      // It will be ignored if called from a Client Component, as the `cookieStore` will not be available.
      async setAll(cookiesToSet) {
        try {
          const store = await cookieStore;
          cookiesToSet.forEach(({ name, value, options }) =>
            store.set(name, value, options),
          );
        } catch {
          // The `setAll` method was called from a Client Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  });
