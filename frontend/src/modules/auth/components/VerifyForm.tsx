"use client";

import { FormSubmitButton } from "@/components/FormSubmitButton";
import { FormTextInput } from "@/components/FormTextInput";
import { HookFormProvider } from "@/components/HookFormProvider";

import { supabaseBrowserClient } from "@/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Center, Text, Title } from "@mantine/core";
import { IconMailCheck } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { OtpDto, otpSchema } from "../schema";
import { notifications } from "@mantine/notifications";

interface VerifyFormProps {
  email: string;
}

export const VerifyForm = ({ email }: VerifyFormProps) => {
  const router = useRouter();

  const form = useForm<OtpDto>({
    resolver: zodResolver(otpSchema),
    defaultValues: { token: "" },
    mode: "onSubmit",
  });

  const handleSubmit = async ({ token }: OtpDto) => {
    try {
      const { error } = await supabaseBrowserClient().auth.verifyOtp({
        email,
        token,
        type: "email",
      });

      if (error) {
        form.setError("token", { message: error.message });
        return;
      }

      router.push("/user/profile");
    } catch (error) {
      console.error("Error verifying OTP:", error);
      notifications.show({
        title: "Error",
        message: "Verification failed. Please try again.",
      });
    }
  };

  return (
    <>
      <Title size="lg">Check your email</Title>
      <Text fz="sm" ta="center">
        We sent a 6-digit code to <strong>{email}</strong>. Enter it below to
        complete your sign up.
      </Text>
      <Center my="24">
        <IconMailCheck size={40} color="var(--mantine-color-anchor)" />
      </Center>
      <HookFormProvider {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <FormTextInput
            name="token"
            label="One-time code"
            placeholder="123456"
            maxLength={6}
            mt="md"
          />
          <FormSubmitButton mt="md" fullWidth>
            Verify
          </FormSubmitButton>
        </form>
      </HookFormProvider>
    </>
  );
};
