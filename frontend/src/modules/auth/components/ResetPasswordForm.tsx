"use client";

import { FormPasswordInput } from "@/components/FormPasswordInput";
import { FormSubmitButton } from "@/components/FormSubmitButton";
import { HookFormProvider } from "@/components/HookFormProvider";
import { handleSupabaseAuthError } from "@/lib/error";
import {
  PasswordResetConfirmDto,
  passwordResetConfirmSchema,
} from "@/schema";
import { supabaseBrowserClient } from "@/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export const ResetPasswordForm = () => {
  const router = useRouter();
  const form = useForm<PasswordResetConfirmDto>({
    resolver: zodResolver(passwordResetConfirmSchema),
    defaultValues: { password: "", confirmPassword: "" },
    mode: "onSubmit",
  });

  const handleSubmit = async ({ password }: PasswordResetConfirmDto) => {
    const supabase = supabaseBrowserClient();

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      router.replace("/user/profile?alert=password_reset");
    } catch (error) {
      handleSupabaseAuthError(error, {
        resetForm: () =>
          form.reset({ password: "", confirmPassword: "" }),
        fallbackMessage: "We couldn't update your password. Please try again.",
      });
    }
  };

  return (
    <HookFormProvider form={form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <FormPasswordInput
          name="password"
          label="New password"
          autoComplete="new-password"
          helperText="Use 8–16 characters, including an uppercase letter and a number."
          mt="md"
          required
        />
        <FormPasswordInput
          name="confirmPassword"
          label="Confirm new password"
          autoComplete="new-password"
          mt="md"
          required
        />
        <FormSubmitButton mt="lg" fullWidth>
          Reset password
        </FormSubmitButton>
      </form>
    </HookFormProvider>
  );
};
