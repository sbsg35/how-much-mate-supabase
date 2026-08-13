"use client";

import { FormSubmitButton } from "@/components/FormSubmitButton";
import { FormTextInput } from "@/components/FormTextInput";
import { HookFormProvider } from "@/components/HookFormProvider";
import { Turnstile } from "@/components/Turnstile";
import { useTurnstile } from "@/hooks/useTurnstile";
import { CLOUDFLARE_TURNSTILE_KEY } from "@/lib/env";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Group,
  VisuallyHidden,
  Box,
  Divider,
  Stack,
  Title,
  Text,
} from "@mantine/core";
import { useForm } from "react-hook-form";
import { SignupDto, signupSchema } from "@/schema";
import { SocialLogins } from "./SocialLogins";
import { NextLink } from "@/components/NextLink";
import { FormPasswordInput } from "@/components/FormPasswordInput";

import { supabaseBrowserClient } from "@/supabase/client";
import { handleSupabaseAuthError } from "@/lib/error";

interface SignupFormProps {
  onSuccess: (email: string) => void;
}

export const SignupForm = ({ onSuccess }: SignupFormProps) => {
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

  const handleSignUp = async (data: SignupDto) => {
    const supabase = supabaseBrowserClient();

    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          captchaToken: data.botToken,
        },
      });
      if (error) throw error;
      onSuccess(data.email);
    } catch (error) {
      resetTurnstile();
      handleSupabaseAuthError(error, {
        resetForm: () => form.reset({ email: data.email, password: "" }),
        fallbackMessage:
          "Sign up failed. Please check your credentials and try again.",
      });
    }
  };

  return (
    <>
      <Title size="md">Create an account</Title>
      <Text c="dimmed">Join the community and start sharing quotes</Text>
      <HookFormProvider form={form}>
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
