"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Group, Stack } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { FormSubmitButton } from "@/components/FormSubmitButton";
import { FormTextInput } from "@/components/FormTextInput";
import { FormTextarea } from "@/components/FormTextarea";
import { HookFormProvider } from "@/components/HookFormProvider";
import { CategorySelect } from "@/components/CategorySelect";
import { CreateProjectDto, createProjectSchema } from "@/schema/project";

type CreateProjectFormValues = z.input<typeof createProjectSchema>;

export const CreateProjectForm = () => {
  const router = useRouter();

  const form = useForm<CreateProjectFormValues, unknown, CreateProjectDto>({
    defaultValues: {
      title: "",
      quote_date: "",
      description: "",
      category_id: NaN,
    },
    resolver: zodResolver(createProjectSchema),
    mode: "onSubmit",
  });

  const handleSubmit = async () => {
    router.push("/user/my-quotes");
  };

  return (
    <HookFormProvider form={form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <Stack gap="md">
          <FormTextInput
            name="title"
            label="Title"
            placeholder="e.g., No call-out fee for emergency plumber"
          />

          <FormTextarea
            name="description"
            label="Description"
            placeholder="Tell us about your experience..."
            minRows={4}
          />

          <FormTextInput
            name="business_name"
            label="Business Name"
            placeholder="e.g., FlowMaster Plumbing"
          />

          <CategorySelect name="category_id" label="Category" />

          <FormTextInput name="quote_date" label="Quote Date" type="date" />

          <Group justify="flex-end" mt="md">
            <FormSubmitButton>Submit Quote</FormSubmitButton>
          </Group>
        </Stack>
      </form>
    </HookFormProvider>
  );
};
