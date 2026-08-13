"use client";

import { FormSubmitButton } from "@/components/FormSubmitButton";
import { FormTextInput } from "@/components/FormTextInput";
import { HookFormProvider } from "@/components/HookFormProvider";
import { Turnstile } from "@/components/Turnstile";
import { useTurnstile } from "@/hooks/useTurnstile";
import { CLOUDFLARE_TURNSTILE_KEY } from "@/lib/env";
import { handleSupabaseAuthError } from "@/lib/error";
import {
  PasswordResetRequestDto,
  passwordResetRequestSchema,
} from "@/schema";
import { supabaseBrowserClient } from "@/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, VisuallyHidden } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export const ForgotPasswordForm = () => {
  const router = useRouter();
  const form = useForm<PasswordResetRequestDto>({
    resolver: zodResolver(passwordResetRequestSchema),
    defaultValues: { email: "", botToken: "" },
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

  const handleSubmit = async (data: PasswordResetRequestDto) => {
    try {
      const callbackUrl = new URL(
        "/auth/callback/password-recovery",
        window.location.origin,
      );

      const { error } =
        await supabaseBrowserClient().auth.resetPasswordForEmail(data.email, {
          redirectTo: callbackUrl.toString(),
          captchaToken: data.botToken,
        });

      if (error) throw error;
      router.push("/auth/forgot-password/sent");
    } catch (error) {
      resetTurnstile();
      handleSupabaseAuthError(error, {
        resetForm: () => form.reset({ email: data.email, botToken: "" }),
        fallbackMessage: "We couldn't send the reset email. Please try again.",
      });
    }
  };

  return (
    <HookFormProvider form={form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <FormTextInput
          name="email"
          label="Email"
          type="email"
          autoComplete="email"
          mt="md"
          required
        />
        <FormSubmitButton disabled={!isVerified} mt="lg" fullWidth>
          Send reset link
        </FormSubmitButton>

        <VisuallyHidden>
          <Box ref={containerRef}>
            <Turnstile />
          </Box>
        </VisuallyHidden>
        <input type="hidden" {...form.register("botToken")} />
      </form>
    </HookFormProvider>
  );
};
