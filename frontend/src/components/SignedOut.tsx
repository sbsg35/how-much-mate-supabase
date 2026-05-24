"use client";

import { useAuth } from "@/providers/AuthProvider";

export function SignedOut({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  if (user) return null;
  return <>{children}</>;
}
