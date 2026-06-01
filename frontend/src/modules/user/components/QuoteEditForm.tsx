"use client";
import { useController, useForm } from "react-hook-form";
import { HookFormProvider } from "@/components/HookFormProvider";
import { Checkbox, Group, Stack } from "@mantine/core";
import { FormSubmitButton } from "@/components/FormSubmitButton";
import { FormTextInput } from "@/components/FormTextInput";
import { FormTextarea } from "@/components/FormTextarea";
import { CategorySelect } from "@/components/CategorySelect";
import { SuburbSelect } from "@/components/SuburbSelect";

import { EditQuoteDto, editQuoteSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormNumberInput } from "@/components/FormNumberInput";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { useUpdateQuoteMutation, type Quote } from "@/service/quote";
import { z } from "zod";

interface QuoteEditFormProps {
  quote: Quote;
}

export const QuoteEditForm = ({ quote }: QuoteEditFormProps) => {
  const router = useRouter();
  const { mutateAsync: updateQuote } = useUpdateQuoteMutation(quote.quote_id);

  const form = useForm<z.input<typeof editQuoteSchema>, unknown, EditQuoteDto>({
    defaultValues: {
      title: quote.title,
      business_name: quote.business_name,
      description: quote.description,
      price: Number(quote.price),
      category_id: quote.category?.category_id ?? NaN,
      suburb_id: quote.suburb?.suburb_id ?? "",
      completed: quote.completed,
      quote_date: quote.quote_date,
    },
    resolver: zodResolver(editQuoteSchema),
    mode: "onSubmit",
  });

  const { field: completedField } = useController({
    name: "completed",
    control: form.control,
  });

  const handleSubmit = async (data: EditQuoteDto) => {
    try {
      await updateQuote(data);
      notifications.show({
        title: "Quote updated successfully",
        message: "Your quote has been updated.",
        color: "green",
      });
      router.push("/user/my-quotes");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to update quote";

      notifications.show({
        title: "Update failed",
        message,
        color: "red",
      });

      form.setError("root.server", {
        type: "server",
        message,
      });
    }
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

          <FormNumberInput name="price" label="Price" min={0} leftSection="$" />

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
            <FormSubmitButton>Update Quote</FormSubmitButton>
          </Group>

          {form.formState.errors.root?.server?.message ? (
            <p>{form.formState.errors.root.server.message}</p>
          ) : null}
        </Stack>
      </form>
    </HookFormProvider>
  );
};
