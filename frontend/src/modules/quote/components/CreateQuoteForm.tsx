"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox, Group, Stack } from "@mantine/core";
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
import type { CreateQuoteActionResult } from "../actions";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { quoteQueryKeys } from "@/service/quote";

type CreateQuoteFormValues = z.input<typeof createQuoteSchema>;

type CreateQuoteFormProps = {
  createQuoteAction: (
    data: CreateQuoteDto,
  ) => Promise<CreateQuoteActionResult | never>;
};

export const CreateQuoteForm = ({
  createQuoteAction,
}: CreateQuoteFormProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();

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

  const handleSubmit = async (data: CreateQuoteDto) => {
    try {
      const result = await createQuoteAction(data);

      if (result?.underReview) {
        await queryClient.invalidateQueries({
          queryKey: quoteQueryKeys.allMyQuotes(),
        });
        notifications.show({
          title: "Quote under review",
          message: "Your quote is under review.",
          color: "yellow",
        });
        router.push("/user/my-quotes");
        return;
      }

      if (result?.error) {
        form.setError("root.server", {
          type: "server",
          message: result.error,
        });
        return;
      }

      await queryClient.invalidateQueries({
        queryKey: quoteQueryKeys.allMyQuotes(),
      });
      router.push("/user/my-quotes");
    } catch (error) {
      console.error("Error creating quote:", error);
      form.setError("root.server", {
        type: "server",
        message: "Unable to submit quote right now",
      });
    }
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

          {form.formState.errors.root?.server?.message ? (
            <p>{form.formState.errors.root.server.message}</p>
          ) : null}
        </Stack>
      </form>
    </HookFormProvider>
  );
};
