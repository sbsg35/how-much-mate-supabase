import { AdminPage } from "@/modules/admin/AdminPage";
import { createSsrClientFromNextCookies } from "@/supabase/server";
import { redirect } from "next/navigation";

export default async function Page() {
  const supabase = await createSsrClientFromNextCookies();
  const { data } = await supabase.auth.getClaims();

  if (!data?.claims) {
    redirect("/auth/login");
  }

  if (data.claims.user_role !== "admin") {
    redirect("/");
  }

  return <AdminPage />;
}
