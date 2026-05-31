"use client";
import { FormSubmitButton } from "@/components/FormSubmitButton";
import { FormTextInput } from "@/components/FormTextInput";
import { HookFormProvider } from "@/components/HookFormProvider";
import { UserUpdateDto, userUpdateSchema } from "@/schema/profile.schema";
import { Profile } from "@/service/profile";
import { supabaseBrowserClient } from "@/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, LoadingOverlay, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { FC } from "react";
import { useForm } from "react-hook-form";

export const ProfileForm: FC<{ user: Profile }> = ({ user }) => {
  const form = useForm<UserUpdateDto>({
    defaultValues: {
      username: user?.username || "",
    },
    resolver: zodResolver(userUpdateSchema),
    mode: "all",
  });

  const isLoading = form.formState.isLoading || form.formState.isSubmitting;

  const handleUpdate = async (data: UserUpdateDto) => {
    try {
      const { data: response, error } = await supabaseBrowserClient()
        .from("profile")
        .update(data)
        .eq("profile_id", user.profile_id)
        .select("profile_id")
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (!response) {
        throw new Error("Profile update was not applied");
      }

      notifications.show({
        title: "Profile updated",
        message: "Your profile has been updated successfully",
        color: "green",
      });
    } catch (error) {
      notifications.show({
        title: "Update failed",
        message: `${error instanceof Error ? error.message : "An unknown error occurred"}`,
        color: "red",
      });
    }
  };

  return (
    <>
      <LoadingOverlay
        visible={isLoading}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
      <Title my={0} order={2}>
        My details
      </Title>
      {user?.email && (
        <Box mt={8} mb={8}>
          <strong>Email:</strong> {user.email}
        </Box>
      )}
      <Box mt={16}>
        <HookFormProvider form={form}>
          <form onSubmit={form.handleSubmit(handleUpdate)}>
            <FormTextInput name="username" label="Username" />
            <FormSubmitButton variant="outline" mt="md">
              Save
            </FormSubmitButton>
          </form>
        </HookFormProvider>
      </Box>
    </>
  );
};
