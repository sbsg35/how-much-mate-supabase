import { createSsrClient } from "@/supabase/server";
import { cookies } from "next/headers";

export default async function Page() {
  const serverClient = createSsrClient(cookies());
  const {
    data: { user },
  } = await serverClient.auth.getUser();
  return <pre>{JSON.stringify(user, null, 2)}</pre>;
}
