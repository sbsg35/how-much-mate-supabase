"use client";

import { useAuth } from "@/providers/AuthProvider";

export function SignedIn({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  if (user) return <>{children}</>;
  return null;
}
