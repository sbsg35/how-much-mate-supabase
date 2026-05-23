"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { FormPasswordInput } from "@/components/FormPasswordInput";
import { FormSubmitButton } from "@/components/FormSubmitButton";
import { FormTextInput } from "@/components/FormTextInput";
import { HookFormProvider } from "@/components/HookFormProvider";
import { NextLink } from "@/components/NextLink";
import { Turnstile } from "@/components/Turnstile";
import { useTurnstile } from "@/hooks/useTurnstile";
import { CLOUDFLARE_TURNSTILE_KEY } from "@/lib/env";

import { PasswordLoginDto, passwordLoginSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Divider, Group, VisuallyHidden } from "@mantine/core";

import { SocialLogins } from "./SocialLogins";
import { supabaseBrowserClient } from "@/supabase/client";
import { notifications } from "@mantine/notifications";

export const LoginTab = () => {
  const navigate = useRouter();

  const form = useForm<PasswordLoginDto>({
    resolver: zodResolver(passwordLoginSchema),
    defaultValues: {
      email: "",
      botToken: "",
      password: "",
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

  const handleLogin = async (data: PasswordLoginDto) => {
    try {
      const result =
        await supabaseBrowserClient().auth.signInWithPassword(data);
      if (!result.data.user) throw new Error("No user returned from Supabase");
      navigate.push("/user/profile");
    } catch (error) {
      console.error("Login error:", error);
      resetTurnstile();

      notifications.show({
        title: "Error",
        message:
          "Failed to log in. Please check your credentials and try again.",
        color: "red",
      });
    }
  };

  return (
    <>
      <HookFormProvider {...form}>
        <form onSubmit={form.handleSubmit(handleLogin)}>
          <FormTextInput name="email" label="Email" mt="md" />
          <FormPasswordInput name="password" label="Password" mt="md" />
          <Group justify="space-between" mt="lg">
            <NextLink href="/auth/forgot-password" ml="auto" fz="sm" mt={-16}>
              Forgot password?
            </NextLink>
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
      <Divider label="OR CONTINUE WITH" labelPosition="center" my="lg" />
      <SocialLogins />
      <Group justify="center" mt="md">
        <NextLink href="/auth/sign-up" fz="sm">
          Don&apos;t have an account? Sign up
        </NextLink>
      </Group>
    </>
  );
};
