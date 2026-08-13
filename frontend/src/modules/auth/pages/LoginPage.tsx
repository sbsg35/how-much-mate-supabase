"use client";
import { Text, Title } from "@mantine/core";

import { useSearchParams } from "next/navigation";
import { AuthNotification } from "../components/AuthNotification";
import { LoginTab } from "../components/LoginTab";

export const LoginPage = () => {
  const searchParams = useSearchParams();
  const alert = searchParams.get("alert");

  return (
    <>
      <AuthNotification type={alert} cleanupPath="/auth/login" />
      <Title fz="h4" order={1}>
        Welcome back
      </Title>
      <Text c="dimmed"> Sign in to share quotes and help the community</Text>
      <LoginTab />
    </>
  );
};
