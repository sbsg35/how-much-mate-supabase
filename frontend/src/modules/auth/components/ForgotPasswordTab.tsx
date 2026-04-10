"use client";

import { FormSubmitButton } from "@/components/FormSubmitButton";
import { FormTextInput } from "@/components/FormTextInput";
import { HookFormProvider } from "@/components/HookFormProvider";
import { Turnstile } from "@/components/Turnstile";
import { useTurnstile } from "@/hooks/useTurnstile";
import { CLOUDFLARE_TURNSTILE_KEY } from "@/lib/env";
import { handleApiError } from "@/lib/schema";
import { useForgotPasswordMutation } from "@/service/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Group, VisuallyHidden, Box, Text, Center } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { passwordResetRequestSchema, PasswordResetRequestDto } from "@/schema";
import { BackLink } from "@/components/BackLink";

export const ForgotPasswordTab = () => {
  const navigate = useRouter();

  const form = useForm<PasswordResetRequestDto>({
    resolver: zodResolver(passwordResetRequestSchema),
    defaultValues: {
      email: "",
      botToken: "",
    },
    mode: "onSubmit",
  });

  const {
    containerRef,
    isVerified,
    reset: resetTurnstile,
  } = useTurnstile({
    siteKey: CLOUDFLARE_TURNSTILE_KEY,
    formSetValue: form.setValue,
    formFieldName: "botToken",
  });

  const { mutateAsync: requestPasswordReset } = useForgotPasswordMutation();

  const handleLogin = async (data: PasswordResetRequestDto) => {
    try {
      await requestPasswordReset(data);
      navigate.push("/auth/password-reset-requested");
    } catch (error) {
      resetTurnstile();

      handleApiError(error, {
        resetForm: form.reset,
        setError: form.setError,
        customErrorMessage: "Failed to send magic link",
      });
    }
  };

  return (
    <>
      <Text c="dimmed"> Enter your email to receive a sign-in link</Text>
      <HookFormProvider {...form}>
        <form onSubmit={form.handleSubmit(handleLogin)}>
          <FormTextInput name="email" label="Email" mt="md" />
          <Group justify="space-between" mt="lg">
            <FormSubmitButton disabled={!isVerified} mt={0} fullWidth>
              Send reset link
            </FormSubmitButton>
          </Group>

          {/* Turnstile component */}
          <VisuallyHidden>
            <Box mt="md" style={{ display: "flex", justifyContent: "center" }}>
              <Box ref={containerRef}>
                <Turnstile />
              </Box>
            </Box>
          </VisuallyHidden>

          {/* Hidden input for the token */}
          <input type="hidden" {...form.register("botToken")} />
        </form>
      </HookFormProvider>
      <Center mt="md">
        <BackLink href="/auth/login">Back to login</BackLink>
      </Center>
    </>
  );
};
