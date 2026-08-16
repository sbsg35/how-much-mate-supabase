"use client";
import { BodyText } from "@/components/BodyText";
import { Heading } from "@/components/Heading";

import { useSearchParams } from "next/navigation";
import { AuthModeSwitcher } from "../components/AuthModeSwitcher";
import { AuthNotification } from "../components/AuthNotification";
import { LoginTab } from "../components/LoginTab";

export const LoginPage = () => {
  const searchParams = useSearchParams();
  const alert = searchParams.get("alert");

  return (
    <>
      <AuthNotification type={alert} cleanupPath="/auth/login" />
      <AuthModeSwitcher current="sign-in" />
      <Heading level={1} size="md">
        Welcome back
      </Heading>
      <BodyText muted>Sign in to share quotes and help the community</BodyText>
      <LoginTab />
    </>
  );
};
