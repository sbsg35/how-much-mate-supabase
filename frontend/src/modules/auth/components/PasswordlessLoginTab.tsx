"use client";

import { FormSubmitButton } from "@/components/FormSubmitButton";
import { FormTextInput } from "@/components/FormTextInput";
import { HookFormProvider } from "@/components/HookFormProvider";
import { Turnstile } from "@/components/Turnstile";
import { useTurnstile } from "@/hooks/useTurnstile";
import { CLOUDFLARE_TURNSTILE_KEY } from "@/lib/env";
import { handleApiError } from "@/lib/schema";
import { usePasswordlessLoginMutation } from "@/service/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Group, VisuallyHidden, Box, Text, Center } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { loginSchema, LoginDto } from "@/schema";
import { BackLink } from "@/components/BackLink";

export const PasswordlessLoginTab = () => {
  const navigate = useRouter();

  const form = useForm<LoginDto>({
    resolver: zodResolver(loginSchema),
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

  const { mutateAsync: login } = usePasswordlessLoginMutation();

  const handleLogin = async (data: LoginDto) => {
    try {
      await login(data);
      navigate.push("/auth/check-email");
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
              Sign in
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
