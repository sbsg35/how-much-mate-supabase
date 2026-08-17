"use client";
import { FormSubmitButton } from "@/components/FormSubmitButton";
import { FormTextInput } from "@/components/FormTextInput";
import { Heading } from "@/components/Heading";
import { HookFormProvider } from "@/components/HookFormProvider";
import { UserUpdateDto, userUpdateSchema } from "@/schema/profile.schema";
import { Profile } from "@/service/profile";
import { supabaseBrowserClient } from "@/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Checkbox, LoadingOverlay } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type UserUpdateFormValues = z.input<typeof userUpdateSchema>;

export const ProfileForm: FC<{ user: Profile }> = ({ user }) => {
  const [savedAnonymous, setSavedAnonymous] = useState(!user?.username);
  const [anonymous, setAnonymous] = useState(savedAnonymous);

  const form = useForm<UserUpdateFormValues, unknown, UserUpdateDto>({
    defaultValues: {
      username: user?.username || "",
    },
    resolver: zodResolver(userUpdateSchema),
    mode: "all",
  });

  const isLoading = form.formState.isLoading || form.formState.isSubmitting;
  const isDirty = form.formState.isDirty || anonymous !== savedAnonymous;

  const handleAnonymousChange = (checked: boolean) => {
    setAnonymous(checked);
    if (checked) {
      form.setValue("username", "", {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  };

  const handleUpdate = async (data: UserUpdateDto) => {
    const payload = {
      ...data,
      username: anonymous ? null : (data.username ?? null),
    };

    try {
      const { data: response, error } = await supabaseBrowserClient()
        .from("profile")
        .update(payload)
        .eq("profile_id", user.profile_id)
        .select("profile_id")
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (!response) {
        throw new Error("Profile update was not applied");
      }

      form.reset({ username: payload.username ?? "" });
      setSavedAnonymous(anonymous);

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
      <Heading my={0}>
        My details
      </Heading>
      {user?.email && (
        <Box mt={8} mb={8}>
          <strong>Email:</strong> {user.email}
        </Box>
      )}
      <Box mt={16}>
        <HookFormProvider form={form}>
          <form onSubmit={form.handleSubmit(handleUpdate)}>
            <FormTextInput
              name="username"
              label="Username"
              helperText="Shown next to your quotes. You can stay anonymous instead."
              thinking={anonymous}
            />
            <Checkbox
              mt={8}
              label="Post anonymously (hides your username on quotes)"
              checked={anonymous}
              onChange={(event) =>
                handleAnonymousChange(event.currentTarget.checked)
              }
            />
            <FormSubmitButton variant="outline" mt="md" disabled={!isDirty}>
              Save
            </FormSubmitButton>
          </form>
        </HookFormProvider>
      </Box>
    </>
  );
};
