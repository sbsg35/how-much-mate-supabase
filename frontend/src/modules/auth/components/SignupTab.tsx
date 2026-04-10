"use client";

import { FormSubmitButton } from "@/components/FormSubmitButton";
import { FormTextInput } from "@/components/FormTextInput";
import { HookFormProvider } from "@/components/HookFormProvider";
import { Turnstile } from "@/components/Turnstile";
import { useTurnstile } from "@/hooks/useTurnstile";
import { CLOUDFLARE_TURNSTILE_KEY } from "@/lib/env";
import { handleApiError } from "@/lib/schema";
import { useSignUpMutation } from "@/service/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Group,
  VisuallyHidden,
  Box,
  Divider,
  Text,
  Stack,
} from "@mantine/core";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { SignupDto, signupSchema } from "@/schema";
import { SocialLogins } from "./SocialLogins";
import { NextLink } from "@/components/NextLink";
import { FormPasswordInput } from "@/components/FormPasswordInput";

export const SignupTab = () => {
  const navigate = useRouter();

  const form = useForm<SignupDto>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      botToken: "",
      password: "",
    },
    mode: "all",
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

  const { mutateAsync: signUp } = useSignUpMutation();

  const handleSignUp = async (data: SignupDto) => {
    try {
      await signUp(data);
      navigate.push("/auth/check-email");
    } catch (error) {
      resetTurnstile();

      handleApiError(error, {
        resetForm: form.reset,
        setError: form.setError,
        customErrorMessage: "Failed to sign up",
      });
    }
  };

  return (
    <>
      <HookFormProvider {...form}>
        <form onSubmit={form.handleSubmit(handleSignUp)}>
          <FormTextInput name="email" label="Email" mt="md" required />
          <FormPasswordInput
            name="password"
            label="Password"
            mt="md"
            required
          />
          <Group justify="space-between" mt="lg">
            <FormSubmitButton disabled={!isVerified} mt={0} fullWidth>
              Sign up
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
      <Divider label="OR CONTINUE WITH" labelPosition="center" my="lg" />
      <SocialLogins isSignUp />
      <Stack align="center">
        <Text c="dimmed" fz="xs">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </Text>
        <NextLink href="/auth/login" fz="sm">
          Already have an account? Sign in
        </NextLink>
      </Stack>
    </>
  );
};
