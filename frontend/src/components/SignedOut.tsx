"use client";

import { useUserQuery } from "@/service/user";

export function SignedOut({ children }: { children: React.ReactNode }) {
  const { data } = useUserQuery();

  if (data?.user) return null;
  return <>{children}</>;
}
