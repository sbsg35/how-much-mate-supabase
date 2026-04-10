"use client";

import { FormSubmitButton } from "@/components/FormSubmitButton";
import { FormTextInput } from "@/components/FormTextInput";
import { HookFormProvider } from "@/components/HookFormProvider";
import { Turnstile } from "@/components/Turnstile";
import { useTurnstile } from "@/hooks/useTurnstile";
import { CLOUDFLARE_TURNSTILE_KEY } from "@/lib/env";
import { handleApiError } from "@/lib/schema";
import { useResetPasswordMutation } from "@/service/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Box, Group, VisuallyHidden } from "@mantine/core";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { PasswordResetConfirmDto, passwordResetConfirmSchema } from "@/schema";

export const ResetPasswordForm = () => {
  const navigate = useRouter();
  const searchParams = useSearchParams();
  const passwordResetToken = searchParams.get("passwordResetToken");

  const form = useForm<PasswordResetConfirmDto>({
    resolver: zodResolver(passwordResetConfirmSchema),
    defaultValues: {
      passwordResetToken: passwordResetToken || "",
      password: "",
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

  const { mutateAsync: resetPassword, isPending } = useResetPasswordMutation();

  const handleResetPassword = async (data: PasswordResetConfirmDto) => {
    try {
      await resetPassword(data);
      navigate.push("/auth/login?alert=password-reset");
    } catch (error) {
      resetTurnstile();

      handleApiError(error, {
        resetForm: form.reset,
        setError: form.setError,
        customErrorMessage: "Failed to reset password",
      });
    }
  };

  if (!passwordResetToken) {
    return (
      <Alert color="red" title="Invalid Link">
        The password reset link is invalid or missing a token. Please request a
        new password reset link.
      </Alert>
    );
  }

  return (
    <>
      <HookFormProvider {...form}>
        <form onSubmit={form.handleSubmit(handleResetPassword)}>
          <FormTextInput
            name="password"
            label="New Password"
            type="password"
            placeholder="Enter your new password"
          />

          <Group justify="space-between" mt="lg">
            <FormSubmitButton
              disabled={!isVerified || isPending}
              mt={0}
              fullWidth
            >
              {isPending ? "Resetting..." : "Reset Password"}
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

          {/* Hidden input for the tokens */}
          <input type="hidden" {...form.register("botToken")} />
          <input type="hidden" {...form.register("passwordResetToken")} />
        </form>
      </HookFormProvider>
    </>
  );
};
