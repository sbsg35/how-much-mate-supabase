"use client";
import { FormSubmitButton } from "@/components/FormSubmitButton";
import { FormTextInput } from "@/components/FormTextInput";
import { HookFormProvider } from "@/components/HookFormProvider";
import { NextLink } from "@/components/NextLink";
import { supabaseBrowserClient } from "@/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Center, Flex, Text, Title } from "@mantine/core";
import { IconArrowLeft, IconMailCheck } from "@tabler/icons-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { OtpDto, otpSchema } from "../schema";

export const CheckEmailPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const form = useForm<OtpDto>({
    resolver: zodResolver(otpSchema),
    defaultValues: { token: "" },
    mode: "onSubmit",
  });

  const handleSubmit = async ({ token }: OtpDto) => {
    const { error } = await supabaseBrowserClient().auth.verifyOtp({
      email,
      token,
      type: "email",
    });

    if (error) {
      form.setError("token", { message: error.message });
      return;
    }

    router.push("/");
  };

  return (
    <>
      <Title size="lg">Check your email</Title>
      <Text fz="sm" ta="center">
        We sent a 6-digit code to <strong>{email || "your email"}</strong>.
        Enter it below to sign in.
      </Text>
      <Center my="24">
        <IconMailCheck size={40} color="var(--mantine-color-anchor)" />
      </Center>
      <HookFormProvider form={form}>
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
      <Center mt="lg">
        <NextLink href="/">
          <Flex align="center">
            <IconArrowLeft size={18} stroke={1.5} />
            <Text>Back to the home page</Text>
          </Flex>
        </NextLink>
      </Center>
    </>
  );
};
