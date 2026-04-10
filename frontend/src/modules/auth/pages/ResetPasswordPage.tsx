"use client";
import { Title } from "@mantine/core";
import { ResetPasswordForm } from "../components/ResetPasswordForm";

export const ResetPasswordPage = () => {
  return (
    <>
      <Title order={1} fz="h4" mb={16}>
        Reset Password
      </Title>
      <ResetPasswordForm />
    </>
  );
};
