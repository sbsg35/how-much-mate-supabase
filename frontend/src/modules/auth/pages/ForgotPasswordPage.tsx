import { BackLink } from "@/components/BackLink";
import { BodyText } from "@/components/BodyText";
import { Heading } from "@/components/Heading";
import { Stack } from "@mantine/core";
import { ForgotPasswordForm } from "../components/ForgotPasswordForm";

export const ForgotPasswordPage = () => {
  return (
    <>
      <Heading level={1} size="md">
        Reset your password
      </Heading>
      <BodyText muted size="sm">
        Enter your email and we&apos;ll send you a secure link to choose a new
        password.
      </BodyText>
      <ForgotPasswordForm />
      <Stack align="center" mt="lg">
        <BackLink href="/auth/login">Back to sign in</BackLink>
      </Stack>
    </>
  );
};
