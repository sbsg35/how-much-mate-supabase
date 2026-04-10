"use client";

import { useUserQuery } from "@/service/user";

export function SignedIn({ children }: { children: React.ReactNode }) {
  const { data } = useUserQuery();

  if (data?.user) return <>{children}</>;
  return null;
}
