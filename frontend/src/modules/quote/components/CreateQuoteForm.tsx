"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox, Group, Stack } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useController, useForm } from "react-hook-form";
import { z } from "zod";

import { FormSubmitButton } from "@/components/FormSubmitButton";
import { FormTextInput } from "@/components/FormTextInput";
import { FormTextarea } from "@/components/FormTextarea";
import { HookFormProvider } from "@/components/HookFormProvider";
import { CategorySelect } from "@/components/CategorySelect";

import { CreateQuoteDto, createQuoteSchema } from "@/schema";
import { FormNumberInput } from "@/components/FormNumberInput";
import { SuburbSelect } from "@/components/SuburbSelect";

type CreateQuoteFormValues = z.input<typeof createQuoteSchema>;

export const CreateProjectForm = () => {
  const router = useRouter();

  const form = useForm<CreateQuoteFormValues, unknown, CreateQuoteDto>({
    defaultValues: {
      title: "",
      business_name: "",
      quote_date: "",
      description: "",
      price: 0,
      suburb_id: "",
      completed: false,

      category_id: NaN,
    },
    resolver: zodResolver(createQuoteSchema),
    mode: "onSubmit",
  });

  const handleSubmit = async () => {
    router.push("/user/my-quotes");
  };

  const { field: completedField } = useController({
    name: "completed",
    control: form.control,
  });

  return (
    <HookFormProvider form={form} debug={true}>
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

          <FormNumberInput
            name="price"
            label="Price"
            min={0}
            leftSection="$"
            rightSection={<></>}
          />

          <CategorySelect name="category_id" label="Category" />

          <SuburbSelect name="suburb_id" label="Suburb" />

          <FormTextInput name="quote_date" label="Quote Date" type="date" />

          <Checkbox
            label="Did you go ahead with this quote?"
            checked={Boolean(completedField.value)}
            onChange={(event) =>
              completedField.onChange(event.currentTarget.checked)
            }
          />

          <Group justify="flex-end" mt="md">
            <FormSubmitButton>Submit Quote</FormSubmitButton>
          </Group>
        </Stack>
      </form>
    </HookFormProvider>
  );
};
