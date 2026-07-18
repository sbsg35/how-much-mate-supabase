import { BackLink } from "@/components/BackLink";
import { Stack, Text, Title } from "@mantine/core";
import { ForgotPasswordForm } from "../components/ForgotPasswordForm";

export const ForgotPasswordPage = () => {
  return (
    <>
      <Title fz="h4" order={1}>
        Reset your password
      </Title>
      <Text c="dimmed" fz="sm">
        Enter your email and we&apos;ll send you a secure link to choose a new
        password.
      </Text>
      <ForgotPasswordForm />
      <Stack align="center" mt="lg">
        <BackLink href="/auth/login">Back to sign in</BackLink>
      </Stack>
    </>
  );
};
