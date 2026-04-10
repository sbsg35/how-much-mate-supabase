"use client";
import { Text, Title } from "@mantine/core";
import { SignupTab } from "../components/SignupTab";

export const SignUpPage = () => {
  return (
    <>
      <Title size="md">Create an account</Title>
      <Text c="dimmed">Join the community and start sharing quotes</Text>
      <SignupTab />
    </>
  );
};
