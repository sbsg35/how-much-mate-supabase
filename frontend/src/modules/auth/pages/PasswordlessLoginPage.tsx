"use client";
import { Title } from "@mantine/core";
import { PasswordlessLoginTab } from "../components/PasswordlessLoginTab";

export const PasswordlessLoginPage = () => {
  return (
    <>
      <Title ta="center">Passwordless login</Title>
      <PasswordlessLoginTab />
    </>
  );
};
